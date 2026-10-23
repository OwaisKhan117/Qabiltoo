"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Gem } from "lucide-react";
import Image from "next/image";
import type { AdminStats, VerificationTier } from "@/lib/qabiltoo/types";
import { VERIFICATION_TIER_META, initialsOf } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

/** Relative time with a spoken suffix: "3m ago", "2h ago", "Mar 3". */
export function timeAgoLong(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ── Admin-local data shapes (API rows include nested profile) ── */

export interface AdminVerification {
  id: string;
  profileId: string;
  docType: string;
  docRef: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt: string | null;
  profile: {
    id: string;
    fullName: string;
    image: string;
    city: string;
    verificationTier: VerificationTier;
    trustScore: number;
  };
}

export interface AdminReport {
  id: string;
  reporterName: string;
  profileId: string;
  reason: string;
  details: string | null;
  status: "open" | "resolved";
  action: "none" | "warned" | "suspended" | "banned";
  createdAt: string;
  resolvedAt: string | null;
  profile: { id: string; fullName: string; image: string; city: string };
}

/* ── Shared live stats query (10s refetch) ────────────────────── */

export const ADMIN_STATS_KEY = ["admin", "stats"] as const;

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_STATS_KEY,
    queryFn: async (): Promise<AdminStats> => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
    refetchInterval: 10_000,
  });
}

/* ── Avatar / thumbnail with graceful fallback ────────────────── */

export function AdminAvatar({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const finalSrc = err ? `/api/avatar/${encodeURIComponent(initialsOf(name))}` : src;
  return (
    <Image
      src={finalSrc}
      alt={`${name} profile photo`}
      width={48}
      height={48}
      className={cn(
        "shrink-0 rounded-full border border-emerald-800/15 bg-emerald-50 object-cover dark:border-emerald-100/10 dark:bg-emerald-900/40",
        className
      )}
      onError={() => setErr(true)}
    />
  );
}

export function StoryThumb({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        aria-label={alt}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-blush-100 text-blush-600 dark:bg-blush-900/30 dark:text-blush-300",
          className
        )}
      >
        <Gem className="h-5 w-5" aria-hidden />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={56}
      height={56}
      className={cn("shrink-0 rounded-lg border border-border object-cover", className)}
      onError={() => setErr(true)}
    />
  );
}

/* ── Tier badge (verification tier of the profile) ────────────── */

export function TierBadge({ tier }: { tier: VerificationTier }) {
  const meta = VERIFICATION_TIER_META[tier];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ color: meta.color, backgroundColor: meta.bg, boxShadow: meta.glow }}
    >
      <BadgeCheck className="h-3 w-3" aria-hidden />
      {meta.label}
    </span>
  );
}

/* ── Live pulsing indicator ───────────────────────────────────── */

export function LiveChip({ label = "Live", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}

/* ── Severity helper (rose tint for serious reasons) ──────────── */

export function isSevereReason(reason: string): boolean {
  return /harass|fake|abuse|threat|inappropriat/i.test(reason);
}

export const REPORT_ACTION_META: Record<
  AdminReport["action"],
  { label: string; className: string }
> = {
  none: {
    label: "No action",
    className:
      "border-border bg-muted text-muted-foreground",
  },
  warned: {
    label: "Warned",
    className:
      "border-gold-500/40 bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-300",
  },
  suspended: {
    label: "Suspended",
    className:
      "border-blush-400/50 bg-blush-100 text-blush-700 dark:bg-blush-900/25 dark:text-blush-300",
  },
  banned: {
    label: "Banned",
    className:
      "border-destructive/40 bg-destructive/10 text-destructive",
  },
};

/* ── Empty state ──────────────────────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
      <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      {hint ? <p className="max-w-sm text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
