"use client";

import { cn } from "@/lib/utils";

/* Solitaire diamond geometry for the backdrop scale. */
const GEM_SILHOUETTE = "M -12 -17 L 12 -17 L 23 -6 L 0 17 L -23 -6 Z";
const GEM_FACETS = "M -23 -6 L 23 -6 M -12 -17 L 0 17 L 12 -17";
/* Four-point sparkle star. */
const SPARKLE = "M 0 -8 C 0.9 -2.4 2.4 -0.9 8 0 C 2.4 0.9 0.9 2.4 0 8 C -0.9 2.4 -2.4 0.9 -8 0 C -2.4 -0.9 -0.9 -2.4 0 -8 Z";

/**
 * Two interlocking diamond rings — a pink ring for the bride and a blue
 * ring for the groom, each crowned with a solitaire diamond — rendered
 * as a soft, subtle background graphic.
 *
 * Pure SVG (sharp at any size), fully responsive (`preserveAspectRatio` +
 * percentage scaling), low opacity so text stays readable, and a gentle
 * drift animation that respects prefers-reduced-motion via CSS.
 */
export function RingsBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        className="rings-drift h-full w-full"
        viewBox="0 0 900 640"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="rings-bride" x1="250" y1="150" x2="500" y2="470" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f9a8d4" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="rings-groom" x1="420" y1="170" x2="670" y2="490" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#9ec5fe" />
            <stop offset="1" stopColor="#5b8def" />
          </linearGradient>
          <linearGradient id="rings-gem" x1="0.1" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.5" stopColor="#f2f7fd" />
            <stop offset="1" stopColor="#dfe9f6" />
          </linearGradient>
          <filter id="rings-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* soft glows behind the rings */}
        <g filter="url(#rings-soft)" opacity="0.5">
          <circle cx="365" cy="310" r="150" stroke="#ec4899" strokeWidth="26" fill="none" />
          <circle cx="525" cy="310" r="150" stroke="#5b8def" strokeWidth="26" fill="none" />
        </g>

        {/* the two diamond rings themselves — overlapping ~35% */}
        <g opacity="0.42" strokeLinecap="round" fill="none">
          <circle cx="365" cy="310" r="150" stroke="url(#rings-bride)" strokeWidth="12" />
          <circle cx="525" cy="310" r="150" stroke="url(#rings-groom)" strokeWidth="12" />
        </g>

        {/* solitaire diamonds seated on top of each ring */}
        <g opacity="0.65">
          <g transform="translate(355 144) rotate(-8)">
            <path d={GEM_SILHOUETTE} fill="url(#rings-gem)" stroke="#b7c4d8" strokeWidth="2.4" strokeLinejoin="round" />
            <path d={GEM_FACETS} fill="none" stroke="#9fb0c7" strokeWidth="1.6" strokeLinejoin="round" opacity="0.55" />
          </g>
          <g transform="translate(535 144) rotate(8)">
            <path d={GEM_SILHOUETTE} fill="url(#rings-gem)" stroke="#b7c4d8" strokeWidth="2.4" strokeLinejoin="round" />
            <path d={GEM_FACETS} fill="none" stroke="#9fb0c7" strokeWidth="1.6" strokeLinejoin="round" opacity="0.55" />
          </g>
        </g>

        {/* delicate highlight arcs for a polished, jewellery feel */}
        <g opacity="0.3" fill="none" strokeLinecap="round">
          <path d="M 262 236 A 150 150 0 0 1 365 160" stroke="#fbcfe8" strokeWidth="4" />
          <path d="M 525 460 A 150 150 0 0 1 452 421" stroke="#bfdbfe" strokeWidth="4" />
        </g>

        {/* gentle sparkles beside the diamonds */}
        <g fill="#ffffff">
          <path
            d={SPARKLE}
            transform="translate(306 100) scale(1.2)"
            className="rings-twinkle"
            opacity="0.7"
          />
          <path
            d={SPARKLE}
            transform="translate(592 112) scale(0.9)"
            className="rings-twinkle"
            style={{ animationDelay: "1.6s" }}
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}
