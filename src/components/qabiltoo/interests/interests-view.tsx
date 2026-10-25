"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeftRight,
  Check,
  Heart,
  Inbox,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PatternOverlay } from "../pattern";
import { useAuthStore } from "@/lib/qabiltoo/store";
import { useMounted } from "@/hooks/use-mounted";
import type { InterestWithProfile, Profile, View } from "@/lib/qabiltoo/types";

interface InterestsViewProps {
  navigate: (view: View) => void;
  onViewProfile: (profile: Profile) => void;
  onRequireAuth: () => void;
}

async function fetchInterests(profileId: string): Promise<{ sent: InterestWithProfile[]; received: InterestWithProfile[] }> {
  const res = await fetch(`/api/interests?profileId=${profileId}`);
  if (!res.ok) throw new Error("Failed to fetch interests");
  return res.json();
}

function StatusBadge({ status }: { status: string }) {
  if (status === "accepted")
    return <Badge className="bg-primary text-primary-foreground">Accepted ✓</Badge>;
  if (status === "declined") return <Badge variant="destructive">Declined</Badge>;
  return <Badge variant="secondary" className="bg-gold-500/15 text-gold-700 dark:text-gold-400">Pending</Badge>;
}

function ProfileMini({
  profile,
  onView,
  children,
}: {
  profile: Profile;
  onView: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <button onClick={onView} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={profile.image}
          alt={profile.fullName}
          fill
          sizes="80px"
          className="object-cover transition-transform hover:scale-105"
        />
      </button>
      <div className="min-w-0 flex-1">
        <button onClick={onView} className="text-left">
          <p className="font-display font-bold hover:text-primary">{profile.fullName}</p>
        </button>
        <p className="text-sm text-muted-foreground">
          {profile.age} yrs · {profile.profession} · {profile.city}
        </p>
        {children}
      </div>
    </div>
  );
}

export function InterestsView({ navigate, onViewProfile, onRequireAuth }: InterestsViewProps) {
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [actingId, setActingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["interests", user?.id],
    queryFn: () => fetchInterests(user!.id),
    enabled: !!user,
    refetchInterval: 15_000,
  });

  async function respond(interestId: string, status: "accepted" | "declined") {
    if (!user) return;
    setActingId(interestId);
    try {
      const res = await fetch(`/api/interests/${interestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, profileId: user.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: err.error ?? "Failed to respond", variant: "destructive" });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["interests", user.id] });
      toast({
        title: status === "accepted" ? "Interest accepted 🎉" : "Interest declined",
        description:
          status === "accepted"
            ? "Barakallahu feek! You can now connect as families."
            : "JazakAllah khair for your response.",
      });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setActingId(null);
    }
  }

  if (!mounted || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-border bg-card p-10 text-center shadow-lg">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/15">
            <Heart className="h-7 w-7 fill-gold-500 text-gold-500" />
          </span>
          <h1 className="font-display text-2xl font-bold">Sign in to see your interests</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Interests are private — sign in to view who expressed interest in you and manage
            your sent proposals.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="rounded-full" onClick={onRequireAuth}>
              Sign In
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => navigate({ name: "register" })}>
              Create Free Profile
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="relative overflow-hidden bg-primary py-12 text-primary-foreground">
        <PatternOverlay className="text-white/10" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">My Interests</h1>
          <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">
            Assalamu Alaikum, {user.fullName.split(" ")[0]} — here&apos;s your proposal inbox.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {isError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
            Couldn&apos;t load your interests. Please refresh and try again.
          </div>
        ) : (
          <Tabs defaultValue="received">
            <TabsList className="grid w-full grid-cols-2 rounded-full sm:w-96">
              <TabsTrigger value="received" className="rounded-full gap-2">
                <Inbox className="h-4 w-4" /> Received
                {data?.received.filter((i) => i.status === "pending").length ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-white">
                    {data.received.filter((i) => i.status === "pending").length}
                  </span>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="sent" className="rounded-full gap-2">
                <ArrowLeftRight className="h-4 w-4" /> Sent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="mt-6 space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
              ) : data && data.received.length > 0 ? (
                data.received.map((interest) => (
                  <div
                    key={interest.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <ProfileMini
                      profile={interest.from}
                      onView={() => onViewProfile(interest.from)}
                    >
                      {interest.message && (
                        <p className="mt-2 rounded-xl bg-muted/60 p-3 text-sm italic text-muted-foreground">
                          “{interest.message}”
                        </p>
                      )}
                    </ProfileMini>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                      <StatusBadge status={interest.status} />
                      {interest.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            disabled={actingId === interest.id}
                            onClick={() => respond(interest.id, "declined")}
                          >
                            {actingId === interest.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-full"
                            disabled={actingId === interest.id}
                            onClick={() => respond(interest.id, "accepted")}
                          >
                            {actingId === interest.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed p-12 text-center">
                  <p className="font-display text-lg font-bold">No interests yet</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    When someone expresses interest in you, it will appear here. Keep your
                    profile shining!
                  </p>
                  <Button variant="outline" className="mt-5 rounded-full" onClick={() => navigate({ name: "browse" })}>
                    Browse Profiles
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-6 space-y-4">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
              ) : data && data.sent.length > 0 ? (
                data.sent.map((interest) => (
                  <div key={interest.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <ProfileMini profile={interest.to} onView={() => onViewProfile(interest.to)}>
                      {interest.message && (
                        <p className="mt-2 rounded-xl bg-muted/60 p-3 text-sm italic text-muted-foreground">
                          You wrote: “{interest.message}”
                        </p>
                      )}
                    </ProfileMini>
                    <div className="mt-3 flex justify-end border-t pt-3">
                      <StatusBadge status={interest.status} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed p-12 text-center">
                  <p className="font-display text-lg font-bold">You haven&apos;t sent any interests</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    Found someone whose deen and values resonate with yours? Send a heartfelt
                    interest — with dua, everything is possible.
                  </p>
                  <Button className="mt-5 rounded-full" onClick={() => navigate({ name: "browse" })}>
                    Find Your Match
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
