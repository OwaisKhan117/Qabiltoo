"use client";

import Image from "next/image";
import type { View } from "@/lib/qabiltoo/types";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import { LightMotes } from "../shared/light-motes";
import { OrnamentDivider, PatternOverlay } from "../pattern";
import {
  BadgeCheck,
  Bell,
  EyeOff,
  HeartHandshake,
  Lock,
  MessageCircleHeart,
  MoonStar,
  Scale,
  ScrollText,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

/* ── Section building blocks ──────────────────────────────── */

interface Pillar {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
}

function EditorialSection({
  id,
  arabic,
  eyebrow,
  title,
  intro,
  pillars,
  tinted = false,
  reverse = false,
}: {
  id: string;
  arabic?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  pillars: Pillar[];
  tinted?: boolean;
  reverse?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={tinted ? "relative overflow-hidden bg-cream/60 py-14 dark:bg-emerald-950/40 sm:py-20" : "py-14 sm:py-20"}
    >
      {tinted && <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />}
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionHeading
          align="center"
          arabic={arabic}
          eyebrow={eyebrow}
          title={title}
          description={intro}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} direction={reverse ? "right" : "up"} className="h-full">
              <article className="h-full rounded-2xl border border-gold-500/15 bg-card p-6 transition-colors duration-300 hover:border-gold-500/40">
                <span
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800/10 text-emerald-800 dark:bg-emerald-100/10 dark:text-emerald-300"
                  aria-hidden
                >
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── View ─────────────────────────────────────────────────── */

export function ApproachView({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="bg-background">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14" aria-labelledby="approach-heading">
        <Reveal direction="scale">
          <div className="relative h-72 overflow-hidden rounded-3xl sm:h-80">
            <Image
              src="/images/mosque-golden.png"
              alt="Mosque silhouette glowing at golden hour"
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/30 to-transparent" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center sm:p-10">
              <p className="font-arabic text-2xl text-gold-300" aria-hidden>منهجنا</p>
              <h1 id="approach-heading" className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
                Our Islamic Approach
              </h1>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Qabiltoo was not built to be another app. It was built as an amanah — a trust — for families
              who want the search for nikah to remain dignified, guarded and pleasing to Allah. Every
              feature you see began with one question:{" "}
              <span className="font-medium text-foreground">&ldquo;Would we be comfortable with this in front of our parents?&rdquo;</span>
            </p>
            <OrnamentDivider className="mt-8" />
          </div>
        </Reveal>
      </section>

      {/* ── Why Qabiltoo exists ──────────────────────────── */}
      <EditorialSection
        id="why"
        tinted
        arabic="لماذا"
        eyebrow="Why we exist"
        title="The marriage crisis in our ummah"
        pillars={[
          {
            icon: HeartHandshake,
            title: "A sacred bond, treated casually",
            body: "Marriage is half of our deen, yet most platforms treat it like a pastime. Profiles become products, and people become profiles to scroll past. That mindset harms hearts on both sides.",
          },
          {
            icon: Scale,
            title: "Apps that feel like dating markets",
            body: "Swipe-based design rewards appearance, not character. It encourages secrecy, prolonged talking without purpose, and decisions made without families — everything our tradition advises against.",
          },
          {
            icon: Users,
            title: "Families pushed to the side",
            body: "Our mothers, fathers and walis carry decades of wisdom about compatibility and character. When they are excluded, the search gets lonelier and the decisions get riskier. We built Qabiltoo to bring them back to the centre.",
          },
        ]}
      />

      {/* ── Halal by design ──────────────────────────────── */}
      <EditorialSection
        id="halal"
        arabic="حلال"
        eyebrow="Halal by design"
        title="Proposals, not swipes"
        intro="Halal here is not a label we add to the marketing — it is how the product itself works. The mechanics of Qabiltoo are the manners of our tradition, translated into software."
        pillars={[
          {
            icon: MessageCircleHeart,
            title: "Proposals, not swipes",
            body: "There is no swipe, no like, no hot-or-not. You send a considered proposal with a respectful message; the person and their family consider it with equal seriousness. Deliberateness is the design.",
          },
          {
            icon: UserRound,
            title: "Family-first architecture",
            body: "Guardian dashboards, wali contact cards and family-visible verification mean a proposal can be reviewed the traditional way — together. Conversations open only after proposals are accepted, with both families aware.",
          },
          {
            icon: ScrollText,
            title: "No casual language, ever",
            body: "You will never see flirty prompts, relationship statuses or casual dating vocabulary here. Our templates, reminders and even error messages are written with adab, because words shape intentions.",
          },
        ]}
        reverse
      />

      {/* ── Privacy first ────────────────────────────────── */}
      <EditorialSection
        id="privacy"
        tinted
        arabic="خصوصية"
        eyebrow="Privacy first"
        title="Modesty is protected by default"
        intro="A Muslim's data and dignity deserve the same protection as their photos. On Qabiltoo, privacy is not a premium feature — it is the starting condition for everyone."
        pillars={[
          {
            icon: EyeOff,
            title: "Photos stay blurred",
            body: "Profile photos are frosted and locked from public view. They unblur only for the person you accepted — after a proposal is accepted, never before. Modesty should never cost you a match.",
          },
          {
            icon: Users,
            title: "Guardian visibility",
            body: "A parent or wali can be linked to your account to shortlist, review and coordinate — with permissions you control. You decide what they see; nothing is shared behind your back.",
          },
          {
            icon: Lock,
            title: "Data dignity",
            body: "We do not sell, scrape or ad-target your data — your search for a spouse is nobody's business but your family's. Contact details stay masked until families choose to share them.",
          },
        ]}
      />

      {/* ── Verified trust ───────────────────────────────── */}
      <EditorialSection
        id="verified"
        arabic="الأمانة"
        eyebrow="Verified trust"
        title="Trust you can see on every profile"
        intro="Sincerity is invisible to an algorithm but visible to a human being. That is why every badge on Qabiltoo is earned through real review, never purchased."
        pillars={[
          {
            icon: BadgeCheck,
            title: "Three tiers of verification",
            body: "ID Verified, Verified & Active, and Premium Verified — each tier means a deeper level of scrutiny, shown openly on the profile so your family can weigh trust for itself.",
          },
          {
            icon: ShieldCheck,
            title: "Human review, not just software",
            body: "Documents, references and activity are reviewed by trained moderators from our community. Software assists; people decide — because mercy and context are human qualities.",
          },
          {
            icon: Scale,
            title: "A trust score with integrity",
            body: "Scores grow through verification, completeness and consistent sincere behaviour. They cannot be bought, boosted or gamed — which is exactly what makes them worth reading.",
          },
        ]}
        reverse
      />

      {/* ── Moderation philosophy ────────────────────────── */}
      <EditorialSection
        id="moderation"
        tinted
        arabic="المراقبة"
        eyebrow="Our moderation philosophy"
        title="Gentle reminders before penalties"
        intro="Moderation in an Islamic community should feel like an elder's advice, not a bouncer at a door. We correct with mercy first, and reserve firmness for genuine harm."
        pillars={[
          {
            icon: ScrollText,
            title: "Etiquette reminders first",
            body: "A disrespectful message usually earns a gentle reminder about adab — most people respond to being reminded with sincerity. Penalties are a last resort, not a first reflex.",
          },
          {
            icon: Bell,
            title: "Reports handled within 24 hours",
            body: "Every report is read by a human within a day. Safety concerns — especially from sisters — are prioritised above everything else in our queue, and we close the loop with the reporter personally.",
          },
          {
            icon: MoonStar,
            title: "Firm on harm, soft on mistakes",
            body: "Fraud, harassment and fake profiles are removed permanently and without hesitation. But an awkward first message or an honest mistake is met with guidance, not a ban.",
          },
        ]}
      />

      {/* ── Commitment (Quran banner) ────────────────────── */}
      <section aria-label="Our commitment" className="pb-14 sm:pb-20">
        <div className="mx-auto max-w-5xl px-4">
          <Reveal direction="scale">
            <figure className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-8 text-center sm:p-12">
              <PatternOverlay className="text-gold-400/10" />
              <LightMotes className="absolute inset-0" count={18} />
              <p className="relative font-arabic text-xl text-gold-300/90" aria-hidden>عهدنا</p>
              <blockquote className="relative mt-2">
                <p className="font-arabic text-2xl leading-loose text-gold-200 sm:text-3xl">
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
                </p>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  &ldquo;And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.&rdquo;
                </p>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
                  Surah Ar-Rum · 30:21 — the verse Qabiltoo was built upon
                </figcaption>
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="px-4 pb-16 sm:pb-24" aria-labelledby="approach-cta">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="approach-cta" className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            If this is the search you want, begin it properly
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Create your profile tonight, involve your family this week, and let the search for nikah
            finally feel like ibadah.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="btn-gold-shimmer px-8 font-semibold" onClick={() => navigate({ name: "register" })}>
              Begin with Bismillah
            </Button>
            <Button size="lg" variant="outline" className="px-8" onClick={() => navigate({ name: "trust" })}>
              See our trust system
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
