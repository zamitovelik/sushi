"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { LogoMark } from "@/components/logo";
import { MapPicker } from "@/components/map-picker";
import { useLocale, useToast, useUI } from "@/components/providers";
import { Reveal } from "@/components/reveal";

/* ───────────────────────── бегущая строка ───────────────────────── */

export function Marquee() {
  const { locale } = useLocale();
  const words =
    locale === "ru"
      ? ["Роллы", "寿司", "Сеты", "Wok", "巻き", "Гёдза", "Темпура", "焼き", "Нигири", "Доставка 40 мин"]
      : ["Rollar", "寿司", "Setlar", "Wok", "巻き", "Gyoza", "Tempura", "焼き", "Nigiri", "40 daqiqa"];

  const strip = [...words, ...words];

  return (
    <div className="marquee relative border-y border-[var(--line)] bg-white py-4">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {strip.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="px-6 font-display text-[0.95rem] font-semibold tracking-tight text-[var(--ink-dim)]">
                  {word}
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--brand)]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────── о нас ───────────────────────────── */

export function About() {
  const { t } = useLocale();

  const features = [
    { title: t("about.f1t"), text: t("about.f1d"), kana: "鮮" },
    { title: t("about.f2t"), text: t("about.f2d"), kana: "作" },
    { title: t("about.f3t"), text: t("about.f3d"), kana: "温" },
    { title: t("about.f4t"), text: t("about.f4d"), kana: "配" },
  ];

  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden border-t border-[var(--line)] bg-white py-20 sm:py-28">
      
      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div className="relative">
              <p className="kicker">{t("about.kicker")}</p>
              <h2 className="section-title mt-4 max-w-[14ch]">{t("about.title")}</h2>
              <p className="mt-7 max-w-[52ch] leading-relaxed text-[var(--ink-dim)]">
                {t("about.text")}
              </p>

              <motion.div
                animate={{ rotate: [0, 6, -4, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                className="mt-10 hidden w-40 opacity-90 lg:block"
              >
                <LogoMark className="h-40 w-40" />
              </motion.div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 90}>
                <div className="panel group h-full p-6 transition-colors duration-500 hover:border-[var(--line-strong)]">
                  <span className="font-display text-3xl font-extrabold text-[var(--brand)] opacity-80 transition-opacity group-hover:opacity-100">
                    {feature.kana}
                  </span>
                  <h3 className="mt-5 font-display text-[1.05rem] font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-[0.87rem] leading-relaxed text-[var(--ink-dim)]">
                    {feature.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── доставка ──────────────────────────── */

export function Delivery() {
  const { t } = useLocale();

  const steps = [
    { title: t("delivery.s1t"), text: t("delivery.s1d") },
    { title: t("delivery.s2t"), text: t("delivery.s2d") },
    { title: t("delivery.s3t"), text: t("delivery.s3d") },
    { title: t("delivery.s4t"), text: t("delivery.s4d") },
  ];

  const zones = [
    t("delivery.zone1"),
    t("delivery.zone2"),
    t("delivery.zone3"),
    t("delivery.zone4"),
  ];

  return (
    <section id="delivery" className="relative scroll-mt-24 border-t border-[var(--line)] bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <p className="kicker">{t("delivery.kicker")}</p>
          <h2 className="section-title mt-4">{t("delivery.title")}</h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <ol className="relative space-y-0">
            <span className="absolute left-[1.35rem] top-3 bottom-3 w-px bg-[var(--line)]" aria-hidden />
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <li className="relative flex gap-6 pb-9 last:pb-0">
                  <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--bg)] tnum text-[0.72rem] font-bold text-[var(--brand)]">
                    0{i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-display text-[1.05rem] font-bold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[46ch] text-[0.9rem] leading-relaxed text-[var(--ink-dim)]">
                      {step.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={160}>
            <div className="panel h-full p-7">
              <h3 className="font-display text-lg font-extrabold tracking-tight">
                {t("delivery.zoneTitle")}
              </h3>
              <ul className="mt-6 space-y-4">
                {zones.map((zone) => (
                  <li key={zone} className="flex items-start gap-3">
                    <span className="mt-[0.55rem] h-1 w-4 shrink-0 bg-[var(--brand)]" />
                    <span className="text-[0.9rem] leading-relaxed text-[var(--ink-dim)]">{zone}</span>
                  </li>
                ))}
              </ul>
              <a href="tel:+998883450593" className="btn btn-ghost mt-8 w-full">
                88 345 05 93
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── отзывы ───────────────────────────── */

const REVIEWS = [
  {
    name: "Диёра",
    ru: "Заказывали сет «Мистер Панда» на день рождения — приехало ровно за 35 минут, всё холодное как надо, рис не разваливается. Лучшие в Чирчике.",
    uz: "Tugʻilgan kunga «Mister Panda» setini buyurtma qildik — roppa-rosa 35 daqiqada yetib keldi, hammasi kerakli darajada sovuq.",
    rating: 5,
  },
  {
    name: "Азиз",
    ru: "Беру запечённые роллы почти каждую пятницу. Сырная шапка настоящая, не порошок. Курьер всегда звонит заранее.",
    uz: "Deyarli har juma pishirilgan roll olaman. Pishloq qopqogʻi haqiqiy. Kuryer doim oldindan qoʻngʻiroq qiladi.",
    rating: 5,
  },
  {
    name: "Нилуфар",
    ru: "Наконец-то нашла место, где есть нормальные веганские роллы. Авокадо маки и чука — мой обычный заказ.",
    uz: "Nihoyat yaxshi vegan rollar bor joyni topdim. Avokado maki va chuka — doimiy buyurtmam.",
    rating: 4,
  },
  {
    name: "Тимур",
    ru: "Удон с креветкой — порция реально большая. Заказывал на офис на пятерых, всем хватило.",
    uz: "Krevetkali udon — porsiya haqiqatan katta. Ofisga besh kishiga buyurtma qildim, hammaga yetdi.",
    rating: 5,
  },
];

export function Reviews() {
  const { t, locale } = useLocale();

  return (
    <section id="reviews" className="relative scroll-mt-24 overflow-hidden border-t border-[var(--line)] bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker">{t("reviews.kicker")}</p>
              <h2 className="section-title mt-4">{t("reviews.title")}</h2>
            </div>
            <a
              href="https://www.instagram.com/mrsushi.uz/"
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost"
            >
              @mrsushi.uz
            </a>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.name} delay={i * 80}>
              <figure className="panel flex h-full flex-col p-6">
                <div className="flex gap-0.5 text-[var(--gold)]">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <span key={star} className={star < review.rating ? "" : "opacity-25"}>
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.88rem] leading-relaxed text-[var(--ink-dim)]">
                  {locale === "ru" ? review.ru : review.uz}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand)] font-display text-[0.7rem] font-extrabold text-white">
                    {review.name.slice(0, 1)}
                  </span>
                  <span className="tnum text-[0.66rem] uppercase tracking-[0.16em]">
                    {review.name}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── контакты ──────────────────────────── */

export function Contacts() {
  const { t } = useLocale();
  const { push } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", guests: "2", date: "", time: "19:00" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = t("common.required");
    if (!/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim())) next.phone = t("common.required");
    if (!form.date) next.date = t("common.required");
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guests: Number(form.guests) }),
      });
      const data = await res.json();
      if (data.ok) {
        push(t("contacts.reserveOk"));
        setForm({ name: "", phone: "", guests: "2", date: "", time: "19:00" });
      } else if (data.error === "rate_limited") {
        push(t("error.rateLimited"), "err");
      } else {
        setErrors(data.fields ?? {});
        push(t("error.fields"), "err");
      }
    } catch {
      push(t("error.server"), "err");
    } finally {
      setBusy(false);
    }
  };

  const rows = [
    { label: t("contacts.address"), value: t("contacts.addressValue") },
    { label: t("contacts.hours"), value: t("contacts.hoursValue") },
    { label: t("contacts.phone"), value: "88 345 05 93" },
    { label: t("contacts.insta"), value: "@mrsushi.uz" },
  ];

  return (
    <section id="contacts" className="relative scroll-mt-24 border-t border-[var(--line)] bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <p className="kicker">{t("contacts.kicker")}</p>
          <h2 className="section-title mt-4">{t("contacts.title")}</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="panel flex h-full flex-col p-7">
              <dl className="space-y-6">
                {rows.map((row) => (
                  <div key={row.label} className="border-b border-[var(--line)] pb-5 last:border-0 last:pb-0">
                    <dt className="text-[0.8rem] text-[var(--ink-faint)]">
                      {row.label}
                    </dt>
                    <dd className="mt-2 font-display text-[1.05rem] font-bold tracking-tight">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://yandex.uz/maps/?text=Чирчик%20Амир%20Темур%20120"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-primary"
                >
                  {t("contacts.map")}
                </a>
                <a
                  href="https://www.instagram.com/mrsushi.uz/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-ghost"
                >
                  Instagram
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mb-6 overflow-hidden rounded-[var(--r-card)] border border-[var(--line)]">
              <MapPicker value={null} interactive={false} className="h-[260px] w-full" />
            </div>

            <form onSubmit={submit} className="panel h-full p-7">
              <h3 className="font-display text-lg font-extrabold tracking-tight">
                {t("contacts.reserveTitle")}
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="field-label">{t("checkout.name")}</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    aria-invalid={Boolean(errors.name)}
                    className="field"
                    placeholder="Эльмурад"
                  />
                </label>

                <label className="block">
                  <span className="field-label">{t("checkout.phone")}</span>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    aria-invalid={Boolean(errors.phone)}
                    className="field"
                    placeholder="+998 88 345 05 93"
                    type="tel"
                  />
                </label>

                <label className="block">
                  <span className="field-label">{t("contacts.guests")}</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.guests}
                    onChange={(event) => setForm({ ...form, guests: event.target.value })}
                    className="field"
                  />
                </label>

                <label className="block">
                  <span className="field-label">{t("contacts.date")}</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm({ ...form, date: event.target.value })}
                    aria-invalid={Boolean(errors.date)}
                    className="field"
                  />
                </label>

                <label className="block">
                  <span className="field-label">{t("checkout.time")}</span>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(event) => setForm({ ...form, time: event.target.value })}
                    className="field"
                  />
                </label>
              </div>

              <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full">
                {busy ? "…" : t("contacts.reserve")}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── подвал ───────────────────────────── */

export function Footer() {
  const { t } = useLocale();
  const { setAuthOpen } = useUI();

  return (
    <footer className="relative overflow-hidden bg-[var(--ink-invert)] text-white">
      
      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[30ch]">
            <div className="flex items-center gap-3">
              <LogoMark className="h-12 w-12" />
              <span className="font-display text-lg uppercase tracking-[0.02em] text-white">
                Mr. Sushi
              </span>
            </div>
            <p className="mt-5 text-[0.86rem] leading-relaxed text-white/70">
              {t("contacts.addressValue")} · {t("contacts.hoursValue")}
            </p>
          </div>

          {/* пути с ведущим слэшем — иначе со страниц разделов якорь никуда не ведёт */}
          <nav className="flex flex-wrap gap-x-10 gap-y-3">
            {(
              [
                ["/#menu", t("nav.menu")],
                ["/#about", t("nav.about")],
                ["/#delivery", t("nav.delivery")],
                ["/#reviews", t("nav.reviews")],
                ["/#contacts", t("nav.contacts")],
              ] as const
            ).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="link-underline text-[0.9rem] font-medium text-white/70 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <a href="tel:+998883450593" className="btn btn-primary">
              88 345 05 93
            </a>
            <button
              type="button"
              onClick={() => setAuthOpen("register")}
              className="btn btn-ghost"
            >
              {t("auth.register")}
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.78rem] text-white/55">
            © {new Date().getFullYear()} Mr. Sushi · {t("footer.rights")}
          </p>
          <p className="text-[0.78rem] text-white/55">
            {t("footer.made")}
          </p>
        </div>
      </div>
    </footer>
  );
}
