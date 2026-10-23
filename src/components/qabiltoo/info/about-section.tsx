"use client";

import type { View } from "@/lib/qabiltoo/types";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import { CountUp } from "../shared/count-up";
import { PatternOverlay } from "../pattern";
import { InfoPageNav } from "./info-page-nav";
import {
  Compass,
  Gem,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

/* ── Values ───────────────────────────────────────────────── */

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Family first",
    body: "Marriage joins two families, not two apps. Every feature — proposals, guardian dashboards, wali cards — is designed for families to decide together.",
  },
  {
    icon: ShieldCheck,
    title: "Trust before growth",
    body: "We would rather verify a thousand profiles by hand than grow faster with fakes. Badges are earned through human review, never purchased.",
  },
  {
    icon: Compass,
    title: "Halal by design",
    body: "No swipes, no casual prompts, no privacy traps. The product's mechanics themselves keep the search dignified — manners written into software.",
  },
  {
    icon: Gem,
    title: "Dignity for every profile",
    body: "Divorced, widowed, late-married, reserved, or simply private — every seeker is treated with the same respect, modesty and warmth.",
  },
];

/* ── Team placeholders ────────────────────────────────────── */

const TEAM = [
  { role: "Founder", initials: "F", note: "Mumbai · product & vision" },
  { role: "CTO", initials: "C", note: "Engineering & privacy" },
  { role: "Head of Trust", initials: "T", note: "Verification & moderation" },
  { role: "Community Lead", initials: "L", note: "Families & success stories" },
];

/* ── View ─────────────────────────────────────────────────── */

export function AboutSection({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="bg-background">
      {/* ── Mission ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-4xl px-4 pt-14 text-center sm:pt-20">
          <SectionHeading
            arabic="عنّا"
            eyebrow="About us"
            title="A matrimonial platform built as an amanah"
            description="Qabiltoo exists for one purpose: to help Muslim families find righteous matches for their sons and daughters — with dignity, involvement and trust. Not engagement metrics, not swipes. Nikah."
          />
          <InfoPageNav page="about" navigate={navigate} />
        </div>
      </section>

      {/* ── Our story ────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-14 sm:pb-16" aria-labelledby="our-story">
        <Reveal>
          <article className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-card p-8 sm:p-10">
            <PatternOverlay className="text-gold-600/[0.06] dark:text-gold-400/[0.06]" />
            <p className="relative font-arabic text-lg text-gold-600/80 dark:text-gold-400/80" aria-hidden>حكايتنا</p>
            <h2 id="our-story" className="relative mt-1 font-display text-2xl font-semibold text-foreground">
              Our story
            </h2>
            <div className="relative mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Qabiltoo began in Mumbai in 2024, around a dining table after a family nikah — where
                four of us, all Muslims frustrated with casual apps, compared notes. One had deleted
                three matrimonial apps in a month. One&apos;s sister had been asked for photos before
                anyone had spoken to her wali. All of us had watched elders lament that finding a spouse
                had stopped feeling like a family&apos;s duaa and started feeling like a marketplace.
              </p>
              <p>
                So we built the thing we wished existed: proposals instead of swipes, blurred photos
                until acceptance, guardians with their own dashboard, verification reviewed by humans
                from our own community — and not a single casual word anywhere in the product.
              </p>
              <p className="font-medium text-foreground">
                We are Muslims first, builders second. Everything on Qabiltoo must be something we
                would gladly show our own mothers — and we mean that literally: our mothers use it.
              </p>
            </div>
          </article>
        </Reveal>
      </section>

      {/* ── Values grid ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream/60 py-14 dark:bg-emerald-950/40 sm:py-16" aria-labelledby="values-heading">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-6xl px-4">
          <h2 id="values-heading" className="text-center font-display text-2xl font-semibold text-foreground sm:text-3xl">
            The values we hold
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="h-full">
                <article className="h-full rounded-2xl border border-gold-500/15 bg-card p-6">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-400" aria-hidden>
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16" aria-label="Qabiltoo by the numbers">
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-8 sm:p-12">
            <dl className="grid gap-8 text-center sm:grid-cols-3">
              {[
                { value: 28, suffix: "", label: "Countries with active families" },
                { value: 400, suffix: "+", label: "Cities represented" },
                { value: 12400, suffix: "+", label: "Families served" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="order-2 mt-2 block text-sm text-white/75">{s.label}</dt>
                  <dd className="order-1 font-display text-4xl font-bold text-gold-300 sm:text-5xl" aria-label={`${s.value}${s.suffix}`}>
                    <CountUp to={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-center text-xs text-white/50">
              Illustrative sample data — live figures shared on request.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Team placeholders ────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24" aria-labelledby="team-heading">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="team-heading" className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            The people behind it
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We keep a low profile so families stay the focus. Names revealed soon, insha&apos;Allah.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((t, i) => (
            <Reveal key={t.role} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col items-center rounded-2xl border border-gold-500/15 bg-card p-6 text-center">
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 font-display text-2xl font-semibold text-gold-300 shadow-inner"
                  aria-hidden
                >
                  {t.initials}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{t.role}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5" aria-hidden />
                  {t.note}
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-3 py-1 text-[11px] font-medium text-gold-700 dark:text-gold-300">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  Announcing soon
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 text-center">
          <p className="font-arabic text-xl text-gold-600/80 dark:text-gold-400/80" aria-hidden>بارك الله فيكم</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            However you begin, may Allah write for you a spouse who is the coolness of your eyes.
          </p>
          <Button size="lg" className="btn-gold-shimmer mt-5 font-semibold" onClick={() => navigate({ name: "register" })}>
            Join Qabiltoo free
          </Button>
        </Reveal>
      </section>
    </div>
  );
}
