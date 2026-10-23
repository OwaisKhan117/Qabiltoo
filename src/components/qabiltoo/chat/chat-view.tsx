"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Info,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  UserCog,
  Video,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SectionHeading } from "../shared/section-heading";
import { RingsConnection } from "../shared/rings-connection";
import { VerificationBadge } from "../shared/verification-badge";
import { RoundPhoto } from "../matches/photo";
import { useAuthStore } from "@/lib/qabiltoo/store";
import { getSocket, useSocketEvent } from "@/lib/qabiltoo/socket";
import {
  displayName,
  threadKeyOf,
  timeAgo,
  type ChatMessage,
  type InterestWithProfile,
  type Profile,
  type ThreadSummary,
  type View,
} from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

/* Safety reminder stays dismissed for the whole browsing session */
let safetyDismissedThisSession = false;

/* ── Helpers ──────────────────────────────────────────────── */

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 animate-bounce rounded-full bg-gold-500"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

/* ── Main view ────────────────────────────────────────────── */

export function ChatView({ navigate, withId }: { navigate: (v: View) => void; withId?: string }) {
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const authed = mounted && !!user;
  const queryClient = useQueryClient();

  const [activeId, setActiveId] = useState<string | null>(withId ?? null);
  const [extras, setExtras] = useState<ChatMessage[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const [typingName, setTypingName] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [waliOn, setWaliOn] = useState<Record<string, boolean>>({});
  const [videoOpen, setVideoOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [guardianApproval, setGuardianApproval] = useState(true);
  const [showSafety, setShowSafety] = useState(() => !safetyDismissedThisSession);
  const [threadSearch, setThreadSearch] = useState("");

  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingClear = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myId = user?.id ?? "";
  const activeKey = useMemo(
    () => (myId && activeId ? threadKeyOf(myId, activeId) : null),
    [myId, activeId]
  );

  /* ── Thread summaries ── */
  const { data: threadsData, isLoading: threadsLoading } = useQuery({
    queryKey: ["threads", myId],
    queryFn: async () => {
      const res = await fetch(`/api/messages?me=${myId}&threads=1`);
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return (await res.json()) as { threads: ThreadSummary[] };
    },
    enabled: authed,
    staleTime: 5_000,
  });

  /* ── Interests (mutual detection gates video call + 403 recovery) ── */
  const { data: interests } = useQuery({
    queryKey: ["interests", myId],
    queryFn: async () => {
      const res = await fetch(`/api/interests?profileId=${myId}`);
      if (!res.ok) throw new Error("Failed to fetch proposals");
      return (await res.json()) as { sent: InterestWithProfile[]; received: InterestWithProfile[] };
    },
    enabled: authed,
    staleTime: 10_000,
  });

  const mutualIds = useMemo(() => {
    const sentAccepted = new Set(
      interests?.sent.filter((i) => i.status === "accepted").map((i) => i.toId) ?? []
    );
    const receivedAccepted = new Set(
      interests?.received.filter((i) => i.status === "accepted").map((i) => i.fromId) ?? []
    );
    return new Set([...sentAccepted].filter((id) => receivedAccepted.has(id)));
  }, [interests]);

  const threads = useMemo(() => threadsData?.threads ?? [], [threadsData]);
  const activeThread = useMemo(
    () => threads.find((t) => t.profile.id === activeId),
    [threads, activeId]
  );

  /* Profile fallback when a thread row doesn't exist yet (matched, no messages) */
  const { data: activeFallback } = useQuery({
    queryKey: ["profile", activeId],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${activeId}`);
      if (!res.ok) return { profile: null };
      return (await res.json()) as { profile: Profile | null };
    },
    enabled: authed && !!activeId && !activeThread,
    staleTime: 60_000,
  });

  const activeProfile: Profile | null = activeThread?.profile ?? activeFallback?.profile ?? null;

  /* ── Messages for the open thread (server marks incoming read) ── */
  const { data: fetchedMsgs, isLoading: msgsLoading } = useQuery({
    queryKey: ["messages", myId, activeId],
    queryFn: async () => {
      const res = await fetch(`/api/messages?me=${myId}&with=${activeId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = (await res.json()) as { messages: ChatMessage[] };
      // Opening the thread reads it — inform the other side for live receipts
      if (activeId) {
        getSocket().emit("chat:read", {
          threadKey: threadKeyOf(myId, activeId),
          readerId: myId,
          otherId: activeId,
        });
        queryClient.invalidateQueries({ queryKey: ["threads", myId] });
      }
      return data;
    },
    enabled: authed && !!activeId,
    staleTime: 5_000,
  });

  const messages = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    for (const m of fetchedMsgs?.messages ?? []) map.set(m.id, m);
    for (const m of extras) map.set(m.id, m);
    return [...map.values()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [fetchedMsgs, extras]);

  const totalUnread = useMemo(
    () => threads.reduce((n, t) => n + t.unread, 0),
    [threads]
  );

  /* ── Socket: presence ── */
  useSocketEvent(
    "presence",
    (...args: unknown[]) => {
      const payload = args[0] as { onlineIds?: string[] } | undefined;
      setOnlineIds(new Set(payload?.onlineIds ?? []));
    },
    authed
  );

  /* ── Socket: incoming messages ── */
  useSocketEvent(
    "chat:new",
    (...args: unknown[]) => {
      const payload = args[0] as { message?: ChatMessage } | undefined;
      const m = payload?.message;
      if (!m || !myId || m.fromId === myId) return;
      const isOpen = activeId === m.fromId;
      if (isOpen) {
        setExtras((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        setTypingName(null);
        getSocket().emit("chat:read", {
          threadKey: m.threadKey,
          readerId: myId,
          otherId: m.fromId,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["threads", myId] });
    },
    authed
  );

  /* ── Socket: read receipts for my sent messages ── */
  useSocketEvent(
    "chat:read",
    (...args: unknown[]) => {
      const payload = args[0] as { threadKey?: string; readerId?: string } | undefined;
      if (!payload?.readerId || payload.readerId === myId) return;
      if (payload.threadKey && payload.threadKey === activeKey) {
        setReadIds((prev) => {
          const next = new Set(prev);
          for (const m of messages) if (m.fromId === myId) next.add(m.id);
          return next;
        });
      }
    },
    authed
  );

  /* ── Socket: typing indicator ── */
  useSocketEvent(
    "chat:typing",
    (...args: unknown[]) => {
      const payload = args[0] as { threadKey?: string; name?: string; fromId?: string } | undefined;
      if (!payload?.threadKey || payload.fromId !== activeId || payload.threadKey !== activeKey) return;
      setTypingName(payload.name?.split(" ")[0] ?? "They");
      if (typingClear.current) clearTimeout(typingClear.current);
      typingClear.current = setTimeout(() => setTypingName(null), 3000);
    },
    authed
  );

  /* Clear timer on unmount */
  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (typingClear.current) clearTimeout(typingClear.current);
    };
  }, []);

  /* ── Actions ── */

  function openThread(id: string) {
    setActiveId(id);
    setExtras([]);
    setReadIds(new Set());
    setDraft("");
    setTypingName(null);
    setInfoOpen(false);
  }

  function onDraftChange(value: string) {
    setDraft(value);
    if (!activeId || !user) return;
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      getSocket().emit("chat:typing", {
        threadKey: threadKeyOf(user.id, activeId),
        toId: activeId,
        name: user.fullName,
      });
    }, 400);
  }

  async function send() {
    const body = draft.trim();
    if (!body || !activeId || !user || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromId: user.id, toId: activeId, body }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: ChatMessage; error?: string };
      if (res.status === 403) {
        toast({
          title: "Conversation not open yet",
          description:
            "Chat unlocks only after both sides accept each other's proposals. Review your proposals to continue.",
        });
        return;
      }
      if (!res.ok || !data.message) {
        throw new Error(data.error ?? "Message could not be sent");
      }
      const message = data.message;
      setExtras((prev) => (prev.some((x) => x.id === message.id) ? prev : [...prev, message]));
      setDraft("");
      if (typingTimer.current) clearTimeout(typingTimer.current);
      // Relay live to the recipient (persistence already done via REST)
      getSocket().emit("chat:new", { message });
      queryClient.invalidateQueries({ queryKey: ["threads", myId] });
    } catch {
      toast({
        title: "Message could not be sent",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }

  /* ── Gates ── */
  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="mt-10 h-[520px] rounded-3xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-24 text-center">
        <RingsConnection size={168} />
        <h1 className="font-display text-3xl font-semibold">Sign in to view your conversations</h1>
        <p className="max-w-sm text-muted-foreground">
          Conversations open respectfully — only after proposals are accepted on both sides, with
          family involvement encouraged throughout.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground/80">
          Use the <span className="font-semibold text-gold-700 dark:text-gold-400">Sign In</span>{" "}
          button in the top bar, or the demo account{" "}
          <span className="font-mono text-foreground/80">ayesha@demo.qabiltoo.in</span>
        </p>
      </div>
    );
  }

  const otherOnline = activeId ? onlineIds.has(activeId) : false;
  const isMutualThread = activeId ? mutualIds.has(activeId) : false;
  const waliActive = activeId ? !!waliOn[activeId] : false;
  const waliName = activeProfile?.waliName ?? "the family wakeel";

  const filteredThreads = threads.filter((t) =>
    t.profile.fullName.toLowerCase().includes(threadSearch.trim().toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-0 pb-8 pt-6 sm:px-6 sm:pt-10">
      <div className="px-4 sm:px-0">
        <SectionHeading
          arabic="محادثات"
          eyebrow="Conversations"
          title="Speak with respect, involve the families"
          align="left"
          className="mb-6"
        />
      </div>

      {/* No mutual matches at all → warm invitation */}
      {threads.length === 0 && !threadsLoading && mutualIds.size === 0 ? (
        <div className="glass-card mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl px-6 py-14 text-center">
          <RingsConnection size={150} />
          <h2 className="font-display text-xl font-semibold">Conversations open after acceptance</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            To keep every interaction halal and intentional, chat unlocks only when both sides have
            accepted each other&apos;s proposals. Until then, proposals are the respectful path
            forward.
          </p>
          <Button
            onClick={() => navigate({ name: "browse" })}
            className="btn-gold-shimmer bg-gold-500 font-semibold text-emerald-950 hover:bg-gold-400"
          >
            Discover Profiles
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[340px_1fr] lg:gap-6">
          {/* ═══ Thread list ═══ */}
          <aside
            className={cn(
              "border-y bg-background/60 px-3 py-4 lg:block lg:rounded-3xl lg:border lg:border-gold-500/15 lg:shadow-sm",
              activeId ? "hidden" : "block"
            )}
            aria-label="Conversation list"
          >
            <div className="mb-3 flex items-center justify-between gap-2 px-1">
              <h2 className="font-display text-base font-semibold">
                Inbox
                {totalUnread > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-[10px] font-bold text-emerald-950">
                    {totalUnread}
                  </span>
                )}
              </h2>
            </div>
            <div className="relative mb-3">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                placeholder="Search conversations"
                className="rounded-full bg-muted/50 pl-9"
                aria-label="Search conversations"
              />
            </div>

            <div className="max-h-[52vh] space-y-1.5 overflow-y-auto pr-1 scrollbar-thin lg:max-h-[calc(100dvh-19rem)]">
              {threadsLoading &&
                [0, 1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}

              {!threadsLoading && filteredThreads.length === 0 && (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                  {threads.length === 0
                    ? "Your matches will appear here."
                    : "No conversations match your search."}
                </p>
              )}

              {filteredThreads.map((t) => {
                /* An open thread is being read right now — reflect that immediately */
                const unreadShown = t.profile.id === activeId ? 0 : t.unread;
                return (
                <button
                  key={t.profile.id}
                  onClick={() => openThread(t.profile.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    activeId === t.profile.id
                      ? "bg-emerald-700/10 ring-1 ring-emerald-700/25 dark:bg-emerald-400/10"
                      : "hover:bg-muted/70"
                  )}
                  aria-current={activeId === t.profile.id ? "true" : undefined}
                >
                  <div className="relative">
                    <RoundPhoto
                      profile={t.profile}
                      alt={t.profile.fullName}
                      className="h-12 w-12"
                      sizes="48px"
                    />
                    {onlineIds.has(t.profile.id) && (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500"
                        title="Online"
                        aria-label="Online now"
                      />
                    )}
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold">
                        {displayName(t.profile.fullName)}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {timeAgo(t.lastMessage.createdAt)}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {t.lastMessage.fromId === myId ? "You: " : ""}
                        {t.lastMessage.body}
                      </span>
                      {unreadShown > 0 && (
                        <Badge className="h-5 min-w-5 shrink-0 rounded-full bg-gold-500 px-1.5 text-[10px] font-bold text-emerald-950 hover:bg-gold-500">
                          {unreadShown}
                        </Badge>
                      )}
                    </span>
                  </span>
                </button>
                );
              })}
            </div>
          </aside>

          {/* ═══ Conversation ═══ */}
          <section
            className={cn(
              "flex min-h-[62vh] flex-col border-y bg-background/60 lg:min-h-0 lg:rounded-3xl lg:border lg:border-gold-500/15 lg:shadow-sm",
              activeId ? "block" : "hidden lg:flex"
            )}
            aria-label="Conversation"
          >
            {!activeId || !activeProfile ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                <MessageCircle className="h-10 w-10 text-gold-500/60" aria-hidden />
                <p className="font-display text-lg font-semibold">Select a conversation</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Choose a thread from your inbox, or accept a proposal to begin a respectful
                  conversation.
                </p>
              </div>
            ) : (
              <ChatPane
                key={activeId}
                me={user}
                other={activeProfile}
                messages={messages}
                msgsLoading={msgsLoading}
                online={otherOnline}
                typingName={typingName}
                isMutual={isMutualThread}
                waliActive={waliActive}
                waliName={waliName}
                draft={draft}
                sending={sending}
                showSafety={showSafety}
                onDraftChange={onDraftChange}
                onSend={send}
                onBack={() => setActiveId(null)}
                onDismissSafety={() => {
                  safetyDismissedThisSession = true;
                  setShowSafety(false);
                }}
                onToggleWali={(on) => setWaliOn((prev) => ({ ...prev, [activeId]: on }))}
                onRequestVideo={() => setVideoOpen(true)}
                infoOpen={infoOpen}
                onInfoOpenChange={setInfoOpen}
                navigate={navigate}
                readIds={readIds}
              />
            )}
          </section>
        </div>
      )}

      {/* ═══ Video call request dialog ═══ */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700/10 text-emerald-800 dark:text-emerald-300">
              <Video className="h-6 w-6" aria-hidden />
            </div>
            <DialogTitle className="text-center font-display text-xl">
              Family-aware video meeting
            </DialogTitle>
            <DialogDescription className="text-center">
              A supervised video call with {activeProfile ? displayName(activeProfile.fullName) : "your match"}
              , arranged with both families.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="flex gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
              Video calls unlock 3 days after mutual acceptance — a short cooling period so
              families can connect first.
            </p>
            <p className="flex gap-2">
              <UserCog className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
              Where wali details are on file, guardians are informed and may join or review the
              call arrangement.
            </p>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-gold-500/25 px-4 py-3">
            <span className="text-sm font-medium">Request guardian approval</span>
            <Switch checked={guardianApproval} onCheckedChange={setGuardianApproval} />
          </label>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setVideoOpen(false)}>
              Not now
            </Button>
            <Button
              className="btn-gold-shimmer bg-gold-500 font-semibold text-emerald-950 hover:bg-gold-400"
              onClick={() => {
                setVideoOpen(false);
                toast({
                  title: "Request sent — Insha'Allah the families will coordinate",
                  description: guardianApproval
                    ? "Both guardians will be asked to approve a suitable time."
                    : "The families will receive your request shortly.",
                });
              }}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Conversation pane (one per open thread) ──────────────── */

function ChatPane({
  me,
  other,
  messages,
  msgsLoading,
  online,
  typingName,
  isMutual,
  waliActive,
  waliName,
  draft,
  sending,
  showSafety,
  onDraftChange,
  onSend,
  onBack,
  onDismissSafety,
  onToggleWali,
  onRequestVideo,
  infoOpen,
  onInfoOpenChange,
  navigate,
  readIds,
}: {
  me: Profile;
  other: Profile;
  messages: ChatMessage[];
  msgsLoading: boolean;
  online: boolean;
  typingName: string | null;
  isMutual: boolean;
  waliActive: boolean;
  waliName: string;
  draft: string;
  sending: boolean;
  showSafety: boolean;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
  onDismissSafety: () => void;
  onToggleWali: (on: boolean) => void;
  onRequestVideo: () => void;
  infoOpen: boolean;
  onInfoOpenChange: (open: boolean) => void;
  navigate: (v: View) => void;
  readIds: Set<string>;
}) {
  /* Precompute day-chip flags so render stays pure */
  const groupedMessages = useMemo(
    () =>
      messages.map((m, idx) => {
        const day = dayLabel(m.createdAt);
        const prevDay = idx > 0 ? dayLabel(messages[idx - 1].createdAt) : "";
        return { m, day, showDay: day !== prevDay };
      }),
    [messages]
  );

  /* Keep the conversation scrolled to the latest message */
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, typingName]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="flex h-full flex-col"
    >
      {/* Header */}
      <header className="border-b border-gold-500/15 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 shrink-0 lg:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Button>
          <button
            onClick={() => navigate({ name: "profile", id: other.id })}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-label={`View profile of ${displayName(other.fullName)}`}
          >
            <div className="relative">
              <RoundPhoto profile={other} alt={other.fullName} className="h-11 w-11" sizes="44px" />
              {online && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500"
                  aria-label="Online now"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate font-display text-base font-semibold leading-tight">
                {displayName(other.fullName)}
                <VerificationBadge tier={other.verificationTier} />
              </p>
              <p className="text-[11px] text-muted-foreground">
                {typingName ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-gold-700 dark:text-gold-400">
                    {typingName} is typing <TypingDots />
                  </span>
                ) : online ? (
                  "Online now"
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </button>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={isMutual ? -1 : 0} className="inline-flex">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isMutual}
                      onClick={onRequestVideo}
                      className="gap-1.5 border-gold-500/40 text-gold-800 hover:bg-gold-500/10 hover:text-gold-900 dark:text-gold-300"
                      aria-label="Request a family-aware video call"
                    >
                      <Video className="h-4 w-4" aria-hidden />
                      <span className="hidden sm:inline">Request Video Call</span>
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isMutual && (
                  <TooltipContent side="bottom" className="max-w-60 text-xs">
                    Unlocks 3 days after mutual acceptance — families informed
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <Popover open={infoOpen} onOpenChange={onInfoOpenChange}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Conversation options">
                  <Info className="h-5 w-5" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">{other.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {other.age} · {other.city}, {other.country}
                    </p>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-medium">
                      <UserCog className="h-4 w-4 text-gold-600" aria-hidden />
                      Add wali to this conversation
                    </span>
                    <Switch
                      checked={waliActive}
                      onCheckedChange={onToggleWali}
                      aria-label="Add wali to this conversation"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Your wali {waliName} will be able to view this conversation — keeping families
                    close is a sunnah, not a formality.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Wali visibility badge row */}
        {waliActive && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2.5 flex justify-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100/80 px-3 py-1 text-[11px] font-medium text-gold-900 ring-1 ring-gold-500/50 dark:bg-gold-500/10 dark:text-gold-200">
              <UserCog className="h-3.5 w-3.5" aria-hidden />
              Wali {waliName} can view this conversation
            </span>
          </motion.div>
        )}
      </header>

      {/* Guardian-aware system note */}
      {waliActive && (
        <div className="mx-4 mt-3 rounded-xl border border-gold-500/25 bg-gold-50/70 px-3 py-2 text-center text-[11px] text-gold-900 dark:bg-gold-500/5 dark:text-gold-200">
          A wali may review this conversation — write with adab and sincerity.
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4 scrollbar-thin lg:max-h-[calc(100dvh-21rem)]"
      >
        {msgsLoading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className={cn("h-10 rounded-2xl", i % 2 ? "ml-auto w-2/5" : "w-2/5")} />
            ))}
          </div>
        )}

        {!msgsLoading && messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
            <MessageCircle className="h-8 w-8 text-gold-500/50" aria-hidden />
            <p className="text-sm font-medium">Begin with a warm salam</p>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Families have connected — now greet with kindness and keep the conversation
              purposeful.
            </p>
          </div>
        )}

        {groupedMessages.map(({ m, day, showDay }) => {
          const mine = m.fromId === me.id;
          const read = mine && (m.readAt != null || readIds.has(m.id));
          return (
            <div key={m.id}>
              {showDay && (
                <div className="my-3 flex justify-center">
                  <span className="rounded-full bg-muted px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {day}
                  </span>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn("flex", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm sm:max-w-[65%]",
                    mine
                      ? "rounded-br-md bg-emerald-700 text-white"
                      : "rounded-bl-md border border-border/60 bg-card text-card-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 text-[10px]",
                      mine ? "text-white/65" : "text-muted-foreground/70"
                    )}
                  >
                    {clockTime(m.createdAt)}
                    {mine &&
                      (read ? (
                        <CheckCheck className="h-3.5 w-3.5 text-emerald-300" aria-label="Read" />
                      ) : (
                        <Check className="h-3.5 w-3.5" aria-label="Sent" />
                      ))}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Safety reminder */}
      {showSafety && (
        <div className="mx-4 mb-2 flex items-start gap-2 rounded-xl border border-gold-500/30 bg-gold-50/80 px-3 py-2 text-[11px] leading-relaxed text-gold-900 dark:bg-gold-500/10 dark:text-gold-200">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <p className="flex-1">
            Keep it respectful — never share financial details. Involve family early; it&apos;s a
            sunnah, not a formality.
          </p>
          <button
            onClick={onDismissSafety}
            className="rounded p-0.5 text-gold-700/70 transition-colors hover:text-gold-900 dark:text-gold-300/70 dark:hover:text-gold-200"
            aria-label="Dismiss safety reminder"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      )}

      {/* Composer */}
      <form
        className="flex items-center gap-2 border-t border-gold-500/15 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <Input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder={
            isMutual ? "Write a respectful message…" : "Conversation opens after mutual acceptance"
          }
          disabled={!isMutual}
          className="rounded-full bg-muted/50"
          aria-label="Message"
          maxLength={2000}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!isMutual || sending || !draft.trim()}
          className="btn-gold-shimmer h-10 w-10 shrink-0 rounded-full bg-gold-500 text-emerald-950 hover:bg-gold-400"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" aria-hidden />
        </Button>
      </form>
    </motion.div>
  );
}
