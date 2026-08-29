import { NextResponse } from "next/server";
import { resolvePromo } from "@/lib/pricing";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/server/rate-limit";
import { promoSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // перебор промокодов ограничиваем: их пространство маленькое
  const limit = rateLimit(`promo:${clientIp(request)}`, 30, 10 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = promoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const result = resolvePromo(parsed.data.code, parsed.data.subtotal);
  if (!result || !result.valid) {
    return NextResponse.json(
      {
        ok: false,
        error: result?.reason === "min" ? "min_not_reached" : "unknown_code",
        min: result?.min ?? 0,
      },
      { status: 422 },
    );
  }

  return NextResponse.json({ ok: true, code: result.key, percent: result.percent });
}
