"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LogoMark } from "@/components/logo";
import { useLocale } from "@/components/providers";
import { MENU } from "@/lib/data/menu";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { t, locale } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const discY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 180]);
  const discRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  const avgRating = (
    MENU.reduce((sum, item) => sum + item.rating, 0) / MENU.length
  ).toFixed(1);

  const stats = [
    { value: String(MENU.length), label: t("hero.stat1") },
    { value: avgRating, label: t("hero.stat2") },
    { value: "40", label: t("hero.stat3") },
  ];

  return (
    <section
      id="top"
      ref={ref}
      className="aurora relative min-h-[100svh] overflow-hidden pt-[72px]"
    >
      {/* вертикальная кана слева */}
      <span
        aria-hidden
        className="kana pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 select-none text-[0.7rem] uppercase tracking-[0.5em] text-[var(--ink-faint)] 2xl:block"
      >
        寿司 · 巻き · 和食
      </span>

      {/* большой полупрозрачный диск-подложка */}
      <motion.div
        aria-hidden
        style={{ y: discY, rotate: discRotate }}
        className="pointer-events-none absolute -right-[22vw] top-[8vh] h-[74vw] w-[74vw] max-w-[900px] opacity-[0.09] lg:-right-[10vw] lg:h-[52vw] lg:w-[52vw]"
      >
        <LogoMark className="h-full w-full" />
      </motion.div>

      <div className="relative mx-auto grid w-full max-w-[1400px] gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8 lg:pt-10">
        <motion.div style={{ y: textY }} className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-mono text-[0.63rem] uppercase tracking-[0.28em] text-[var(--ink-dim)]"
          >
            {t("hero.eyebrow")}
          </motion.p>

          <h1 className="mt-6 font-display font-extrabold leading-[0.88] tracking-[-0.045em]">
            {(["hero.title1", "hero.title2", "hero.title3"] as const).map((key, i) => (
              <motion.span
                key={key}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.08 + i * 0.1, ease }}
                className="block whitespace-nowrap text-[clamp(2.4rem,7vw,4.9rem)]"
                style={i === 2 ? { color: "var(--brand)" } : undefined}
              >
                {t(key)}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="mt-7 max-w-[46ch] text-[1.02rem] leading-relaxed text-[var(--ink-dim)]"
          >
            {t("hero.lead")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a href="#menu" className="btn btn-primary">
              {t("hero.cta")}
              <span aria-hidden>↓</span>
            </a>
            <a href="tel:+998883450593" className="btn btn-ghost">
              {t("hero.call")}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-[var(--line)] pt-7"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-[1.9rem] font-extrabold leading-none tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* карточка-акция */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="relative z-10 mx-auto w-full max-w-[26rem] lg:mx-0 lg:ml-auto"
        >
          <div className="panel relative overflow-hidden p-7" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="seigaiha pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-40" />
            <motion.div
              animate={reduce ? undefined : { rotate: [0, 4, -3, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto w-28"
            >
              <LogoMark className="h-28 w-28" />
            </motion.div>

            <p className="mt-6 text-center font-display text-lg font-bold leading-snug tracking-tight">
              {t("hero.badge")}
            </p>

            <div className="mt-6 space-y-2.5">
              {["PANDA10", "CHIRCHIQ15", "INSTA20"].map((code, i) => (
                <motion.div
                  key={code}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center justify-between rounded-xl border border-dashed border-[var(--line-strong)] px-4 py-2.5"
                >
                  <span className="font-mono text-[0.72rem] font-bold tracking-[0.14em] text-[var(--gold)]">
                    {code}
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                    −{[10, 15, 20][i]}%
                  </span>
                </motion.div>
              ))}
            </div>

            <p className="mt-5 text-center font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
              {locale === "ru"
                ? "Промокод вводится в корзине"
                : "Promokod savatda kiritiladi"}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#menu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        aria-hidden
      >
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
          scroll
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-px bg-gradient-to-b from-[var(--brand)] to-transparent"
        />
      </motion.a>
    </section>
  );
}
