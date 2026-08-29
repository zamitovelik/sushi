import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/server/passwords";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/server/rate-limit";
import {
  SESSION_COOKIE,
  SESSION_TTL_DAYS,
  createSession,
  prisma,
  toPublicUser,
} from "@/lib/server/store";
import { fieldErrors, registerSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(`register:${clientIp(request)}`, 5, 15 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const { name, email, phone, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) {
    return NextResponse.json(
      { ok: false, error: "email_taken", fields: { email: "taken" } },
      { status: 409 },
    );
  }

  const { salt, hash } = await hashPassword(password);

  let user;
  try {
    user = await prisma.user.create({
      data: { name, email, phone, passwordSalt: salt, passwordHash: hash, bonus: 10000 },
    });
  } catch {
    // гонка: между проверкой и вставкой email мог занять другой запрос
    return NextResponse.json(
      { ok: false, error: "email_taken", fields: { email: "taken" } },
      { status: 409 },
    );
  }

  const token = await createSession(user.id);
  const response = NextResponse.json({ ok: true, user: toPublicUser(user) }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });

  console.log(`[mrsushi] новый пользователь: ${name} <${email}>`);
  return response;
}
