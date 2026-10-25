"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Subtle Islamic 8-point star lattice overlay.
 * Color follows `currentColor` — wrap in a container with a text color.
 */
export function PatternOverlay({ className }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <pattern id={`star-${id}`} width="76" height="76" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="23" y="23" width="30" height="30" />
            <rect x="23" y="23" width="30" height="30" transform="rotate(45 38 38)" />
            <circle cx="38" cy="38" r="4.5" />
          </g>
          <g fill="currentColor">
            <circle cx="0" cy="0" r="1.5" />
            <circle cx="76" cy="0" r="1.5" />
            <circle cx="0" cy="76" r="1.5" />
            <circle cx="76" cy="76" r="1.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#star-${id})`} />
    </svg>
  );
}

/** Ornamental divider with center diamond — Islamic motif */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400/70 sm:w-24" />
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-500">
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          transform="rotate(45 12 12)"
          fill="currentColor"
          opacity="0.9"
        />
        <rect
          x="9"
          y="9"
          width="6"
          height="6"
          transform="rotate(45 12 12)"
          className="fill-background"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400/70 sm:w-24" />
    </div>
  );
}
