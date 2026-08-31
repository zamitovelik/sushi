"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useAuth, useLocale, useToast, useUI } from "@/components/providers";
import { useScrollLock } from "@/lib/use-scroll-lock";

export function CallbackModal() {
  const { t, locale } = useLocale();
  const { callbackOpen, setCallbackOpen } = useUI();
  const { user } = useAuth();
  const { push } = useToast();

  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const close = useCallback(() => {
    setCallbackOpen(false);
    setErrors({});
    setSending(false);
    setDone(false);
  }, [setCallbackOpen]);

  useScrollLock(callbackOpen);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  if (!callbackOpen) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = t("common.required");
    if (!/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim())) next.phone = t("common.required");
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.error === "rate_limited") push(t("error.rateLimited"), "err");
        else {
          setErrors(data.fields ?? {});
          push(t("error.fields"), "err");
        }
        return;
      }

      setDone(true);
      setForm({ name: "", phone: "", comment: "" });
    } catch {
      push(t("error.server"), "err");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[79] flex items-end justify-center sm:items-center sm:p-5"
    >
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-[26rem] overflow-hidden rounded-t-[18px] bg-white p-6 sm:rounded-[18px] sm:p-7"
        style={{ boxShadow: "var(--shadow-lift)" }}
        role="dialog"
        aria-modal="true"
        aria-label={t("callback.title")}
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-[var(--ink-dim)] transition-colors hover:bg-[var(--bg-3)] hover:text-[var(--brand)]"
          aria-label={t("common.close")}
        >
          ✕
        </button>

        {done ? (
          <div className="py-4 text-center">
            <span
              className="mx-auto grid h-14 w-14 place-items-center rounded-full text-2xl"
              style={{ background: "var(--bg-3)" }}
              aria-hidden
            >
              ✓
            </span>
            <h2 className="font-display mt-4 text-[1.25rem] uppercase">
              {t("callback.doneTitle")}
            </h2>
            <p className="mt-2 leading-relaxed text-[var(--ink-dim)]">{t("callback.doneText")}</p>
            <button type="button" onClick={close} className="btn btn-primary mt-6 w-full">
              {t("callback.close")}
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display pr-10 text-[1.25rem] uppercase">{t("callback.title")}</h2>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--ink-dim)]">
              {t("callback.lead")}
            </p>

            <form onSubmit={submit} className="mt-5 space-y-3.5">
              <label className="block">
                <span className="field-label">{t("callback.name")}</span>
                <input
                  value={form.name || user?.name || ""}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Эльмурад"
                  aria-invalid={Boolean(errors.name)}
                  className="field"
                />
              </label>

              <label className="block">
                <span className="field-label">{t("callback.phone")}</span>
                <input
                  type="tel"
                  value={form.phone || user?.phone || ""}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="+998 __ ___ __ __"
                  aria-invalid={Boolean(errors.phone)}
                  className="field"
                />
              </label>

              <label className="block">
                <span className="field-label">{t("callback.comment")}</span>
                <textarea
                  value={form.comment}
                  onChange={(event) => setForm({ ...form, comment: event.target.value })}
                  placeholder={t("callback.commentPh")}
                  rows={2}
                  className="field resize-none"
                />
              </label>

              <button type="submit" disabled={sending} className="btn btn-primary !mt-5 w-full">
                {sending ? t("callback.sending") : t("callback.submit")}
              </button>
            </form>

            <p className="mt-3 text-center text-[0.78rem] text-[var(--ink-faint)]">
              {locale === "ru"
                ? "Или позвоните сами: 88 345 05 93"
                : "Yoki oʻzingiz qoʻngʻiroq qiling: 88 345 05 93"}
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
