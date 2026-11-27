"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, Lock, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ParallaxCard } from "../shared/parallax-card";
import { RingsBackdrop } from "../shared/rings-backdrop";
import { VerificationBadge } from "../shared/verification-badge";
import { ActivityTicker } from "./activity-ticker";
import { displayName, type Profile, type ProfilesResponse, type View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

/* Heavy canvas layers are lazy-loaded client-side only */
const LightMotes = dynamic(
  () => import("../shared/light-motes").then((m) => ({ default: m.LightMotes })),
  { ssr: false }
);

interface HeroProps {
  navigate: (view: View) => void;
  /** Server-fetched gold profiles — hero cards render in the initial HTML */
  initialHero?: ProfilesResponse;
}

/* Slow, dignified entrance for each line of copy.
   CSS transform-only (GPU-friendly) and the text is visible from the very
   first paint — critical for LCP. Delay via --rise-delay. */
const rise = (delay: number) =>
  ({ "--rise-delay": `${delay}s` }) as CSSProperties;

async function fetchGoldProfiles(): Promise<ProfilesResponse> {
  const res = await fetch("/api/profiles?verificationTier=gold&limit=3");
  if (!res.ok) throw new Error("Failed to fetch gold profiles");
  return res.json();
}

/* ── Floating profile-card mockup ─────────────────────────── */
function FloatingProfileCard({
  profile,
  floatClass,
  rotate = 0,
  className,
  showPhoto = true,
  delay = 0,
  priority = false,
}: {
  profile: Profile;
  floatClass?: string;
  rotate?: number;
  className?: string;
  showPhoto?: boolean;
  delay?: number;
  priority?: boolean;
}) {
  return (
    <div
      className={cn("rise-in-card absolute", className)}
      style={rise(delay)}
    >
      <div className={floatClass}>
        <ParallaxCard maxTilt={7} depth={10} className="w-full">
          <div
            style={{ transform: `rotate(${rotate}deg)` }}
            className="w-40 rounded-2xl border border-white/20 bg-white/10 p-2.5 shadow-2xl shadow-emerald-950/40 backdrop-blur-md sm:w-44 lg:w-48"
          >
            {showPhoto && (
              <div className="relative mb-2.5 aspect-[4/4.1] w-full overflow-hidden rounded-xl">
                <Image
                  src={profile.image}
                  alt={`Profile of ${displayName(profile.fullName)}`}
                  fill
                  sizes="(max-width: 640px) 160px, 192px"
                  priority={priority}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/45 via-transparent to-transparent" />
              </div>
            )}
            <div className="space-y-1 px-0.5 pb-0.5">
              <div className="flex items-center justify-between gap-1">
                <p className="truncate font-display text-sm font-semibold text-white">
                  {displayName(profile.fullName)}
                </p>
                <VerificationBadge tier={profile.verificationTier} iconSize={13} />
              </div>
              <p className="truncate text-[11px] text-white/70">
                {profile.age} yrs · {profile.city}
              </p>
            </div>
          </div>
        </ParallaxCard>
      </div>
    </div>
  );
}

export function Hero({ navigate, initialHero }: HeroProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["hero-gold-profiles"],
    queryFn: fetchGoldProfiles,
    initialData: initialHero,
    staleTime: 60_000,
  });

  const cards = (data?.profiles ?? []).slice(0, 3);
  const [cardA, cardB, cardC] = cards;

  function scrollToFeatured() {
    document.getElementById("featured-profiles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-950 text-white"
      aria-label="Welcome to Qabiltoo"
    >
      {/* ── Atmosphere layers ── */}
      <RingsBackdrop className="opacity-80" />
      <div className="absolute inset-0">
        <LightMotes count={42} speed={0.8} />
      </div>
      {/* soft glows — radial gradients (visually identical to blurred circles,
          but cheap to paint: no 460–520px blur filters) */}
      <div
        className="pointer-events-none absolute -left-40 top-10 h-[460px] w-[460px]"
        style={{ background: "radial-gradient(closest-side, rgba(46,132,105,0.25), transparent)" }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px]"
        style={{ background: "radial-gradient(closest-side, rgba(212,175,55,0.15), transparent)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-950/70 to-transparent" />

      <div className="relative mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:pb-24 lg:pt-16">
        {/* ── Left: copy + CTAs ── */}
        <div className="max-w-2xl">
          {/* Arabic calligraphy accent */}
          <div className="rise-in mb-5 flex items-center gap-4" style={rise(0.15)}>
            <span className="font-arabic text-4xl leading-none text-gold-300 drop-shadow-[0_2px_14px_rgba(212,175,55,0.35)] sm:text-5xl" lang="ar" aria-hidden="true">
              نكاح
            </span>
            <span className="h-px w-14 bg-gradient-to-r from-gold-400/80 to-transparent" aria-hidden="true" />
          </div>

          {/* Eyebrow */}
          <p
            className="rise-in mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/90 sm:text-sm"
            style={rise(0.29)}
          >
            Assalamu Alaikum — Welcome to Qabiltoo
          </p>

          {/* Headline */}
          <h1
            className="rise-in font-display text-4xl font-bold leading-[1.14] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]"
            style={rise(0.43)}
          >
            Begin Your Journey to a{" "}
            <span className="text-gradient-gold">Blessed Nikah</span>
          </h1>

          {/* Subheadline */}
          <p
            className="rise-in mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            style={rise(0.57)}
          >
            A privacy-first, guardian-approved matrimony where every introduction is halal,
            every profile verified — and your family involved from the very first Salaam.
          </p>

          {/* CTAs */}
          <div
            className="rise-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={rise(0.71)}
          >
            <Button
              size="lg"
              onClick={() => navigate({ name: "register" })}
              className="btn-gold-shimmer rounded-full bg-gold-500 text-base font-semibold text-emerald-950 shadow-lg shadow-gold-500/30 hover:bg-gold-400"
            >
              Create Free Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatured}
              className="rounded-full border-white/35 bg-white/5 text-base text-white hover:border-gold-300/60 hover:bg-white/10 hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-gold-300" />
              Meet Our Members
            </Button>
          </div>

          {/* Trust microcopy */}
          <ul
            className="rise-in mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/70"
            style={rise(0.85)}
          >
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-gold-300" aria-hidden />
              ID-verified profiles
            </li>
            <li aria-hidden="true" className="text-white/30">·</li>
            <li className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gold-300" aria-hidden />
              Guardian-friendly
            </li>
            <li aria-hidden="true" className="text-white/30">·</li>
            <li className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-gold-300" aria-hidden />
              Photos blurred until matched
            </li>
          </ul>
        </div>

        {/* ── Right: floating 3D profile-card mockups ── */}
        <div className="relative mx-auto h-[300px] w-full max-w-md sm:h-[380px] lg:h-[470px] lg:max-w-none">
          {/* decorative halo */}
          <div
            className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/25"
            aria-hidden="true"
          />
          <div
            className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2"
            style={{ background: "radial-gradient(closest-side, rgba(223,187,82,0.10), transparent)" }}
            aria-hidden="true"
          />

          {isLoading && (
            <div className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2">
              <Skeleton className="aspect-[4/5] w-full rounded-2xl bg-white/10" />
            </div>
          )}

          {cardA && (
            <FloatingProfileCard
              profile={cardA}
              rotate={-4}
              floatClass="float-slow"
              priority
              delay={0.45}
              className="left-1/2 top-1/2 z-20 w-max -translate-x-1/2 -translate-y-1/2 lg:left-8 lg:top-6 lg:translate-x-0 lg:translate-y-0"
            />
          )}
          {cardB && (
            <FloatingProfileCard
              profile={cardB}
              rotate={3}
              floatClass="float-slower"
              delay={0.65}
              className="bottom-0 right-0 z-10 hidden w-max sm:block lg:right-auto lg:bottom-2 lg:left-[15rem]"
            />
          )}
          {cardC && (
            <FloatingProfileCard
              profile={cardC}
              rotate={-2}
              floatClass="float-slow"
              delay={0.85}
              className="right-4 top-0 z-0 hidden w-max lg:block"
            />
          )}
        </div>
      </div>

      {/* live-activity pill — floats fully inside the hero, just above its
          bottom edge, so it is always visible and never clipped by the fold */}
      <ActivityTicker />
    </section>
  );
}
