"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { Check, Crown, Gem, Sparkles, X } from "lucide-react";
import type { View } from "@/lib/qabiltoo/types";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import { PatternOverlay, OrnamentDivider } from "../pattern";
import { BILLING_FAQ, BILLING_META, COMPARISON, PLANS, perMonthPrice, totalPrice, type BillingPeriod, type Cell, type Plan } from "./plans";
import { PaymentDialog } from "./payment-dialog";
import { cn } from "@/lib/utils";

/* ── Animated price number ────────────────────────────────── */

function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    if (from === value) return;
    prev.current = value;
    const controls = animate(from, value, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return <motion.span key={value}>{display.toLocaleString("en-IN")}</motion.span>;
}

/* ── Billing toggle ───────────────────────────────────────── */

function BillingToggle({ period, onChange }: { period: BillingPeriod; onChange: (p: BillingPeriod) => void }) {
  const periods: BillingPeriod[] = ["monthly", "quarterly", "annual"];
  return (
    <div
      role="tablist"
      aria-label="Billing period"
      className="mx-auto inline-flex items-center gap-1 rounded-full border border-gold-500/25 bg-card p-1 shadow-sm"
    >
      {periods.map((p) => {
        const active = period === p;
        return (
          <button
            key={p}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(p)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 sm:px-5",
              active ? "text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-700"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {BILLING_META[p].label}
              {BILLING_META[p].saveChip && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-gold-400/90 text-emerald-950" : "bg-gold-500/15 text-gold-700 dark:text-gold-300"
                  )}
                >
                  {BILLING_META[p].saveChip}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Cell icon for matrix ─────────────────────────────────── */

function MatrixCell({ cell }: { cell: Cell }) {
  if (cell.kind === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
        <Check className="h-4 w-4" aria-hidden />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (cell.kind === "no") {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground/50">
        <X className="h-4 w-4" aria-hidden />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return <span className="text-xs font-medium text-foreground/80">{cell.value}</span>;
}

/* ── Plan card theming ────────────────────────────────────── */

const THEME = {
  free: {
    card: "border-border bg-card",
    chip: "bg-muted text-muted-foreground",
    price: "text-foreground",
    cta: "border border-emerald-700/40 bg-transparent text-emerald-800 hover:bg-emerald-700 hover:text-white dark:text-emerald-300",
  },
  silver: {
    card: "border-slate-300/70 bg-card dark:border-slate-500/40",
    chip: "bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200",
    price: "text-foreground",
    cta: "border border-slate-400/60 bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100",
  },
  gold: {
    card: "glow-gold border-gold-500/60 bg-gradient-to-b from-gold-50 to-card dark:from-gold-900/20",
    chip: "bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950",
    price: "text-gold-600 dark:text-gold-400",
    cta: "btn-gold-shimmer text-emerald-950 font-semibold",
  },
  platinum: {
    card: "border-blush-400/60 bg-gradient-to-b from-blush-50 to-card dark:from-blush-900/20",
    chip: "bg-gradient-to-r from-blush-500 to-blush-600 text-white",
    price: "text-blush-700 dark:text-blush-300",
    cta: "bg-gradient-to-r from-blush-500 to-blush-600 font-semibold text-white hover:from-blush-600 hover:to-blush-700",
  },
} as const;

const THEME_ICONS = {
  free: Sparkles,
  silver: Gem,
  gold: Crown,
  platinum: Crown,
} as const;

/* ── View ─────────────────────────────────────────────────── */

export function PricingView({ navigate }: { navigate: (v: View) => void }) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const openCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
    setPayDialogOpen(true);
  };

  return (
    <div className="bg-background">
      {/* ── Hero + toggle ────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <PatternOverlay className="text-gold-600/5 dark:text-gold-400/5" />
        <div className="relative mx-auto max-w-6xl px-4 pt-14 sm:pt-20">
          <SectionHeading
            arabic="الخطط"
            eyebrow="Membership"
            title="Choose your path to nikah"
            description="Begin free — always. When your search becomes serious, a membership gives your family deeper filters, fuller visibility and our fastest verification."
          />
          <Reveal delay={0.1} className="flex justify-center">
            <BillingToggle period={period} onChange={setPeriod} />
          </Reveal>
        </div>
      </section>

      {/* ── Plan cards ───────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:pb-20" aria-label="Membership plans">
        <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan, i) => {
            const theme = THEME[plan.theme];
            const Icon = THEME_ICONS[plan.theme];
            const monthly = perMonthPrice(plan.basePrice, period);
            const total = totalPrice(plan.basePrice, period);
            const showEquivalent = plan.basePrice > 0 && period !== "monthly";

            return (
              <Reveal key={plan.tier} delay={i * 0.1} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-lg",
                    theme.card,
                    plan.featured && "xl:scale-105 xl:z-10"
                  )}
                >
                  {plan.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-950 shadow-md">
                      Recommended
                    </span>
                  )}

                  <div className="mb-4 flex items-center justify-between">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", theme.chip)}>
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                      {plan.name}
                    </span>
                    <span className="font-arabic text-lg text-gold-600/70 dark:text-gold-400/70" aria-hidden>
                      {plan.arabic}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn("font-display text-4xl font-bold", theme.price)}>
                      ₹<AnimatedPrice value={monthly} />
                    </span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  <div className="mt-1.5 min-h-5 text-xs text-muted-foreground">
                    {showEquivalent ? (
                      <span>
                        Billed ₹{total.toLocaleString("en-IN")} every {BILLING_META[period].months} months
                        {BILLING_META[period].saveChip ? (
                          <span className="ml-1.5 rounded-full bg-gold-500/15 px-1.5 py-0.5 text-[10px] font-bold text-gold-700 dark:text-gold-300">
                            {BILLING_META[period].saveChip}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      plan.basePrice === 0 ? "Free forever — no card required" : "Billed monthly, cancel anytime"
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>

                  {/* Highlights */}
                  <ul className="mt-5 flex-1 space-y-2.5" aria-label={`${plan.name} features`}>
                    {plan.highlights.map((h) => (
                      <li
                        key={h.label}
                        className={cn(
                          "flex items-start gap-2 text-sm",
                          h.included ? "text-foreground/90" : "text-muted-foreground/50"
                        )}
                      >
                        {h.included ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                        ) : (
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" aria-hidden />
                        )}
                        <span>{h.label}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-6 pt-2">
                    {plan.basePrice === 0 ? (
                      <Button
                        size="lg"
                        variant="outline"
                        className={cn("w-full", theme.cta)}
                        onClick={() => navigate({ name: "register" })}
                      >
                        Begin Free
                      </Button>
                    ) : (
                      <Button size="lg" className={cn("w-full", theme.cta)} onClick={() => openCheckout(plan)}>
                        Choose {plan.name.split(" ")[0]}
                      </Button>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-xs text-muted-foreground">
            All memberships include free guardian access, verified badges and our moderation team&apos;s duaa for your search.
            Prices in INR, inclusive of taxes.
          </p>
        </Reveal>
      </section>

      {/* ── Comparison matrix (desktop only — cards stack on mobile) ── */}
      <section className="hidden pb-16 lg:block" aria-label="Feature comparison">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="mb-6 text-center font-display text-2xl font-semibold text-foreground">
              Compare every detail
            </h2>
            <div className="overflow-hidden rounded-2xl border border-gold-500/20 bg-card shadow-sm">
              <table className="w-full text-sm">
                <caption className="sr-only">Membership feature comparison across Free, Silver, Gold and Platinum</caption>
                <thead>
                  <tr className="border-b border-gold-500/20 bg-cream/60 dark:bg-emerald-950/40">
                    <th scope="col" className="px-5 py-4 text-left font-display text-base font-semibold text-foreground">
                      Feature
                    </th>
                    {PLANS.map((plan, idx) => (
                      <th
                        key={plan.tier}
                        scope="col"
                        className={cn(
                          "px-4 py-4 text-center font-display text-base font-semibold",
                          idx < 2 ? "text-muted-foreground" : "text-foreground",
                          plan.featured && "text-gold-600 dark:text-gold-400"
                        )}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="border-b border-border/60 last:border-0">
                      <th scope="row" className="px-5 py-3.5 text-left font-medium text-foreground/90">
                        {row.feature}
                      </th>
                      {row.cells.map((cell, idx) => (
                        <td
                          key={idx}
                          className={cn(
                            "px-4 py-3.5 text-center",
                            idx < 2 ? "opacity-60" : "",
                            row.premium && cell.kind === "yes" && "bg-gold-500/[0.04]"
                          )}
                        >
                          <MatrixCell cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
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
      <PaymentDialog plan={selectedPlan} period={period} open={payDialogOpen} onOpenChange={setPayDialogOpen} />
    </div>
  );
}
