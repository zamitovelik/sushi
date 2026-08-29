import { randomUUID } from "crypto";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { MENU } from "@/lib/data/menu";
import { PrismaClient } from "@/lib/generated/prisma/client";
import type { MenuItem, PublicUser } from "@/lib/types";

/**
 * Доступ к данным. Меню читается из кода, всё изменяемое — из SQLite.
 * Раньше состояние жило в памяти процесса и терялось при рестарте,
 * а при запуске в несколько воркеров вообще не шарилось между ними.
 */

declare global {
  var __MRSUSHI_PRISMA__: PrismaClient | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан — скопируйте .env.example в .env");

  // Prisma 7 подключается к базе через driver adapter, а не по строке из схемы
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });
}

export const prisma = globalThis.__MRSUSHI_PRISMA__ ?? createClient();

// в dev Next перезагружает модули на каждое изменение — без кеша
// накопились бы десятки открытых пулов соединений
if (process.env.NODE_ENV !== "production") globalThis.__MRSUSHI_PRISMA__ = prisma;

/* ─────────────────────────── остатки ─────────────────────────── */

/**
 * Идемпотентный посев остатков. Выполняется один раз на процесс:
 * отдельный сид-скрипт пришлось бы запускать вручную, а так база
 * готова к работе сразу после `prisma migrate`.
 */
let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  seedPromise ??= (async () => {
    const existing = await prisma.stock.count();
    if (existing >= MENU.length) return;

    const known = new Set(
      (await prisma.stock.findMany({ select: { menuId: true } })).map((row) => row.menuId),
    );
    const missing = MENU.filter((item) => !known.has(item.id));
    if (missing.length === 0) return;

    // два воркера могут стартовать одновременно — проигравший поймает
    // конфликт по первичному ключу, и это нормально
    await Promise.all(
      missing.map((item) =>
        prisma.stock
          .create({ data: { menuId: item.id, quantity: item.stock } })
          .catch(() => undefined),
      ),
    );
    console.log(`[mrsushi] остатки засеяны: ${missing.length} позиций`);
  })().catch((error) => {
    // не кешируем неудачу, чтобы следующий запрос попробовал снова
    seedPromise = null;
    throw error;
  });

  return seedPromise;
}

export async function menuWithLiveStock(): Promise<MenuItem[]> {
  await ensureSeeded();
  const rows = await prisma.stock.findMany();
  const stock = new Map(rows.map((row) => [row.menuId, row.quantity]));
  return MENU.map((item) => ({ ...item, stock: stock.get(item.id) ?? 0 }));
}

/* ─────────────────────────── сессии ─────────────────────────── */

export const SESSION_COOKIE = "mrsushi_session";
export const SESSION_TTL_DAYS = 30;

export async function createSession(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { id: token, userId, expiresAt } });
  void sweepExpiredSessions();
  return token;
}

export async function userFromSession(token: string | undefined) {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: token },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: token } }).catch(() => undefined);
    return null;
  }

  return session.user;
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  await prisma.session.delete({ where: { id: token } }).catch(() => undefined);
}

/** Протухшие сессии иначе копились бы в базе бесконечно. */
let lastSweep = 0;
export async function sweepExpiredSessions() {
  const now = Date.now();
  if (now - lastSweep < 60 * 60 * 1000) return;
  lastSweep = now;
  await prisma.session
    .deleteMany({ where: { expiresAt: { lte: new Date(now) } } })
    .catch(() => undefined);
}

/* ────────────────────────── пользователи ────────────────────────── */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  bonus: number;
  createdAt: Date;
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt.toISOString(),
    bonus: user.bonus,
  };
}

/* ─────────────────────────── заказы ─────────────────────────── */

/** Человекочитаемый номер: id автоинкрементный, смещение — чтобы не начинать с единицы. */
export const ORDER_NUMBER_OFFSET = 1042;

export function orderNumber(id: number) {
  return `MS-${ORDER_NUMBER_OFFSET + id}`;
}

export class OutOfStockError extends Error {
  constructor(public readonly unavailable: { id: string; available: number }[]) {
    super("out_of_stock");
    this.name = "OutOfStockError";
  }
}

export interface CreateOrderInput {
  userId: string | null;
  lines: { menuId: string; name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promo: string | null;
  customer: { name: string; phone: string; address: string; comment: string };
  delivery: "delivery" | "pickup";
  payment: string;
  time: string;
  etaMinutes: number;
}

/**
 * Списание остатков и создание заказа — одной транзакцией.
 * Условие `quantity >= qty` внутри UPDATE делает проверку атомарной:
 * два параллельных заказа на последнюю порцию не смогут оба пройти.
 */
export async function createOrder(input: CreateOrderInput) {
  await ensureSeeded();

  return prisma.$transaction(async (tx) => {
    for (const line of input.lines) {
      const updated = await tx.stock.updateMany({
        where: { menuId: line.menuId, quantity: { gte: line.qty } },
        data: { quantity: { decrement: line.qty } },
      });

      if (updated.count === 0) {
        const row = await tx.stock.findUnique({ where: { menuId: line.menuId } });
        throw new OutOfStockError([{ id: line.menuId, available: row?.quantity ?? 0 }]);
      }
    }

    const order = await tx.order.create({
      data: {
        userId: input.userId,
        etaMinutes: input.etaMinutes,
        subtotal: input.subtotal,
        discount: input.discount,
        deliveryFee: input.deliveryFee,
        total: input.total,
        promo: input.promo,
        customerName: input.customer.name,
        customerPhone: input.customer.phone,
        customerAddress: input.customer.address,
        customerComment: input.customer.comment,
        delivery: input.delivery,
        payment: input.payment,
        time: input.time,
        items: {
          create: input.lines.map((line) => ({
            menuId: line.menuId,
            name: line.name,
            qty: line.qty,
            price: line.price,
          })),
        },
      },
      include: { items: true },
    });

    if (input.userId) {
      await tx.user.update({
        where: { id: input.userId },
        data: { bonus: { increment: Math.round(input.total * 0.03) } },
      });
    }

    return order;
  });
}

export async function ordersOfUser(userId: string, take = 10) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    include: { items: true },
  });

  return orders.map((order) => ({
    id: String(order.id),
    number: orderNumber(order.id),
    createdAt: order.createdAt.toISOString(),
    total: order.total,
    status: order.status,
    items: order.items.map((item) => ({
      id: item.menuId,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
  }));
}
