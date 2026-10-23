"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { CalendarHeart, ChevronLeft, ChevronRight, MapPin, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarLoader } from "../shared/star-loader";
import type { SuccessStory } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

const ROTATE_MS = 6000;

async function fetchStories(): Promise<{ stories: SuccessStory[] }> {
  const res = await fetch("/api/stories");
  if (!res.ok) throw new Error("Failed to fetch stories");
  return res.json();
}

/**
 * Auto-rotating success-story carousel — a slow 3D card flip between
 * stories (rotateY), paused on hover, with dots and arrows. Falls back
 * to a gentle fade under prefers-reduced-motion.
 */
export function StoriesCarousel() {
  const { data, isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: fetchStories,
    staleTime: 60_000,
  });
  const stories = data?.stories ?? [];

  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = stories.length;

  const paginate = useCallback(
    (dir: number) => {
      setState(([i]) => [(i + dir + count) % count, dir]);
    },
    [count]
  );

  const goTo = useCallback((i: number) => {
    setState(([cur]) => [i, i > cur ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      if (!paused) setState(([i]) => [(i + 1) % count, 1]);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  if (isLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center" role="status" aria-label="Loading stories">
        <StarLoader size={64} />
      </div>
    );
  }

  if (count === 0) return null;
  /* Guard against a refetch shrinking the list while an old index is active */
  const story = stories[((index % count) + count) % count];

  const flip = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, rotateY: direction >= 0 ? 90 : -90 },
        animate: { opacity: 1, rotateY: 0 },
        exit: { opacity: 0, rotateY: direction >= 0 ? -90 : 90 },
      };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Success stories"
    >
      <div className="perspective-1200 mx-auto max-w-4xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={story.id}
            initial={flip.initial}
            animate={flip.animate}
            exit={flip.exit}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="preserve-3d"
          >
            <div className="grid items-center gap-8 rounded-[2rem] border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-10 md:grid-cols-[240px_1fr] md:gap-10">
              {/* Arch photo */}
              <div className="relative mx-auto w-44 sm:w-52 md:w-full md:max-w-[240px]">
                <div
                  className="absolute -inset-2.5 rounded-t-full rounded-b-[2rem] border border-gold-400/50"
                  aria-hidden="true"
                />
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[1.6rem] shadow-lg">
                  <Image
                    src={story.image}
                    alt={`${story.coupleNames} — a Qabiltoo couple`}
                    fill
                    sizes="(max-width: 768px) 208px, 240px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/25 via-transparent to-transparent" />
                </div>
              </div>

              {/* Words */}
              <div className="text-center md:text-left">
                <Quote className="mx-auto h-7 w-7 text-gold-500 md:mx-0" aria-hidden />
                <p className="mt-4 font-display text-2xl font-bold text-foreground">
                  {story.coupleNames}
                </p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:text-emerald-300">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {story.city}, {story.country}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-700 dark:text-gold-300">
                    <CalendarHeart className="h-3.5 w-3.5" aria-hidden />
                    Married {story.marriedAt}
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gold-400/50 hover:border-gold-500 hover:bg-gold-500/10"
          onClick={() => paginate(-1)}
          aria-label="Previous story"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Choose story">
          {stories.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Story ${i + 1}: ${s.coupleNames}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-500",
                i === index
                  ? "w-7 bg-gold-500"
                  : "w-2.5 bg-primary/20 hover:bg-primary/40 dark:bg-white/20 dark:hover:bg-white/40"
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gold-400/50 hover:border-gold-500 hover:bg-gold-500/10"
          onClick={() => paginate(1)}
          aria-label="Next story"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
