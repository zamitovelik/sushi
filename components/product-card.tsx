"use client";

import { motion } from "framer-motion";
import { DishImage } from "@/components/dish-image";
import { useCart, useLocale, useToast } from "@/components/providers";
import { formatSum } from "@/lib/pricing";
import type { MenuItem } from "@/lib/types";

export function ProductCard({ item, index }: { item: MenuItem; index: number }) {
  const { t, locale } = useLocale();
  const { add, setQty, qtyOf } = useCart();
  const { push } = useToast();

  const qty = qtyOf(item.id);
  const out = item.stock === 0;
  const low = !out && item.stock <= 5;
  const atMax = qty >= item.stock;

  const badges = [
    item.hit && { label: t("card.hit"), bg: "var(--brand)", fg: "#fff" },
    item.novelty && { label: t("card.new"), bg: "var(--ink-invert)", fg: "#fff" },
    item.spicy && { label: t("card.spicy"), bg: "#fff", fg: "var(--brand-hot)" },
    item.veg && { label: t("card.veg"), bg: "#fff", fg: "var(--leaf)" },
  ].filter(Boolean) as { label: string; bg: string; fg: string }[];

  const increase = () => {
    if (atMax) {
      push(t("card.maxStock"), "err");
      return;
    }
    if (qty === 0) {
      add(item.id);
      push(`${item.name[locale]} — ${t("toast.added")}`);
    } else {
      setQty(item.id, qty + 1);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[var(--r-card)] bg-white transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
      style={{ boxShadow: "var(--shadow-soft)", opacity: out ? 0.7 : 1 }}
    >
      <div className="relative overflow-hidden">
        <DishImage
          item={item}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          className="h-40 w-full transition-transform duration-500 group-hover:scale-[1.05] sm:h-44"
        />

        {badges.length > 0 && (
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className="rounded-full px-2.5 py-1 text-[0.68rem] font-bold"
                style={{ background: badge.bg, color: badge.fg }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {out && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <span className="rounded-full bg-[var(--ink-invert)] px-3.5 py-1.5 text-[0.72rem] font-semibold text-white">
              {t("card.out")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.98rem] font-semibold leading-snug">{item.name[locale]}</h3>
          <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[0.78rem] text-[var(--ink-faint)]">
            <span aria-hidden style={{ color: "var(--gold)" }}>
              ★
            </span>
            <span className="tnum font-semibold text-[var(--ink-dim)]">{item.rating}</span>
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-[0.84rem] leading-relaxed text-[var(--ink-faint)]">
          {item.description[locale]}
        </p>

        <p className="mt-2 text-[0.78rem] text-[var(--ink-faint)]">
          {item.weight} {t("common.g")}
          {item.pieces ? ` · ${item.pieces} ${t("card.pcs")}` : ""}
          {low ? (
            <span className="font-semibold text-[var(--brand-hot)]">
              {" "}
              · {t("card.last")} {item.stock}
            </span>
          ) : null}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex items-baseline gap-1.5">
            <span className="tnum font-display text-[1.15rem] leading-none">
              {formatSum(item.price)}
            </span>
            <span className="text-[0.75rem] text-[var(--ink-faint)]">{t("common.sum")}</span>
            {item.oldPrice && (
              <span className="tnum text-[0.75rem] text-[var(--ink-faint)] line-through">
                {formatSum(item.oldPrice)}
              </span>
            )}
          </div>

          {qty === 0 ? (
            <button
              type="button"
              disabled={out}
              onClick={increase}
              className="btn btn-primary !px-4 !py-2 !text-[0.82rem]"
            >
              {out ? "—" : t("card.add")}
            </button>
          ) : (
            <div className="flex animate-[pop_0.2s_ease] items-center gap-0.5 rounded-full bg-[var(--bg-3)] p-1">
              <button
                type="button"
                onClick={() => setQty(item.id, qty - 1)}
                className="grid h-7 w-7 place-items-center rounded-full bg-white text-[var(--ink)] shadow-sm transition-colors hover:text-[var(--brand)]"
                aria-label="−"
              >
                −
              </button>
              <span className="tnum w-6 text-center text-[0.85rem] font-bold">{qty}</span>
              <button
                type="button"
                onClick={increase}
                className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand)] text-white transition-colors hover:bg-[var(--brand-hot)]"
                aria-label="+"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
