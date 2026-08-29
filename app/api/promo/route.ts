import { NextResponse } from "next/server";
import { resolvePromo } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const code = String(body.code ?? "");
  const subtotal = Number(body.subtotal ?? 0);
  const result = resolvePromo(code, subtotal);

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
