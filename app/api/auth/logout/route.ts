import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, destroySession } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  await destroySession(store.get(SESSION_COOKIE)?.value);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
