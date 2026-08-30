"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { DishImage } from "@/components/dish-image";
import { useAuth, useCart, useLocale, useToast, useUI } from "@/components/providers";
import { FREE_DELIVERY_FROM, MENU } from "@/lib/data/menu";
import { calcTotals, formatSum } from "@/lib/pricing";

type Step = "cart" | "checkout" | "done";

interface DoneOrder {
  number: string;
  total: number;
  etaMinutes: number;
}

const TIME_SLOTS = ["asap", "12:00", "14:00", "17:00", "19:00", "21:00"];

export function CartDrawer() {
  const { t, locale } = useLocale();
  const { cartOpen, setCartOpen } = useUI();
  const { lines, setQty, remove, clear, promo, setPromo } = useCart();
  const { user, refresh } = useAuth();
  const { push } = useToast();

  const [step, setStep] = useState<Step>("cart");
  const [promoInput, setPromoInput] = useState(promo ?? "");
  const [promoBusy, setPromoBusy] = useState(false);
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState<"cash" | "card" | "click">("cash");
  const [time, setTime] = useState("asap");
  const [form, setForm] = useState({ name: "", phone: "", address: "", comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<DoneOrder | null>(null);

  const detailed = useMemo(
    () =>
      lines
        .map((line) => {
          const item = MENU.find((menuItem) => menuItem.id === line.id);
          return item ? { ...line, item } : null;
        })
        .filter(Boolean) as { id: string; qty: number; item: (typeof MENU)[number] }[],
    [lines],
  );

  const subtotal = detailed.reduce((sum, line) => sum + line.item.price * line.qty, 0);
  const totals = calcTotals({ subtotal, promo, delivery });

  useEffect(() => {
    document.body.classList.toggle("is-locked", cartOpen);
    return () => document.body.classList.remove("is-locked");
  }, [cartOpen]);

  /* Переход к оформлению — событие, поэтому подставляем данные
     залогиненного гостя здесь, а не эффектом на открытие корзины. */
  const goToCheckout = () => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name,
        phone: prev.phone || user.phone,
      }));
    }
    setStep("checkout");
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;
    setPromoBusy(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.ok) {
        setPromo(data.code);
        push(`${t("cart.promoOk")} −${data.percent}%`);
      } else {
        setPromo(null);
        push(
          data.error === "min_not_reached"
            ? `${locale === "ru" ? "Промокод от" : "Promokod"} ${formatSum(data.min)} ${t("common.sum")}`
            : locale === "ru"
              ? "Промокод не найден"
              : "Promokod topilmadi",
          "err",
        );
      }
    } catch {
      push(t("error.server"), "err");
    } finally {
      setPromoBusy(false);
    }
  };

  const submitOrder = async () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = t("common.required");
    if (!/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim())) next.phone = t("common.required");
    if (delivery === "delivery" && form.address.trim().length < 5)
      next.address = t("common.required");
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines,
          customer: form,
          delivery,
          payment,
          time,
          promo,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.error === "out_of_stock") {
          push(
            locale === "ru"
              ? "Часть позиций разобрали — обновите корзину"
              : "Ayrim taomlar tugadi — savatni yangilang",
            "err",
          );
        } else if (data.error === "rate_limited") {
          push(t("error.rateLimited"), "err");
        } else if (data.error === "internal") {
          push(t("error.server"), "err");
        } else {
          setErrors(data.fields ?? {});
          push(t("error.fields"), "err");
        }
        return;
      }

      setDone({
        number: data.order.number,
        total: data.order.total,
        etaMinutes: data.order.etaMinutes,
      });
      setStep("done");
      clear();
      setPromoInput("");
      void refresh();
    } catch {
      push(t("error.server"), "err");
    } finally {
      setSending(false);
    }
  };

  const closeAll = () => {
    setCartOpen(false);
    setTimeout(() => {
      setStep("cart");
      setDone(null);
      setErrors({});
    }, 350);
  };

/*
 * Оверлей размонтируется сразу, без exit-анимации: AnimatePresence в
 * framer-motion 13 не удаляет ребёнка из DOM после проигрывания exit —
 * прозрачный оверлей остаётся поверх страницы и перехватывает клики.
 */
  if (!cartOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[75]"
    >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAll} />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 34 }}
            className="absolute right-0 top-0 flex h-full w-[min(100vw,30rem)] flex-col border-l border-[var(--line)] bg-white"
            role="dialog"
            aria-label={t("cart.title")}
          >
            {/* шапка */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
              <div className="flex items-center gap-3">
                {step === "checkout" && (
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-dim)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    aria-label={t("checkout.back")}
                  >
                    ←
                  </button>
                )}
                <h2 className="font-display text-lg font-extrabold tracking-tight">
                  {step === "checkout"
                    ? t("checkout.title")
                    : step === "done"
                      ? t("checkout.doneTitle")
                      : t("cart.title")}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeAll}
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-dim)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
                aria-label={t("common.close")}
              >
                ✕
              </button>
            </div>

            {/* ——— УСПЕХ ——— */}
            {step === "done" && done && (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className="grid h-20 w-20 place-items-center rounded-full border-2 border-[var(--leaf)]"
                >
                  <motion.svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                  >
                    <motion.path
                      d="m5 12.5 4.5 4.5L19 7"
                      stroke="var(--leaf)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    />
                  </motion.svg>
                </motion.div>

                <h3 className="font-display text-2xl font-extrabold tracking-tight">
                  {t("checkout.doneTitle")}
                </h3>
                <p className="max-w-[30ch] text-sm text-[var(--ink-dim)]">{t("checkout.doneText")}</p>

                <div className="panel w-full space-y-3 p-5">
                  <Row label={t("checkout.orderNo")} value={done.number} accent />
                  <Row
                    label={t("checkout.eta")}
                    value={`${done.etaMinutes} ${t("common.min")}`}
                  />
                  <Row
                    label={t("cart.total")}
                    value={`${formatSum(done.total)} ${t("common.sum")}`}
                    accent
                  />
                </div>

                <button type="button" onClick={closeAll} className="btn btn-primary mt-2 w-full">
                  {t("checkout.close")}
                </button>
              </div>
            )}

            {/* ——— КОРЗИНА ——— */}
            {step === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {detailed.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <span className="text-5xl opacity-60">🥢</span>
                      <p className="font-display text-lg font-bold">{t("cart.empty")}</p>
                      <p className="max-w-[26ch] text-sm text-[var(--ink-dim)]">
                        {t("cart.emptyHint")}
                      </p>
                      <button
                        type="button"
                        onClick={closeAll}
                        className="btn btn-ghost mt-2"
                      >
                        {t("cart.goMenu")}
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                        {detailed.map((line) => (
                          <motion.li
                            key={line.id}
                            layout
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3"
                          >
                            <DishImage
                              item={line.item}
                              sizes="80px"
                              className="h-16 w-20 shrink-0 rounded-lg"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-[0.86rem] font-bold tracking-tight">
                                {line.item.name[locale]}
                              </p>
                              <p className="mt-0.5 tnum text-[0.62rem] text-[var(--ink-faint)]">
                                {line.item.weight} {t("common.g")} ·{" "}
                                {formatSum(line.item.price)} {t("common.sum")}
                              </p>

                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-1 rounded-full border border-[var(--line)] p-0.5">
                                  <button
                                    type="button"
                                    onClick={() => setQty(line.id, line.qty - 1)}
                                    className="grid h-6 w-6 place-items-center rounded-full text-xs transition-colors hover:bg-[var(--panel-strong)]"
                                    aria-label="−"
                                  >
                                    −
                                  </button>
                                  <span className="w-5 text-center tnum text-[0.72rem] font-bold tabular-nums">
                                    {line.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (line.qty >= line.item.stock) {
                                        push(t("card.maxStock"), "err");
                                        return;
                                      }
                                      setQty(line.id, line.qty + 1);
                                    }}
                                    className="grid h-6 w-6 place-items-center rounded-full text-xs transition-colors hover:bg-[var(--panel-strong)]"
                                    aria-label="+"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="tnum text-[0.8rem] font-bold tabular-nums">
                                  {formatSum(line.item.price * line.qty)}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => remove(line.id)}
                              className="self-start text-[var(--ink-faint)] transition-colors hover:text-[var(--brand)]"
                              aria-label="✕"
                            >
                              ✕
                            </button>
                          </motion.li>
                        ))}
                    </ul>
                  )}
                </div>

                {detailed.length > 0 && (
                  <div className="border-t border-[var(--line)] px-6 py-5">
                    {/* прогресс до бесплатной доставки */}
                    {totals.freeDeliveryLeft > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[0.8rem] text-[var(--ink-faint)]">
                          <span>{t("cart.freeLeft")}</span>
                          <span className="text-[var(--gold)]">
                            {formatSum(totals.freeDeliveryLeft)} {t("common.sum")}
                          </span>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--line)]">
                          <motion.div
                            className="h-full rounded-full bg-[var(--brand)]"
                            initial={false}
                            animate={{
                              width: `${Math.min(100, ((subtotal - totals.discount) / FREE_DELIVERY_FROM) * 100)}%`,
                            }}
                            transition={{ type: "spring", stiffness: 160, damping: 26 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* промокод */}
                    <div className="flex gap-2">
                      <input
                        value={promoInput}
                        onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                        placeholder={t("cart.promo")}
                        className="field !py-2.5 tnum text-[0.72rem] tracking-[0.14em]"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        disabled={promoBusy || !promoInput.trim()}
                        className="btn btn-ghost !px-4 !py-2.5 !text-[0.6rem]"
                      >
                        {t("cart.promoApply")}
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Row
                        label={t("cart.subtotal")}
                        value={`${formatSum(totals.subtotal)} ${t("common.sum")}`}
                      />
                      {totals.discount > 0 && (
                        <Row
                          label={`${t("cart.discount")} · ${totals.promo}`}
                          value={`−${formatSum(totals.discount)} ${t("common.sum")}`}
                          tone="var(--leaf)"
                        />
                      )}
                      <Row
                        label={t("cart.delivery")}
                        value={
                          totals.deliveryFee === 0
                            ? t("cart.free")
                            : `${formatSum(totals.deliveryFee)} ${t("common.sum")}`
                        }
                      />
                      <div className="hairline h-px" />
                      <Row
                        label={t("cart.total")}
                        value={`${formatSum(totals.total)} ${t("common.sum")}`}
                        accent
                        big
                      />
                    </div>

                    <button
                      type="button"
                      onClick={goToCheckout}
                      className="btn btn-primary mt-4 w-full"
                    >
                      {t("cart.checkout")}
                    </button>
                    <button
                      type="button"
                      onClick={clear}
                      className="mt-3 w-full text-[0.8rem] text-[var(--ink-faint)] transition-colors hover:text-[var(--brand)]"
                    >
                      {t("cart.clear")}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ——— ОФОРМЛЕНИЕ ——— */}
            {step === "checkout" && (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                  <div>
                    <span className="field-label">{t("checkout.method")}</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ["delivery", t("checkout.delivery")],
                          ["pickup", t("checkout.pickup")],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setDelivery(value)}
                          data-active={delivery === value}
                          className="chip justify-center !py-3"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Field
                    label={t("checkout.name")}
                    value={form.name}
                    error={errors.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="Эльмурад"
                  />
                  <Field
                    label={t("checkout.phone")}
                    value={form.phone}
                    error={errors.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    placeholder="+998 88 345 05 93"
                    type="tel"
                  />
                  {delivery === "delivery" && (
                    <Field
                      label={t("checkout.address")}
                      value={form.address}
                      error={errors.address}
                      onChange={(v) => setForm({ ...form, address: v })}
                      placeholder={
                        locale === "ru" ? "Чирчик, ул. Навои, 14, кв. 7" : "Chirchiq, Navoiy 14, 7-xonadon"
                      }
                    />
                  )}

                  <div>
                    <span className="field-label">{t("checkout.time")}</span>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          data-active={time === slot}
                          className="chip"
                        >
                          {slot === "asap" ? t("checkout.asap") : slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="field-label">{t("checkout.payment")}</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          ["cash", t("checkout.cash")],
                          ["card", t("checkout.card")],
                          ["click", t("checkout.click")],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPayment(value)}
                          data-active={payment === value}
                          className="chip justify-center !px-2 !text-center !text-[0.58rem]"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="field-label">{t("checkout.comment")}</span>
                    <textarea
                      value={form.comment}
                      onChange={(event) => setForm({ ...form, comment: event.target.value })}
                      placeholder={t("checkout.commentPh")}
                      rows={3}
                      className="field resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-[var(--line)] px-6 py-5">
                  <div className="space-y-2">
                    <Row
                      label={t("cart.subtotal")}
                      value={`${formatSum(totals.subtotal)} ${t("common.sum")}`}
                    />
                    {totals.discount > 0 && (
                      <Row
                        label={t("cart.discount")}
                        value={`−${formatSum(totals.discount)} ${t("common.sum")}`}
                        tone="var(--leaf)"
                      />
                    )}
                    <Row
                      label={t("cart.delivery")}
                      value={
                        totals.deliveryFee === 0
                          ? t("cart.free")
                          : `${formatSum(totals.deliveryFee)} ${t("common.sum")}`
                      }
                    />
                    <div className="hairline h-px" />
                    <Row
                      label={t("cart.total")}
                      value={`${formatSum(totals.total)} ${t("common.sum")}`}
                      accent
                      big
                    />
                  </div>

                  <button
                    type="button"
                    onClick={submitOrder}
                    disabled={sending}
                    className="btn btn-primary mt-4 w-full"
                  >
                    {sending ? t("checkout.sending") : t("checkout.submit")}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
    </motion.div>
  );
}

function Row({
  label,
  value,
  accent,
  big,
  tone,
}: {
  label: string;
  value: string;
  accent?: boolean;
  big?: boolean;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[0.82rem] text-[var(--ink-dim)]">
        {label}
      </span>
      <span
        className={`tnum tabular-nums ${big ? "text-[1.05rem] font-bold" : "text-[0.78rem] font-medium"}`}
        style={{ color: tone ?? (accent ? "var(--ink)" : "var(--ink-dim)") }}
      >
        {value}
      </span>
    </div>
  );
}

function Field({
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
      />
      {error && (
        <span className="mt-1.5 block text-[0.78rem] text-[var(--brand-hot)]">
          {error}
        </span>
      )}
    </label>
  );
}
