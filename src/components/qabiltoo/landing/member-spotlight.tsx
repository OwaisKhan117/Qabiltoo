"use client";

import Image from "next/image";
import { BadgeCheck, BookOpen, Heart, MapPin, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "../shared/reveal";
import { OrnamentDivider } from "../pattern";

/**
 * Member Spotlight — Rumana.
 * A dignified, modest spotlight of one of our verified members:
 * real photo (lazy-loaded, responsive), her own words, and a gentle
 * CTA. Sits on the home page where members first feel the community's
 * sincerity.
 */
export function MemberSpotlight() {
  return (
    <section
      className="relative overflow-hidden bg-background py-20 lg:py-24 dark:bg-card/40"
      aria-label="Member spotlight — Rumana"
    >
      {/* soft decorative glows */}
      <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-blush-300/25 blur-3xl dark:bg-blush-500/10" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-gold-400/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* ── Photo ── */}
          <Reveal direction="right" className="mx-auto w-full max-w-sm lg:max-w-md">
            <figure className="relative">
              <div
                className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-gold-400/40 via-transparent to-blush-400/40 blur-sm"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-gold-500/30 shadow-2xl shadow-emerald-950/15">
                <Image
                  src="/images/profile-f7.png"
                  alt="Rumana"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 384px, 448px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/35 via-transparent to-transparent" aria-hidden="true" />
              </div>
              <figcaption className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-emerald-950/80 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                <BadgeCheck className="h-4 w-4 text-gold-400" aria-hidden />
                Premium Verified Member
              </figcaption>
            </figure>
          </Reveal>

          {/* ── Words ── */}
          <div>
            <Reveal direction="up">
              <p className="font-arabic text-xl leading-relaxed text-gold-600 dark:text-gold-300" lang="ar" aria-hidden="true">
                عُضْوَةٌ مُتَمَيِّزَة
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
                Meet <span className="text-gradient-emerald-gold">Rumana</span> — a Hafiza who
                chose dignity over hurry
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <blockquote className="mt-6 space-y-3 border-l-2 border-gold-500/60 pl-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
                <Quote className="mb-1 h-5 w-5 text-gold-500" aria-hidden />
                <p>
                  &ldquo;Life has made me gentler and stronger simultaneously. On Qabiltoo I
                  found something rare — a space where my hijab is respected, my career is
                  not a compromise, and every introduction begins with intention and the
                  blessing of family.&rdquo;
                </p>
              </blockquote>
            </Reveal>

            <Reveal direction="up" delay={0.18}>
              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-gold-600 dark:text-gold-400" aria-hidden />
                  PhD Urdu Literature · Assistant Professor
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold-600 dark:text-gold-400" aria-hidden />
                  Kolkata, India
                </li>
                <li className="flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-gold-600 dark:text-gold-400" aria-hidden />
                  Hafiza · Trust score 91
                </li>
              </ul>
            </Reveal>

            <Reveal direction="up" delay={0.26}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="btn-gold-shimmer rounded-full bg-gold-500 font-semibold text-emerald-950 shadow-lg shadow-gold-500/25 hover:bg-gold-400"
                  onClick={() => document.getElementById("featured-profiles")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  <Heart className="h-4 w-4" aria-hidden />
                  Discover Members Like Rumana
                </Button>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.32}>
              <OrnamentDivider className="mt-10 justify-start" />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Rumana&rsquo;s story is shared with her permission as a demo profile. Every
                Qabiltoo spotlight celebrates modesty, sincerity and family involvement.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
