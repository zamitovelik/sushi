import { z } from "zod";

/**
 * Схемы валидации, общие для клиента и сервера.
 * Раньше регулярки дублировались в четырёх роутах и двух компонентах
 * и неизбежно разъезжались при правках — теперь источник один.
 */

const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const trimmed = z.string().transform((value) => value.trim());

export const nameField = trimmed.pipe(z.string().min(2, "too_short").max(80, "too_long"));

export const phoneField = trimmed.pipe(z.string().regex(PHONE_RE, "invalid"));

export const emailField = trimmed
  .transform((value) => value.toLowerCase())
  .pipe(z.string().regex(EMAIL_RE, "invalid"));

export const passwordField = z.string().min(6, "too_short").max(200, "too_long");

/* ─────────────────────────── авторизация ─────────────────────────── */

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "required"),
});

/* ───────────────────────────── заказы ───────────────────────────── */

export const orderSchema = z
  .object({
    items: z
      .array(
        z.object({
          id: z.string().min(1, "required"),
          qty: z.number().int().min(1).max(50),
        }),
      )
      .min(1, "empty")
      .max(60, "too_many"),
    customer: z.object({
      name: nameField,
      phone: phoneField,
      address: trimmed.pipe(z.string().max(300, "too_long")).default(""),
      comment: trimmed.pipe(z.string().max(500, "too_long")).default(""),
    }),
    delivery: z.enum(["delivery", "pickup"]),
    payment: z.enum(["cash", "card", "click"]),
    time: z.string().max(20).default("asap"),
    promo: z.string().max(40).nullable().optional(),
  })
  // адрес обязателен только при доставке — самовывозу он не нужен
  .refine((data) => data.delivery === "pickup" || data.customer.address.length >= 5, {
    path: ["customer", "address"],
    message: "too_short",
  });

/* ───────────────────────────── прочее ───────────────────────────── */

export const promoSchema = z.object({
  code: z.string().min(1, "required").max(40),
  subtotal: z.number().int().min(0),
});

export const reserveSchema = z.object({
  name: nameField,
  phone: phoneField,
  guests: z.coerce.number().int().min(1, "too_small").max(20, "too_big"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "invalid"),
});

export const callbackSchema = z.object({
  name: nameField,
  phone: phoneField,
  comment: trimmed.pipe(z.string().max(300, "too_long")).default(""),
});

export const menuQuerySchema = z.object({
  category: z.string().optional(),
  q: z.string().max(80).optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  inStock: z.string().optional(),
  spicy: z.string().optional(),
  veg: z.string().optional(),
  sort: z.enum(["popular", "price-asc", "price-desc", "rating"]).catch("popular"),
});

/* ───────────────────────────── хелперы ───────────────────────────── */

/**
 * Превращает ошибку zod в плоскую карту «поле → код», которую ждёт клиент.
 * Вложенные пути схлопываются до последнего сегмента: customer.phone → phone,
 * потому что формы на клиенте плоские.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.filter((part) => typeof part !== "number");
    const key = String(path.at(-1) ?? "form");
    fields[key] ??= issue.message || "invalid";
  }
  return fields;
}

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type ReserveInput = z.infer<typeof reserveSchema>;
export type CallbackInput = z.infer<typeof callbackSchema>;
