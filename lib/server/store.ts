import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { MENU } from "@/lib/data/menu";
import type { MenuItem, PublicUser } from "@/lib/types";

/**
 * MVP-хранилище: всё живёт в памяти процесса Next.js.
 * globalThis нужен, чтобы состояние переживало hot-reload в dev-режиме.
 * Заменить на реальную БД = переписать только этот файл.
 */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  salt: string;
  hash: string;
  createdAt: string;
  bonus: number;
}

export interface StoredOrder {
  id: string;
  number: string;
  userId: string | null;
  createdAt: string;
  etaMinutes: number;
  status: "accepted" | "cooking" | "on_the_way" | "done";
  items: { id: string; name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promo: string | null;
  customer: { name: string; phone: string; address: string; comment: string };
  delivery: "delivery" | "pickup";
  payment: "cash" | "card" | "click";
  time: string;
}

export interface StoredReservation {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  createdAt: string;
}

interface DB {
  users: Map<string, StoredUser>;
  sessions: Map<string, string>;
  orders: StoredOrder[];
  reservations: StoredReservation[];
  stock: Map<string, number>;
  orderSeq: number;
}

declare global {
  var __MRSUSHI_DB__: DB | undefined;
}

function createDB(): DB {
  return {
    users: new Map(),
    sessions: new Map(),
    orders: [],
    reservations: [],
    stock: new Map(MENU.map((item) => [item.id, item.stock])),
    orderSeq: 1042,
  };
}

export const db: DB = globalThis.__MRSUSHI_DB__ ?? createDB();
if (process.env.NODE_ENV !== "production") globalThis.__MRSUSHI_DB__ = db;

/* ——— пароли ——— */

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string) {
  const candidate = scryptSync(password, salt, 64);
  const known = Buffer.from(hash, "hex");
  return candidate.length === known.length && timingSafeEqual(candidate, known);
}

/* ——— сессии ——— */

export const SESSION_COOKIE = "mrsushi_session";

export function createSession(userId: string) {
  const token = randomUUID();
  db.sessions.set(token, userId);
  return token;
}

export function userFromSession(token: string | undefined): StoredUser | null {
  if (!token) return null;
  const userId = db.sessions.get(token);
  if (!userId) return null;
  return db.users.get(userId) ?? null;
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    bonus: user.bonus,
  };
}

/* ——— каталог ——— */

export function menuWithLiveStock(): MenuItem[] {
  return MENU.map((item) => ({ ...item, stock: db.stock.get(item.id) ?? 0 }));
}

export function nextOrderNumber() {
  db.orderSeq += 1;
  return `MS-${db.orderSeq}`;
}

export function newId() {
  return randomUUID();
}
