import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoPageBody } from "@/components/info-page";

/**
 * Страницы второстепенных разделов из бокового меню.
 *
 * Содержимое намеренно не заполнено: оферта, юридическая информация
 * и правила возврата — юридические документы, их нельзя сочинять.
 * Остальное (филиалы, вакансии, новости) — фактические данные заведения.
 * Структура и навигация готовы, текст вставляется в одном месте.
 */
const PAGES = {
  branches: "side.branches",
  gallery: "side.gallery",
  jobs: "side.jobs",
  promos: "side.promos",
  news: "side.news",
  recipes: "side.recipes",
  terms: "side.terms",
  rules: "side.rules",
  offer: "side.offer",
  legal: "side.legal",
  certificates: "side.certs",
  returns: "side.returns",
} as const;

type Slug = keyof typeof PAGES;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in PAGES)) notFound();

  return (
    <main className="mx-auto w-full max-w-[720px] px-5 py-16 sm:px-6 sm:py-24">
      <InfoPageBody titleKey={PAGES[slug as Slug]} slug={slug} />

      <Link href="/" className="btn btn-ghost mt-10">
        ← На главную
      </Link>
    </main>
  );
}
