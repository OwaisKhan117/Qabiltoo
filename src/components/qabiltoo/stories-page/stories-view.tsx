"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarHeart, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import type { SuccessStory } from "@/lib/qabiltoo/types";
import type { View } from "@/lib/qabiltoo/types";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import { PatternOverlay } from "../pattern";
import { cn } from "@/lib/utils";

/* ── Photo with graceful fallback (portrait crop, gold-emerald) ── */

const ASPECTS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square"] as const;

function StoryPhoto({
  story,
  aspectClass,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className,
}: {
  story: Pick<SuccessStory, "image" | "coupleNames">;
  aspectClass?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = story.coupleNames
    .split("&")
    .map((p) => p.trim()[0])
    .join(" & ");

  if (failed) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950",
          aspectClass,
          className
        )}
        role="img"
        aria-label={`${story.coupleNames} — illustration placeholder`}
      >
        <PatternOverlay className="text-gold-400/15" />
        <div className="relative text-center">
          <p className="font-arabic text-3xl text-gold-300" aria-hidden>بسم الله</p>
          <p className="mt-2 font-display text-lg font-semibold tracking-wide text-white/90">{initials}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", aspectClass, className)}>
      <Image
        src={story.image}
        alt={`${story.coupleNames} — married couple`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/* ── Loading skeleton ─────────────────────────────────────── */

function StorySkeleton() {
  return (
    <div className="mb-5 break-inside-avoid">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <Skeleton className="mt-3 h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}

/* ── View ─────────────────────────────────────────────────── */

export function StoriesView({ navigate }: { navigate: (v: View) => void }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await fetch("/api/stories");
      if (!res.ok) throw new Error("Failed to fetch stories");
      return res.json() as Promise<{ stories: SuccessStory[] }>;
    },
    staleTime: 60_000,
  });

  const [active, setActive] = useState<SuccessStory | null>(null);

  const stories = data?.stories ?? [];

  return (
    <div className="bg-background">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-4xl px-4 pt-14 text-center sm:pt-20">
          <SectionHeading
            arabic="قصص النجاح"
            eyebrow="Success Stories"
            title="Every story began with Bismillah"
            description="Real nikahs, real families, real duaas answered. These couples found each other through Qabiltoo — with families involved from the very first message."
          />
        </div>
      </section>

      {/* ── Masonry grid ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24" aria-label="Success stories gallery">
        {isLoading ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StorySkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="mx-auto max-w-md rounded-2xl border border-gold-500/20 bg-card p-10 text-center">
            <HeartHandshake className="mx-auto h-10 w-10 text-gold-500" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Stories could not load</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong on our side. Please try again in a moment, insha&apos;Allah.
            </p>
          </div>
        ) : stories.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-gold-500/20 bg-card p-10 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-gold-500" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">The first story is waiting</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No approved stories yet — perhaps yours will be the first, bi idhnillah.
            </p>
            <Button className="btn-gold-shimmer mt-5 font-semibold" onClick={() => navigate({ name: "register" })}>
              Begin your journey
            </Button>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {stories.map((story, i) => (
              <Reveal key={story.id} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setActive(story)}
                  aria-label={`Read the story of ${story.coupleNames}`}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-gold-500/10 text-left shadow-sm transition-shadow duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none"
                >
                  <StoryPhoto story={story} aspectClass={ASPECTS[i % ASPECTS.length]} priority={i < 2} />
                  {/* Gradient overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/35 to-transparent"
                    aria-hidden
                  />
                  {/* Featured chip */}
                  {story.featured && (
                    <span className="absolute top-3 right-3 rounded-full bg-gold-500/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-950 shadow">
                      Featured
                    </span>
                  )}
                  {/* Bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h2 className="font-display text-xl font-semibold text-white transition-transform duration-300 group-hover:-translate-y-0.5">
                      {story.coupleNames}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-white/85 italic">&ldquo;{story.quote}&rdquo;</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-white backdrop-blur-sm">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {story.city}, {story.country}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-white backdrop-blur-sm">
                        <CalendarHeart className="h-3 w-3" aria-hidden />
                        Nikah {story.marriedAt}
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}

        {/* CTA under grid */}
        {!isLoading && !isError && stories.length > 0 && (
          <Reveal className="mt-8 text-center">
            <p className="font-arabic text-xl text-gold-600/80 dark:text-gold-400/80" aria-hidden>وَأَنْكِحُوا الْأَيَامَى</p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              &ldquo;Marry off those among you who are single&rdquo; — your story could be on this wall one day, insha&apos;Allah.
            </p>
            <Button size="lg" className="btn-gold-shimmer mt-5 font-semibold" onClick={() => navigate({ name: "register" })}>
              Begin your story
            </Button>
          </Reveal>
        )}
      </section>

      {/* ── Full story modal ─────────────────────────────── */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        {active && (
          <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl p-0 sm:max-w-3xl">
            <DialogTitle className="sr-only">Success story of {active.coupleNames}</DialogTitle>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid max-h-[92vh] overflow-y-auto md:grid-cols-[0.85fr_1.15fr] md:overflow-hidden"
            >
              {/* Photo side */}
              <div className="relative">
                <StoryPhoto
                  story={active}
                  aspectClass="aspect-[4/3] md:h-full md:aspect-auto"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
                <div
                  className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-transparent to-emerald-950/10 md:block"
                  aria-hidden
                />
                {active.featured && (
                  <span className="absolute top-3 left-3 rounded-full bg-gold-500/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-950 shadow">
                    Featured
                  </span>
                )}
              </div>

              {/* Story side */}
              <div className="flex max-h-[60vh] flex-col overflow-y-auto p-6 sm:p-8 md:max-h-[92vh]">
                <h2 className="font-display text-2xl font-semibold text-foreground">{active.title}</h2>
                <p className="mt-1 text-sm font-medium text-gold-600 dark:text-gold-400">{active.coupleNames}</p>

                {/* Meta chips */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-foreground/80">
                    <MapPin className="h-3 w-3 text-gold-600 dark:text-gold-400" aria-hidden />
                    {active.city}, {active.country}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-foreground/80">
                    <CalendarHeart className="h-3 w-3 text-gold-600 dark:text-gold-400" aria-hidden />
                    Nikah {active.marriedAt}
                  </span>
                </div>

                {/* Gold pull-quote */}
                <blockquote className="relative mt-5 rounded-xl border-l-4 border-gold-500 bg-gold-500/[0.06] p-4">
                  <p className="text-sm leading-relaxed text-foreground/90 italic">&ldquo;{active.quote}&rdquo;</p>
                  <footer className="mt-2 text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">
                    In their words
                  </footer>
                </blockquote>

                {/* Full story */}
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{active.story}</p>

                <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row">
                  <Button className="btn-gold-shimmer flex-1 font-semibold" onClick={() => navigate({ name: "register" })}>
                    Begin your story
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setActive(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
