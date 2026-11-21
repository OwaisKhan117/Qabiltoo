"use client";

import { useState } from "react";
import { Check, Crown, Gem, HeartHandshake, Infinity as InfinityIcon, Lock, ShieldCheck, Sparkles } from "lucide-react";
import type { View } from "@/lib/qabiltoo/types";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import { PatternOverlay, OrnamentDivider } from "../pattern";
import { BILLING_FAQ, PLAN_SECTIONS, formatINR, perMonth, type Plan, type PlanTheme } from "./plans";
import { PaymentDialog } from "./payment-dialog";
import { useAuthStore } from "@/lib/qabiltoo/store";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ── Plan card theming ─────────────────────────────────────────────────── */

const THEME: Record<
  PlanTheme,
  { card: string; chip: string; price: string; cta: string; durationPill: string }
> = {
  silver: {
    card: "border-slate-300/70 bg-card dark:border-slate-500/40",
    chip: "bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200",
    price: "text-foreground",
    cta: "border border-slate-400/60 bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100",
    durationPill: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  gold: {
    card: "glow-gold border-gold-500/60 bg-gradient-to-b from-gold-50 to-card dark:from-gold-900/20",
    chip: "bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950",
    price: "text-gold-600 dark:text-gold-400",
    cta: "btn-gold-shimmer bg-gold-500 text-charcoal font-semibold hover:bg-gold-400 dark:text-emerald-950",
    durationPill: "bg-gold-500/15 text-gold-700 dark:text-gold-300",
  },
  assisted: {
    card: "border-emerald-700/40 bg-card",
    chip: "bg-gradient-to-r from-emerald-700 to-emerald-600 text-white",
    price: "text-emerald-800 dark:text-emerald-300",
    cta: "bg-emerald-800 text-white font-semibold hover:bg-emerald-700",
    durationPill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  unlimited: {
    card: "",
    chip: "",
    price: "",
    cta: "",
    durationPill: "",
  },
};

const THEME_ICONS: Record<PlanTheme, typeof Gem> = {
  silver: Gem,
  gold: Crown,
  assisted: HeartHandshake,
  unlimited: InfinityIcon,
};

/* ── Duration plan card (Silver / Gold / Assisted) ─────────────────────── */

function PlanCard({ plan, index, onChoose }: { plan: Plan; index: number; onChoose: (p: Plan) => void }) {
  const theme = THEME[plan.theme];
  const Icon = THEME_ICONS[plan.theme];
  const monthly = perMonth(plan);

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <article
        className={cn(
          "relative flex h-full flex-col rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-lg",
          theme.card,
          plan.popular && "lg:scale-[1.04] lg:z-10"
        )}
        aria-label={plan.name}
      >
        {plan.popular && (
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-950 shadow-md">
            Most Popular
          </span>
        )}

        <div className="mb-4 flex items-center justify-between gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", theme.chip)}>
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {plan.shortName}
          </span>
          <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", theme.durationPill)}>
            {plan.duration}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-display text-4xl font-bold", theme.price)}>₹{formatINR(plan.price)}</span>
          <span className="text-sm text-muted-foreground">/ {plan.durationMonths} months</span>
        </div>
        <div className="mt-1.5 min-h-5 text-xs text-muted-foreground">
          {monthly !== null ? (
            <span>
              That&apos;s about ₹{formatINR(monthly)} per month —{" "}
              <span className="font-medium text-gold-700 dark:text-gold-300">
                {formatINR(plan.price)} billed once
              </span>
            </span>
          ) : (
            "Billed once"
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>

        {/* Features */}
        <ul className="mt-5 flex-1 space-y-2.5" aria-label={`${plan.name} features`}>
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-6 pt-2">
          <Button size="lg" className={cn("w-full", theme.cta)} onClick={() => onChoose(plan)}>
            Choose {plan.shortName}
          </Button>
        </div>
      </article>
    </Reveal>
  );
}

/* ── Unlimited plan card (full-width, premium) ─────────────────────────── */

function UnlimitedCard({ plan, onChoose }: { plan: Plan; onChoose: (p: Plan) => void }) {
  return (
    <Reveal>
      <article
        className="relative overflow-hidden rounded-3xl border border-gold-500/50 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-6 text-white shadow-xl shadow-emerald-900/20 sm:p-10"
        aria-label={plan.name}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
          {/* Left: name + price */}
          <div className="lg:w-[38%] lg:shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-950">
              <InfinityIcon className="h-3.5 w-3.5" aria-hidden />
              Best Value · No Expiry
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{plan.name}</h3>
            <p className="mt-1 text-sm font-medium text-gold-300">{plan.duration}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{plan.tagline}</p>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-gold-300">₹{formatINR(plan.price)}</span>
              <span className="text-sm text-white/70">one-time</span>
            </div>
            <p className="mt-1 text-xs text-white/60">Never renews — active until you find your match.</p>
            <Button
              size="lg"
              className="btn-gold-shimmer mt-6 w-full bg-gold-500 font-bold text-emerald-950 hover:bg-gold-400 sm:w-auto sm:px-10"
              onClick={() => onChoose(plan)}
            >
              Activate Unlimited
            </Button>
          </div>

          {/* Right: features in two columns */}
          <ul className="grid flex-1 gap-x-6 gap-y-3 sm:grid-cols-2" aria-label={`${plan.name} features`}>
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 rounded-xl border border-gold-500/20 bg-white/5 px-4 py-3 text-sm text-white/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

/* ── View ──────────────────────────────────────────────────────────────── */

export function PricingView({ navigate }: { navigate: (v: View) => void }) {
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const user = useAuthStore((s) => s.user);

  const choosePlan = (plan: Plan) => {
    if (!user) {
      toast({
        title: "Create your free account first",
        description: "It takes two minutes — then choose any membership to unlock chat and contact details.",
      });
      navigate({ name: "register" });
      return;
    }
    setSelectedPlan(plan);
    setPayDialogOpen(true);
  };

  return (
    <div className="bg-background">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-6xl px-4 pt-14 sm:pt-20">
          <SectionHeading
            arabic="الخطط"
            eyebrow="Membership"
            title="Choose your path to nikah"
            description="Begin free — always. When your search becomes serious, pick a duration: three months, six months, or unlimited until you find your match, insha'Allah."
          />
          <Reveal delay={0.15} className="mt-8 flex justify-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-card px-5 py-2.5 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-gold-500" aria-hidden />
              Every account starts free — browsing and proposals need no card.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Plan sections ────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:pb-20" aria-label="Membership plans">
        {PLAN_SECTIONS.map((section, si) => (
          <div
            key={section.id}
            id={section.id}
            className={cn("scroll-mt-24", si > 0 && "mt-16 border-t border-border/60 pt-14 sm:mt-20")}
          >
            <Reveal delay={0.05}>
              <div className="mb-8 text-center">
                <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {section.title}
                </h2>
                <OrnamentDivider className="mt-3" />
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{section.caption}</p>
              </div>
            </Reveal>

            {section.plans.length === 1 ? (
              <UnlimitedCard plan={section.plans[0]} onChoose={choosePlan} />
            ) : (
              <div className="grid items-stretch gap-5 pt-2 md:grid-cols-3 md:gap-6 lg:gap-7">
                {section.plans.map((plan, i) => (
                  <PlanCard key={plan.id} plan={plan} index={i} onChoose={choosePlan} />
                ))}
              </div>
            )}
          </div>
        ))}

        <Reveal delay={0.15}>
          <p className="mt-12 text-center text-xs text-muted-foreground">
            All memberships include verified badges, our moderation team&apos;s duaa for your search and secure
            payments. Prices in INR, inclusive of taxes · Cancel anytime ·{" "}
            <span className="inline-flex items-center gap-1">
              <Lock className="inline h-3 w-3" aria-hidden /> Card details never touch our servers
            </span>
          </p>
        </Reveal>
      </section>

      {/* ── Trust strip ──────────────────────────────────── */}
      <section className="border-y border-gold-500/15 bg-cream/60 py-8 dark:bg-emerald-950/40" aria-label="Payment trust">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            7-day full refund, no questions asked
          </span>
          <span className="inline-flex items-center gap-2">
            <Crown className="h-4 w-4 text-gold-600 dark:text-gold-400" aria-hidden />
            Verification badges are always free — earned, never sold
          </span>
          <span className="inline-flex items-center gap-2">
            <Gem className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            Every paid plan unlocks chat with unlimited members
          </span>
        </div>
      </section>

      {/* ── Billing FAQ ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream/60 py-14 dark:bg-emerald-950/40 sm:py-20" aria-labelledby="billing-faq-heading">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-3xl px-4">
          <h2 id="billing-faq-heading" className="text-center font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Billing questions, answered
          </h2>
          <OrnamentDivider className="mt-4" />
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="mt-8 space-y-3">
              {BILLING_FAQ.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`faq-${i}`}
                  className="rounded-xl border border-gold-500/15 bg-card px-5 last:border-b"
                >
                  <AccordionTrigger className="text-left text-[15px] font-semibold text-foreground hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ── Payment dialog ───────────────────────────────── */}
      <PaymentDialog plan={selectedPlan} open={payDialogOpen} onOpenChange={setPayDialogOpen} />
    </div>
  );
}
