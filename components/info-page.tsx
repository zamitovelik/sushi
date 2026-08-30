"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers";
import { GALLERY_PHOTOS, INFO_CONTENT, type InfoBlock } from "@/lib/data/info";
import type { TranslationKey } from "@/lib/i18n";

export function InfoPageBody({ titleKey, slug }: { titleKey: TranslationKey; slug: string }) {
  const { t, locale } = useLocale();
  const blocks = INFO_CONTENT[slug] ?? [];

  return (
    <>
      <p className="kicker">Mr. Sushi</p>
      <h1 className="section-title mt-3">{t(titleKey)}</h1>

      <div className="mt-8 space-y-8">
        {blocks.map((block, i) => (
          <Block key={i} block={block} locale={locale} />
        ))}
      </div>
    </>
  );
}

function Block({ block, locale }: { block: InfoBlock; locale: "ru" | "uz" }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="text-[1.05rem] leading-relaxed text-[var(--ink-dim)]">
          {block.text[locale]}
        </p>
      );

    case "paragraphs":
      return (
        <div className="space-y-4">
          {block.items.map((item, i) => (
            <p key={i} className="leading-relaxed text-[var(--ink-dim)]">
              {item[locale]}
            </p>
          ))}
        </div>
      );

    case "list":
      return (
        <section>
          {block.title && (
            <h2 className="font-display mb-3 text-[1.05rem] uppercase">{block.title[locale]}</h2>
          )}
          <ul className="space-y-2.5">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3 leading-relaxed text-[var(--ink-dim)]">
                <span className="mt-[0.6rem] h-1 w-3 shrink-0 bg-[var(--brand)]" aria-hidden />
                <span>{item[locale]}</span>
              </li>
            ))}
          </ul>
        </section>
      );

    case "cards":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <article key={i} className="panel flex flex-col p-5">
              <h3 className="font-display text-[1.02rem] leading-snug">{item.title[locale]}</h3>
              <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-[var(--ink-dim)]">
                {item.text[locale]}
              </p>
              {item.meta && (
                <p className="mt-4 text-[0.82rem] font-semibold text-[var(--brand)]">
                  {item.meta[locale]}
                </p>
              )}
            </article>
          ))}
        </div>
      );

    case "steps":
      return (
        <ol className="relative space-y-0">
          <span className="absolute bottom-3 left-[1.1rem] top-3 w-px bg-[var(--line)]" aria-hidden />
          {block.items.map((item, i) => (
            <li key={i} className="relative flex gap-5 pb-7 last:pb-0">
              <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white text-[0.8rem] font-bold text-[var(--brand)]">
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="font-display text-[1rem] leading-snug">{item.title[locale]}</h3>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-[var(--ink-dim)]">
                  {item.text[locale]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "faq":
      return (
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <details key={i} className="panel group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold">
                {item.q[locale]}
                <span
                  aria-hidden
                  className="shrink-0 text-[var(--ink-faint)] transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-[var(--ink-dim)]">{item.a[locale]}</p>
            </details>
          ))}
        </div>
      );

    case "gallery":
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GALLERY_PHOTOS.map((name) => (
            <span
              key={name}
              className="relative block aspect-square overflow-hidden rounded-[var(--r-img)] bg-[var(--bg-2)]"
            >
              <Image
                src={`/menu/${name}.webp`}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 240px"
                className="object-cover"
              />
            </span>
          ))}
        </div>
      );

    case "note":
      return (
        <p className="rounded-[var(--r-card)] bg-[var(--bg-2)] px-5 py-4 text-[0.9rem] leading-relaxed text-[var(--ink-dim)]">
          {block.text[locale]}
        </p>
      );
  }
}
