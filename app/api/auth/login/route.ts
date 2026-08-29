import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/server/passwords";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/server/rate-limit";
import {
  SESSION_COOKIE,
  SESSION_TTL_DAYS,
  createSession,
  prisma,
  toPublicUser,
} from "@/lib/server/store";
import { fieldErrors, loginSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = clientIp(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const { email, password } = parsed.data;

  // Два лимита: по IP — против перебора учёток с одного адреса,
  // по email — против распределённого перебора одного пароля.
  const byIp = rateLimit(`login:ip:${ip}`, 10, 15 * 60_000);
  if (!byIp.ok) return tooManyRequests(byIp);
  const byEmail = rateLimit(`login:email:${email}`, 5, 15 * 60_000);
  if (!byEmail.ok) return tooManyRequests(byEmail);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordSalt, user.passwordHash))) {
    // одинаковый ответ на «нет такого email» и «неверный пароль»,
    // иначе форма превращается в валидатор существующих адресов
    return NextResponse.json({ ok: false, error: "bad_credentials" }, { status: 401 });
  }

  const token = await createSession(user.id);
  const response = NextResponse.json({ ok: true, user: toPublicUser(user) });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });

  console.log(`[mrsushi] вход: ${email}`);
  return response;
}
