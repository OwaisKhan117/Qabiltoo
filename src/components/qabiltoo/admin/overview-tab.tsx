"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  Crown,
  Flag,
  Globe,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CountUp } from "../shared/count-up";
import { TrustRing } from "../shared/trust-ring";
import type { AdminStats } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";
import { LiveChip } from "./kit";

type StatTone = "emerald" | "gold" | "rose";

const TONE_CLASSES: Record<StatTone, string> = {
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  gold: "bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  index,
  reduced,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: StatTone;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={cn(
          "rounded-2xl border border-border bg-card p-4 shadow-sm",
          tone === "gold" && "ring-1 ring-gold-500/25"
        )}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex rounded-xl p-2",
              TONE_CLASSES[tone],
              tone === "gold" && "glow-gold"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        </div>
        <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-foreground">
          <CountUp to={value} duration={1.6} />
        </p>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Dark custom tooltip for recharts ─────────────────────────── */

interface TooltipEntry {
  value?: number | string;
  name?: string | number;
}

function DarkTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gold-500/30 bg-emerald-950/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="font-semibold text-emerald-50">{label}</p>
      <p className="mt-0.5 text-gold-300">
        {payload[0]?.value} {unit}
      </p>
    </div>
  );
}

const formatDayShort = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short" });

const formatDayLong = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

/* ── Tab ──────────────────────────────────────────────────────── */

export type AdminTabValue = "overview" | "verifications" | "moderation" | "content";

export function OverviewTab({
  stats,
  loading,
  error,
  onRetry,
  onGoTab,
}: {
  stats?: AdminStats;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onGoTab: (tab: AdminTabValue) => void;
}) {
  const reduced = useReducedMotion() ?? false;

  const cards: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    tone: StatTone;
  }[] = stats
    ? [
        { icon: UserPlus, label: "New signups today", value: stats.newSignupsToday, tone: "emerald" },
        { icon: BadgeCheck, label: "Pending verifications", value: stats.pendingVerifications, tone: "gold" },
        { icon: Flag, label: "Open reports", value: stats.openReports, tone: "rose" },
        { icon: Users, label: "Total profiles", value: stats.totalProfiles, tone: "emerald" },
        { icon: HeartHandshake, label: "Accepted proposals", value: stats.acceptedProposals, tone: "emerald" },
        { icon: MessageCircle, label: "Messages sent", value: stats.messagesCount, tone: "emerald" },
        { icon: Crown, label: "Gold members", value: stats.goldMembers, tone: "gold" },
        { icon: Globe, label: "Countries", value: stats.countries, tone: "emerald" },
      ]
    : [];

  const genderData = stats
    ? [
        { name: "Brides", value: stats.genderSplit.female, fill: "#d4af37" },
        { name: "Grooms", value: stats.genderSplit.male, fill: "#14654f" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Heading row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Operations Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Community health at a glance — figures refresh automatically.
          </p>
        </div>
        <LiveChip label="Live · 10s" />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load statistics</AlertTitle>
          <AlertDescription>
            The stats service did not respond.{" "}
            <button onClick={onRetry} className="font-semibold underline underline-offset-2">
              Retry now
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stat cards */}
      {loading && !stats ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[118px] rounded-2xl" />
          ))}
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c, i) => (
              <StatCard
                key={c.label}
                icon={c.icon}
                label={c.label}
                value={c.value}
                tone={c.tone}
                index={i}
                reduced={reduced}
              />
            ))}
          </div>
        )
      )}

      {/* Charts row 1: 7-day signups + verified share */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Signups — last 7 days
            </h3>
            <p className="text-xs text-muted-foreground">
              {stats?.newSignups7d.reduce((a, d) => a + d.count, 0) ?? 0} new members this week
            </p>
          </div>
          <div className="mt-4 h-52 sm:h-56">
            {stats && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.newSignups7d} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDayShort}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={26}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(212,175,55,0.08)" }}
                    content={<DarkTooltip unit="signups" />}
                    labelFormatter={(label) => formatDayLong(String(label))}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={36}>
                    {stats.newSignups7d.map((d, i) => (
                      <Cell
                        key={d.date}
                        fill={i === stats.newSignups7d.length - 1 ? "#d4af37" : "#14654f"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Gold bar marks today. Emerald bars mark previous days.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
          <h3 className="self-start font-display text-lg font-semibold text-foreground">
            Verified share
          </h3>
          {stats ? (
            <>
              <TrustRing value={stats.verifiedShare} size={138} className="my-3">
                <span className="font-display text-2xl font-semibold text-foreground">
                  <CountUp to={stats.verifiedShare} suffix="%" duration={1.6} />
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Verified
                </span>
              </TrustRing>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-600" aria-hidden />
                of members are ID-verified after manual review
              </p>
            </>
          ) : (
            <Skeleton className="my-6 h-32 w-32 rounded-full" />
          )}
        </div>
      </div>

      {/* Charts row 2: gender split + quick links */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-foreground">Gender balance</h3>
          <div className="relative mt-2 h-44">
            {stats && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<DarkTooltip unit="profiles" />} />
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={4}
                    cornerRadius={6}
                    strokeWidth={0}
                  >
                    {genderData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-semibold tabular-nums text-foreground">
                {stats ? stats.totalProfiles : "—"}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Profiles
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gold-500" aria-hidden />
              Brides · {stats?.genderSplit.female ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" aria-hidden />
              Grooms · {stats?.genderSplit.male ?? "—"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-foreground">Quick actions</h3>
          <p className="text-xs text-muted-foreground">Jump straight into the working queues.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                tab: "verifications" as const,
                icon: BadgeCheck,
                title: "Verification queue",
                hint: stats
                  ? `${stats.pendingVerifications} awaiting review`
                  : "Review ID documents",
                cls: "text-gold-600 dark:text-gold-400",
              },
              {
                tab: "moderation" as const,
                icon: Flag,
                title: "Moderation queue",
                hint: stats ? `${stats.openReports} open reports` : "Handle community reports",
                cls: "text-rose-600 dark:text-rose-400",
              },
              {
                tab: "content" as const,
                icon: MessageCircle,
                title: "Content desk",
                hint: "Success stories & FAQ",
                cls: "text-emerald-600 dark:text-emerald-400",
              },
            ].map((q) => (
              <button
                key={q.tab}
                onClick={() => onGoTab(q.tab)}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-gold-500/50 hover:bg-gold-50/60 dark:hover:bg-gold-900/10"
              >
                <q.icon className={cn("mt-0.5 h-4 w-4 shrink-0", q.cls)} aria-hidden />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-foreground">{q.title}</span>
                  <span className="block text-xs text-muted-foreground">{q.hint}</span>
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
