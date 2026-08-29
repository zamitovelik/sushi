import { NextResponse } from "next/server";
import { db, newId } from "@/lib/server/store";

export const dynamic = "force-dynamic";

const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const guests = Number(body.guests ?? 2);
  const date = String(body.date ?? "");
  const time = String(body.time ?? "");

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "too_short";
  if (!PHONE_RE.test(phone)) fields.phone = "invalid";
  if (!date) fields.date = "required";
  if (!time) fields.time = "required";

  if (Object.keys(fields).length) {
    return NextResponse.json({ ok: false, error: "validation", fields }, { status: 422 });
  }

  const reservation = {
    id: newId(),
    name,
    phone,
    guests: Math.min(20, Math.max(1, guests)),
    date,
    time,
    createdAt: new Date().toISOString(),
  };
  db.reservations.push(reservation);

  console.log(`[mrsushi] бронь: ${name} · ${guests} гостей · ${date} ${time} · ${phone}`);
  return NextResponse.json({ ok: true, reservation }, { status: 201 });
}
