"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/* ── Qabiltoo brand mark: two interlocking diamond rings ────────
   Pink ring for the bride, blue ring for the groom — each crowned
   with a solitaire diamond. Drawn as crisp vector strokes with
   soft gradients; the diamonds are icy white with delicate facets. */

const BRIDE_FROM = "#f9a8d4";
const BRIDE_TO = "#ec4899";
const GROOM_FROM = "#9ec5fe";
const GROOM_TO = "#5b8def";

/* Solitaire diamond geometry: flat table on top, girdle at the widest
   point, pavilion tapering to the culet that seats on the ring band. */
const GEM_MARK_SILHOUETTE = "M -3 -4 L 3 -4 L 5.5 -1.5 L 0 4 L -5.5 -1.5 Z";
const GEM_MARK_FACETS = "M -5.5 -1.5 L 5.5 -1.5 M -3 -4 L 0 4 L 3 -4";
const GEM_WORD_SILHOUETTE = "M -5 -6.75 L 5 -6.75 L 9.5 -2.5 L 0 6.75 L -9.5 -2.5 Z";
const GEM_WORD_FACETS = "M -9.5 -2.5 L 9.5 -2.5 M -5 -6.75 L 0 6.75 L 5 -6.75";

/** Icy-white diamond gradient, shared by every gem in a given SVG. */
function GemGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0.1" y1="0" x2="0.7" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.5" stopColor="#f2f7fd" />
      <stop offset="1" stopColor="#dfe9f6" />
    </linearGradient>
  );
}

/** A solitaire diamond, positioned/tilted around its own centre. */
function Gem({
  cx,
  cy,
  tilt = 0,
  silhouette,
  facets,
  fillId,
  outlineWidth,
  facetWidth,
}: {
  cx: number;
  cy: number;
  tilt?: number;
  silhouette: string;
  facets: string;
  fillId: string;
  outlineWidth: number;
  facetWidth: number;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${tilt})`}>
      <path
        d={silhouette}
        fill={`url(#${fillId})`}
        stroke="#b7c4d8"
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      <path
        d={facets}
        fill="none"
        stroke="#9fb0c7"
        strokeWidth={facetWidth}
        strokeLinejoin="round"
        opacity={0.55}
      />
    </g>
  );
}

/**
 * Icon-only mark — the two interlocking diamond rings.
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
        <GemGradient id={`qab-gem-${id}`} />
      </defs>
      {/* bride ring (pink) */}
      <circle cx="18.5" cy="24" r="12.5" stroke={`url(#qab-bride-${id})`} strokeWidth="4.5" />
      {/* groom ring (blue) — interlocking with the bride ring */}
      <circle cx="29.5" cy="24" r="12.5" stroke={`url(#qab-groom-${id})`} strokeWidth="4.5" />
      {/* solitaire diamonds seated on top of each ring */}
      <Gem
        cx={15.9}
        cy={6.3}
        tilt={-8}
        silhouette={GEM_MARK_SILHOUETTE}
        facets={GEM_MARK_FACETS}
        fillId={`qab-gem-${id}`}
        outlineWidth={0.85}
        facetWidth={0.5}
      />
      <Gem
        cx={32.1}
        cy={6.3}
        tilt={8}
        silhouette={GEM_MARK_SILHOUETTE}
        facets={GEM_MARK_FACETS}
        fillId={`qab-gem-${id}`}
        outlineWidth={0.85}
        facetWidth={0.5}
      />
    </svg>
  );
}

/**
 * One "o" of the wordmark rendered as a diamond engagement ring.
 * Sized against the surrounding font so the band sits on the text
 * baseline exactly like a lowercase "o", with the solitaire diamond
 * peeking above — the name and the symbol become one.
 */
function RingO({
  variant,
  gradientId,
  gemId,
  className,
}: {
  variant: "bride" | "groom";
  gradientId: string;
  gemId: string;
  className?: string;
}) {
  const from = variant === "bride" ? BRIDE_FROM : GROOM_FROM;
  const to = variant === "bride" ? BRIDE_TO : GROOM_TO;
  const bride = variant === "bride";
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("inline-block h-[0.78em] w-[0.78em] shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="14" y1="16" x2="50" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <GemGradient id={gemId} />
      </defs>
      <circle cx="32" cy="38.5" r="20" stroke={`url(#${gradientId})`} strokeWidth="8" />
      <Gem
        cx={bride ? 28.2 : 35.8}
        cy={10}
        tilt={bride ? -8 : 8}
        silhouette={GEM_WORD_SILHOUETTE}
        facets={GEM_WORD_FACETS}
        fillId={gemId}
        outlineWidth={1.1}
        facetWidth={0.7}
      />
    </svg>
  );
}

/**
 * Full wordmark — "Qabilt" in the display serif, with the final two
 * "o" letters replaced by the pink (bride) and blue (groom) diamond
 * rings touching/overlapping each other.
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
        <RingO
          variant="bride"
          gradientId={`qab-word-bride-${id}`}
          gemId={`qab-word-gem-b-${id}`}
          className="ml-[0.05em] translate-y-[0.015em]"
        />
        <RingO
          variant="groom"
          gradientId={`qab-word-groom-${id}`}
          gemId={`qab-word-gem-g-${id}`}
          className="-ml-[0.3em] translate-y-[0.015em]"
        />
      </span>
    </span>
  );
}
