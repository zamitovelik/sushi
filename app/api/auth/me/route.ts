import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, ordersOfUser, toPublicUser, userFromSession } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const user = await userFromSession(store.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ ok: true, user: null, orders: [] });

  const orders = await ordersOfUser(user.id);
  return NextResponse.json({ ok: true, user: toPublicUser(user), orders });
}
