"use client";

import { useLocale } from "@/components/providers";
import type { TranslationKey } from "@/lib/i18n";

/** Клиентская часть страницы раздела: заголовок и текст переводятся. */
export function InfoPageBody({ titleKey }: { titleKey: TranslationKey }) {
  const { t } = useLocale();

  return (
    <>
      <h1 className="section-title">{t(titleKey)}</h1>

      <div className="panel mt-8 p-6 sm:p-8">
        <p className="font-display text-[1.05rem] uppercase">{t("side.soonTitle")}</p>
        <p className="mt-3 leading-relaxed text-[var(--ink-dim)]">{t("side.soonText")}</p>
      </div>
    </>
  );
}
