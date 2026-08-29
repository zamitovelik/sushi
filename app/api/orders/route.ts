import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MENU } from "@/lib/data/menu";
import { calcTotals } from "@/lib/pricing";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/server/rate-limit";
import {
  OutOfStockError,
  SESSION_COOKIE,
  createOrder,
  orderNumber,
  ordersOfUser,
  prisma,
  userFromSession,
} from "@/lib/server/store";
import { notifyTelegram } from "@/lib/server/telegram";
import { fieldErrors, orderSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const user = await userFromSession(store.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ ok: true, orders: [] });

  return NextResponse.json({ ok: true, orders: await ordersOfUser(user.id, 50) });
}

export async function POST(request: Request) {
  const limit = rateLimit(`order:${clientIp(request)}`, 10, 60 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const { items, customer, delivery, payment, time, promo } = parsed.data;

  // Цены берём из меню на сервере: то, что прислал клиент, не используется.
  const lines: { menuId: string; name: string; qty: number; price: number }[] = [];
  for (const line of items) {
    const item = MENU.find((menuItem) => menuItem.id === line.id);
    if (!item) continue;
    lines.push({ menuId: item.id, name: item.name.ru, qty: line.qty, price: item.price });
  }

  if (lines.length === 0) {
    return NextResponse.json({ ok: false, error: "empty_cart" }, { status: 422 });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const totals = calcTotals({ subtotal, promo, delivery });
  const etaMinutes = delivery === "pickup" ? 25 : 40;

  const store = await cookies();
  const user = await userFromSession(store.get(SESSION_COOKIE)?.value);

  let order;
  try {
    order = await createOrder({
      userId: user?.id ?? null,
      lines,
      subtotal: totals.subtotal,
      discount: totals.discount,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      promo: totals.promo,
      customer,
      delivery,
      payment,
      time,
      etaMinutes,
    });
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return NextResponse.json(
        { ok: false, error: "out_of_stock", unavailable: error.unavailable },
        { status: 409 },
      );
    }
    console.error("[mrsushi] не удалось создать заказ:", error);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }

  const number = orderNumber(order.id);

  // Не ждём Telegram: гость не должен смотреть на спиннер из-за
  // внешнего сервиса, а заказ уже лежит в базе.
  void notifyTelegram({
    number,
    items: lines.map((line) => ({ name: line.name, qty: line.qty, price: line.price })),
    subtotal: totals.subtotal,
    discount: totals.discount,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
    promo: totals.promo,
    customer,
    delivery,
    payment,
    time,
    etaMinutes,
  }).then((sent) => {
    if (!sent) return;
    return prisma.order
      .update({ where: { id: order.id }, data: { notifiedAt: new Date() } })
      .catch(() => undefined);
  });

  console.log(
    `[mrsushi] заказ ${number} · ${lines.length} позиц. · ${totals.total} сум · ${customer.phone}`,
  );

  return NextResponse.json(
    {
      ok: true,
      order: {
        id: String(order.id),
        number,
        createdAt: order.createdAt.toISOString(),
        etaMinutes: order.etaMinutes,
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryFee: order.deliveryFee,
        promo: order.promo,
        items: order.items.map((item) => ({
          id: item.menuId,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
      },
    },
    { status: 201 },
  );
}
