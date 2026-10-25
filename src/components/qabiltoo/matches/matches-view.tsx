"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BookmarkX,
  Eye,
  Gem,
  HeartHandshake,
  Inbox,
  Lock,
  MailOpen,
  MessageCircle,
  Sparkles,
  UserRoundX,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlurredPhoto } from "../shared/blurred-photo";
import { SectionHeading } from "../shared/section-heading";
import { RingsConnection } from "../shared/rings-connection";
import { VerificationBadge } from "../shared/verification-badge";
import { useAuthStore } from "@/lib/qabiltoo/store";
import {
  displayName,
  timeAgo,
  type InterestWithProfile,
  type Profile,
  type View,
  type ViewerItem,
} from "@/lib/qabiltoo/types";
import { ArchPhoto, ProposalCardShell, RoundPhoto } from "./photo";
import { MatchReveal } from "./match-reveal";

/* ── Sign-in gate ─────────────────────────────────────────── */

function SignInState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-24 text-center">
      <div className="relative">
        <RingsConnection size={168} />
      </div>
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <p className="max-w-sm text-muted-foreground">{hint}</p>
      <p className="text-xs leading-relaxed text-muted-foreground/80">
        Use the <span className="font-semibold text-gold-700 dark:text-gold-400">Sign In</span> button
        in the top bar, or the demo account{" "}
        <span className="font-mono text-foreground/80">ayesha@demo.qabiltoo.in</span>
      </p>
    </div>
  );
}

function agoOf(iso: string): string {
  const t = timeAgo(iso);
  if (t === "now") return "just now";
  return /^[0-9]+[mhd]$/.test(t) ? `${t} ago` : t;
}

/* ── Status chip for sent proposals ───────────────────────── */

function StatusChip({ status }: { status: InterestWithProfile["status"] }) {
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
        <HeartHandshake className="h-3 w-3" aria-hidden />
        Accepted
      </span>
    );
  }
  if (status === "declined") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        <UserRoundX className="h-3 w-3" aria-hidden />
        Declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-0.5 text-[11px] font-semibold text-gold-800 dark:bg-gold-500/15 dark:text-gold-300">
      <Sparkles className="h-3 w-3" aria-hidden />
      Pending
    </span>
  );
}

/* ── Main view ────────────────────────────────────────────── */

export function MatchesView({
  navigate,
  onViewProfile,
}: {
  navigate: (v: View) => void;
  onViewProfile: (id: string) => void;
}) {
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const savedIdsRaw = useAuthStore((s) => s.savedIds);
  const toggleSaved = useAuthStore((s) => s.toggleSaved);
  const queryClient = useQueryClient();
  const [revealPair, setRevealPair] = useState<Profile | null>(null);

  const authed = mounted && !!user;

  /* ── Data ── */
  const { data: interests, isLoading } = useQuery({
    queryKey: ["interests", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/interests?profileId=${user!.id}`);
      if (!res.ok) throw new Error("Failed to fetch proposals");
      return (await res.json()) as { sent: InterestWithProfile[]; received: InterestWithProfile[] };
    },
    enabled: authed,
    staleTime: 10_000,
  });

  const { data: viewsData } = useQuery({
    queryKey: ["views", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/views?profileId=${user!.id}&tier=${encodeURIComponent(user!.tier)}`);
      if (!res.ok) throw new Error("Failed to fetch views");
      return (await res.json()) as { viewers: ViewerItem[]; total: number };
    },
    enabled: authed,
    staleTime: 15_000,
  });

  const savedIds = useMemo(
    () => (authed ? savedIdsRaw.filter((id) => id !== user?.id) : []),
    [authed, savedIdsRaw, user?.id]
  );

  const savedQueries = useQueries({
    queries: savedIds.map((id) => ({
      queryKey: ["profile", id],
      queryFn: async () => {
        const res = await fetch(`/api/profiles/${id}`);
        if (!res.ok) return { profile: null };
        return (await res.json()) as { profile: Profile | null };
      },
      staleTime: 60_000,
      enabled: authed,
    })),
  });

  const savedProfiles = useMemo(
    () =>
      savedQueries
        .map((q) => q.data?.profile ?? null)
        .filter((p): p is Profile => !!p),
    [savedQueries]
  );

  /* ── Mutual matches (sent accepted ∩ received accepted) ── */
  const mutualIds = useMemo(() => {
    const sentAccepted = new Set(
      interests?.sent.filter((i) => i.status === "accepted").map((i) => i.toId) ?? []
    );
    const receivedAccepted = new Set(
      interests?.received.filter((i) => i.status === "accepted").map((i) => i.fromId) ?? []
    );
    return new Set([...sentAccepted].filter((id) => receivedAccepted.has(id)));
  }, [interests]);

  const mutualProfiles = useMemo(() => {
    if (!interests) return [];
    return interests.received
      .filter((i) => mutualIds.has(i.fromId))
      .map((i) => i.from as Profile);
  }, [interests, mutualIds]);

  /* ── Accept / decline (optimistic) ── */
  const respond = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "declined" }) => {
      const res = await fetch(`/api/interests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, profileId: user!.id }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Could not respond to the proposal");
      }
      return res.json();
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["interests", user!.id] });
      const key = ["interests", user!.id] as const;
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
      queryClient.invalidateQueries({ queryKey: ["interests", user!.id] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      if (vars.status === "accepted") {
        const interest = interests?.received.find((i) => i.id === vars.id);
        if (interest && mutualIds.has(interest.fromId)) {
          setRevealPair(interest.from as Profile);
        }
        toast({
          title: "Proposal accepted — MashaAllah",
          description: mutualIds.has(interest?.fromId ?? "")
            ? "It's a match. A respectful conversation has opened."
            : "Chat unlocks when you've both accepted.",
        });
      } else {
        toast({
          title: "Handled with grace",
          description: "The proposal has been respectfully declined.",
        });
      }
    },
  });

  /* ── Loading (pre-hydration / fetching) ── */
  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <SignInState
        title="Sign in to view your proposals"
        hint="Your received proposals, sent proposals and profile visitors are kept private in your account."
      />
    );
  }

  const received = interests?.received ?? [];
  const sent = interests?.sent ?? [];
  const pendingReceived = received.filter((i) => i.status === "pending");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <SectionHeading
        arabic="الطلبات"
        eyebrow="Proposals & Matches"
        title="Every proposal, handled with dignity"
        description="Review proposals with your family, respond with grace, and let conversation open only when hearts meet on both sides."
      />

      {/* ── Your matches strip ── */}
      {mutualProfiles.length > 0 && (
        <section aria-label="Your matches" className="mb-8">
          <div className="glass-card rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-50 via-background to-emerald-50 p-5 dark:from-gold-500/5 dark:via-transparent dark:to-emerald-900/20">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
                <HeartHandshake className="h-4 w-4" aria-hidden />
              </span>
              <h2 className="font-display text-lg font-semibold">Your Matches</h2>
              <Badge className="bg-gold-500/15 text-[11px] text-gold-800 hover:bg-gold-500/15 dark:text-gold-300">
                {mutualProfiles.length} mutual
              </Badge>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-thin">
              {mutualProfiles.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRevealPair(p)}
                  className="group flex w-36 shrink-0 flex-col items-center gap-2 rounded-2xl border border-gold-500/20 bg-background/70 p-3 text-center shadow-sm transition-colors hover:border-gold-500/45"
                  aria-label={`Open match with ${displayName(p.fullName)}`}
                >
                  <RoundPhoto
                    profile={p}
                    alt={p.fullName}
                    className="h-16 w-16"
                    sizes="64px"
                  />
                  <span className="text-sm font-semibold leading-tight">
                    {displayName(p.fullName)}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gold-700 dark:text-gold-400">
                    <MessageCircle className="h-3 w-3" aria-hidden />
                    Open chat
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tabs ── */}
      <Tabs defaultValue="received">
        <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/60 p-1.5 sm:inline-flex sm:w-auto">
          <TabsTrigger value="received" className="gap-1.5 rounded-xl px-3 py-2 text-sm">
            <Inbox className="h-4 w-4" aria-hidden />
            Received
            {pendingReceived.length > 0 && (
              <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-emerald-950">
                {pendingReceived.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-1.5 rounded-xl px-3 py-2 text-sm">
            <MailOpen className="h-4 w-4" aria-hidden />
            Sent
            {sent.length > 0 && (
              <span className="text-xs text-muted-foreground">{sent.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="views" className="gap-1.5 rounded-xl px-3 py-2 text-sm">
            <Eye className="h-4 w-4" aria-hidden />
            Who Viewed Me
            {(viewsData?.total ?? 0) > 0 && (
              <span className="text-xs text-muted-foreground">{viewsData?.total}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-1.5 rounded-xl px-3 py-2 text-sm">
            <Gem className="h-4 w-4" aria-hidden />
            Saved
            {savedIds.length > 0 && (
              <span className="text-xs text-muted-foreground">{savedIds.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ═══ RECEIVED ═══ */}
        <TabsContent value="received">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-72 rounded-3xl" />
              ))}
            </div>
          ) : received.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-6 w-6" aria-hidden />}
              title="No proposals yet"
              body="When someone sends a proposal with sincere intentions, it will appear here for you and your family to review."
              action={
                <Button variant="outline" onClick={() => navigate({ name: "browse" })}>
                  Discover Profiles
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {received.map((interest) => {
                const sender = interest.from as Profile;
                const isMutual = mutualIds.has(sender.id);
                const handled = interest.status !== "pending";
                return (
                  <ProposalCardShell key={interest.id} className="flex flex-col">
                    <div className="flex items-start gap-4">
                      <ArchPhoto
                        profile={sender}
                        alt={sender.fullName}
                        className="h-24 w-20"
                        sizes="80px"
                      />
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => onViewProfile(sender.id)}
                          className="block max-w-full truncate text-left font-display text-lg font-semibold leading-snug hover:text-gold-700 dark:hover:text-gold-400"
                        >
                          {displayName(sender.fullName)}
                        </button>
                        <p className="truncate text-sm text-muted-foreground">
                          {sender.age} · {sender.city}
                          {sender.country !== "India" ? `, ${sender.country}` : ""}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">{sender.profession}</p>
                        <div className="mt-1.5">
                          <VerificationBadge tier={sender.verificationTier} />
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {timeAgo(interest.createdAt)}
                      </span>
                    </div>

                    {interest.message && (
                      <blockquote className="mt-4 rounded-2xl border-l-2 border-gold-500/60 bg-gold-50/60 px-4 py-3 text-sm italic leading-relaxed text-foreground/85 dark:bg-gold-500/5">
                        &ldquo;{interest.message}&rdquo;
                      </blockquote>
                    )}

                    <div className="mt-4 flex flex-1 items-end">
                      {handled ? (
                        <div className="flex w-full items-center justify-between gap-2">
                          <StatusChip status={interest.status} />
                          {isMutual && (
                            <Button
                              size="sm"
                              onClick={() => navigate({ name: "chat", withId: sender.id })}
                              className="gap-1.5 bg-emerald-700 text-white hover:bg-emerald-600"
                            >
                              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                              Conversation
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex w-full gap-2">
                          <Button
                            className="btn-gold-shimmer flex-1 bg-gold-500 font-semibold text-emerald-950 hover:bg-gold-400"
                            disabled={respond.isPending}
                            onClick={() => respond.mutate({ id: interest.id, status: "accepted" })}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            disabled={respond.isPending}
                            onClick={() => respond.mutate({ id: interest.id, status: "declined" })}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </ProposalCardShell>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ═══ SENT ═══ */}
        <TabsContent value="sent">
          {sent.length === 0 ? (
            <EmptyState
              icon={<MailOpen className="h-6 w-6" aria-hidden />}
              title="No proposals sent yet"
              body="When you send a respectful proposal, you can follow its journey here — from pending to accepted, Insha'Allah."
              action={
                <Button variant="outline" onClick={() => navigate({ name: "browse" })}>
                  Discover Profiles
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sent.map((interest) => {
                const recipient = interest.to as Profile;
                const isMutual = mutualIds.has(recipient.id);
                return (
                  <ProposalCardShell key={interest.id} className="flex flex-col">
                    <div className="flex items-start gap-4">
                      {interest.status === "accepted" ? (
                        <ArchPhoto
                          profile={recipient}
                          alt={recipient.fullName}
                          className="h-24 w-20"
                          sizes="80px"
                        />
                      ) : (
                        <BlurredPhoto
                          src={recipient.image}
                          alt={recipient.fullName}
                          className="h-24 w-20 shrink-0 rounded-t-[3.5rem] rounded-b-2xl ring-1 ring-gold-500/25"
                          overlayLabel="Revealed when accepted"
                          onClick={() => onViewProfile(recipient.id)}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => onViewProfile(recipient.id)}
                          className="block max-w-full truncate text-left font-display text-lg font-semibold leading-snug hover:text-gold-700 dark:hover:text-gold-400"
                        >
                          {displayName(recipient.fullName)}
                        </button>
                        <p className="truncate text-sm text-muted-foreground">
                          {recipient.age} · {recipient.city}
                          {recipient.country !== "India" ? `, ${recipient.country}` : ""}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">{recipient.profession}</p>
                        <div className="mt-1.5">
                          <VerificationBadge tier={recipient.verificationTier} />
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {timeAgo(interest.createdAt)}
                      </span>
                    </div>

                    {interest.message && (
                      <blockquote className="mt-4 rounded-2xl border-l-2 border-emerald-600/40 bg-emerald-50/60 px-4 py-3 text-sm italic leading-relaxed text-foreground/80 dark:bg-emerald-900/15">
                        &ldquo;{interest.message}&rdquo;
                      </blockquote>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <StatusChip status={interest.status} />
                      {isMutual ? (
                        <Button
                          size="sm"
                          onClick={() => navigate({ name: "chat", withId: recipient.id })}
                          className="gap-1.5 bg-emerald-700 text-white hover:bg-emerald-600"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                          Message
                        </Button>
                      ) : interest.status === "accepted" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate({ name: "chat", withId: recipient.id })}
                          className="gap-1.5"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                          Message
                        </Button>
                      ) : null}
                    </div>
                  </ProposalCardShell>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ═══ WHO VIEWED ME ═══ */}
        <TabsContent value="views">
          {!viewsData ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-44 rounded-3xl" />
              ))}
            </div>
          ) : viewsData.viewers.length === 0 ? (
            <EmptyState
              icon={<Eye className="h-6 w-6" aria-hidden />}
              title="No profile visits yet"
              body="As your profile reaches more members, you'll see who stopped by — a gentle signal of interest."
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {viewsData.total} {viewsData.total === 1 ? "member has" : "members have"} viewed your
                profile recently.
                {user.tier !== "Gold" && user.tier !== "Platinum" && " Upgrade to reveal every visitor."}
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {viewsData.viewers.map((v) =>
                  v.locked ? (
                    <LockedViewerCard key={`locked-${v.viewer.id}-${v.viewedAt}`} onUpgrade={() => navigate({ name: "pricing" })} />
                  ) : (
                    <ProposalCardShell key={`v-${v.viewer.id}-${v.viewedAt}`}>
                      <button
                        onClick={() => onViewProfile(v.viewer.id)}
                        className="flex w-full items-center gap-4 text-left"
                        aria-label={`View profile of ${displayName(v.viewer.fullName)}`}
                      >
                        <RoundPhoto profile={v.viewer} alt={v.viewer.fullName} className="h-14 w-14" sizes="56px" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-base font-semibold">
                            {displayName(v.viewer.fullName)}
                          </span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {v.viewer.city}
                            {v.viewer.country !== "India" ? `, ${v.viewer.country}` : ""}
                          </span>
                          <span className="text-[11px] text-muted-foreground/80">
                            Viewed {agoOf(v.viewedAt)}
                          </span>
                        </span>
                      </button>
                    </ProposalCardShell>
                  )
                )}
              </div>
            </>
          )}
        </TabsContent>

        {/* ═══ SAVED ═══ */}
        <TabsContent value="saved">
          {savedIds.length === 0 ? (
            <EmptyState
              icon={<Gem className="h-6 w-6" aria-hidden />}
              title="Nothing saved yet"
              body="Tap the bookmark on any profile to keep it here for thoughtful review with your family."
              action={
                <Button variant="outline" onClick={() => navigate({ name: "browse" })}>
                  Discover Profiles
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {savedProfiles.map((p) => (
                <ProposalCardShell key={p.id} className="flex flex-col">
                  <div className="flex items-start gap-4">
                    <BlurredPhoto
                      src={p.image}
                      alt={p.fullName}
                      className="h-24 w-20 shrink-0 rounded-t-[3.5rem] rounded-b-2xl ring-1 ring-gold-500/25"
                      overlayLabel="Photos stay private"
                      onClick={() => onViewProfile(p.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => onViewProfile(p.id)}
                        className="block max-w-full truncate text-left font-display text-lg font-semibold leading-snug hover:text-gold-700 dark:hover:text-gold-400"
                      >
                        {displayName(p.fullName)}
                      </button>
                      <p className="truncate text-sm text-muted-foreground">
                        {p.age} · {p.city}
                        {p.country !== "India" ? `, ${p.country}` : ""}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{p.profession}</p>
                      <div className="mt-1.5">
                        <VerificationBadge tier={p.verificationTier} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewProfile(p.id)}
                      className="gap-1.5"
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        toggleSaved(p.id);
                        toast({ title: "Removed from saved", description: `${displayName(p.fullName)} is no longer in your saved list.` });
                      }}
                      className="gap-1.5 text-muted-foreground hover:text-rose-700 dark:hover:text-rose-400"
                      aria-label={`Remove ${displayName(p.fullName)} from saved`}
                    >
                      <BookmarkX className="h-4 w-4" aria-hidden />
                      Unsave
                    </Button>
                  </div>
                </ProposalCardShell>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Mutual match reveal ── */}
      <MatchReveal
        open={!!revealPair}
        onOpenChange={(open) => {
          if (!open) setRevealPair(null);
        }}
        user={user}
        other={revealPair ?? user}
        onOpenChat={() => {
          const id = revealPair?.id;
          setRevealPair(null);
          if (id) navigate({ name: "chat", withId: id });
        }}
        onContinue={() => {
          setRevealPair(null);
          navigate({ name: "browse" });
        }}
      />
    </div>
  );
}

/* ── Locked viewer card (premium teaser) ──────────────────── */

function LockedViewerCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="glass-card relative overflow-hidden rounded-3xl border border-dashed border-gold-500/30 p-5">
      <div className="flex items-center gap-4">
        {/* silhouette */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(11,83,69,0.25) 0%, rgba(212,175,55,0.28) 100%)",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="h-5 w-5 text-gold-700/70 dark:text-gold-400/70" aria-hidden />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="h-4 w-24 rounded-full bg-muted" aria-hidden />
          <div className="mt-1.5 h-3 w-16 rounded-full bg-muted/70" aria-hidden />
          <p className="mt-1 text-[11px] text-muted-foreground">Viewed recently</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-gold-50/80 p-3 text-center dark:bg-gold-500/5">
        <p className="text-xs font-medium leading-relaxed text-gold-900 dark:text-gold-200">
          Upgrade to Gold to see who&apos;s interested in you
        </p>
        <Button
          size="sm"
          onClick={onUpgrade}
          className="btn-gold-shimmer mt-2 bg-gold-500 font-semibold text-emerald-950 hover:bg-gold-400"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────── */

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass-card mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/12 text-gold-600 dark:text-gold-400">
        {icon}
      </span>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}
