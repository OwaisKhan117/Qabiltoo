"use client";

import { cn } from "@/lib/utils";

/**
 * Two interlocking rings — a pink ring for the bride and a blue ring for
 * the groom — rendered as a soft, subtle background graphic.
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
          <filter id="rings-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* soft glows behind the rings */}
        <g filter="url(#rings-soft)" opacity="0.5">
          <circle cx="365" cy="310" r="150" stroke="#ec4899" strokeWidth="26" fill="none" />
          <circle cx="525" cy="310" r="150" stroke="#5b8def" strokeWidth="26" fill="none" />
        </g>

        {/* the two rings themselves — overlapping ~35% */}
        <g opacity="0.42" strokeLinecap="round" fill="none">
          <circle cx="365" cy="310" r="150" stroke="url(#rings-bride)" strokeWidth="12" />
          <circle cx="525" cy="310" r="150" stroke="url(#rings-groom)" strokeWidth="12" />
        </g>

        {/* delicate highlight arcs for a polished, jewellery feel */}
        <g opacity="0.3" fill="none" strokeLinecap="round">
          <path d="M 262 236 A 150 150 0 0 1 365 160" stroke="#fbcfe8" strokeWidth="4" />
          <path d="M 525 460 A 150 150 0 0 1 452 421" stroke="#bfdbfe" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}
