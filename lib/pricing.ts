import { DELIVERY_FEE, FREE_DELIVERY_FROM, PROMOS } from "@/lib/data/menu";

export interface PriceInput {
  subtotal: number;
  promo?: string | null;
  delivery?: "delivery" | "pickup";
}

export interface PriceResult {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promo: string | null;
  promoPercent: number;
  freeDeliveryLeft: number;
}

export function resolvePromo(code: string | null | undefined, subtotal: number) {
  if (!code) return null;
  const key = code.trim().toUpperCase();
  const promo = PROMOS[key];
  if (!promo) return { key, valid: false as const, reason: "unknown" as const, percent: 0, min: 0 };
  if (subtotal < promo.min)
    return { key, valid: false as const, reason: "min" as const, percent: promo.percent, min: promo.min };
  return { key, valid: true as const, percent: promo.percent, min: promo.min };
}

export function calcTotals({ subtotal, promo, delivery = "delivery" }: PriceInput): PriceResult {
  const applied = resolvePromo(promo, subtotal);
  const percent = applied?.valid ? applied.percent : 0;
  const discount = Math.round((subtotal * percent) / 100);
  const payable = subtotal - discount;

  const deliveryFee =
    delivery === "pickup" || payable >= FREE_DELIVERY_FROM || payable === 0 ? 0 : DELIVERY_FEE;

  return {
    subtotal,
    discount,
    deliveryFee,
    total: payable + deliveryFee,
    promo: applied?.valid ? applied.key : null,
    promoPercent: percent,
    freeDeliveryLeft: Math.max(0, FREE_DELIVERY_FROM - payable),
  };
}

export function formatSum(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value));
}
