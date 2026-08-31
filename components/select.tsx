"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Свой выпадающий список вместо <select>.
 *
 * Системный список рисует ОС: наши цвета, скругления и шрифт внутрь не
 * попадают, поэтому он выпадал голым прямоугольником и выбивался из
 * остального интерфейса. Здесь всё своё, но поведение оставлено
 * привычным: стрелки, Enter, Escape, клик мимо.
 */

export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  const current = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const onDown = (event: MouseEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  /* Подсветку ведём за клавиатурой: без прокрутки к активному пункту
     список длиннее экрана «терял» выделение. */
  useEffect(() => {
    if (open) items.current[cursor]?.scrollIntoView({ block: "nearest" });
  }, [open, cursor]);

  const openAt = () => {
    setCursor(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  };

  const choose = (next: T) => {
    onChange(next);
    setOpen(false);
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        openAt();
      }
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((index) => Math.min(options.length - 1, index + 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((index) => Math.max(0, index - 1));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(options[cursor].value);
    }
  };

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openAt())}
        onKeyDown={onKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--line-strong)] bg-white py-2.5 pl-4 pr-3 text-[0.85rem] font-medium transition-colors hover:border-[var(--ink)]"
      >
        <span className="truncate">{current.label}</span>
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          aria-hidden
          className="shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none", color: "var(--ink-faint)" }}
        >
          <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onKey}
          className="absolute right-0 z-30 mt-2 max-h-[15rem] w-full min-w-[13rem] overflow-auto rounded-xl border border-[var(--line)] bg-white p-1.5"
          style={{ boxShadow: "var(--shadow-lift)", animation: "pop 0.14s ease" }}
        >
          {options.map((option, index) => {
            const active = option.value === value;
            return (
              <li
                key={option.value}
                ref={(node) => {
                  items.current[index] = node;
                }}
                role="option"
                aria-selected={active}
                onClick={() => choose(option.value)}
                onMouseEnter={() => setCursor(index)}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-[0.85rem] transition-colors"
                style={{
                  background: index === cursor ? "var(--bg-3)" : "transparent",
                  color: active ? "var(--brand)" : "var(--ink)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {option.label}
                {active && (
                  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden>
                    <path
                      d="M1 5l3.6 3.6L12 1.2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
