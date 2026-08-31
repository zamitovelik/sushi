"use client";

import { motion } from "framer-motion";
import { DishImage } from "@/components/dish-image";
import { useLocale, useUI } from "@/components/providers";
import { MENU } from "@/lib/data/menu";
import { formatSum } from "@/lib/pricing";

const ease = [0.16, 1, 0.3, 1] as const;

/** Три позиции для витрины героя — то, что реально хочется съесть. */
const SHOWCASE = ["set-panda", "salad-caesar", "baked-ebi"];

export function Hero() {
  const { t, locale } = useLocale();
  const { setCallbackOpen } = useUI();

  const showcase = SHOWCASE.map((id) => MENU.find((item) => item.id === id)!).filter(Boolean);


  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pb-14 lg:pt-14">
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
            <button
              type="button"
              onClick={() => setCallbackOpen(true)}
              className="btn btn-ghost"
            >
              {t("callback.cta")}
            </button>
          </motion.div>

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
              className="group relative block overflow-hidden rounded-[var(--r-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <DishImage
                item={item}
                sizes="(max-width: 640px) 50vw, 260px"
                className="h-40 w-full transition-transform duration-500 group-hover:scale-[1.06] sm:h-48 lg:h-56"
              />

              {/* Затемнение снизу: подпись лежит на фото, а снимки блюд
                  бывают почти белыми. Плотность подобрана по худшему
                  случаю — белый фон под строкой имени: на её высоте
                  подложка даёт контраст 5.8 при норме 4.5. */}
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,11,0.96) 0%, rgba(10,10,11,0.86) 32%, rgba(10,10,11,0.3) 64%, transparent 92%)",
                }}
              />

              {item.hit && (
                <span className="absolute left-3 top-3 rounded-full bg-[var(--brand)] px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.04em] text-white">
                  {t("card.hit")}
                </span>
              )}

              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/92 px-2 py-1 text-[0.7rem] font-semibold text-[var(--ink)]">
                <span aria-hidden style={{ color: "var(--gold)" }}>
                  ★
                </span>
                <span className="tnum">{item.rating}</span>
              </span>

              {/* имя и цена в столбик: в узкой плитке в строку они схлопывались в многоточие */}
              <span className="absolute inset-x-0 bottom-0 block p-3.5">
                <span className="block text-[0.88rem] font-semibold leading-snug text-white">
                  {item.name[locale]}
                </span>
                <span className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="tnum font-display text-[1.05rem] font-extrabold text-white">
                    {formatSum(item.price)}
                  </span>
                  <span className="text-[0.68rem] text-white/70">{t("common.sum")}</span>
                </span>
              </span>
            </a>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
