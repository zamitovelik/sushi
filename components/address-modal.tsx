"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapPicker } from "@/components/map-picker";
import { useAddress, useLocale, useToast, useUI } from "@/components/providers";
import { CHIRCHIQ, isInDeliveryZone, reverseGeocode } from "@/lib/geo";
import { useScrollLock } from "@/lib/use-scroll-lock";

export function AddressModal() {
  const { t, locale } = useLocale();
  const { addressOpen, setAddressOpen } = useUI();
  const { address, setAddress } = useAddress();
  const { push } = useToast();

  const [point, setPoint] = useState(() =>
    address ? { lat: address.lat, lng: address.lng } : CHIRCHIQ,
  );
  const [text, setText] = useState(address?.text ?? "");
  const [looking, setLooking] = useState(false);
  // подпись, введённую руками, не затираем ответом геокодера
  const editedByHand = useRef(false);

  const close = useCallback(() => setAddressOpen(false), [setAddressOpen]);

  useScrollLock(addressOpen);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const pick = useCallback(
    async (next: { lat: number; lng: number }) => {
      setPoint(next);
      if (editedByHand.current) return;

      setLooking(true);
      const found = await reverseGeocode(next.lat, next.lng, locale);
      setLooking(false);
      if (found) setText(found);
    },
    [locale],
  );

  if (!addressOpen) return null;

  const outOfZone = !isInDeliveryZone(point);

  const submit = () => {
    if (!text.trim()) return;
    setAddress({ lat: point.lat, lng: point.lng, text: text.trim() });
    push(t("address.saved"));
    close();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[77] flex items-end justify-center sm:items-center sm:p-5"
    >
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex max-h-[92svh] w-full max-w-[34rem] flex-col overflow-hidden rounded-t-[18px] bg-white sm:rounded-[18px]"
        style={{ boxShadow: "var(--shadow-lift)" }}
        role="dialog"
        aria-modal="true"
        aria-label={t("address.title")}
      >
        <div className="px-6 pb-4 pt-6 text-center">
          <h2 className="font-display text-[1.25rem] uppercase">{t("address.title")}</h2>
          <p className="mt-1 text-[0.88rem] text-[var(--ink-dim)]">{t("address.lead")}</p>
        </div>

        <MapPicker value={point} onPick={pick} className="h-[240px] w-full sm:h-[280px]" />

        <div className="px-6 py-4">
          <p className="mb-2 text-[0.78rem] text-[var(--ink-faint)]">{t("address.hint")}</p>

          <input
            value={text}
            onChange={(event) => {
              editedByHand.current = true;
              setText(event.target.value);
            }}
            placeholder={t("address.field")}
            className="field"
            aria-label={t("address.field")}
          />

          {looking && (
            <p className="mt-2 text-[0.78rem] text-[var(--ink-faint)]">…</p>
          )}
          {outOfZone && (
            <p className="mt-2 text-[0.8rem] font-medium text-[var(--brand-hot)]">
              {t("address.outOfZone")}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={close} className="btn btn-ghost">
              {t("address.later")}
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!text.trim()}
              className="btn btn-primary"
            >
              {t("address.ok")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
