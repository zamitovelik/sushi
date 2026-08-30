"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { LogoLockup } from "@/components/logo";
import { useLocale, useUI } from "@/components/providers";
import type { TranslationKey } from "@/lib/i18n";

/**
 * Боковое меню слева — как у yaponamama.uz: весь второстепенный
 * навигационный слой убран из шапки сюда.
 *
 * Пункты, у которых есть якорь, скроллят к секции на главной.
 * Остальные ведут на страницы-заглушки: содержимое для них —
 * юридические тексты и контент заведения, выдумывать его нельзя.
 */
const ITEMS: { key: TranslationKey; href: string }[] = [
  { key: "side.branches", href: "/info/branches" },
  { key: "side.contacts", href: "/#contacts" },
  { key: "side.gallery", href: "/info/gallery" },
  { key: "side.about", href: "/#about" },
  { key: "side.jobs", href: "/info/jobs" },
  { key: "side.delivery", href: "/#delivery" },
  { key: "side.feedback", href: "/#reviews" },
  { key: "side.promos", href: "/info/promos" },
  { key: "side.news", href: "/info/news" },
  { key: "side.recipes", href: "/info/recipes" },
  { key: "side.terms", href: "/info/terms" },
  { key: "side.rules", href: "/info/rules" },
  { key: "side.offer", href: "/info/offer" },
  { key: "side.legal", href: "/info/legal" },
  { key: "side.certs", href: "/info/certificates" },
  { key: "side.returns", href: "/info/returns" },
];

export function SideMenu() {
  const { t } = useLocale();
  const { sideOpen, setSideOpen } = useUI();

  useEffect(() => {
    document.body.classList.toggle("is-locked", sideOpen);
    return () => document.body.classList.remove("is-locked");
  }, [sideOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSideOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSideOpen]);

  if (!sideOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[80]"
    >
      <div className="absolute inset-0 bg-black/40" onClick={() => setSideOpen(false)} />

      <motion.nav
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="absolute left-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col bg-white"
        style={{ boxShadow: "var(--shadow-lift)" }}
        aria-label={t("side.title")}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <LogoLockup compact />
          <button
            type="button"
            onClick={() => setSideOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-dim)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            aria-label={t("common.close")}
          >
            ✕
          </button>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto py-2">
          {ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setSideOpen(false)}
                className="block px-5 py-3.5 text-[0.95rem] leading-snug transition-colors hover:bg-[var(--bg-3)]"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-[var(--line)] px-5 py-4">
          <a href="tel:+998883450593" className="btn btn-primary w-full">
            88 345 05 93
          </a>
        </div>
      </motion.nav>
    </motion.div>
  );
}
