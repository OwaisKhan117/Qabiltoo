import type { SubscriptionTier } from "@/lib/qabiltoo/types";

/* ── Plans ─────────────────────────────────────────────────────────────────
   Membership model: pick a duration — 3 Months, 6 Months, or Unlimited
   (valid until you find your match). Each duration offers Silver, Gold and
   Assisted tiers; the Unlimited duration is a single all-inclusive plan.   */

export type PaidTier = Exclude<SubscriptionTier, "Free">;
export type PlanTheme = "silver" | "gold" | "assisted" | "unlimited";

export interface Plan {
  /** Stable id used by checkout / subscription API, e.g. "gold-3m" */
  id: string;
  tier: PaidTier;
  name: string;
  shortName: string;
  duration: string;
  /** null = unlimited (no expiry) */
  durationMonths: number | null;
  price: number;
  tagline: string;
  features: string[];
  popular?: boolean;
  theme: PlanTheme;
}

export interface PlanSection {
  id: string;
  title: string;
  caption: string;
  plans: Plan[];
}

/* ── Feature sets (shared across durations) ────────────────────────────── */

const SILVER_FEATURES = (contacts: number): string[] => [
  "Chat with Unlimited Members",
  `Unlock ${contacts} Contact Details`,
  "Hide Unwanted Profiles",
  "Standard Search Filters",
];

const GOLD_FEATURES = (contacts: number): string[] => [
  "Chat with Unlimited Members",
  `Unlock ${contacts} Contact Details`,
  "Hide Unwanted Profiles",
  "All Advanced Search Filters",
  "See Who Viewed Your Profile",
  "Priority Placement in Search Results",
  "Profile Highlight Badge",
];

const ASSISTED_FEATURES = (contacts: number): string[] => [
  "Chat with Unlimited Members",
  `Unlock ${contacts} Contact Details`,
  "Hide Unwanted Profiles",
  "All Advanced Search Filters",
  "See Who Viewed Your Profile",
  "Priority Placement in Search Results",
  "Profile Highlight Badge",
  "Dedicated Relationship Manager",
  "Weekly Hand-Picked Match Suggestions",
  "Family Coordination and Call Support",
];

const UNLIMITED_FEATURES: string[] = [
  "Chat with Unlimited Members",
  "Unlimited Contact Unlocks",
  "Hide Unwanted Profiles",
  "All Advanced Search Filters",
  "See Who Viewed Your Profile",
  "Top Priority Profile Visibility",
  "Verified Profile Badge",
  "3 Months Assisted Service Free (Relationship Manager, Weekly Matches, Family Coordination)",
];

/* ── Sections ──────────────────────────────────────────────────────────── */

export const PLAN_SECTIONS: PlanSection[] = [
  {
    id: "3-months",
    title: "3 Months",
    caption: "A focused season of searching — ideal for getting started.",
    plans: [
      {
        id: "silver-3m",
        tier: "Silver",
        name: "Silver Plan (3 Months)",
        shortName: "Silver",
        duration: "3 Months",
        durationMonths: 3,
        price: 1299,
        tagline: "The essentials for a sincere, modest search.",
        features: SILVER_FEATURES(15),
        theme: "silver",
      },
      {
        id: "gold-3m",
        tier: "Gold",
        name: "Gold Plan (3 Months)",
        shortName: "Gold",
        duration: "3 Months",
        durationMonths: 3,
        price: 2499,
        tagline: "Our most-loved path — full filters and full visibility.",
        features: GOLD_FEATURES(40),
        popular: true,
        theme: "gold",
      },
      {
        id: "assisted-3m",
        tier: "Assisted",
        name: "Assisted Plan (3 Months)",
        shortName: "Assisted",
        duration: "3 Months",
        durationMonths: 3,
        price: 3999,
        tagline: "A dedicated relationship manager walks with your family.",
        features: ASSISTED_FEATURES(60),
        theme: "assisted",
      },
    ],
  },
  {
    id: "6-months",
    title: "6 Months",
    caption: "More time, a kinder monthly cost — for an unhurried search.",
    plans: [
      {
        id: "silver-6m",
        tier: "Silver",
        name: "Silver Plan (6 Months)",
        shortName: "Silver",
        duration: "6 Months",
        durationMonths: 6,
        price: 1999,
        tagline: "Six months of essentials at a gentler price.",
        features: SILVER_FEATURES(30),
        theme: "silver",
      },
      {
        id: "gold-6m",
        tier: "Gold",
        name: "Gold Plan (6 Months)",
        shortName: "Gold",
        duration: "6 Months",
        durationMonths: 6,
        price: 3799,
        tagline: "Half a year with every premium advantage.",
        features: GOLD_FEATURES(80),
        popular: true,
        theme: "gold",
      },
      {
        id: "assisted-6m",
        tier: "Assisted",
        name: "Assisted Plan (6 Months)",
        shortName: "Assisted",
        duration: "6 Months",
        durationMonths: 6,
        price: 5999,
        tagline: "Six months of guided, family-coordinated matchmaking.",
        features: ASSISTED_FEATURES(120),
        theme: "assisted",
      },
    ],
  },
  {
    id: "unlimited",
    title: "Unlimited",
    caption: "One payment — valid until you find your match, insha'Allah.",
    plans: [
      {
        id: "unlimited",
        tier: "Unlimited",
        name: "Unlimited Plan",
        shortName: "Unlimited",
        duration: "Valid Until You Find Your Match",
        durationMonths: null,
        price: 6999,
        tagline: "No expiry, no renewals — every premium feature, plus 3 months of Assisted service free.",
        features: UNLIMITED_FEATURES,
        theme: "unlimited",
      },
    ],
  },
];

/** Flat list of every purchasable plan (for checkout lookups) */
export const ALL_PLANS: Plan[] = PLAN_SECTIONS.flatMap((s) => s.plans);

export function findPlan(id: string): Plan | undefined {
  return ALL_PLANS.find((p) => p.id === id);
}

export function formatINR(n: number): string {
  return n.toLocaleString("en-IN");
}

/** Per-month equivalent — null for the Unlimited plan */
export function perMonth(plan: Plan): number | null {
  if (plan.durationMonths === null || plan.durationMonths <= 0) return null;
  return Math.round(plan.price / plan.durationMonths);
}

/* ── Billing FAQ ───────────────────────────────────────────────────────── */

export const BILLING_FAQ = [
  {
    q: "Can I cancel my membership anytime?",
    a: "Yes — absolutely. Cancel in two taps and your plan simply does not renew. You keep every feature until the end of the period you paid for, and your profile remains active on the free tier with its verification badges and trust score intact.",
  },
  {
    q: "What is your refund policy?",
    a: "If a technical issue prevented you from using your membership, contact us within 7 days of payment and we will refund it in full, no questions asked. We do not refund unused periods after 7 days, because profiles can pause instead — pause your membership and the remaining days are preserved.",
  },
  {
    q: "What does 'Unlock Contact Details' mean?",
    a: "Contact details (phone and family contact) stay private by default. Each unlock lets you reveal the contact details of one member you are genuinely interested in — the count depends on your plan (15 on Silver 3 Months, up to Unlimited on the Unlimited Plan). Unlocks are only spent when you choose to reveal, and misuse is covered by our moderation policy.",
  },
  {
    q: "Which plan should I choose?",
    a: "Silver covers the essentials — chat, contact unlocks and standard filters. Gold is our most popular path: advanced filters, viewer visibility and a highlighted profile with priority placement. Assisted adds a dedicated relationship manager with weekly hand-picked matches and family coordination calls. And if you prefer to pay once and search without a deadline, the Unlimited plan is valid until you find your match, insha'Allah.",
  },
  {
    q: "How is my family involved on paid plans?",
    a: "Families are at the heart of Qabiltoo on every plan — proposals open respectful family-to-family conversations and guardian (wali) details are part of each profile. On the Assisted plans (and the 3 free Assisted months included with Unlimited), a dedicated relationship manager coordinates directly with your family through weekly calls.",
  },
  {
    q: "Is the Unlimited plan really unlimited?",
    a: "Yes. One payment of ₹6,999 and your membership stays active until you find your match — there is no expiry date and no renewal. It also includes 3 months of our Assisted service (relationship manager, weekly matches, family coordination) at no extra cost.",
  },
];
