"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/* ── Qabiltoo brand mark: two interlocking rings ────────────────
   Pink ring for the bride, blue ring for the groom — the heart of
   the identity. Drawn as crisp vector strokes with soft gradients. */

const BRIDE_FROM = "#f9a8d4";
const BRIDE_TO = "#ec4899";
const GROOM_FROM = "#9ec5fe";
const GROOM_TO = "#5b8def";

/**
 * Icon-only mark — the two interlocking rings.
 * Transparent background; reads cleanly on light and dark surfaces.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-9 w-9", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`qab-bride-${id}`} x1="6" y1="8" x2="30" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={BRIDE_FROM} />
          <stop offset="1" stopColor={BRIDE_TO} />
        </linearGradient>
        <linearGradient id={`qab-groom-${id}`} x1="20" y1="10" x2="44" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={GROOM_FROM} />
          <stop offset="1" stopColor={GROOM_TO} />
        </linearGradient>
      </defs>
      {/* bride ring (pink) */}
      <circle cx="18.5" cy="24" r="12.5" stroke={`url(#qab-bride-${id})`} strokeWidth="4.5" />
      {/* groom ring (blue) — interlocking with the bride ring */}
      <circle cx="29.5" cy="24" r="12.5" stroke={`url(#qab-groom-${id})`} strokeWidth="4.5" />
    </svg>
  );
}

/**
 * One "o" of the wordmark rendered as a wedding ring.
 * Sized against the surrounding font so it sits on the text baseline
 * exactly like a lowercase "o" — the name and the symbol become one.
 */
function RingO({
  variant,
  gradientId,
  className,
}: {
  variant: "bride" | "groom";
  gradientId: string;
  className?: string;
}) {
  const from = variant === "bride" ? BRIDE_FROM : GROOM_FROM;
  const to = variant === "bride" ? BRIDE_TO : GROOM_TO;
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("inline-block h-[0.66em] w-[0.66em] shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="25" stroke={`url(#${gradientId})`} strokeWidth="9.5" />
    </svg>
  );
}

/**
 * Full wordmark — "Qabilt" in the display serif, with the final two
 * "o" letters replaced by the pink (bride) and blue (groom) rings
 * touching/overlapping each other.
 *
 * `dark` switches the word colour for dark backgrounds; the rings
 * keep their pink/blue identity on both.
 */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  const id = useId().replace(/[:]/g, "");
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "font-display inline-flex items-baseline text-2xl font-bold leading-none tracking-tight",
          dark ? "text-white" : "text-primary"
        )}
      >
        <span>Qabilt</span>
        <RingO variant="bride" gradientId={`qab-word-bride-${id}`} className="ml-[0.05em] translate-y-[0.02em]" />
        <RingO
          variant="groom"
          gradientId={`qab-word-groom-${id}`}
          className="-ml-[0.14em] translate-y-[0.02em]"
        />
      </span>
    </span>
  );
}
