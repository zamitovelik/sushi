"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useLocale, useUI } from "@/components/providers";
import { Reveal } from "@/components/reveal";
import { CATEGORIES, PRICE_BOUNDS } from "@/lib/data/menu";
import type { TranslationKey } from "@/lib/i18n";
import { formatSum } from "@/lib/pricing";
import type { CategoryId, MenuItem } from "@/lib/types";

type Sort = "popular" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: Sort; key: TranslationKey }[] = [
  { value: "popular", key: "menu.sort.popular" },
  { value: "price-asc", key: "menu.sort.price-asc" },
  { value: "price-desc", key: "menu.sort.price-desc" },
  { value: "rating", key: "menu.sort.rating" },
];

export function Catalog() {
  const { t, locale } = useLocale();
  // поиск живёт в шапке — каталог только применяет запрос
  const { query, setQuery } = useUI();

  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [maxPrice, setMaxPrice] = useState(PRICE_BOUNDS.max);
  const [inStock, setInStock] = useState(false);
  const [spicy, setSpicy] = useState(false);
  const [veg, setVeg] = useState(false);
  const [sort, setSort] = useState<Sort>("popular");

  const [items, setItems] = useState<MenuItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (category !== "all") p.set("category", category);
    if (query.trim()) p.set("q", query.trim());
    if (maxPrice < PRICE_BOUNDS.max) p.set("max", String(maxPrice));
    if (inStock) p.set("inStock", "1");
    if (spicy) p.set("spicy", "1");
    if (veg) p.set("veg", "1");
    p.set("sort", sort);
    return p.toString();
  }, [category, query, maxPrice, inStock, spicy, veg, sort]);

  const load = useCallback(async (search: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/menu?${search}`, {
        signal: controller.signal,
        cache: "no-store",
      });
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError(true);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void load(params), 220);
    return () => clearTimeout(timer);
  }, [params, load]);

  const dirty =
    category !== "all" ||
    query !== "" ||
    maxPrice < PRICE_BOUNDS.max ||
    inStock ||
    spicy ||
    veg ||
    sort !== "popular";

  const reset = () => {
    setCategory("all");
    setQuery("");
    setMaxPrice(PRICE_BOUNDS.max);
    setInStock(false);
    setSpicy(false);
    setVeg(false);
    setSort("popular");
  };

  return (
    <section id="menu" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="kicker">{t("menu.kicker")}</p>
              <h2 className="section-title mt-4">{t("menu.title")}</h2>
              <p className="mt-4 max-w-[46ch] text-[var(--ink-dim)]">{t("menu.lead")}</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <label className="relative flex-1 md:hidden">
                <span className="sr-only">{t("menu.search")}</span>
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="m20 20-3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  id="catalog-search"
                  placeholder={t("menu.search")}
                  className="field !pl-11"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] transition-colors hover:text-[var(--brand)]"
                    aria-label={t("common.close")}
                  >
                    ✕
                  </button>
                )}
              </label>

              <label className="relative">
                <span className="sr-only">{t("menu.sort")}</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                  className="field appearance-none !pr-10 text-[0.85rem]"
                  style={{ backgroundColor: "rgba(255,248,235,0.04)" }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#12100e]">
                      {t(option.key)}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
                >
                  ▾
                </span>
              </label>
            </div>
          </div>
        </Reveal>

        {/* категории */}
        <Reveal delay={80}>
          <div className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setCategory("all")}
              data-active={category === "all"}
              className="chip shrink-0"
            >
              {t("menu.all")}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                data-active={category === cat.id}
                className="chip shrink-0"
              >
                <span className="opacity-70">{cat.kana}</span>
                {cat.label[locale]}
              </button>
            ))}
          </div>
        </Reveal>

        {/* фильтры */}
        <Reveal delay={120}>
          <div className="panel mt-4 flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <span className="field-label !mb-0">{t("menu.priceRange")}</span>
                <span className="tnum text-[0.72rem] font-bold tabular-nums text-[var(--gold)]">
                  {formatSum(maxPrice)} {t("common.sum")}
                </span>
              </div>
              <input
                type="range"
                className="range mt-3"
                min={PRICE_BOUNDS.min}
                max={PRICE_BOUNDS.max}
                step={1000}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                aria-label={t("menu.priceRange")}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setInStock((v) => !v)}
                data-active={inStock}
                className="chip"
              >
                {t("menu.inStock")}
              </button>
              <button
                type="button"
                onClick={() => setSpicy((v) => !v)}
                data-active={spicy}
                className="chip"
              >
                {t("menu.spicy")}
              </button>
              <button
                type="button"
                onClick={() => setVeg((v) => !v)}
                data-active={veg}
                className="chip"
              >
                {t("menu.veg")}
              </button>
              {dirty && (
                <button
                  type="button"
                  onClick={reset}
                  className="tnum text-[0.62rem] uppercase tracking-[0.16em] text-[var(--brand)] underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {t("menu.reset")}
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* счётчик */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-[0.82rem] text-[var(--ink-faint)]">
            {t("menu.found")}: {loading ? "…" : total}
          </span>
          <span className="hairline h-px flex-1" />
        </div>

        {/* сетка */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading &&
            items.length === 0 &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[24rem] animate-pulse rounded-[--radius] border border-[var(--line)] bg-[var(--panel)]"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}

          <AnimatePresence>
            {!loading &&
              items.map((item, index) => (
                <ProductCard key={item.id} item={item} index={index} />
              ))}
          </AnimatePresence>
        </div>

        {!loading && !error && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel mt-6 flex flex-col items-center gap-4 px-6 py-20 text-center"
          >
            <span className="font-display text-4xl">🍥</span>
            <p className="font-display text-xl font-bold tracking-tight">{t("menu.empty")}</p>
            <p className="max-w-[36ch] text-sm text-[var(--ink-dim)]">{t("menu.emptyHint")}</p>
            <button type="button" onClick={reset} className="btn btn-ghost mt-2">
              {t("menu.reset")}
            </button>
          </motion.div>
        )}

        {error && (
          <div className="panel mt-6 px-6 py-16 text-center">
            <p className="font-display text-lg font-bold">
              {locale === "ru" ? "Сервер не ответил" : "Server javob bermadi"}
            </p>
            <button type="button" onClick={() => void load(params)} className="btn btn-ghost mt-5">
              {locale === "ru" ? "Повторить" : "Qayta urinish"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
