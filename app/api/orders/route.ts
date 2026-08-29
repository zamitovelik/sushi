import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MENU } from "@/lib/data/menu";
import { calcTotals } from "@/lib/pricing";
import {
  SESSION_COOKIE,
  db,
  newId,
  nextOrderNumber,
  userFromSession,
  type StoredOrder,
} from "@/lib/server/store";

export const dynamic = "force-dynamic";

const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

export async function GET() {
  const store = await cookies();
  const user = userFromSession(store.get(SESSION_COOKIE)?.value);
  const orders = db.orders.filter((o) => (user ? o.userId === user.id : false));
  return NextResponse.json({ ok: true, orders });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const customer = (body.customer ?? {}) as Record<string, unknown>;
  const delivery = body.delivery === "pickup" ? "pickup" : "delivery";
  const payment = ["cash", "card", "click"].includes(String(body.payment))
    ? (String(body.payment) as StoredOrder["payment"])
    : "cash";
  const time = String(body.time ?? "asap");
  const promo = body.promo ? String(body.promo) : null;

  const name = String(customer.name ?? "").trim();
  const phone = String(customer.phone ?? "").trim();
  const address = String(customer.address ?? "").trim();
  const comment = String(customer.comment ?? "").trim();

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "too_short";
  if (!PHONE_RE.test(phone)) fields.phone = "invalid";
  if (delivery === "delivery" && address.length < 5) fields.address = "too_short";
  if (!rawItems.length) fields.items = "empty";

  if (Object.keys(fields).length) {
    return NextResponse.json({ ok: false, error: "validation", fields }, { status: 422 });
  }

  // проверка наличия на «складе» кухни — источник правды только сервер
  const lines: StoredOrder["items"] = [];
  const unavailable: { id: string; available: number }[] = [];

  for (const raw of rawItems) {
    const id = String((raw as Record<string, unknown>).id ?? "");
    const qty = Math.max(1, Math.min(50, Number((raw as Record<string, unknown>).qty ?? 0)));
    const item = MENU.find((m) => m.id === id);
    if (!item || !Number.isFinite(qty)) continue;

    const available = db.stock.get(id) ?? 0;
    if (available < qty) {
      unavailable.push({ id, available });
      continue;
    }
    lines.push({ id, name: item.name.ru, qty, price: item.price });
  }

  if (unavailable.length) {
    return NextResponse.json(
      { ok: false, error: "out_of_stock", unavailable },
      { status: 409 },
    );
  }
  if (!lines.length) {
    return NextResponse.json({ ok: false, error: "empty_cart" }, { status: 422 });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const totals = calcTotals({ subtotal, promo, delivery });

  for (const line of lines) {
    db.stock.set(line.id, (db.stock.get(line.id) ?? 0) - line.qty);
  }

  const store = await cookies();
  const user = userFromSession(store.get(SESSION_COOKIE)?.value);

  const order: StoredOrder = {
    id: newId(),
    number: nextOrderNumber(),
    userId: user?.id ?? null,
    createdAt: new Date().toISOString(),
    etaMinutes: delivery === "pickup" ? 25 : 40,
    status: "accepted",
    items: lines,
    subtotal: totals.subtotal,
    discount: totals.discount,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
    promo: totals.promo,
    customer: { name, phone, address, comment },
    delivery,
    payment,
    time,
  };

  db.orders.push(order);
  if (user) user.bonus += Math.round(totals.total * 0.03);

  console.log(
    `[mrsushi] заказ ${order.number} · ${lines.length} позиц. · ${order.total} сум · ${phone}`,
  );

  return NextResponse.json({ ok: true, order }, { status: 201 });
}
