"use client";

import { motion } from "framer-motion";
import { BadgeCheck, HeartHandshake, Lock, ShieldCheck, type LucideIcon } from "lucide-react";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";

interface TrustBadge {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const BADGES: TrustBadge[] = [
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    desc: "Every member passes manual ID review before appearing in search.",
  },
  {
    icon: Lock,
    title: "Privacy Protected",
    desc: "Photos blurred, names masked, data never sold — dignity safeguarded.",
  },
  {
    icon: ShieldCheck,
    title: "Guardian Approved",
    desc: "Wali-friendly tools keep families involved from first Salaam to nikah.",
  },
  {
    icon: HeartHandshake,
    title: "Halal Matchmaking",
    desc: "Purposeful introductions with sincere intent for nikah — never casual.",
  },
];

/** Gentle pulse ring behind the icon — slow and dignified */
function PulseRing() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      <motion.span
        className="absolute inset-0 rounded-2xl border border-gold-400/60"
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{ opacity: 0, scale: 1.35 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
      />
      <motion.span
        className="absolute inset-0 rounded-2xl border border-gold-400/40"
        initial={{ opacity: 0.6, scale: 1 }}
        animate={{ opacity: 0, scale: 1.35 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 2.1 }}
      />
    </span>
  );
}

export function TrustBadges() {
  return (
    <section className="py-20 lg:py-28" aria-label="Trust and safety">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          arabic="الأمانة"
          eyebrow="Trust & Safety"
          title="Your trust is our amanah"
          description="Four promises we keep with every family that joins Qabiltoo."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((badge, i) => (
            <Reveal key={badge.title} delay={i * 0.12} duration={0.8} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-xl hover:shadow-gold-500/10">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-200/25 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                  <PulseRing />
                  <span className="float-slow relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-lg shadow-emerald-900/20">
                    <badge.icon className="h-7 w-7 text-gold-300" aria-hidden />
                  </span>
                </span>

                <h3 className="font-display text-lg font-bold text-foreground">{badge.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{badge.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
