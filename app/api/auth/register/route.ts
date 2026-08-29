import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSession,
  db,
  hashPassword,
  newId,
  toPublicUser,
} from "@/lib/server/store";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "too_short";
  if (!EMAIL_RE.test(email)) fields.email = "invalid";
  if (!PHONE_RE.test(phone)) fields.phone = "invalid";
  if (password.length < 6) fields.password = "too_short";

  if (Object.keys(fields).length) {
    return NextResponse.json({ ok: false, error: "validation", fields }, { status: 422 });
  }

  const exists = [...db.users.values()].some((u) => u.email === email);
  if (exists) {
    return NextResponse.json(
      { ok: false, error: "email_taken", fields: { email: "taken" } },
      { status: 409 },
    );
  }

  const { salt, hash } = hashPassword(password);
  const user = {
    id: newId(),
    name,
    email,
    phone,
    salt,
    hash,
    createdAt: new Date().toISOString(),
    bonus: 10000,
  };
  db.users.set(user.id, user);

  const token = createSession(user.id);
  const response = NextResponse.json({ ok: true, user: toPublicUser(user) }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  console.log(`[mrsushi] новый пользователь: ${name} <${email}> ${phone}`);
  return response;
}
