"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ShieldAlert } from "lucide-react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { LandingView } from "./landing/landing-view";
import { StarLoader } from "./shared/star-loader";
import { useAuthStore } from "@/lib/qabiltoo/store";
import { getSocket, useSocketEvent } from "@/lib/qabiltoo/socket";
import type { InterestWithProfile, NotificationItem, ProfilesResponse, Profile, View } from "@/lib/qabiltoo/types";

/* ── Server-fetched landing data (React Query initialData) ──── */
export interface QabiltooInitialData {
  heroProfiles?: ProfilesResponse;
  featuredProfiles?: ProfilesResponse;
}

/* ── Heavy / below-the-fold views are code-split ───────────────
   Each chunk is fetched on first navigation; a calm star loader
   fills the brief window while it arrives. This keeps the initial
   bundle (landing page) small and hydration fast.                */
function ViewLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <StarLoader size={56} />
    </div>
  );
}

const BrowseView = dynamic(
  () => import("./browse/browse-view").then((m) => ({ default: m.BrowseView })),
  { loading: ViewLoader }
);
const ProfileDetailView = dynamic(
  () => import("./profile/profile-detail-view").then((m) => ({ default: m.ProfileDetailView })),
  { loading: ViewLoader }
);
const SendInterestDialog = dynamic(
  () => import("./profile/send-interest-dialog").then((m) => ({ default: m.SendInterestDialog })),
  { ssr: true }
);
const RegisterView = dynamic(
  () => import("./register/register-view").then((m) => ({ default: m.RegisterView })),
  { loading: ViewLoader }
);
const MatchesView = dynamic(
  () => import("./matches/matches-view").then((m) => ({ default: m.MatchesView })),
  { loading: ViewLoader }
);
const ChatView = dynamic(
  () => import("./chat/chat-view").then((m) => ({ default: m.ChatView })),
  { loading: ViewLoader }
);
const TrustView = dynamic(
  () => import("./trust/trust-view").then((m) => ({ default: m.TrustView })),
  { loading: ViewLoader }
);
const PricingView = dynamic(
  () => import("./pricing/pricing-view").then((m) => ({ default: m.PricingView })),
  { loading: ViewLoader }
);
const StoriesView = dynamic(
  () => import("./stories-page/stories-view").then((m) => ({ default: m.StoriesView })),
  { loading: ViewLoader }
);
const ApproachView = dynamic(
  () => import("./approach/approach-view").then((m) => ({ default: m.ApproachView })),
  { loading: ViewLoader }
);
const InfoView = dynamic(
  () => import("./info/info-view").then((m) => ({ default: m.InfoView })),
  { loading: ViewLoader }
);
const AdminView = dynamic(
  () => import("./admin/admin-view").then((m) => ({ default: m.AdminView })),
  { loading: ViewLoader }
);
const AuthDialog = dynamic(
  () => import("./auth-dialog").then((m) => ({ default: m.AuthDialog })),
  { ssr: true }
);

function QabiltooShell({ initial }: { initial?: QabiltooInitialData }) {
  const [view, setView] = useState<View>({ name: "landing" });
  const [authOpen, setAuthOpen] = useState(false);
  const [interestTarget, setInterestTarget] = useState<Profile | null>(null);
  const [interestDialogOpen, setInterestDialogOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const proposedIds = useAuthStore((s) => s.proposedIds);
  const markProposed = useAuthStore((s) => s.markProposed);
  const queryClient = useQueryClient();
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const navigate = useCallback((next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  /* ── Performance: resume purely-decorative CSS loops only once the
        page is fully interactive (keeps the load window paint-quiet) ── */
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.documentElement.classList.add("perf-ready");
      /* Warm the chunks for the most likely next views (login → My Profile,
         chat, auth + proposal dialogs) — fetched on idle, never blocks load */
      import("./profile/profile-detail-view").catch(() => {});
      import("./profile/send-interest-dialog").catch(() => {});
      import("./auth-dialog").catch(() => {});
      import("./chat/chat-view").catch(() => {});
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);

  /* ── Socket identity + realtime notifications ─────────────── */
  useEffect(() => {
    if (!user) return;
    getSocket()
      .then((socket) => {
        socket.emit("identity", { profileId: user.id, name: user.fullName });
      })
      .catch(() => {});
  }, [user]);

  useSocketEvent("notification:new", (...args: unknown[]) => {
    const payload = args[0] as { notification?: Partial<NotificationItem> } | undefined;
    const n = payload?.notification;
    if (!n?.title) return;
    toast({
      title: n.title,
      description: n.body ?? undefined,
    });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["interests"] });
  });

  useSocketEvent("chat:new", (...args: unknown[]) => {
    const payload = args[0] as { message?: { fromId?: string; body?: string } } | undefined;
    const m = payload?.message;
    if (!m?.fromId || !user) return;
    const current = viewRef.current;
    if (current.name === "chat" && current.withId === m.fromId) return; // already viewing
    toast({
      title: "New message",
      description: m.body?.slice(0, 90),
    });
    queryClient.invalidateQueries({ queryKey: ["threads"] });
  });

  /* ── Proposals tracking ───────────────────────────────────── */
  const { data: interestsData } = useQuery({
    queryKey: ["interests", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/interests?profileId=${user!.id}`);
      if (!res.ok) throw new Error("Failed to fetch interests");
      return res.json() as Promise<{ sent: InterestWithProfile[]; received: InterestWithProfile[] }>;
    },
    enabled: !!user,
    staleTime: 10_000,
  });

  const interestedIds = useMemo(() => {
    const ids = new Set(user ? proposedIds : []);
    interestsData?.sent.forEach((i) => ids.add(i.toId));
    return ids;
  }, [interestsData, user, proposedIds]);

  const mutuallyAcceptedIds = useMemo(() => {
    const sentAccepted = new Set(
      interestsData?.sent.filter((i) => i.status === "accepted").map((i) => i.toId) ?? []
    );
    const receivedAccepted = new Set(
      interestsData?.received.filter((i) => i.status === "accepted").map((i) => i.fromId) ?? []
    );
    return new Set([...sentAccepted].filter((id) => receivedAccepted.has(id)));
  }, [interestsData]);

  const handleSendInterest = useCallback(
    (profile: Profile) => {
      if (!user) {
        toast({
          title: "Sign in to send a proposal",
          description: "Create a free profile or sign in to send heartfelt proposals.",
        });
        setAuthOpen(true);
        return;
      }
      if (profile.id === user.id) {
        toast({
          title: "That's your own profile",
          description: "You cannot send a proposal to yourself.",
        });
        return;
      }
      setInterestTarget(profile);
      setInterestDialogOpen(true);
    },
    [user]
  );

  const handleInterestSuccess = useCallback(
    (target: Profile | null) => {
      if (target) {
        markProposed(target.id);
        // Realtime relay: notify the recipient if they're online
        if (user) {
          getSocket()
            .then((socket) => {
              socket.emit("notify", {
                toId: target.id,
                notification: {
                  type: "proposal",
                  title: `New proposal from ${user.fullName.split(" ")[0]}`,
                  body: "Someone respects your profile and wishes to connect family-to-family.",
                },
              });
            })
            .catch(() => {});
        }
        toast({
          title: "Proposal sent",
          description: "Insha'Allah they'll respond soon. May Allah bless your search.",
        });
      }
      setInterestTarget(null);
    },
    [markProposed, user]
  );

  const openAuth = useCallback(() => setAuthOpen(true), []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar view={view} navigate={navigate} onOpenAuth={openAuth} />

      <div className="flex-1">
        {view.name === "landing" && (
          <LandingView
            navigate={navigate}
            onViewProfile={(p) => navigate({ name: "profile", id: p.id })}
            onSendInterest={handleSendInterest}
            interestedIds={interestedIds}
            initialHero={initial?.heroProfiles}
            initialFeatured={initial?.featuredProfiles}
          />
        )}

        {view.name === "browse" && (
          <BrowseView
            initialGender={view.gender}
            navigate={navigate}
            onViewProfile={(p) => navigate({ name: "profile", id: p.id })}
            onSendInterest={handleSendInterest}
            interestedIds={interestedIds}
          />
        )}

        {view.name === "profile" && (
          <ProfileDetailView
            id={view.id}
            navigate={navigate}
            onSendInterest={handleSendInterest}
            isInterested={interestedIds.has(view.id)}
            isOwnProfile={user?.id === view.id}
          />
        )}

        {view.name === "register" && <RegisterView navigate={navigate} />}

        {view.name === "interests" && (
          <MatchesView
            navigate={navigate}
            onViewProfile={(id) => navigate({ name: "profile", id })}
          />
        )}

        {view.name === "chat" && <ChatView navigate={navigate} withId={view.withId} />}


        {view.name === "trust" && <TrustView navigate={navigate} />}

        {view.name === "pricing" && <PricingView navigate={navigate} />}

        {view.name === "stories" && <StoriesView navigate={navigate} />}

        {view.name === "approach" && <ApproachView navigate={navigate} />}

        {view.name === "info" && <InfoView page={view.page} navigate={navigate} />}

        {view.name === "admin" &&
          (user?.role === "admin" ? (
            <AdminView navigate={navigate} />
          ) : (
            <section
              aria-label="Access restricted"
              className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                <ShieldAlert className="h-8 w-8 text-destructive" aria-hidden />
              </span>
              <h1 className="font-display text-2xl font-bold">403 — Admin access only</h1>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                This operations console is restricted to Qabiltoo administrators.
                If you believe you should have access, please contact the platform team.
              </p>
              {!user && (
                <Button className="rounded-full" onClick={() => setAuthOpen(true)}>
                  Sign In
                </Button>
              )}
              <Button variant="outline" className="rounded-full" onClick={() => navigate({ name: "landing" })}>
                Back to Home
              </Button>
            </section>
          ))}
      </div>

      <Footer navigate={navigate} />

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onGoRegister={() => navigate({ name: "register" })}
        onLoggedIn={(profile) => {
          navigate({ name: "profile", id: profile.id });
          toast({
            title: `Assalamualaikum, ${profile.fullName.split(" ")[0]}`,
            description: "You are signed in — this is your profile.",
            duration: 1000,
          });
        }}
      />
      <SendInterestDialog
        profile={interestTarget}
        open={interestDialogOpen}
        onOpenChange={setInterestDialogOpen}
        onSuccess={() => handleInterestSuccess(interestTarget)}
      />
    </div>
  );
}

export function QabiltooApp({ initial }: { initial?: QabiltooInitialData } = {}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <QabiltooShell initial={initial} />
    </QueryClientProvider>
  );
}
