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
    item.hit && { label: t("card.hit"), color: "var(--brand)" },
    item.novelty && { label: t("card.new"), color: "var(--gold)" },
    item.spicy && { label: t("card.spicy"), color: "#FF7043" },
    item.veg && { label: t("card.veg"), color: "var(--leaf)" },
  ].filter(Boolean) as { label: string; color: string }[];

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
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.035, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[--radius] border border-[var(--line)] bg-[var(--panel)] backdrop-blur-md transition-colors duration-500 hover:border-[var(--line-strong)]"
      style={{ opacity: out ? 0.62 : 1 }}
    >
      {/* иллюстрация */}
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `radial-gradient(70% 60% at 50% 45%, ${item.tone}26, transparent 70%)`,
          }}
        />
        <DishImage
          item={item}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          className="relative h-44 w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className="rounded-full px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.14em]"
              style={{ background: badge.color, color: "#150f0d" }}
            >
              {badge.label}
            </span>
          ))}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-[var(--line)] bg-black/55 px-2.5 py-1 backdrop-blur">
          <span className="text-[0.65rem] text-[var(--gold)]">★</span>
          <span className="font-mono text-[0.62rem] font-bold tabular-nums">{item.rating}</span>
          <span className="font-mono text-[0.55rem] text-[var(--ink-faint)]">({item.reviews})</span>
        </div>

        {out && (
          <div className="absolute inset-0 grid place-items-center bg-black/55 backdrop-blur-[2px]">
            <span className="rounded-full border border-[var(--brand)] px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--brand-hot)]">
              {t("card.out")}
            </span>
          </div>
        )}
      </div>

      {/* контент */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.02rem] font-bold leading-tight tracking-tight">
          {item.name[locale]}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.83rem] leading-relaxed text-[var(--ink-dim)]">
          {item.description[locale]}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          <span>
            {item.weight} {t("common.g")}
          </span>
          {item.pieces ? (
            <span>
              · {item.pieces} {t("card.pcs")}
            </span>
          ) : null}
          {low && (
            <span className="text-[var(--brand-hot)]">
              · {t("card.last")} {item.stock}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {item.oldPrice && (
              <p className="font-mono text-[0.68rem] text-[var(--ink-faint)] line-through">
                {formatSum(item.oldPrice)}
              </p>
            )}
            <p className="font-display text-[1.25rem] font-extrabold leading-none tracking-tight">
              {formatSum(item.price)}
              <span className="ml-1 font-mono text-[0.6rem] font-normal tracking-[0.12em] text-[var(--ink-faint)]">
                {t("common.sum")}
              </span>
            </p>
          </div>

          {qty === 0 ? (
            <button
              type="button"
              disabled={out}
              onClick={increase}
              className="btn btn-primary !px-4 !py-2.5 !text-[0.6rem] disabled:!shadow-none"
            >
              {out ? t("card.out") : t("card.add")}
            </button>
          ) : (
            <div className="flex animate-[pop_0.22s_cubic-bezier(0.2,0.9,0.3,1.4)] items-center gap-1 rounded-full border border-[var(--brand)] p-1">
              <button
                type="button"
                onClick={() => setQty(item.id, qty - 1)}
                className="grid h-8 w-8 place-items-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--panel-strong)]"
                aria-label="−"
              >
                −
              </button>
              <span className="w-6 text-center font-mono text-[0.8rem] font-bold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={increase}
                className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand)] text-[#fff6ec] transition-colors hover:bg-[var(--brand-hot)]"
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
