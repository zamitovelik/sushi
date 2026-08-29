import { NextResponse } from "next/server";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/server/rate-limit";
import { prisma } from "@/lib/server/store";
import { fieldErrors, reserveSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(`reserve:${clientIp(request)}`, 5, 60 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = reserveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const reservation = await prisma.reservation.create({ data: parsed.data });

  console.log(
    `[mrsushi] бронь: ${reservation.name} · ${reservation.guests} гостей · ${reservation.date} ${reservation.time}`,
  );

  return NextResponse.json(
    {
      ok: true,
      reservation: {
        ...reservation,
        createdAt: reservation.createdAt.toISOString(),
      },
    },
    { status: 201 },
  );
}
