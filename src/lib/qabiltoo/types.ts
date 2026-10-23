/* ── Qabiltoo shared types ─────────────────────────────────── */

export type VerificationTier = "blue" | "green" | "gold";
export type SubscriptionTier = "Free" | "Silver" | "Gold" | "Platinum";
export type OnBehalfOf = "self" | "family";

export interface Profile {
  id: string;
  fullName: string;
  gender: "male" | "female";
  age: number;
  height: string;
  city: string;
  state: string;
  country: string;
  education: string;
  profession: string;
  income: string | null;
  maritalStatus: string;
  sect: string | null;
  religiousLevel: string | null;
  namaz: string | null;
  quranLevel: string | null;
  hijabBeard: string | null;
  about: string;
  partnerPreference: string | null;
  familyInfo: string | null;
  image: string;
  photos: string[];
  email: string | null;
  phone: string | null;
  isDemo: boolean;
  onBehalfOf: OnBehalfOf;
  verificationTier: VerificationTier;
  trustScore: number;
  tier: SubscriptionTier;
  waliName: string | null;
  waliPhone: string | null;
  waliRelation: string | null;
  relocate: boolean;
  idVerified: boolean;
  verificationStatus: "none" | "pending" | "approved" | "rejected";
  lastActive: string;
  createdAt: string;
}

export interface ProfilesResponse {
  profiles: Profile[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProfileFilters {
  q?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  city?: string;
  country?: string;
  maritalStatus?: string;
  sect?: string;
  education?: string;
  profession?: string;
  income?: string;
  relocate?: string;
  verificationTier?: string;
  page?: number;
  limit?: number;
}

export interface StatsResponse {
  totalProfiles: number;
  maleCount: number;
  femaleCount: number;
  cities: number;
  countries: number;
  cityNames: string[];
}

export interface InterestWithProfile {
  id: string;
  fromId: string;
  toId: string;
  message: string | null;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  from: Profile;
  to: Profile;
}

export interface InterestsResponse {
  sent: InterestWithProfile[];
  received: InterestWithProfile[];
}

/* ── Chat ──────────────────────────────────────────────────── */

export interface ChatMessage {
  id: string;
  threadKey: string;
  fromId: string;
  toId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  sender?: { id: string; fullName: string; image: string | null };
}

export interface ThreadSummary {
  profile: Profile;
  lastMessage: ChatMessage;
  unread: number;
}

/* ── Success stories ───────────────────────────────────────── */

export interface SuccessStory {
  id: string;
  coupleNames: string;
  title: string;
  quote: string;
  story: string;
  image: string;
  city: string;
  country: string;
  marriedAt: string;
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

/* ── Live activity ticker ──────────────────────────────────── */

export interface ActivityItem {
  id: string;
  text: string;
  type: "join" | "proposal" | "match" | "verification" | "success";
  createdAt: string;
}

/* ── Notifications ─────────────────────────────────────────── */

export interface NotificationItem {
  id: string;
  profileId: string;
  type: "proposal" | "match" | "view" | "message" | "system" | "verification";
  title: string;
  body: string | null;
  read: boolean;
  createdAt: string;
}

/* ── Profile views (who viewed me) ─────────────────────────── */

export interface ViewerItem {
  viewer: Profile;
  viewedAt: string;
  locked: boolean;
}

/* ── Verification center ───────────────────────────────────── */

export interface VerificationRequest {
  id: string;
  profileId: string;
  docType: string;
  docRef: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  profile: { id: string; fullName: string; image: string; city: string; verificationTier: VerificationTier };
}

/* ── Reports / moderation ──────────────────────────────────── */

export interface ReportItem {
  id: string;
  reporterName: string;
  profileName: string;
  profileId: string;
  reason: string;
  details: string | null;
  status: "open" | "resolved";
  action: "none" | "warned" | "suspended" | "banned";
  createdAt: string;
}

/* ── Admin ─────────────────────────────────────────────────── */

export interface AdminStats {
  totalProfiles: number;
  newSignupsToday: number;
  newSignups7d: { date: string; count: number }[];
  pendingVerifications: number;
  openReports: number;
  acceptedProposals: number;
  totalProposals: number;
  messagesCount: number;
  goldMembers: number;
  countries: number;
  genderSplit: { male: number; female: number };
  verifiedShare: number;
}

/* ── OTP auth ──────────────────────────────────────────────── */

export interface OtpSendResponse {
  sent: boolean;
  devCode: string;
  isNew: boolean;
}

export interface OtpVerifyResponse {
  ok: boolean;
  profile?: Profile;
  error?: string;
}

/* ── SPA views (single-route app) ──────────────────────────── */

export type View =
  | { name: "landing" }
  | { name: "browse"; gender?: string }
  | { name: "register" }
  | { name: "interests" }
  | { name: "profile"; id: string }
  | { name: "chat"; withId?: string }
  | { name: "guardian" }
  | { name: "trust" }
  | { name: "pricing" }
  | { name: "stories" }
  | { name: "approach" }
  | { name: "info"; page: "faq" | "about" | "contact" }
  | { name: "admin" };

/* ── Constants ─────────────────────────────────────────────── */

export const MARITAL_STATUSES = ["Never Married", "Divorced", "Widowed"] as const;
export const SECTS = ["Sunni", "Shia", "Just Muslim"] as const;
export const RELIGIOUS_LEVELS = ["Very Practicing", "Moderate", "Exploring"] as const;
export const NAMAZ_OPTIONS = ["5 times daily", "Regularly", "Sometimes", "Learning"] as const;
export const QURAN_LEVELS = ["Hafiz", "Reads with Tajweed", "Reads regularly", "Learning"] as const;
export const HIJAB_BEARD_OPTIONS = ["Yes, always", "Yes, mostly", "Sometimes", "Prefer not to say"] as const;
export const INCOME_BRACKETS = [
  "Under ₹5 LPA",
  "₹5–10 LPA",
  "₹10–15 LPA",
  "₹15–25 LPA",
  "₹25–50 LPA",
  "₹50 LPA+",
] as const;
export const EDUCATION_LEVELS = ["High School", "Bachelor", "Master", "Doctorate", "Alim/Alimah"] as const;

/* ── Helpers ───────────────────────────────────────────────── */

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Privacy-friendly display name: "Ayesha Siddiqui" -> "Ayesha S." */
export function displayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

/** Deterministic chat thread key for a pair of profile ids */
export function threadKeyOf(a: string, b: string): string {
  return [a, b].sort().join(":");
}

/** Compact relative time: "3m", "2h", "5d" */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export const VERIFICATION_TIER_META: Record<
  VerificationTier,
  { label: string; color: string; bg: string; glow: string; description: string }
> = {
  blue: {
    label: "ID Verified",
    color: "#3b82f6",
    bg: "#3b82f61a",
    glow: "0 0 12px #3b82f655",
    description: "Government ID checked by our review team. Identity confirmed.",
  },
  green: {
    label: "Verified & Active",
    color: "#16a34a",
    bg: "#16a34a1a",
    glow: "0 0 12px #16a34a55",
    description: "ID verified + activity reviewed. A reliable, engaged member.",
  },
  gold: {
    label: "Premium Verified",
    color: "#d4af37",
    bg: "#d4af371f",
    glow: "0 0 14px #d4af3788",
    description: "Highest trust: ID + documents + references fully vetted.",
  },
};
