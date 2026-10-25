"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AuthDialog } from "./auth-dialog";
import { LandingView } from "./landing/landing-view";
import { BrowseView } from "./browse/browse-view";
import { ProfileDetailView } from "./profile/profile-detail-view";
import { SendInterestDialog } from "./profile/send-interest-dialog";
import { RegisterView } from "./register/register-view";
import { MatchesView } from "./matches/matches-view";
import { ChatView } from "./chat/chat-view";
import { GuardianView } from "./guardian/guardian-view";
import { TrustView } from "./trust/trust-view";
import { PricingView } from "./pricing/pricing-view";
import { StoriesView } from "./stories-page/stories-view";
import { ApproachView } from "./approach/approach-view";
import { InfoView } from "./info/info-view";
import { AdminView } from "./admin/admin-view";
import { useAuthStore } from "@/lib/qabiltoo/store";
import { getSocket, useSocketEvent } from "@/lib/qabiltoo/socket";
import type { InterestWithProfile, NotificationItem, Profile, View } from "@/lib/qabiltoo/types";

function QabiltooShell() {
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

  /* ── Socket identity + realtime notifications ─────────────── */
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    socket.emit("identity", { profileId: user.id, name: user.fullName });
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
        const socket = getSocket();
        if (user) {
          socket.emit("notify", {
            toId: target.id,
            notification: {
              type: "proposal",
              title: `New proposal from ${user.fullName.split(" ")[0]}`,
              body: "Someone respects your profile and wishes to connect family-to-family.",
            },
          });
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

        {view.name === "guardian" && <GuardianView navigate={navigate} />}

        {view.name === "trust" && <TrustView navigate={navigate} />}

        {view.name === "pricing" && <PricingView navigate={navigate} />}

        {view.name === "stories" && <StoriesView navigate={navigate} />}

        {view.name === "approach" && <ApproachView navigate={navigate} />}

        {view.name === "info" && <InfoView page={view.page} navigate={navigate} />}

        {view.name === "admin" && <AdminView navigate={navigate} />}
      </div>

      <Footer navigate={navigate} />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onGoRegister={() => navigate({ name: "register" })} />
      <SendInterestDialog
        profile={interestTarget}
        open={interestDialogOpen}
        onOpenChange={setInterestDialogOpen}
        onSuccess={() => handleInterestSuccess(interestTarget)}
      />
    </div>
  );
}

export function QabiltooApp() {
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
      <QabiltooShell />
    </QueryClientProvider>
  );
}
