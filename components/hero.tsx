"use client";

import { motion } from "framer-motion";
import { DishImage } from "@/components/dish-image";
import { useLocale } from "@/components/providers";
import { MENU } from "@/lib/data/menu";
import { formatSum } from "@/lib/pricing";

const ease = [0.16, 1, 0.3, 1] as const;

/** Три позиции для витрины героя — то, что реально хочется съесть. */
const SHOWCASE = ["set-panda", "roll-philadelphia", "baked-ebi"];

export function Hero() {
  const { t, locale } = useLocale();

  const showcase = SHOWCASE.map((id) => MENU.find((item) => item.id === id)!).filter(Boolean);

  const stats = [
    { value: "40", label: t("hero.stat3") },
    { value: String(MENU.length), label: t("hero.stat1") },
    {
      value: (MENU.reduce((sum, i) => sum + i.rating, 0) / MENU.length).toFixed(1),
      label: t("hero.stat2"),
    },
  ];

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pb-20 lg:pt-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="eyebrow"
          >
            {t("hero.eyebrow")}
          </motion.p>

          <h1 className="mt-4 font-display uppercase leading-[0.92] tracking-[-0.025em]">
            {(["hero.title1", "hero.title2", "hero.title3"] as const).map((key, i) => (
              <motion.span
                key={key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.06 + i * 0.08, ease }}
                className="block text-[clamp(2.3rem,6.5vw,4.4rem)]"
                style={i === 2 ? { color: "var(--brand)" } : undefined}
              >
                {t(key)}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease }}
            className="mt-5 max-w-[44ch] text-[1.02rem] leading-relaxed text-[var(--ink-dim)]"
          >
            {t("hero.lead")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a href="#menu" className="btn btn-primary !px-7">
              {t("hero.cta")}
            </a>
            <a href="tel:+998883450593" className="btn btn-ghost">
              {t("hero.call")}
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-10 flex flex-wrap gap-x-9 gap-y-5 border-t border-[var(--line)] pt-6"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display block text-[1.75rem] leading-none">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-[0.8rem] text-[var(--ink-faint)]">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* витрина: три блюда, как на референсах — еда, а не декор */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4"
        >
          {showcase.map((item) => (
            <a
              key={item.id}
              href="#menu"
              className="group overflow-hidden rounded-[var(--r-card)] bg-white transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <DishImage
                item={item}
                sizes="(max-width: 640px) 50vw, 220px"
                className="h-28 w-full transition-transform duration-500 group-hover:scale-[1.04] sm:h-32 lg:h-36"
              />
              {/* имя и цена в столбик: в узкой карточке в строку они схлопывались в многоточие */}
              <div className="px-3 py-3">
                <span className="block text-[0.86rem] font-semibold leading-snug">
                  {item.name[locale]}
                </span>
                <span className="tnum mt-1 block text-[0.9rem] font-bold text-[var(--brand)]">
                  {formatSum(item.price)}
                </span>
              </div>
            </a>
          ))}
        </motion.div>
      </div>

      {/* полоса выгод — как у Kura под первым экраном */}
      <div className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
          {[
            { t: t("hero.badge"), k: "🛵" },
            { t: t("about.f1t"), k: "🐟" },
            { t: t("about.f2t"), k: "🔪" },
            { t: t("about.f4t"), k: "📦" },
          ].map((b) => (
            <div key={b.t} className="flex items-center gap-2.5 py-4">
              <span aria-hidden className="text-lg">
                {b.k}
              </span>
              <span className="text-[0.84rem] font-medium leading-tight text-[var(--ink-dim)]">
                {b.t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
