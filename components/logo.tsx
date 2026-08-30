"use client";

/**
 * Векторная интерпретация логотипа Mr. Sushi: панда с палочками и нигири.
 * Всё в одном SVG — масштабируется без потерь, красится через currentColor.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Mr. Sushi"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ms-disc" cx="35%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor="#EFE7D6" />
        </radialGradient>
        <linearGradient id="ms-salmon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9E76" />
          <stop offset="100%" stopColor="#E8613C" />
        </linearGradient>
        <linearGradient id="ms-stick" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E3BE85" />
          <stop offset="100%" stopColor="#B9854A" />
        </linearGradient>
      </defs>

      {/* диск-подложка */}
      <circle cx="60" cy="60" r="58" fill="url(#ms-disc)" />
      <circle cx="60" cy="60" r="58" stroke="#16110F" strokeWidth="3" />

      {/* палочки за головой */}
      <g transform="rotate(-20 60 60)">
        <rect x="86" y="18" width="5.4" height="62" rx="2.7" fill="url(#ms-stick)" />
        <rect x="94" y="22" width="5.4" height="58" rx="2.7" fill="url(#ms-stick)" />
        <rect x="86" y="18" width="5.4" height="62" rx="2.7" stroke="#16110F" strokeWidth="1.6" />
        <rect x="94" y="22" width="5.4" height="58" rx="2.7" stroke="#16110F" strokeWidth="1.6" />
      </g>

      {/* уши */}
      <circle cx="30" cy="36" r="13.5" fill="#16110F" />
      <circle cx="90" cy="36" r="13.5" fill="#16110F" />
      <circle cx="30" cy="36" r="6" fill="#3A2E2A" />
      <circle cx="90" cy="36" r="6" fill="#3A2E2A" />

      {/* голова */}
      <ellipse cx="60" cy="55" rx="35" ry="31" fill="#FFFDF7" stroke="#16110F" strokeWidth="3" />

      {/* глазные пятна */}
      <ellipse
        cx="45"
        cy="51"
        rx="11.5"
        ry="13.5"
        fill="#16110F"
        transform="rotate(-16 45 51)"
      />
      <ellipse
        cx="75"
        cy="51"
        rx="11.5"
        ry="13.5"
        fill="#16110F"
        transform="rotate(16 75 51)"
      />
      <circle cx="46.5" cy="50" r="4.6" fill="#FFFDF7" />
      <circle cx="73.5" cy="50" r="4.6" fill="#FFFDF7" />
      <circle cx="47.4" cy="50.6" r="2.4" fill="#16110F" />
      <circle cx="74.4" cy="50.6" r="2.4" fill="#16110F" />
      <circle cx="48.6" cy="48.8" r="1" fill="#FFFDF7" />
      <circle cx="75.6" cy="48.8" r="1" fill="#FFFDF7" />

      {/* нос и улыбка */}
      <path
        d="M55.4 63.5c0-2.4 2.1-4 4.6-4s4.6 1.6 4.6 4c0 2.3-2.1 3.7-4.6 3.7s-4.6-1.4-4.6-3.7Z"
        fill="#16110F"
      />
      <path
        d="M60 67.6v3.2M60 70.8c-2.6 4.2-8.2 3.6-9.6-.6M60 70.8c2.6 4.2 8.2 3.6 9.6-.6"
        stroke="#16110F"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* нигири в лапах */}
      <g transform="translate(0 4)">
        <ellipse cx="60" cy="98" rx="24" ry="11" fill="#FFFDF7" stroke="#16110F" strokeWidth="3" />
        <path
          d="M37.5 94.5c4-6.5 12.5-10 22.5-10s18.5 3.5 22.5 10c-4.5 3.2-13 5-22.5 5s-18-1.8-22.5-5Z"
          fill="url(#ms-salmon)"
          stroke="#16110F"
          strokeWidth="2.6"
        />
        <path
          d="M43 89.5c3.4-1.6 8.4-2.6 17-2.6M47 94c4-1.4 9-2.2 16-2.2"
          stroke="#FFD8C4"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <rect x="53" y="86" width="14" height="19" rx="2.5" fill="#16110F" opacity="0.92" />
      </g>

      {/* лапы */}
      <ellipse cx="31" cy="92" rx="9.5" ry="8" fill="#16110F" transform="rotate(-18 31 92)" />
      <ellipse cx="89" cy="92" rx="9.5" ry="8" fill="#16110F" transform="rotate(18 89 92)" />
    </svg>
  );
}

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group flex items-center gap-2.5">
      <LogoMark
        className={`${compact ? "h-8 w-8" : "h-10 w-10"} shrink-0 transition-transform duration-300 group-hover:-rotate-6`}
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-extrabold uppercase tracking-[0.01em] text-[var(--brand)]">
          Mr. Sushi
        </span>
        <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-faint)]">
          Chirchiq
        </span>
      </span>
    </span>
  );
}
