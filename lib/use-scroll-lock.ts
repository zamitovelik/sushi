"use client";

import { useEffect } from "react";

/**
 * Блокировка прокрутки под оверлеями.
 *
 * Раньше каждый оверлей сам дёргал classList и на размонтировании снимал
 * блокировку — при двух открытых (корзина плюс карточка блюда) закрытие
 * одного разблокировало страницу под другим. Отсюда счётчик.
 *
 * Ширину полосы прокрутки не компенсируем здесь: за это отвечает
 * `scrollbar-gutter: stable` на html, место под полосу зарезервировано
 * постоянно и её исчезновение уже ничего не сдвигает.
 */

let locks = 0;

function lock() {
  if (locks === 0) document.body.classList.add("is-locked");
  locks += 1;
}

function unlock() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.body.classList.remove("is-locked");
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}
