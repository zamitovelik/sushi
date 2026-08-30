"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoLockup } from "@/components/logo";
import { useAddress, useAuth, useCart, useLocale, useToast, useUI } from "@/components/providers";
import type { Locale } from "@/lib/types";

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const { count } = useCart();
  const { user, logout, orders } = useAuth();
  const { setCartOpen, setAuthOpen, setAddressOpen, setSideOpen, query, setQuery } = useUI();
  const { address } = useAddress();
  const { push } = useToast();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const switchLocale = (next: Locale) => {
    setLocale(next);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] w-full max-w-[1320px] items-center gap-2.5 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setSideOpen(true)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-[var(--bg-3)]"
            aria-label={t("side.title")}
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block h-[2px] w-[18px] rounded bg-[var(--ink)]" />
              <span className="block h-[2px] w-[18px] rounded bg-[var(--ink)]" />
              <span className="block h-[2px] w-[18px] rounded bg-[var(--ink)]" />
            </span>
          </button>

          <Link href="/" className="shrink-0" aria-label="Mr. Sushi">
            <LogoLockup compact />
          </Link>

          {/* поиск переехал сюда из каталога — так его находят сразу */}
          <label className="relative ml-2 hidden min-w-0 max-w-[22rem] flex-1 md:block">
            <span className="sr-only">{t("menu.search")}</span>
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                // ищем по каталогу, поэтому сразу подводим к нему
                document.querySelector("#menu")?.scrollIntoView({ block: "start" });
              }}
              placeholder={t("menu.search")}
              className="field !py-2 !pl-10 !text-[0.9rem]"
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

          <button
            type="button"
            onClick={() => setAddressOpen(true)}
            className="ml-auto hidden max-w-[15rem] items-center gap-1.5 rounded-full border border-[var(--line-strong)] py-2 pl-3 pr-3.5 text-[0.85rem] transition-colors hover:border-[var(--ink)] md:flex"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
              <path
                d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
                stroke="var(--brand)"
                strokeWidth="1.8"
              />
              <circle cx="12" cy="10" r="2.4" stroke="var(--brand)" strokeWidth="1.8" />
            </svg>
            <span className="truncate">{address ? address.text : t("address.pick")}</span>
            <span aria-hidden className="text-[var(--ink-faint)]">▾</span>
          </button>

          <div className="ml-auto flex items-center gap-2 md:ml-3 sm:gap-2.5">
            <a
              href="tel:+998883450593"
              className="hidden text-[0.92rem] font-semibold text-[var(--ink)] transition-colors hover:text-[var(--brand)] xl:block"
            >
              88 345 05 93
            </a>

            {/* язык */}
            <div className="hidden items-center rounded-full bg-[var(--bg-3)] p-0.5 sm:flex">
              {(["ru", "uz"] as Locale[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchLocale(code)}
                  className="relative rounded-full px-2.5 py-1.5 text-[0.78rem] font-semibold uppercase transition-colors"
                  style={{ color: locale === code ? "#ffffff" : "var(--ink-dim)" }}
                >
                  {locale === code && (
                    <motion.span
                      layoutId="locale-pill"
                      className="absolute inset-0 rounded-full bg-[var(--ink-invert)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{code}</span>
                </button>
              ))}
            </div>

            {/* аккаунт */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-[var(--line)] py-1.5 pl-1.5 pr-3 transition-colors hover:border-[var(--line-strong)]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand)] text-[0.8rem] font-bold text-white">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden text-[0.85rem] font-medium sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
              ) : (
                <span className="hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setAuthOpen("login")}
                    className="btn btn-ghost !px-4 !py-2 !text-[0.85rem]"
                  >
                    {t("auth.login")}
                  </button>
                </span>
              )}

              {user && accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className="panel absolute right-0 top-[calc(100%+10px)] w-[19rem] overflow-hidden p-4"
                  style={{ boxShadow: "var(--shadow-lift)" }}
                >
                  <p className="font-display text-[0.95rem]">{user.name}</p>
                  <p className="mt-0.5 text-[0.8rem] text-[var(--ink-faint)]">{user.email}</p>

                  <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--bg-3)] px-3 py-2.5">
                    <span className="text-[0.82rem] text-[var(--ink-dim)]">{t("auth.bonus")}</span>
                    <span className="tnum text-[0.95rem] font-bold text-[var(--gold)]">
                      {user.bonus.toLocaleString("ru-RU")}
                    </span>
                  </div>

                  <p className="mt-4 text-[0.75rem] font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
                    {t("auth.myOrders")}
                  </p>
                  <div className="mt-2 max-h-40 space-y-1.5 overflow-y-auto">
                    {orders.length === 0 && (
                      <p className="text-[0.82rem] text-[var(--ink-faint)]">{t("auth.noOrders")}</p>
                    )}
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg bg-[var(--bg-3)] px-3 py-2"
                      >
                        <span className="text-[0.82rem] text-[var(--ink-dim)]">{order.number}</span>
                        <span className="tnum text-[0.82rem] font-semibold">
                          {order.total.toLocaleString("ru-RU")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      setAccountOpen(false);
                      push(t("toast.bye"));
                    }}
                    className="btn btn-ghost mt-4 w-full !py-2 !text-[0.85rem]"
                  >
                    {t("auth.logout")}
                  </button>
                </motion.div>
              )}
            </div>

            {/* корзина */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-white transition-colors hover:bg-[var(--brand-hot)]"
              aria-label={t("cart.title")}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M3 5h2.2l2.1 10.6a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="1.4" fill="currentColor" />
                <circle cx="17" cy="20" r="1.4" fill="currentColor" />
              </svg>
              <span key={count} className="tnum animate-[pop_0.22s_ease] text-[0.88rem] font-bold">
                {count}
              </span>
            </button>

            {/* поиск на мобильном — иконкой, поле в шапке не помещается */}
            <button
              type="button"
              onClick={() => {
                document.querySelector("#menu")?.scrollIntoView({ block: "start" });
                setTimeout(
                  () => document.querySelector<HTMLInputElement>("#catalog-search")?.focus(),
                  400,
                );
              }}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] md:hidden"
              aria-label={t("menu.search")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* мобильное меню */}
    </>
  );
}
