"use client";

import Image from "next/image";
import type { View } from "@/lib/qabiltoo/types";
import { VERIFICATION_TIER_META, type VerificationTier } from "@/lib/qabiltoo/types";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "../shared/section-heading";
import { VerificationBadge } from "../shared/verification-badge";
import { TrustRing } from "../shared/trust-ring";
import { Reveal } from "../shared/reveal";
import { LightMotes } from "../shared/light-motes";
import { PatternOverlay } from "../pattern";
import {
  BadgeCheck,
  BookOpen,
  Camera,
  Check,
  ClipboardCheck,
  FileCheck,
  Gem,
  HeartHandshake,
  Hourglass,
  MessageCircleHeart,
  MoonStar,
  ScrollText,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

/* ── 3-tier badge system data ─────────────────────────────── */

interface TierCardData {
  tier: VerificationTier;
  icon: typeof BadgeCheck;
  requirements: string[];
  howToEarn: string;
}

const TIER_CARDS: TierCardData[] = [
  {
    tier: "blue",
    icon: FileCheck,
    requirements: [
      "Government-issued photo ID (Aadhaar, passport or licence)",
      "Name and date of birth match your profile",
      "Document reviewed by a human moderator",
    ],
    howToEarn: "Upload any accepted ID document from your profile settings. Most reviews complete within 24 hours.",
  },
  {
    tier: "green",
    icon: ClipboardCheck,
    requirements: [
      "Everything in ID Verified",
      "Profile completeness above 80%",
      "Recent, respectful activity reviewed by our team",
      "No open reports against the profile",
    ],
    howToEarn: "Stay sincerely active — complete your profile, respond to proposals with dignity, and keep your record clean. Our team reviews accounts weekly.",
  },
  {
    tier: "gold",
    icon: Gem,
    requirements: [
      "Everything in Verified & Active",
      "Education or employment documents submitted",
      "Character references from family or community",
      "Guardian (wali) details confirmed",
    ],
    howToEarn: "Request Premium Verification from your profile. Our team will call your references and confirm your documents — families can then trust your profile completely.",
  },
];

/* ── Trust score examples ─────────────────────────────────── */

const TRUST_EXAMPLES = [
  { value: 45, label: "Getting started", note: "Profile created, exploring the platform" },
  { value: 78, label: "Growing trust", note: "ID verified, profile nearly complete" },
  { value: 96, label: "Fully trusted", note: "Gold tier — everything vetted and confirmed" },
];

const SCORE_FACTORS = [
  {
    icon: FileCheck,
    title: "ID verification",
    detail: "Verifying your identity adds the largest single boost to your score.",
  },
  {
    icon: ClipboardCheck,
    title: "Profile completeness",
    detail: "Faith, family background and partner preferences — every completed section counts.",
  },
  {
    icon: Camera,
    title: "Profile photo",
    detail: "A modest, respectful photo (blurred publicly anyway) signals sincerity.",
  },
  {
    icon: Users,
    title: "Wali / guardian details",
    detail: "Including your wali's contact shows family-first intentions.",
  },
  {
    icon: UserCheck,
    title: "Consistent activity",
    detail: "Regular, respectful participation is reviewed and rewarded.",
  },
];

/* ── Islamic etiquette guidelines ─────────────────────────── */

const ETIQUETTE = [
  {
    icon: HeartHandshake,
    title: "Begin with intention (niyyah)",
    body: "Before anything else, sit with your intention. You are here seeking a companion for the sake of Allah — not entertainment, not validation. When your niyyah is sincere, every step that follows becomes easier to keep halal.",
  },
  {
    icon: Users,
    title: "Involve your family early",
    body: "The Prophet ﷺ taught that marriage blessed by families carries tranquillity. Share your search with your parents or wali from the start — their wisdom protects you, and their approval opens doors you cannot open alone.",
  },
  {
    icon: MessageCircleHeart,
    title: "Communicate with dignity",
    body: "Speak as you would in front of your elders. Keep conversations purposeful, modest and kind — there is no need for late-night chats or flirtation. When both sides communicate with adab, families can trust what is growing.",
  },
  {
    icon: BadgeCheck,
    title: "Be honest in your profile",
    body: "Write your age, deen, career and circumstances truthfully. A match built on accuracy is a mercy; one built on embellishment cracks at the first family meeting. Trust is the real currency here — guard yours.",
  },
  {
    icon: MoonStar,
    title: "Pray istikhara",
    body: "When a proposal feels promising, pray two rakah and ask Allah to place good in it — then look for the doors that open and close. Our elders made every big decision this way, and their marriages lasted a lifetime.",
  },
  {
    icon: Hourglass,
    title: "Be patient — sabr",
    body: "The right proposal may take weeks or months, and silence is not rejection. Allah's timing is perfect; use this season to grow in your deen and character. What is written for you will never miss you.",
  },
];

/* ── View ─────────────────────────────────────────────────── */

export function TrustView({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="bg-background">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">
        <PatternOverlay className="text-gold-400/10" />
        <LightMotes className="absolute inset-0" count={26} />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <SectionHeading
            dark
            arabic="الأمانة"
            eyebrow="Trust & Verification"
            title="Trust is our foundation"
            description="Marriage is too important to leave to strangers. Every profile on Qabiltoo passes through a human review process, every badge is earned — never bought — and every family can see exactly how much a profile has been verified."
            className="max-w-3xl"
          />
          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-300" aria-hidden />
                Human-moderated
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <ScrollText className="h-3.5 w-3.5 text-gold-300" aria-hidden />
                Islamic etiquette enforced
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-gold-300" aria-hidden />
                Badges earned, never bought
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3-tier badge system ──────────────────────────── */}
      <section className="relative py-14 sm:py-20" aria-labelledby="tiers-heading">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            arabic="التحقق"
            eyebrow="Three tiers of trust"
            title="Verification badges, explained"
            description="Look for these badges on every profile. Each tier means a deeper level of human review — so your family can decide with confidence."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {TIER_CARDS.map((card, i) => {
              const meta = VERIFICATION_TIER_META[card.tier];
              return (
                <Reveal key={card.tier} delay={i * 0.12} className="h-full">
                  <article
                    className="glass-card relative flex h-full flex-col rounded-2xl border p-6"
                    style={{ borderColor: `${meta.color}33` }}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <VerificationBadge tier={card.tier} showLabel glow iconSize={34} className="!px-4 !py-2 !text-base" />
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ background: meta.bg, color: meta.color }}
                        aria-hidden
                      >
                        <card.icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{meta.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{meta.description}</p>

                    <ul className="mt-5 space-y-2.5" aria-label={`${meta.label} requirements`}>
                      {card.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-sm text-foreground/85">
                          <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: meta.color }} aria-hidden />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-5">
                      <p className="rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground">How to earn it: </span>
                        {card.howToEarn}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust score ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream/60 py-14 dark:bg-emerald-950/40 sm:py-20" aria-labelledby="score-heading">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-6xl px-4">
          <SectionHeading
            arabic="الثقة"
            eyebrow="Trust score"
            title="One number your family can read at a glance"
            description="Every profile carries a Trust Score from 0–100 — a living measure of verification, completeness and sincere activity. Here is how it grows:"
          />

          <div className="grid gap-6 sm:grid-cols-3">
            {TRUST_EXAMPLES.map((ex, i) => (
              <Reveal key={ex.value} delay={i * 0.14} direction="scale" className="flex flex-col items-center text-center">
                <TrustRing value={ex.value} size={148}>
                  <span className="font-display text-3xl font-semibold text-foreground">{ex.value}</span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Trust Score</span>
                </TrustRing>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{ex.label}</h3>
                <p className="mt-1 max-w-56 text-sm text-muted-foreground">{ex.note}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mx-auto mt-12 max-w-3xl">
              <h3 className="mb-4 text-center font-display text-lg font-semibold text-foreground">What raises your score</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {SCORE_FACTORS.map((f) => (
                  <li key={f.title} className="flex items-start gap-3 rounded-xl border border-gold-500/15 bg-card p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400" aria-hidden>
                      <f.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{f.detail}</p>
                    </div>
                  </li>
                ))}
                <li className="flex items-center gap-3 rounded-xl border border-gold-500/15 bg-gradient-to-r from-gold-500/10 to-transparent p-4">
                  <Check className="h-5 w-5 shrink-0 text-gold-600 dark:text-gold-400" aria-hidden />
                  <p className="text-sm font-medium text-foreground">
                    Higher score = earlier ranking in Discover, and more family confidence in your proposals.
                  </p>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Quran quote banner ───────────────────────────── */}
      <section aria-label="Quran 30:21">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <Reveal direction="scale">
            <figure className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-8 text-center sm:p-12">
              <PatternOverlay className="text-gold-400/10" />
              <LightMotes className="absolute inset-0" count={18} />
              <blockquote className="relative">
                <p className="font-arabic text-2xl leading-loose text-gold-200 sm:text-3xl">
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
                </p>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  &ldquo;And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.&rdquo;
                </p>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
                  Surah Ar-Rum · 30:21
                </figcaption>
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Islamic etiquette guidelines ─────────────────── */}
      <section className="py-14 sm:py-20" aria-labelledby="etiquette-heading">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            arabic="الأدب"
            eyebrow="Islamic etiquette"
            title="Our community guidelines"
            description="Six gentle reminders we ask every member to carry with them. Moderators enforce these with warmth first — reminders before penalties."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ETIQUETTE.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08} className="h-full">
                <article className="group h-full rounded-2xl border border-gold-500/15 bg-card p-6 transition-colors duration-300 hover:border-gold-500/40">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 transition-transform duration-300 group-hover:scale-110 dark:text-gold-400" aria-hidden>
                    <g.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────── */}
      <section className="px-4 pb-16 sm:pb-24" aria-labelledby="trust-cta">
        <Reveal className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/images/mosque-golden.png"
              alt="Mosque silhouette at golden hour"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-emerald-950/70" aria-hidden />
            <div className="relative flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="font-arabic text-lg text-gold-300" aria-hidden>خطوة أولى</p>
                <h2 id="trust-cta" className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  Begin your verified journey
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                  Create your free profile, verify your ID within 24 hours, and let families see the sincerity you carry.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button size="lg" className="btn-gold-shimmer font-semibold" onClick={() => navigate({ name: "register" })}>
                  Start free & get verified
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  onClick={() => navigate({ name: "info", page: "faq" })}
                >
                  Read the FAQ
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
