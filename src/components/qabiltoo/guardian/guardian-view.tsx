"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeCheck,
  Eye,
  Gem,
  Inbox,
  MailOpen,
  ShieldCheck,
  Sparkles,
  UserCog,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LightMotes } from "../shared/light-motes";
import { PatternOverlay } from "../pattern";
import { TrustRing } from "../shared/trust-ring";
import { VerificationBadge } from "../shared/verification-badge";
import { RoundPhoto } from "../matches/photo";
import { useAuthStore } from "@/lib/qabiltoo/store";
import {
  displayName,
  timeAgo,
  type InterestWithProfile,
  type NotificationItem,
  type Profile,
  type View,
  type ViewerItem,
} from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

function agoOf(iso: string): string {
  const t = timeAgo(iso);
  if (t === "now") return "just now";
  return /^[0-9]+[mhd]$/.test(t) ? `${t} ago` : t;
}

/* ── Activity timeline items (notifications + derived events) ── */

interface TimelineItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  body: string | null;
  at: string;
}

/* ── Sign-in gate ─────────────────────────────────────────── */

function GuardianSignIn() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-24 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-900 text-gold-300 shadow-lg ring-1 ring-gold-500/40">
        <UserCog className="h-10 w-10" aria-hidden />
      </div>
      <h1 className="font-display text-3xl font-semibold">Sign in to open the Guardian Console</h1>
      <p className="max-w-sm text-muted-foreground">
        The console is reserved for wakeels and walis managing a family member&apos;s proposals —
        sign in to review with wisdom and guide with care.
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground/80">
        Use the <span className="font-semibold text-gold-700 dark:text-gold-400">Sign In</span>{" "}
        button in the top bar, or the demo account{" "}
        <span className="font-mono text-foreground/80">ayesha@demo.qabiltoo.in</span>
      </p>
    </div>
  );
}

/* ── Main view ────────────────────────────────────────────── */

export function GuardianView({ navigate }: { navigate: (v: View) => void }) {
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const authed = mounted && !!user;
  const queryClient = useQueryClient();

  const [managedIdOverride, setManagedIdOverride] = useState<string | null>(null);

  /* ── Managed profiles (onBehalfOf = family) ── */
  const { data: allProfiles } = useQuery({
    queryKey: ["profiles", "all-48"],
    queryFn: async () => {
      const res = await fetch("/api/profiles?limit=48");
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return (await res.json()) as { profiles: Profile[] };
    },
    enabled: authed,
    staleTime: 60_000,
  });

  const managedCandidates = useMemo(
    () => (allProfiles?.profiles ?? []).filter((p) => p.onBehalfOf === "family"),
    [allProfiles]
  );

  const managedProfile: Profile | null =
    managedCandidates.find((p) => p.id === managedIdOverride) ??
    managedCandidates[0] ??
    user ??
    null;
  const managedId = managedProfile?.id ?? null;
  const usingOwnProfile = managedCandidates.length === 0 && !!user;

  /* ── Proposals for the managed profile ── */
  const { data: interests, isLoading: interestsLoading } = useQuery({
    queryKey: ["interests", managedId],
    queryFn: async () => {
      const res = await fetch(`/api/interests?profileId=${managedId}`);
      if (!res.ok) throw new Error("Failed to fetch proposals");
      return (await res.json()) as { sent: InterestWithProfile[]; received: InterestWithProfile[] };
    },
    enabled: authed && !!managedId,
    staleTime: 10_000,
  });

  /* ── Views for the managed profile (live refresh) ── */
  const { data: viewsData } = useQuery({
    queryKey: ["views", managedId, "guardian"],
    queryFn: async () => {
      const res = await fetch(`/api/views?profileId=${managedId}&tier=${encodeURIComponent(managedProfile?.tier ?? "Free")}`);
      if (!res.ok) throw new Error("Failed to fetch views");
      return (await res.json()) as { viewers: ViewerItem[]; total: number };
    },
    enabled: authed && !!managedId,
    refetchInterval: 15_000,
  });

  /* ── Notifications for the managed profile ── */
  const { data: notifsData } = useQuery({
    queryKey: ["notifications", managedId, "guardian"],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?profileId=${managedId}`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return (await res.json()) as { notifications: NotificationItem[] };
    },
    enabled: authed && !!managedId,
    refetchInterval: 15_000,
  });

  const received = interests?.received ?? [];
  const sent = interests?.sent ?? [];
  const pendingQueue = received.filter((i) => i.status === "pending");

  /* ── Approve / decline on behalf of the managed profile ── */
  const respond = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "declined" }) => {
      const res = await fetch(`/api/interests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, profileId: managedId }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Could not respond to the proposal");
      }
      return res.json();
    },
    onMutate: async ({ id, status }) => {
      const key = ["interests", managedId] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<{
        sent: InterestWithProfile[];
        received: InterestWithProfile[];
      }>(key);
      queryClient.setQueryData<{ sent: InterestWithProfile[]; received: InterestWithProfile[] }>(
        key,
        (old) =>
          old
            ? {
                sent: old.sent,
                received: old.received.map((i) => (i.id === id ? { ...i, status } : i)),
              }
            : old
      );
      return { previous, key };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(ctx.key, ctx.previous);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["interests", managedId] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast(
        vars.status === "accepted"
          ? {
              title: "Proposal accepted — MashaAllah",
              description: `${managedProfile ? displayName(managedProfile.fullName) : "The family"} has a new matched conversation when both sides accept.`,
            }
          : {
              title: "Handled with grace",
              description: "The proposal has been respectfully declined.",
            }
      );
    },
  });

  /* ── 7-day chart data from real views + proposals ── */
  const chartData = useMemo(() => {
    const received = interests?.received ?? [];
    const sent = interests?.sent ?? [];
    const days: { key: string; label: string; views: number; proposals: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      days.push({
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        views: 0,
        proposals: 0,
      });
    }
    const bucketOf = (iso: string) => {
      const d = new Date(iso);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
      return days.find((x) => x.key === key);
    };
    for (const v of viewsData?.viewers ?? []) {
      const bucket = bucketOf(v.viewedAt);
      if (bucket) bucket.views += 1;
    }
    for (const i of [...received, ...sent]) {
      const bucket = bucketOf(i.createdAt);
      if (bucket) bucket.proposals += 1;
    }
    return days;
  }, [viewsData, interests]);

  const maxDayKey = useMemo(() => {
    let best = "";
    let bestTotal = -1;
    for (const d of chartData) {
      const total = d.views + d.proposals;
      if (total > bestTotal) {
        bestTotal = total;
        best = d.key;
      }
    }
    return best;
  }, [chartData]);

  /* ── Recent activity timeline ── */
  const timeline = useMemo<TimelineItem[]>(() => {
    const received = interests?.received ?? [];
    const sent = interests?.sent ?? [];
    const items: TimelineItem[] = [];
    for (const n of notifsData?.notifications ?? []) {
      items.push({
        id: `n-${n.id}`,
        icon:
          n.type === "proposal" ? (
            <MailOpen className="h-3.5 w-3.5" aria-hidden />
          ) : n.type === "view" ? (
            <Eye className="h-3.5 w-3.5" aria-hidden />
          ) : n.type === "match" ? (
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
          ),
        title: n.title,
        body: n.body,
        at: n.createdAt,
      });
    }
    for (const i of received) {
      items.push({
        id: `r-${i.id}`,
        icon: <MailOpen className="h-3.5 w-3.5" aria-hidden />,
        title: `${displayName(i.from.fullName)} sent a proposal`,
        body: i.status === "pending" ? "Awaiting the family's review." : `Status: ${i.status}.`,
        at: i.createdAt,
      });
    }
    for (const i of sent.slice(0, 4)) {
      items.push({
        id: `s-${i.id}`,
        icon: <MailOpen className="h-3.5 w-3.5" aria-hidden />,
        title: `Proposal sent to ${displayName(i.to.fullName)}`,
        body: i.status === "pending" ? "Awaiting their family's response." : `Status: ${i.status}.`,
        at: i.createdAt,
      });
    }
    const recentViews = (viewsData?.viewers ?? []).slice(0, 4);
    for (const v of recentViews) {
      items.push({
        id: `v-${v.viewer.id}-${v.viewedAt}`,
        icon: <Eye className="h-3.5 w-3.5" aria-hidden />,
        title: "Profile viewed",
        body: `A member from ${v.viewer.city || "abroad"} stopped by.`,
        at: v.viewedAt,
      });
    }
    return items
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 9);
  }, [notifsData, interests, viewsData]);

  /* ── Gates ── */
  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="mt-10 h-96 rounded-3xl" />
      </div>
    );
  }

  if (!user) {
    return <GuardianSignIn />;
  }

  return (
    <div className="pb-20">
      {/* ═══ Emerald console band ═══ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white">
        <div className="absolute inset-0 text-white/[0.07]">
          <PatternOverlay />
        </div>
        <div className="absolute inset-0 opacity-70">
          <LightMotes count={20} speed={0.7} />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <Badge className="w-fit gap-1.5 border border-gold-400/50 bg-gold-500/15 text-[11px] font-semibold uppercase tracking-widest text-gold-300 hover:bg-gold-500/15">
                <ShieldCheck className="h-3 w-3" aria-hidden />
                Guardian mode
              </Badge>
            </div>
            <h1 className="flex flex-wrap items-baseline gap-3 font-display text-3xl font-semibold sm:text-4xl">
              Guardian Console
              <span className="font-arabic text-2xl font-normal text-gold-300 sm:text-3xl" lang="ar">
                ولي
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              A private space for wakeels and walis — approve with wisdom, guide with care.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        {/* ═══ Managed profile ═══ */}
        <section
          className="glass-card mb-8 rounded-3xl border border-gold-500/20 p-5"
          aria-label="Managed profile"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-4">
              <RoundPhoto
                profile={managedProfile ?? user}
                alt={managedProfile?.fullName ?? user.fullName}
                className="h-16 w-16"
                sizes="64px"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">
                  Managing
                </p>
                <h2 className="truncate font-display text-xl font-semibold">
                  {managedProfile ? displayName(managedProfile.fullName) : "—"}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {managedProfile && (
                    <VerificationBadge tier={managedProfile.verificationTier} showLabel />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {managedProfile?.city}
                    {managedProfile && managedProfile.country !== "India"
                      ? `, ${managedProfile.country}`
                      : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <TrustRing
                value={managedProfile?.trustScore ?? user.trustScore}
                size={74}
                strokeWidth={7}
              >
                <span className="font-display text-lg font-semibold">
                  {managedProfile?.trustScore ?? user.trustScore}
                </span>
                <span className="text-[8px] font-medium uppercase tracking-widest text-muted-foreground">
                  Trust
                </span>
              </TrustRing>

              {managedCandidates.length > 0 ? (
                <div className="w-44">
                  <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
                    Switch profile
                  </p>
                  <Select
                    value={managedProfile?.id ?? undefined}
                    onValueChange={(v) => setManagedIdOverride(v)}
                  >
                    <SelectTrigger aria-label="Choose managed profile">
                      <SelectValue placeholder="Choose profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {managedCandidates.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {displayName(p.fullName)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                usingOwnProfile && (
                  <p className="max-w-40 text-[11px] leading-relaxed text-muted-foreground">
                    No family-managed profiles found — showing your own.
                  </p>
                )
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* ═══ Approval queue ═══ */}
          <section className="lg:col-span-3" aria-label="Approval queue">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Inbox className="h-5 w-5 text-gold-600 dark:text-gold-400" aria-hidden />
                Approval Queue
              </h2>
              {pendingQueue.length > 0 && (
                <Badge className="bg-gold-500/15 text-xs text-gold-800 hover:bg-gold-500/15 dark:text-gold-300">
                  {pendingQueue.length} awaiting review
                </Badge>
              )}
            </div>

            {interestsLoading ? (
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-3xl" />
                ))}
              </div>
            ) : pendingQueue.length === 0 ? (
              <div className="glass-card flex flex-col items-center gap-3 rounded-3xl px-6 py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-700 dark:text-emerald-300">
                  <BadgeCheck className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-semibold">
                  No proposals await your review — Alhamdulillah, all clear.
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  New proposals for {managedProfile ? displayName(managedProfile.fullName) : "the family"}{" "}
                  will arrive here for your considered approval.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingQueue.map((interest) => {
                  const sender = interest.from as Profile;
                  return (
                    <motion.article
                      key={interest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-3xl border border-gold-500/15 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <RoundPhoto
                          profile={sender}
                          alt={sender.fullName}
                          className="h-14 w-14"
                          sizes="56px"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <h3 className="font-display text-base font-semibold">
                              {displayName(sender.fullName)}
                            </h3>
                            <span className="text-[11px] text-muted-foreground">
                              {agoOf(interest.createdAt)}
                            </span>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">
                            {sender.age} · {sender.city}
                            {sender.country !== "India" ? `, ${sender.country}` : ""} ·{" "}
                            {sender.profession}
                          </p>
                          <div className="mt-1">
                            <VerificationBadge tier={sender.verificationTier} />
                          </div>
                        </div>
                      </div>
                      {interest.message && (
                        <blockquote className="mt-3 rounded-2xl border-l-2 border-gold-500/60 bg-gold-50/60 px-4 py-2.5 text-sm italic leading-relaxed text-foreground/85 dark:bg-gold-500/5">
                          &ldquo;{interest.message}&rdquo;
                        </blockquote>
                      )}
                      <div className="mt-4 flex gap-2">
                        <Button
                          className="btn-gold-shimmer flex-1 bg-gold-500 font-semibold text-emerald-950 hover:bg-gold-400 sm:flex-none sm:px-6"
                          disabled={respond.isPending}
                          onClick={() => respond.mutate({ id: interest.id, status: "accepted" })}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-none sm:px-6"
                          disabled={respond.isPending}
                          onClick={() => respond.mutate({ id: interest.id, status: "declined" })}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto hidden text-muted-foreground sm:inline-flex"
                          onClick={() => navigate({ name: "profile", id: sender.id })}
                        >
                          View profile
                        </Button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </section>

          {/* ═══ Right rail: stats, chart, activity ═══ */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stat cards */}
            <section aria-label="Activity summary" className="grid grid-cols-3 gap-3">
              <StatCard
                icon={<Eye className="h-4 w-4" aria-hidden />}
                label="Profile views"
                value={viewsData?.total ?? 0}
                loading={!viewsData}
              />
              <StatCard
                icon={<MailOpen className="h-4 w-4" aria-hidden />}
                label="Proposals received"
                value={received.length}
                loading={interestsLoading}
              />
              <StatCard
                icon={<MailOpen className="h-4 w-4" aria-hidden />}
                label="Proposals sent"
                value={sent.length}
                loading={interestsLoading}
              />
            </section>

            {/* 7-day chart */}
            <section
              className="glass-card rounded-3xl border border-gold-500/15 p-5"
              aria-label="Last 7 days activity"
            >
              <h3 className="mb-1 font-display text-base font-semibold">Last 7 days</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Views and proposals — refreshing live every 15s.
              </p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barCategoryGap="28%" margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" opacity={0.5} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                      className="text-muted-foreground"
                    />
                    <ChartTooltip
                      cursor={{ fill: "rgba(212,175,55,0.08)" }}
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid rgba(212,175,55,0.3)",
                        fontSize: 12,
                        background: "var(--background, #fff)",
                      }}
                      formatter={(value: number | string, name: string) => [
                        value,
                        name === "views" ? "Views" : "Proposals",
                      ]}
                    />
                    <Bar dataKey="views" stackId="a" radius={[4, 4, 0, 0]}>
                      {chartData.map((d) => (
                        <Cell key={d.key} fill={d.key === maxDayKey ? "#d4af37" : "#2e8469"} />
                      ))}
                    </Bar>
                    <Bar dataKey="proposals" stackId="a" radius={[4, 4, 0, 0]}>
                      {chartData.map((d) => (
                        <Cell key={d.key} fill={d.key === maxDayKey ? "#b8962e" : "#0b5345"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500" aria-hidden /> Views
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-900 dark:bg-emerald-950" aria-hidden /> Proposals
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-gold-500" aria-hidden /> Busiest day
                </span>
              </div>
            </section>

            {/* Recent activity */}
            <section
              className="glass-card rounded-3xl border border-gold-500/15 p-5"
              aria-label="Recent activity"
            >
              <h3 className="mb-3 font-display text-base font-semibold">Recent activity</h3>
              {timeline.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Quiet so far — activity will appear here as the profile receives attention.
                </p>
              ) : (
                <ol className="max-h-72 space-y-0 overflow-y-auto pr-1 scrollbar-thin">
                  {timeline.map((item, idx) => (
                    <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
                      {/* timeline line */}
                      {idx < timeline.length - 1 && (
                        <span
                          className="absolute left-[13px] top-7 h-[calc(100%-1.4rem)] w-px bg-gold-500/20"
                          aria-hidden
                        />
                      )}
                      <span className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-800 ring-1 ring-emerald-700/20 dark:text-emerald-300">
                        {item.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug">{item.title}</p>
                        {item.body && (
                          <p className="truncate text-xs text-muted-foreground">{item.body}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground/70">
                          {agoOf(item.at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </div>

        {/* Demo note */}
        <p className="mt-10 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground/70">
          <Gem className="h-3 w-3" aria-hidden />
          Demo console — actions affect sample data.
        </p>
      </div>
    </div>
  );
}

/* ── Stat card ────────────────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="glass-card flex flex-col items-center gap-1 rounded-2xl border border-gold-500/15 px-2 py-4 text-center">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-800 dark:text-emerald-300">
        {icon}
      </span>
      {loading ? (
        <Skeleton className="h-6 w-8" />
      ) : (
        <span className="font-display text-xl font-semibold leading-none">{value}</span>
      )}
      <span className={cn("text-[10px] font-medium leading-tight text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}
