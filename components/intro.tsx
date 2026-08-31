"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/logo";
import { INTRO_SEEN_KEY } from "@/lib/intro";

/**
 * Заставка на входе: логотип сначала «рисуется» обводкой, потом
 * подтягиваются заливки и название, после чего экран уходит.
 *
 * Показываем один раз за сессию вкладки — на каждом переходе внутри
 * сайта это раздражало бы. Флаг проверяется ещё до гидратации
 * (скрипт в layout вешает html.intro-seen), поэтому вернувшийся
 * посетитель не видит даже вспышки.
 *
 * Разметка рендерится на сервере: заставка должна закрывать экран уже
 * на первом кадре, иначе сайт мелькнёт до неё.
 */

export function Intro() {
  const [gone, setGone] = useState(false);
  const [filled, setFilled] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
      // приватный режим — просто покажем заставку
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Снимать заставку синхронно тут не нужно и нельзя: в обоих случаях
       её уже скрыл CSS (html.intro-seen либо prefers-reduced-motion),
       так что размонтирование тиком позже незаметно. */
    if (seen || reduced) {
      const skip = window.setTimeout(() => setGone(true), 0);
      return () => window.clearTimeout(skip);
    }

    /* Длину обводки берём у каждой фигуры отдельно: с общим числом
       мелкие детали дорисовывались бы раньше крупных и рывками. */
    const shapes = box.current?.querySelectorAll<SVGGeometryElement>("svg [stroke]");
    shapes?.forEach((shape, index) => {
      const length = typeof shape.getTotalLength === "function" ? shape.getTotalLength() : 0;
      if (!length) return;
      shape.style.setProperty("--len", String(Math.ceil(length)));
      shape.style.setProperty("--delay", String(index * 38) + "ms");
    });

    document.documentElement.classList.add("intro-on");

    const timers = [
      window.setTimeout(() => setFilled(true), 900),
      window.setTimeout(() => setLeaving(true), 1750),
      window.setTimeout(() => {
        setGone(true);
        try {
          sessionStorage.setItem(INTRO_SEEN_KEY, "1");
        } catch {
          // не смогли запомнить — покажем ещё раз, не страшно
        }
      }, 2300),
    ];

    return () => {
      timers.forEach(window.clearTimeout);
      document.documentElement.classList.remove("intro-on");
    };
  }, []);

  useEffect(() => {
    if (gone) document.documentElement.classList.remove("intro-on");
  }, [gone]);

  if (gone) return null;

  return (
    <div
      ref={box}
      className="intro"
      data-leaving={leaving}
      role="presentation"
      aria-hidden="true"
    >
      <div className="intro-stack" data-filled={filled}>
        <span className="intro-mark">
          <LogoMark className="h-28 w-28 sm:h-36 sm:w-36" />
        </span>

        <span className="intro-word">
          <span className="intro-name">Mr. Sushi</span>
          <span className="intro-city">Chirchiq</span>
        </span>
      </div>
    </div>
  );
}
