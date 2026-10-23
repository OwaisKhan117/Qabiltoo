import type { SubscriptionTier } from "@/lib/qabiltoo/types";

/* ── Billing periods ──────────────────────────────────────── */

export type BillingPeriod = "monthly" | "quarterly" | "annual";

export const BILLING_META: Record<
  BillingPeriod,
  { label: string; discount: number; months: number; saveChip?: string }
> = {
  monthly: { label: "Monthly", discount: 0, months: 1 },
  quarterly: { label: "Quarterly", discount: 0.1, months: 3, saveChip: "Save 10%" },
  annual: { label: "Annual", discount: 0.2, months: 12, saveChip: "Save 20%" },
};

/** Per-month price after the period discount */
export function perMonthPrice(base: number, period: BillingPeriod): number {
  if (base === 0) return 0;
  return Math.round(base * (1 - BILLING_META[period].discount));
}

/** Total charged for the whole billing period */
export function totalPrice(base: number, period: BillingPeriod): number {
  if (base === 0) return 0;
  return Math.round(base * BILLING_META[period].months * (1 - BILLING_META[period].discount));
}

/* ── Plans ────────────────────────────────────────────────── */

export type Cell = { kind: "yes" } | { kind: "no" } | { kind: "text"; value: string };

export interface Plan {
  tier: SubscriptionTier;
  name: string;
  arabic: string;
  basePrice: number;
  tagline: string;
  highlights: { label: string; included: boolean }[];
  theme: "free" | "silver" | "gold" | "platinum";
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    tier: "Free",
    name: "Free",
    arabic: "البداية",
    basePrice: 0,
    tagline: "Browse, discover and take your first sincere steps — always free.",
    theme: "free",
    highlights: [
      { label: "Browse & discover profiles", included: true },
      { label: "5 proposals per month", included: true },
      { label: "Basic search filters", included: true },
      { label: "Profile photos stay blurred", included: true },
      { label: "See who viewed you", included: false },
      { label: "Priority verification", included: false },
    ],
  },
  {
    tier: "Silver",
    name: "Silver",
    arabic: "الفضة",
    basePrice: 499,
    tagline: "For serious seekers who want deeper filters and fuller visibility.",
    theme: "silver",
    highlights: [
      { label: "25 proposals per month", included: true },
      { label: "Advanced faith & sect filters", included: true },
      { label: "See your viewers count", included: true },
      { label: "Profile photos stay blurred", included: true },
      { label: "See exactly who viewed you", included: false },
      { label: "Photo reveals after a match", included: false },
    ],
  },
  {
    tier: "Gold",
    name: "Gold",
    arabic: "الذهب",
    basePrice: 999,
    tagline: "Our most trusted path — unlimited proposals, full transparency.",
    theme: "gold",
    featured: true,
    highlights: [
      { label: "Unlimited proposals", included: true },
      { label: "See exactly who viewed you", included: true },
      { label: "Photo reveals after a match", included: true },
      { label: "Priority verification (24h)", included: true },
      { label: "Elevated placement in Discover", included: true },
      { label: "Dedicated matchmaker", included: false },
    ],
  },
  {
    tier: "Platinum",
    name: "Platinum VIP",
    arabic: "الماسي",
    basePrice: 2499,
    tagline: "White-glove nikah care — a matchmaker walks with your family.",
    theme: "platinum",
    highlights: [
      { label: "Everything in Gold", included: true },
      { label: "Dedicated human matchmaker", included: true },
      { label: "Family coordination service", included: true },
      { label: "Hand-shortlisted proposals", included: true },
      { label: "Guardian briefing calls", included: true },
      { label: "Nikah day planning assistance", included: true },
    ],
  },
];

/* ── Comparison matrix (desktop) ──────────────────────────── */

export interface MatrixRow {
  feature: string;
  cells: [Cell, Cell, Cell, Cell];
  /** Dim this row on lower tiers for emphasis */
  premium?: boolean;
}

export const COMPARISON: MatrixRow[] = [
  {
    feature: "Browse & discover profiles",
    cells: [{ kind: "yes" }, { kind: "yes" }, { kind: "yes" }, { kind: "yes" }],
  },
  {
    feature: "Proposals per month",
    cells: [{ kind: "text", value: "5" }, { kind: "text", value: "25" }, { kind: "text", value: "Unlimited" }, { kind: "text", value: "Unlimited" }],
  },
  {
    feature: "Basic search filters",
    cells: [{ kind: "yes" }, { kind: "yes" }, { kind: "yes" }, { kind: "yes" }],
  },
  {
    feature: "Advanced faith & sect filters",
    cells: [{ kind: "no" }, { kind: "yes" }, { kind: "yes" }, { kind: "yes" }],
    premium: true,
  },
  {
    feature: "Profile photos",
    cells: [
      { kind: "text", value: "Blurred" },
      { kind: "text", value: "Blurred" },
      { kind: "text", value: "After match" },
      { kind: "text", value: "After match" },
    ],
    premium: true,
  },
  {
    feature: "See who viewed you",
    cells: [{ kind: "no" }, { kind: "text", value: "Count only" }, { kind: "text", value: "Full list" }, { kind: "text", value: "Full list" }],
    premium: true,
  },
  {
    feature: "Priority verification",
    cells: [{ kind: "no" }, { kind: "no" }, { kind: "yes" }, { kind: "yes" }],
    premium: true,
  },
  {
    feature: "Elevated placement in Discover",
    cells: [{ kind: "no" }, { kind: "no" }, { kind: "yes" }, { kind: "yes" }],
    premium: true,
  },
  {
    feature: "Dedicated human matchmaker",
    cells: [{ kind: "no" }, { kind: "no" }, { kind: "no" }, { kind: "yes" }],
    premium: true,
  },
  {
    feature: "Family coordination service",
    cells: [{ kind: "no" }, { kind: "no" }, { kind: "no" }, { kind: "yes" }],
    premium: true,
  },
];

/* ── Billing FAQ ──────────────────────────────────────────── */

export const BILLING_FAQ = [
  {
    q: "Can I cancel my membership anytime?",
    a: "Yes — absolutely. Cancel from your profile settings in two taps, and your plan simply does not renew. You keep every feature until the end of the period you paid for, and your profile (with its verification badges and trust score) remains active on the free tier.",
  },
  {
    q: "What is your refund policy?",
    a: "If a technical issue prevented you from using your membership, contact us within 7 days of payment and we will refund it in full, no questions asked. We do not refund unused periods after 7 days, because profiles can pause instead — pause your membership and the remaining days are preserved.",
  },
  {
    q: "What counts as a proposal?",
    a: "A proposal is sent when you express interest in a profile and it is delivered to the person and their family — accepting a proposal or chatting after a mutual acceptance never consumes your quota. Proposals that are declined or expire unanswered are returned to your balance at the start of each month.",
  },
  {
    q: "Is Gold really worth it?",
    a: "Gold members send unlimited proposals, see exactly who viewed them, and get priority verification — usually the difference between one careful attempt a month and a confident, family-guided search. Most members who reach nikah on Qabiltoo do so on Gold; Silver exists for those who prefer a slower pace.",
  },
  {
    q: "Do you offer family accounts?",
    a: "Yes. With any paid membership, a parent or wali can be linked as a guardian with their own dashboard — they can shortlist profiles, review proposals and coordinate introductions, while you keep full control of what they see. Guardian access is always free; only the seeker's plan is billed.",
  },
];
