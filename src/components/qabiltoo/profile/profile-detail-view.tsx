"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  GraduationCap,
  Heart,
  Banknote,
  MapPin,
  Moon,
  Ruler,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PatternOverlay, OrnamentDivider } from "../pattern";
import type { Profile, View } from "@/lib/qabiltoo/types";

interface ProfileDetailViewProps {
  id: string;
  navigate: (view: View) => void;
  onSendInterest: (profile: Profile) => void;
  isInterested: boolean;
  isOwnProfile: boolean;
}

interface ProfileDetailResponse {
  profile: Profile;
}

export function ProfileDetailView({
  id,
  navigate,
  onSendInterest,
  isInterested,
  isOwnProfile,
}: ProfileDetailViewProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", id],
    queryFn: async (): Promise<ProfileDetailResponse> => {
      const res = await fetch(`/api/profiles/${id}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });

  if (isError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold">Profile not found</h1>
        <p className="mt-2 text-muted-foreground">This profile may have been removed.</p>
        <Button className="mt-6 rounded-full" onClick={() => navigate({ name: "browse" })}>
          Back to Browse
        </Button>
      </main>
    );
  }

  if (isLoading || !data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-9 w-40 rounded-full" />
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Skeleton className="aspect-[4/4.6] rounded-[2rem]" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  const profile = data.profile;
  const isFemale = profile.gender === "female";

  return (
    <main className="relative">
      {/* header band */}
      <div className="relative overflow-hidden bg-primary pb-24 pt-8 text-primary-foreground">
        <PatternOverlay className="text-white/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ name: "browse" })}
            className="flex items-center gap-1.5 text-sm text-primary-foreground/75 transition-colors hover:text-gold-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to profiles
          </button>
        </div>
      </div>

      <div className="mx-auto -mt-20 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Photo card */}
          <div className="relative z-10 mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative overflow-hidden rounded-t-[9rem] rounded-b-[1.5rem] border-4 border-card shadow-2xl shadow-primary/15">
              <div className="relative aspect-[4/4.8]">
                <Image
                  src={profile.image}
                  alt={`Profile photo of ${profile.fullName}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 380px"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    isFemale ? "bg-gold-600/90" : "bg-primary/90"
                  }`}
                >
                  {isFemale ? "Bride" : "Groom"} · {profile.age} yrs
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="relative z-10">
            {isOwnProfile && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-gold-500/40 bg-gold-50 px-4 py-2.5 text-sm text-gold-700 dark:bg-gold-500/10 dark:text-gold-400">
                <Sparkles className="h-4 w-4" /> This is your profile — members see this exactly
                as shown.
              </div>
            )}

            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="flex items-center gap-2 font-display text-3xl font-bold">
                    {profile.fullName}
                    <BadgeCheck className="h-6 w-6 text-primary" aria-label="Verified profile" />
                  </h1>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <UserRound className="h-4 w-4 text-primary" /> {profile.age} yrs
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ruler className="h-4 w-4 text-primary" /> {profile.height}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" /> {profile.city}, {profile.state}
                    </span>
                  </p>
                </div>
                {!isOwnProfile && (
                  <Button
                    size="lg"
                    className="rounded-full shadow-md shadow-primary/20"
                    onClick={() => onSendInterest(profile)}
                    disabled={isInterested}
                  >
                    <Heart className={isInterested ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                    {isInterested ? "Interest Sent" : "Send Interest"}
                  </Button>
                )}
              </div>

              <OrnamentDivider className="my-6" />

              {/* About */}
              <section aria-label="About">
                <h2 className="font-display text-lg font-bold">About {profile.fullName.split(" ")[0]}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{profile.about}</p>
              </section>

              {/* Facts grid */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: GraduationCap, label: "Education", value: profile.education },
                  { icon: BriefcaseBusiness, label: "Profession", value: profile.profession },
                  { icon: Banknote, label: "Annual Income", value: profile.income || "Prefer not to say" },
                  { icon: Heart, label: "Marital Status", value: profile.maritalStatus },
                  { icon: Moon, label: "Sect", value: profile.sect || "Just Muslim" },
                  { icon: Sparkles, label: "Religious Level", value: profile.religiousLevel || "Moderate" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="truncate font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Namaz */}
              {profile.namaz && (
                <div className="mt-4 rounded-2xl border border-gold-500/30 bg-gold-50 p-4 dark:bg-gold-500/10">
                  <p className="text-sm">
                    <span className="font-bold text-gold-700 dark:text-gold-400">Namaz: </span>
                    {profile.namaz}
                  </p>
                </div>
              )}

              {/* Partner preference */}
              {profile.partnerPreference && (
                <section className="mt-6" aria-label="Partner preference">
                  <h2 className="font-display text-lg font-bold">Looking for</h2>
                  <p className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-4 leading-relaxed text-muted-foreground">
                    {profile.partnerPreference}
                  </p>
                </section>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="secondary">{isFemale ? "Bride" : "Groom"}</Badge>
                <Badge variant="secondary">{profile.maritalStatus}</Badge>
                {profile.sect && <Badge variant="secondary">{profile.sect}</Badge>}
                <Badge variant="secondary">Profile Verified</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
