"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/providers";

export function Toasts() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border px-5 py-3 text-left backdrop-blur-xl"
            style={{
              borderColor: toast.tone === "err" ? "var(--brand)" : "var(--line)",
              background: toast.tone === "err" ? "var(--brand-tint)" : "#ffffff",
              boxShadow: "var(--shadow-lift)",
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: toast.tone === "err" ? "var(--brand-hot)" : "var(--leaf)" }}
            />
            <span className="text-[0.85rem] font-medium">
              {toast.text}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
