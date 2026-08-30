"use client";

import type { ArtVariant } from "@/lib/types";

/**
 * Процедурные иллюстрации блюд — заглушка до фотографий.
 * Рисуются под светлый интерфейс: тёплая подложка вместо тарелки,
 * чтобы блок читался как слот под фото, а не как тёмное пятно.
 */

function hashOf(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Ролл сверху: нори — рис — начинка. */
function Roll({
  cx,
  cy,
  r,
  tone,
  accent = "#8CBF6B",
}: {
  cx: number;
  cy: number;
  r: number;
  tone: string;
  accent?: string;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#2E2A28" />
      <circle cx={cx} cy={cy} r={r * 0.84} fill="#FBF7EC" />
      <circle cx={cx - r * 0.16} cy={cy - r * 0.1} r={r * 0.3} fill={tone} />
      <circle cx={cx + r * 0.22} cy={cy + r * 0.18} r={r * 0.22} fill={accent} />
      <circle cx={cx + r * 0.05} cy={cy - r * 0.3} r={r * 0.14} fill="#E8D9B8" />
      <circle cx={cx - r * 0.55} cy={cy + r * 0.32} r={r * 0.06} fill="#C9BFA6" />
      <circle cx={cx + r * 0.5} cy={cy - r * 0.42} r={r * 0.06} fill="#C9BFA6" />
    </>
  );
}

export function FoodArt({
  variant,
  tone,
  seed,
  className = "",
}: {
  variant: ArtVariant;
  tone: string;
  seed: string;
  className?: string;
}) {
  const h = hashOf(seed);
  const tilt = ((h % 12) - 6) * 1.1;

  return (
    /*
     * Фон живёт на контейнере, а рисунок вписывается целиком (meet).
     * Со slice в широком блоке масштаб уезжал так, что от блюда
     * оставался один кусок во весь экран.
     */
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ background: `linear-gradient(150deg, #FFFDF8 0%, ${tone}20 100%)` }}
      aria-hidden
    >
      <svg
        viewBox="0 0 240 150"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(20 0)">
        <ellipse cx="100" cy="112" rx="62" ry="13" fill="#2E2A28" opacity="0.07" />

      <g transform={`rotate(${tilt} 100 80)`}>
        {variant === "maki" && (
          <>
            <Roll cx={64} cy={88} r={24} tone={tone} />
            <Roll cx={100} cy={66} r={26} tone={tone} accent="#E8B04B" />
            <Roll cx={137} cy={88} r={24} tone={tone} accent="#8CBF6B" />
          </>
        )}

        {variant === "nigiri" && (
          <>
            <g transform="translate(-24 4)">
              <ellipse cx="100" cy="94" rx="33" ry="15" fill="#FBF7EC" />
              <path
                d="M68 88c6-11 18-17 32-17s26 6 32 17c-7 5-19 8-32 8s-25-3-32-8Z"
                fill={tone}
              />
            </g>
            <g transform="translate(30 -14) scale(0.88)">
              <ellipse cx="100" cy="94" rx="33" ry="15" fill="#FBF7EC" />
              <path
                d="M68 88c6-11 18-17 32-17s26 6 32 17c-7 5-19 8-32 8s-25-3-32-8Z"
                fill={tone}
              />
              <rect x="88" y="72" width="24" height="32" rx="3" fill="#2E2A28" opacity="0.85" />
            </g>
          </>
        )}

        {variant === "set" && (
          <>
            <rect x="34" y="44" width="132" height="72" rx="6" fill="#F0E7D6" />
            <Roll cx={60} cy={68} r={14} tone={tone} />
            <Roll cx={91} cy={66} r={14} tone="#F6C177" />
            <Roll cx={122} cy={68} r={14} tone="#8CBF6B" />
            <Roll cx={148} cy={70} r={12} tone={tone} />
            <Roll cx={63} cy={99} r={13} tone="#E8935B" />
            <Roll cx={94} cy={101} r={13} tone={tone} />
            <Roll cx={125} cy={99} r={13} tone="#C98BB0" />
          </>
        )}

        {variant === "bowl" && (
          <>
            <ellipse cx="100" cy="84" rx="50" ry="34" fill="#FBF7EC" />
            <ellipse cx="100" cy="82" rx="43" ry="28" fill={tone} opacity="0.9" />
            <path
              d="M64 76c14 8 24 10 36 10s26-3 36-11M66 88c14 8 22 10 34 10s26-3 36-10"
              stroke="#FBF7EC"
              strokeOpacity="0.85"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="86" cy="72" r="6" fill="#FBF7EC" />
            <circle cx="116" cy="78" r="5" fill="#6FA84F" />
          </>
        )}

        {variant === "bite" && (
          <>
            {[
              [68, 90, 1],
              [100, 70, 1.1],
              [132, 90, 1],
              [84, 104, 0.85],
              [116, 104, 0.85],
            ].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <path d="M-19 4c0-11 9-17 19-17s19 6 19 17c0 8-8 12-19 12s-19-4-19-12Z" fill={tone} />
                <path
                  d="M-12 -2c4-4 9-6 13-6"
                  stroke="#FFFFFF"
                  strokeOpacity="0.5"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </>
        )}

        {variant === "drink" && (
          <>
            <path
              d="M80 34h40l-4 22c-1 6-3 8-3 14v30c0 6-4 9-13 9s-13-3-13-9V70c0-6-2-8-3-14Z"
              fill="#FBF7EC"
            />
            <path d="M83 60h34v40c0 5-4 7-17 7s-17-2-17-7Z" fill={tone} opacity="0.92" />
            <ellipse cx="100" cy="60" rx="17" ry="4.5" fill="#FFFFFF" opacity="0.6" />
            <circle cx="92" cy="78" r="3.2" fill="#FFFFFF" opacity="0.5" />
            <circle cx="108" cy="90" r="2.4" fill="#FFFFFF" opacity="0.4" />
          </>
        )}
        </g>
        </g>
      </svg>
    </span>
  );
}
