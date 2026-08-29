import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

/**
 * scrypt намеренно медленный — это его смысл. Синхронный scryptSync
 * блокировал бы event loop на всё время вычисления, и один логин
 * останавливал бы обработку всех остальных запросов процесса.
 */
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

export async function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  return { salt, hash: derived.toString("hex") };
}

export async function verifyPassword(password: string, salt: string, hash: string) {
  const candidate = await scryptAsync(password, salt, KEY_LENGTH);
  const known = Buffer.from(hash, "hex");
  // timingSafeEqual падает при разной длине, поэтому сверяем её заранее
  if (candidate.length !== known.length) return false;
  return timingSafeEqual(candidate, known);
}
