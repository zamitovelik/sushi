/**
 * Ограничитель частоты запросов: скользящее окно в памяти процесса.
 *
 * Осознанное ограничение: счётчики не шарятся между процессами, поэтому
 * при запуске в несколько воркеров (PM2 cluster, несколько контейнеров)
 * фактический лимит умножается на их число. Для одного инстанса этого
 * достаточно; для горизонтального масштабирования нужен Redis.
 */

interface Bucket {
  hits: number[];
}

declare global {
  var __MRSUSHI_RATE__: Map<string, Bucket> | undefined;
}

const buckets: Map<string, Bucket> = globalThis.__MRSUSHI_RATE__ ?? new Map();
if (process.env.NODE_ENV !== "production") globalThis.__MRSUSHI_RATE__ = buckets;

/** Раз в 5 минут выкидываем протухшие ключи, чтобы карта не росла вечно. */
let lastSweep = Date.now();
function sweep(now: number, windowMs: number) {
  if (now - lastSweep < 5 * 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    bucket.hits = bucket.hits.filter((time) => now - time < windowMs);
    if (bucket.hits.length === 0) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now, windowMs);

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((time) => now - time < windowMs);

  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    const oldest = bucket.hits[0];
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: limit - bucket.hits.length, retryAfterSeconds: 0 };
}

/**
 * IP клиента. За Nginx/Cloudflare реальный адрес приходит в заголовках,
 * поэтому доверяем им — но только потому, что приложение всегда стоит
 * за обратным прокси. При прямом выставлении в интернет заголовок
 * подделывается и лимит обходится.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function tooManyRequests(result: RateLimitResult) {
  return Response.json(
    { ok: false, error: "rate_limited", retryAfter: result.retryAfterSeconds },
    { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
  );
}
