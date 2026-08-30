"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { DishImage } from "@/components/dish-image";
import { useCart, useLocale, useToast, useUI } from "@/components/providers";
import { MENU } from "@/lib/data/menu";
import type { TranslationKey } from "@/lib/i18n";
import { formatSum } from "@/lib/pricing";
import type { AllergenId } from "@/lib/types";

const ALLERGEN_KEY: Record<AllergenId, TranslationKey> = {
  fish: "allergen.fish",
  crustacean: "allergen.crustacean",
  gluten: "allergen.gluten",
  dairy: "allergen.dairy",
  egg: "allergen.egg",
  soy: "allergen.soy",
  sesame: "allergen.sesame",
  nuts: "allergen.nuts",
};

export function ProductModal() {
  const { t, locale } = useLocale();
  const { detailsId, setDetailsId, setCartOpen } = useUI();
  const { add, setQty, qtyOf } = useCart();
  const { push } = useToast();

  const item = detailsId ? (MENU.find((menuItem) => menuItem.id === detailsId) ?? null) : null;
  const close = useCallback(() => setDetailsId(null), [setDetailsId]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", Boolean(detailsId));
    return () => document.body.classList.remove("is-locked");
  }, [detailsId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  /*
   * Размонтируем сразу, без exit-анимации: AnimatePresence в
   * framer-motion 13 оставляет узел в DOM после проигрывания exit,
   * и прозрачный оверлей продолжает перехватывать клики.
   */
  if (!item) return null;

  const qty = qtyOf(item.id);
  const out = item.stock === 0;

  const increase = () => {
    if (qty >= item.stock) {
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

  const badges = [
    item.hit && { label: t("card.hit"), bg: "var(--brand)", fg: "#fff" },
    item.novelty && { label: t("card.new"), bg: "var(--ink-invert)", fg: "#fff" },
    item.spicy && { label: t("card.spicy"), bg: "#fff", fg: "var(--brand-hot)" },
    item.veg && { label: t("card.veg"), bg: "#fff", fg: "var(--leaf)" },
  ].filter(Boolean) as { label: string; bg: string; fg: string }[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[78] flex items-end justify-center sm:items-center sm:p-5"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex max-h-[92svh] w-full max-w-[46rem] flex-col overflow-hidden rounded-t-[18px] bg-white sm:max-h-[88svh] sm:rounded-[18px]"
        style={{ boxShadow: "var(--shadow-lift)" }}
        role="dialog"
        aria-modal="true"
        aria-label={item.name[locale]}
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[var(--ink-dim)] shadow-sm backdrop-blur transition-colors hover:text-[var(--brand)]"
          aria-label={t("common.close")}
        >
          ✕
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="relative">
            <DishImage
              item={item}
              sizes="(max-width: 640px) 100vw, 736px"
              className="h-52 w-full sm:h-64"
            />
            {badges.length > 0 && (
              <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                {badges.map((badge) => (
                  <span
                    key={badge.label}
                    className="rounded-full px-2.5 py-1 text-[0.7rem] font-bold"
                    style={{ background: badge.bg, color: badge.fg }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
            {out && (
              <div className="absolute inset-0 grid place-items-center bg-white/70">
                <span className="rounded-full bg-[var(--ink-invert)] px-4 py-2 text-[0.8rem] font-semibold text-white">
                  {t("card.out")}
                </span>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display pr-6 text-[1.5rem] uppercase leading-tight sm:text-[1.75rem]">
                {item.name[locale]}
              </h2>
              <span className="mt-1 flex shrink-0 items-center gap-1 text-[0.9rem]">
                <span aria-hidden style={{ color: "var(--gold)" }}>
                  ★
                </span>
                <span className="tnum font-bold">{item.rating}</span>
                <span className="text-[var(--ink-faint)]">({item.reviews})</span>
              </span>
            </div>

            <p className="mt-3 leading-relaxed text-[var(--ink-dim)]">
              {item.description[locale]}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Spec label={t("modal.weight")} value={`${item.weight} ${t("common.g")}`} />
              <Spec
                label={item.pieces ? t("modal.pieces") : t("modal.portion")}
                value={item.pieces ? String(item.pieces) : "1"}
              />
              <Spec label={t("modal.rating")} value={`★ ${item.rating}`} />
              <Spec label={t("modal.stock")} value={out ? "—" : String(item.stock)} />
            </dl>

            <section className="mt-6">
              <h3 className="field-label">{t("modal.composition")}</h3>
              <ul className="flex flex-wrap gap-1.5">
                {item.ingredients[locale].map((ingredient) => (
                  <li
                    key={ingredient}
                    className="rounded-full bg-[var(--bg-3)] px-3 py-1.5 text-[0.82rem] text-[var(--ink-dim)]"
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-5">
              <h3 className="field-label">{t("modal.allergens")}</h3>
              {item.allergens.length === 0 ? (
                <p className="text-[0.85rem] font-medium text-[var(--leaf)]">
                  {t("modal.noAllergens")}
                </p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {item.allergens.map((allergen) => (
                    <li
                      key={allergen}
                      className="rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-[0.8rem] font-medium text-[var(--ink-dim)]"
                    >
                      {t(ALLERGEN_KEY[allergen])}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2.5 text-[0.78rem] leading-relaxed text-[var(--ink-faint)]">
                {t("modal.allergenNote")}
              </p>
            </section>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] bg-white px-5 py-4 sm:px-7">
          <div className="flex items-baseline gap-2">
            <span className="tnum font-display text-[1.5rem] leading-none">
              {formatSum(item.price)}
            </span>
            <span className="text-[0.85rem] text-[var(--ink-faint)]">{t("common.sum")}</span>
            {item.oldPrice && (
              <span className="tnum text-[0.85rem] text-[var(--ink-faint)] line-through">
                {formatSum(item.oldPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {qty > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-[var(--bg-3)] p-1">
                <button
                  type="button"
                  onClick={() => setQty(item.id, qty - 1)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm"
                  aria-label="−"
                >
                  −
                </button>
                <span className="tnum w-7 text-center font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={increase}
                  className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand)] text-white transition-colors hover:bg-[var(--brand-hot)]"
                  aria-label="+"
                >
                  +
                </button>
              </div>
            )}

            {qty === 0 ? (
              <button
                type="button"
                disabled={out}
                onClick={increase}
                className="btn btn-primary !px-6"
              >
                {out ? t("card.out") : t("card.add")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  close();
                  setCartOpen(true);
                }}
                className="btn btn-primary !px-6"
              >
                {t("cart.title")}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--bg-3)] px-3 py-2.5">
      <dt className="text-[0.72rem] text-[var(--ink-faint)]">{label}</dt>
      <dd className="tnum mt-1 text-[0.95rem] font-bold">{value}</dd>
    </div>
  );
}
