"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";
import { useAuth, useLocale, useToast, useUI } from "@/components/providers";

const EMPTY = { name: "", email: "", phone: "", password: "", password2: "" };

export function AuthModal() {
  const { t, locale } = useLocale();
  const { authOpen, setAuthOpen } = useUI();
  const { login, register } = useAuth();
  const { push } = useToast();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const mode = authOpen || "login";
  const isRegister = mode === "register";

  useEffect(() => {
    document.body.classList.toggle("is-locked", Boolean(authOpen));
    return () => document.body.classList.remove("is-locked");
  }, [authOpen]);

  /* Закрытие — это всегда событие, поэтому сбрасываем состояние здесь,
     а не эффектом на изменение authOpen. */
  const close = useCallback(() => {
    setAuthOpen(false);
    setErrors({});
    setBusy(false);
  }, [setAuthOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const messageFor = (code: string) => {
    const table: Record<string, { ru: string; uz: string }> = {
      bad_credentials: { ru: "Неверный email или пароль", uz: "Email yoki parol notoʻgʻri" },
      email_taken: { ru: "Такой email уже зарегистрирован", uz: "Bu email allaqachon roʻyxatdan oʻtgan" },
      validation: { ru: "Проверьте поля формы", uz: "Maydonlarni tekshiring" },
      rate_limited: {
        ru: "Слишком много попыток. Попробуйте через минуту",
        uz: "Urinishlar juda koʻp. Bir daqiqadan keyin urinib koʻring",
      },
      unknown: { ru: "Что-то пошло не так", uz: "Nimadir notoʻgʻri ketdi" },
    };
    return (table[code] ?? table.unknown)[locale];
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};

    if (isRegister) {
      if (form.name.trim().length < 2) next.name = t("common.required");
      if (!/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim())) next.phone = t("common.required");
      if (form.password !== form.password2)
        next.password2 = locale === "ru" ? "Пароли не совпадают" : "Parollar mos emas";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = t("common.required");
    if (form.password.length < 6)
      next.password = locale === "ru" ? "Минимум 6 символов" : "Kamida 6 belgi";

    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    const result = isRegister
      ? await register({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        })
      : await login({ email: form.email.trim(), password: form.password });
    setBusy(false);

    if (result.ok) {
      push(`${t("toast.welcome")}, ${result.user.name}`);
      close();
      setForm(EMPTY);
      return;
    }

    if (result.fields) {
      setErrors(
        Object.fromEntries(
          Object.keys(result.fields).map((key) => [key, t("common.required")]),
        ),
      );
    }
    push(messageFor(result.error), "err");
  };

/*
 * Оверлей размонтируется сразу, без exit-анимации: AnimatePresence в
 * framer-motion 13 не удаляет ребёнка из DOM после проигрывания exit —
 * прозрачный оверлей остаётся поверх страницы и перехватывает клики.
 */
  if (!authOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[76] grid place-items-center p-4"
    >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="panel relative w-full max-w-[27rem] overflow-hidden"
            style={{ background: "#ffffff", boxShadow: "var(--shadow-lift)" }}
            role="dialog"
            aria-modal="true"
          >
            <div className="brand-band" aria-hidden />

            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-dim)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              aria-label={t("common.close")}
            >
              ✕
            </button>

            <div className="relative px-7 pb-7 pt-9">
              <LogoMark className="mx-auto h-14 w-14" />

              <h2 className="mt-5 text-center font-display text-2xl font-extrabold tracking-tight">
                {isRegister ? t("auth.registerTitle") : t("auth.loginTitle")}
              </h2>
              <p className="mx-auto mt-2 max-w-[32ch] text-center text-[0.82rem] leading-relaxed text-[var(--ink-dim)]">
                {isRegister ? t("auth.registerLead") : t("auth.loginLead")}
              </p>

              <form onSubmit={submit} className="mt-6 space-y-3.5">
                  {isRegister && (
                    <motion.div
                      key="reg-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3.5 overflow-hidden"
                    >
                      <Input
                        label={t("auth.name")}
                        value={form.name}
                        error={errors.name}
                        placeholder="Эльмурад"
                        onChange={(v) => setForm({ ...form, name: v })}
                      />
                      <Input
                        label={t("auth.phone")}
                        value={form.phone}
                        error={errors.phone}
                        placeholder="+998 88 345 05 93"
                        type="tel"
                        onChange={(v) => setForm({ ...form, phone: v })}
                      />
                    </motion.div>
                  )}

                <Input
                  label={t("auth.email")}
                  value={form.email}
                  error={errors.email}
                  placeholder="you@mail.uz"
                  type="email"
                  onChange={(v) => setForm({ ...form, email: v })}
                />
                <Input
                  label={t("auth.password")}
                  value={form.password}
                  error={errors.password}
                  placeholder="••••••"
                  type="password"
                  onChange={(v) => setForm({ ...form, password: v })}
                />

                {isRegister && (
                  <Input
                    label={t("auth.password2")}
                    value={form.password2}
                    error={errors.password2}
                    placeholder="••••••"
                    type="password"
                    onChange={(v) => setForm({ ...form, password2: v })}
                  />
                )}

                <button type="submit" disabled={busy} className="btn btn-primary !mt-5 w-full">
                  {busy ? "…" : isRegister ? t("auth.submitRegister") : t("auth.submitLogin")}
                </button>
              </form>

              <p className="mt-5 text-center text-[0.78rem] text-[var(--ink-dim)]">
                {isRegister ? t("auth.hasAccount") : t("auth.noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setAuthOpen(isRegister ? "login" : "register");
                  }}
                  className="link-underline font-semibold text-[var(--brand)]"
                >
                  {isRegister ? t("auth.login") : t("auth.register")}
                </button>
              </p>

              {isRegister && (
                <p className="mt-4 text-center tnum text-[0.55rem] uppercase leading-relaxed tracking-[0.12em] text-[var(--ink-faint)]">
                  {t("auth.agree")}
                </p>
              )}
            </div>
          </motion.div>
    </motion.div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="field"
        autoComplete={type === "password" ? "current-password" : "on"}
      />
      {error && (
        <span className="mt-1.5 block text-[0.78rem] text-[var(--brand-hot)]">
          {error}
        </span>
      )}
    </label>
  );
}
