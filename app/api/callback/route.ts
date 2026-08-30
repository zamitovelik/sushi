import { NextResponse } from "next/server";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/server/rate-limit";
import { prisma } from "@/lib/server/store";
import { notifyCallback } from "@/lib/server/telegram";
import { callbackSchema, fieldErrors } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(`callback:${clientIp(request)}`, 5, 60 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = callbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const callback = await prisma.callback.create({ data: parsed.data });

  // Telegram не ждём: заявка уже в базе, а оператор всё равно смотрит список
  void notifyCallback({
    name: callback.name,
    phone: callback.phone,
    comment: callback.comment,
  }).then((sent) => {
    if (!sent) return;
    return prisma.callback
      .update({ where: { id: callback.id }, data: { notifiedAt: new Date() } })
      .catch(() => undefined);
  });

  console.log(`[mrsushi] заявка на звонок: ${callback.name} · ${callback.phone}`);

  return NextResponse.json({ ok: true }, { status: 201 });
}
