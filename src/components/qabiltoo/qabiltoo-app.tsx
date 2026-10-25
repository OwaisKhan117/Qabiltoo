"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AuthDialog } from "./auth-dialog";
import { LandingView } from "./landing/landing-view";
import { BrowseView } from "./browse/browse-view";
import { ProfileDetailView } from "./profile/profile-detail-view";
import { SendInterestDialog } from "./profile/send-interest-dialog";
import { RegisterView } from "./register/register-view";
import { InterestsView } from "./interests/interests-view";
import { useAuthStore } from "@/lib/qabiltoo/store";
import type { InterestWithProfile, Profile, View } from "@/lib/qabiltoo/types";

function QabiltooShell() {
  const [view, setView] = useState<View>({ name: "landing" });
  const [authOpen, setAuthOpen] = useState(false);
  const [interestTarget, setInterestTarget] = useState<Profile | null>(null);
  const [interestDialogOpen, setInterestDialogOpen] = useState(false);
  const [optimisticSent, setOptimisticSent] = useState<Set<string>>(new Set());
  const user = useAuthStore((s) => s.user);

  const navigate = useCallback((next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Track which profiles the user has already sent interests to
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
    const ids = new Set(optimisticSent);
    interestsData?.sent.forEach((i) => ids.add(i.toId));
    return ids;
  }, [interestsData, optimisticSent]);

  const handleSendInterest = useCallback(
    (profile: Profile) => {
      if (!user) {
        toast({
          title: "Sign in to express interest",
          description: "Create a free profile or sign in to send heartfelt interests.",
        });
        setAuthOpen(true);
        return;
      }
      if (profile.id === user.id) {
        toast({ title: "That's you! 😊", description: "You cannot send interest to your own profile." });
        return;
      }
      setInterestTarget(profile);
      setInterestDialogOpen(true);
    },
    [user]
  );

  const handleInterestSuccess = useCallback(() => {
    if (interestTarget) {
      setOptimisticSent((prev) => new Set(prev).add(interestTarget.id));
    }
    toast({
      title: "Interest sent 💌",
      description: "Insha'Allah they'll respond soon. May Allah bless your search.",
    });
    setInterestTarget(null);
  }, [interestTarget]);

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
          <InterestsView
            navigate={navigate}
            onViewProfile={(p) => navigate({ name: "profile", id: p.id })}
            onRequireAuth={openAuth}
          />
        )}
      </div>

      <Footer navigate={navigate} />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onGoRegister={() => navigate({ name: "register" })} />
      <SendInterestDialog
        profile={interestTarget}
        open={interestDialogOpen}
        onOpenChange={setInterestDialogOpen}
        onSuccess={handleInterestSuccess}
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
