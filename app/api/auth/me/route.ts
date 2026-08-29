import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, db, toPublicUser, userFromSession } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const user = userFromSession(store.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ ok: true, user: null, orders: [] });

  const orders = db.orders
    .filter((order) => order.userId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10);

  return NextResponse.json({ ok: true, user: toPublicUser(user), orders });
}
