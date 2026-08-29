"use client";

import type { ArtVariant } from "@/lib/types";

/**
 * Процедурные иллюстрации блюд. Фотографий у заведения пока нет,
 * поэтому каждая позиция получает собственную векторную «подачу»:
 * форма зависит от типа блюда, цвет — от начинки.
 */

function hashOf(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Ролл сверху: нори — рис — начинка. Начинка всегда из двух-трёх компонентов. */
function Rice({
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
      {/* нори */}
      <circle cx={cx} cy={cy} r={r} fill="#141010" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2A2320" strokeWidth="1" />
      {/* рис */}
      <circle cx={cx} cy={cy} r={r * 0.84} fill="#F4EEDF" />
      <circle cx={cx} cy={cy} r={r * 0.84} fill="none" stroke="#D9CFB8" strokeWidth="0.8" />
      {/* начинка */}
      <circle cx={cx - r * 0.16} cy={cy - r * 0.1} r={r * 0.3} fill={tone} />
      <circle cx={cx + r * 0.22} cy={cy + r * 0.18} r={r * 0.22} fill={accent} />
      <circle cx={cx + r * 0.05} cy={cy - r * 0.3} r={r * 0.14} fill="#E8D9B8" />
      {/* кунжут на рисе */}
      <circle cx={cx - r * 0.55} cy={cy + r * 0.32} r={r * 0.055} fill="#B9AE93" />
      <circle cx={cx + r * 0.5} cy={cy - r * 0.42} r={r * 0.055} fill="#B9AE93" />
      <circle cx={cx - r * 0.3} cy={cy + r * 0.6} r={r * 0.05} fill="#B9AE93" />
      {/* блик */}
      <path
        d={`M${cx - r * 0.72} ${cy - r * 0.34}a${r * 0.8} ${r * 0.8} 0 0 1 ${r * 0.5} -${r * 0.42}`}
        stroke="#FFFFFF"
        strokeOpacity="0.28"
        strokeWidth={r * 0.1}
        strokeLinecap="round"
        fill="none"
      />
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
  const tilt = ((h % 14) - 7) * 1.2;

  return (
    <svg
      viewBox="0 0 200 150"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`plate-${seed}`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#2C2520" />
          <stop offset="100%" stopColor="#15100E" />
        </radialGradient>
        <linearGradient id={`glow-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.3" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="82" rx="86" ry="58" fill={`url(#plate-${seed})`} />
      <ellipse cx="100" cy="82" rx="86" ry="58" fill={`url(#glow-${seed})`} />
      <ellipse
        cx="100"
        cy="82"
        rx="86"
        ry="58"
        fill="none"
        stroke={tone}
        strokeOpacity="0.28"
        strokeWidth="1.2"
      />

      <g transform={`rotate(${tilt} 100 82)`}>
        {variant === "maki" && (
          <>
            <Rice cx={62} cy={92} r={25} tone={tone} accent="#8CBF6B" />
            <Rice cx={100} cy={70} r={27} tone={tone} />
            <Rice cx={140} cy={92} r={25} tone={tone} accent="#E8B04B" />
            <circle cx="100" cy="70" r="3" fill="#F6F0E2" opacity="0.7" />
            <circle cx="80" cy="112" r="2.4" fill="#F6F0E2" opacity="0.5" />
            <circle cx="126" cy="114" r="2" fill="#F6F0E2" opacity="0.4" />
          </>
        )}

        {variant === "nigiri" && (
          <>
            <g transform="translate(-26 6)">
              <ellipse cx="100" cy="98" rx="34" ry="16" fill="#F6F0E2" />
              <ellipse cx="100" cy="98" rx="34" ry="16" fill="none" stroke="#1A1614" strokeWidth="2.5" />
              <path
                d="M68 92c6-11 18-17 32-17s26 6 32 17c-7 5-19 8-32 8s-25-3-32-8Z"
                fill={tone}
                stroke="#1A1614"
                strokeWidth="2.5"
              />
              <path d="M76 88c6-3 14-5 24-5" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2.4" strokeLinecap="round" />
            </g>
            <g transform="translate(30 -12) scale(0.86)">
              <ellipse cx="100" cy="98" rx="34" ry="16" fill="#F6F0E2" />
              <ellipse cx="100" cy="98" rx="34" ry="16" fill="none" stroke="#1A1614" strokeWidth="2.8" />
              <path
                d="M68 92c6-11 18-17 32-17s26 6 32 17c-7 5-19 8-32 8s-25-3-32-8Z"
                fill={tone}
                stroke="#1A1614"
                strokeWidth="2.8"
              />
              <rect x="88" y="76" width="24" height="34" rx="3" fill="#1A1614" opacity="0.9" />
            </g>
          </>
        )}

        {variant === "set" && (
          <>
            <rect
              x="34"
              y="46"
              width="132"
              height="74"
              rx="8"
              fill="#100C0A"
              stroke={tone}
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
            <Rice cx={58} cy={70} r={15} tone={tone} />
            <Rice cx={90} cy={68} r={15} tone="#F6C177" />
            <Rice cx={122} cy={70} r={15} tone="#8CBF6B" />
            <Rice cx={148} cy={72} r={13} tone={tone} />
            <Rice cx={62} cy={102} r={14} tone="#E8935B" />
            <Rice cx={94} cy={104} r={14} tone={tone} />
            <Rice cx={126} cy={102} r={14} tone="#C98BB0" />
            <path d="M146 96h16v18h-16z" fill="#F6F0E2" opacity="0.9" />
            <path d="M146 96h16v6h-16z" fill="#6FA84F" />
          </>
        )}

        {variant === "bowl" && (
          <>
            <ellipse cx="100" cy="86" rx="52" ry="36" fill="#0E0B09" stroke="#1A1614" strokeWidth="3" />
            <ellipse cx="100" cy="84" rx="45" ry="30" fill={tone} opacity="0.85" />
            <path
              d="M62 78c14 8 24 10 38 10s26-3 38-11M64 90c14 8 22 10 36 10s26-3 38-10"
              stroke="#F6E7C8"
              strokeOpacity="0.75"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="86" cy="74" r="6" fill="#F6F0E2" opacity="0.85" />
            <circle cx="116" cy="80" r="5" fill="#6FA84F" opacity="0.9" />
            <path
              d="M132 44c4 8-2 12 2 20M142 46c4 8-2 12 2 20"
              stroke={tone}
              strokeOpacity="0.5"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {variant === "bite" && (
          <>
            {[
              [66, 96, 1],
              [100, 74, 1.1],
              [134, 96, 1],
              [84, 110, 0.85],
              [118, 110, 0.85],
            ].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <path
                  d="M-20 4c0-11 9-18 20-18s20 7 20 18c0 8-9 13-20 13s-20-5-20-13Z"
                  fill={tone}
                  stroke="#1A1614"
                  strokeWidth="2.4"
                />
                <path
                  d="M-13 -2c4-4 9-6 13-6M-6 6c5-3 10-4 15-4"
                  stroke="#FFF6E4"
                  strokeOpacity="0.55"
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
              d="M78 34h44l-4 24c-1 6-4 9-4 15v34c0 6-5 10-14 10s-14-4-14-10V73c0-6-3-9-4-15Z"
              fill="#0E0B09"
              stroke="#1A1614"
              strokeWidth="3"
            />
            <path
              d="M82 62h36v45c0 5-4 8-18 8s-18-3-18-8Z"
              fill={tone}
              opacity="0.9"
            />
            <ellipse cx="100" cy="62" rx="18" ry="5" fill="#FFFFFF" opacity="0.25" />
            <circle cx="92" cy="82" r="3.4" fill="#FFFFFF" opacity="0.45" />
            <circle cx="108" cy="94" r="2.6" fill="#FFFFFF" opacity="0.35" />
            <circle cx="99" cy="102" r="2" fill="#FFFFFF" opacity="0.3" />
            <rect x="112" y="24" width="4" height="44" rx="2" fill="#E3BE85" transform="rotate(14 114 46)" />
          </>
        )}
      </g>
    </svg>
  );
}
