"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LogoLockup } from "@/components/logo";
import { useAuth, useCart, useLocale, useToast, useUI } from "@/components/providers";
import type { TranslationKey } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const NAV: { href: string; key: TranslationKey }[] = [
  { href: "#menu", key: "nav.menu" },
  { href: "#about", key: "nav.about" },
  { href: "#delivery", key: "nav.delivery" },
  { href: "#reviews", key: "nav.reviews" },
  { href: "#contacts", key: "nav.contacts" },
];

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const { count } = useCart();
  const { user, logout, orders } = useAuth();
  const { setCartOpen, setAuthOpen } = useUI();
  const { push } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [active, setActive] = useState("#menu");
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV.map((item) => document.querySelector(item.href)).filter(
      Boolean,
    ) as Element[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", mobileOpen);
    return () => document.body.classList.remove("is-locked");
  }, [mobileOpen]);

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
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(11,9,8,0.86)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        }}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center gap-3 px-4 sm:gap-6 sm:px-8">
          <a href="#top" className="shrink-0" aria-label="Mr. Sushi">
            <LogoLockup compact={scrolled} />
          </a>

          <nav className="ml-auto hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-active={active === item.href}
                className="link-underline font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)] data-[active=true]:text-[var(--ink)]"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
            {/* переключатель языка */}
            <div className="hidden items-center rounded-full border border-[var(--line)] p-0.5 sm:flex">
              {(["ru", "uz"] as Locale[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchLocale(code)}
                  className="relative rounded-full px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-colors"
                  style={{ color: locale === code ? "#fff6ec" : "var(--ink-faint)" }}
                >
                  {locale === code && (
                    <motion.span
                      layoutId="locale-pill"
                      className="absolute inset-0 rounded-full bg-[var(--brand)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{code}</span>
                </button>
              ))}
            </div>

            {/* Аккаунт. Кнопку «Войти» прячем на мобильном обёрткой, а не классом
                hidden: .btn задаёт display: inline-flex и перебивает утилиту. */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-[var(--line)] py-1.5 pl-1.5 pr-3.5 transition-colors hover:border-[var(--line-strong)]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--brand)] font-display text-[0.7rem] font-extrabold text-[#fff6ec]">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden font-mono text-[0.66rem] uppercase tracking-[0.14em] sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
              ) : (
                <span className="hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setAuthOpen("login")}
                    className="btn btn-ghost !px-4 !py-2.5 !text-[0.64rem]"
                  >
                    {t("auth.login")}
                  </button>
                </span>
              )}

                {user && accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="panel absolute right-0 top-[calc(100%+12px)] w-[19rem] overflow-hidden p-4"
                    style={{ background: "rgba(18,16,14,0.97)" }}
                  >
                    <p className="font-display text-sm font-bold">{user.name}</p>
                    <p className="mt-0.5 font-mono text-[0.62rem] tracking-wide text-[var(--ink-faint)]">
                      {user.email}
                    </p>
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--line)] px-3 py-2">
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                        {t("auth.bonus")}
                      </span>
                      <span className="font-mono text-sm font-bold text-[var(--gold)]">
                        {user.bonus.toLocaleString("ru-RU")}
                      </span>
                    </div>

                    <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                      {t("auth.myOrders")}
                    </p>
                    <div className="mt-2 max-h-40 space-y-1.5 overflow-y-auto">
                      {orders.length === 0 && (
                        <p className="text-xs text-[var(--ink-faint)]">{t("auth.noOrders")}</p>
                      )}
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between rounded-lg bg-[var(--panel)] px-3 py-2"
                        >
                          <span className="font-mono text-[0.66rem] text-[var(--ink-dim)]">
                            {order.number}
                          </span>
                          <span className="font-mono text-[0.66rem] font-bold">
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
                      className="btn btn-ghost mt-4 w-full !py-2.5 !text-[0.62rem]"
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
              className="relative flex h-11 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-[#fff6ec] transition-transform duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-brand)" }}
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
              {/* счётчик не анимируем: это критичная информация, она не должна зависеть от анимации */}
              <span
                key={count}
                className="animate-[pop_0.22s_cubic-bezier(0.2,0.9,0.3,1.4)] font-mono text-[0.72rem] font-bold tabular-nums"
              >
                {count}
              </span>
            </button>

            {/* бургер */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] lg:hidden"
              aria-label="Menu"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-px w-5 bg-[var(--ink)]" />
                <span className="block h-px w-5 bg-[var(--ink)]" />
                <span className="block h-px w-3 bg-[var(--brand)]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* мобильное меню */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[min(86vw,22rem)] flex-col gap-2 border-l border-[var(--line)] bg-[var(--bg-2)] p-7 pt-8"
            >
              <div className="flex items-center justify-between">
                <LogoLockup compact />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-dim)]"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-8 flex flex-col">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                    className="border-b border-[var(--line)] py-4 font-display text-lg font-semibold tracking-tight"
                  >
                    {t(item.key)}
                  </motion.a>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2">
                {(["ru", "uz"] as Locale[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => switchLocale(code)}
                    className="chip flex-1 justify-center"
                    data-active={locale === code}
                  >
                    {code}
                  </button>
                ))}
              </div>

              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setAuthOpen("login");
                  }}
                  className="btn btn-ghost mt-4"
                >
                  {t("auth.login")}
                </button>
              )}

              <a href="tel:+998883450593" className="btn btn-primary mt-3">
                88 345 05 93
              </a>
            </motion.nav>
          </motion.div>
        )}
    </>
  );
}
