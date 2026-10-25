"use client";

import { cn } from "@/lib/utils";

/**
 * Spinning 8-pointed Islamic star loader — used for "verifying" states.
 * Slow, dignified rotation with a soft gold glow.
 */
export function StarLoader({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} aria-label="Verifying">
      <span className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl" aria-hidden />
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="spin-slower relative"
        role="status"
        aria-hidden="true"
      >
        <g fill="none" stroke="#d4af37" strokeWidth="2">
          <rect x="16" y="16" width="32" height="32" rx="2" />
          <rect x="16" y="16" width="32" height="32" rx="2" transform="rotate(45 32 32)" />
          <circle cx="32" cy="32" r="7" strokeOpacity="0.7" />
        </g>
        <circle cx="32" cy="32" r="2.4" fill="#d4af37" />
      </svg>
    </div>
  );
}
