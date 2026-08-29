import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSession,
  db,
  toPublicUser,
  verifyPassword,
} from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const user = [...db.users.values()].find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.salt, user.hash)) {
    return NextResponse.json({ ok: false, error: "bad_credentials" }, { status: 401 });
  }

  const token = createSession(user.id);
  const response = NextResponse.json({ ok: true, user: toPublicUser(user) });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  console.log(`[mrsushi] вход: ${email}`);
  return response;
}
