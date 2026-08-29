import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, db } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) db.sessions.delete(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
