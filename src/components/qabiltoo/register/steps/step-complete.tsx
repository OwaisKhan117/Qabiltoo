"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gem, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LightMotes } from "../../shared/light-motes";
import type { OnboardingData } from "../onboarding";
import type { View } from "@/lib/qabiltoo/types";

const NEXT_STEPS = [
  {
    icon: ShieldCheck,
    title: "ID reviewed within 24 hours",
    body: "Our team confirms your document privately, then your blue badge appears.",
  },
  {
    icon: Sparkles,
    title: "Your profile appears in Discover",
    body: "Serious members and families can then find you and view your details.",
  },
  {
    icon: HeartHandshake,
    title: "Families may send proposals",
    body: "You decide who to accept — every conversation begins with intention.",
  },
] as const;

/** Step 8 — Completion: gold light rays + motes (no confetti) */
export function StepComplete({ data, navigate }: { data: OnboardingData; navigate: (v: View) => void }) {
  const firstName = data.fullName.trim().split(/\s+/)[0] || "friend";
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="step-complete-h"
      className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-card px-6 py-14 text-center shadow-xl shadow-gold-500/10 sm:px-10"
    >
      {/* Rotating gold rays + floating motes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div
          className="absolute left-1/2 top-16 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(212,175,55,0.16) 0deg 7deg, transparent 7deg 20deg)",
            maskImage: "radial-gradient(closest-side, black 15%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(closest-side, black 15%, transparent 72%)",
          }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        />
        <LightMotes className="absolute inset-0" count={28} />
      </div>

      <div className="relative">
        <motion.div
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="glow-gold mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-500/40"
        >
          <Gem className="h-8 w-8 text-white" aria-hidden />
        </motion.div>

        <p className="mt-6 font-arabic text-2xl leading-relaxed text-gold-600 dark:text-gold-300" aria-hidden>
          بارك الله فيك
        </p>
        <h2 id="step-complete-h" className="mt-1 font-display text-2xl font-bold sm:text-3xl">
          Barakallahu feek, {firstName}!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Your profile is complete and under review. May Allah write for you what is best and
          unite you with a spouse who brings coolness to your eyes.
        </p>

        <ul className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-3">
          {NEXT_STEPS.map((s) => (
            <li key={s.title} className="rounded-2xl border border-border bg-background/60 p-4">
              <s.icon className="h-4 w-4 text-gold-600 dark:text-gold-300" aria-hidden />
              <p className="mt-2 text-[13px] font-semibold leading-snug">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="btn-gold-shimmer rounded-full px-8"
            onClick={() =>
              navigate({ name: "browse", gender: data.gender === "female" ? "male" : "female" })
            }
          >
            Discover Profiles <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8"
            onClick={() => navigate({ name: "trust" })}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden /> Complete Trust Centre
          </Button>
        </div>
      </div>
    </section>
  );
}
