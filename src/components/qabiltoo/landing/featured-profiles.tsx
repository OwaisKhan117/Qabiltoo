"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BriefcaseBusiness, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurredPhoto } from "../shared/blurred-photo";
import { VerificationBadge } from "../shared/verification-badge";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import { displayName, type Profile, type ProfilesResponse, type View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

async function fetchFeatured(): Promise<ProfilesResponse> {
  const res = await fetch("/api/profiles?limit=8&sort=trust");
  if (!res.ok) throw new Error("Failed to fetch featured profiles");
  const data: ProfilesResponse = await res.json();
  /* Interleave brides & grooms for a balanced, respectful showcase */
  const brides = data.profiles.filter((p) => p.gender === "female");
  const grooms = data.profiles.filter((p) => p.gender === "male");
  const mixed: Profile[] = [];
  for (let i = 0; mixed.length < 8 && i < Math.max(brides.length, grooms.length); i++) {
    if (brides[i]) mixed.push(brides[i]);
    if (grooms[i]) mixed.push(grooms[i]);
  }
  return { profiles: mixed.slice(0, 8), total: data.total, page: 1, totalPages: 1 };
}

interface FeaturedCardProps {
  profile: Profile;
  onViewProfile: (p: Profile) => void;
  onSendInterest: (p: Profile) => void;
  sent: boolean;
}

function FeaturedCard({ profile, onViewProfile, onSendInterest, sent }: FeaturedCardProps) {
  const isFemale = profile.gender === "female";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-xl hover:shadow-gold-500/10">
      {/* Photo — always blurred until connected */}
      <div className="relative aspect-[4/4.2] w-full">
        <BlurredPhoto
          src={profile.image}
          alt={`Profile of ${displayName(profile.fullName)}`}
          className="absolute inset-0"
          overlayLabel="Photos are private until connected"
        />
        <span
          className={cn(
            "absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow",
            isFemale ? "bg-gold-600/90" : "bg-emerald-700/90"
          )}
        >
          {isFemale ? "Bride" : "Groom"}
        </span>
        <span className="absolute right-3 top-3 z-10">
          <VerificationBadge tier={profile.verificationTier} iconSize={14} />
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="font-display text-lg font-bold text-foreground">
          {displayName(profile.fullName)}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">
            {profile.age} yrs · {profile.city}, {profile.country}
          </span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{profile.profession}</span>
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">
          {profile.about}
        </p>

        <div className="mt-auto flex gap-2 pt-4">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-primary/30 hover:border-primary/60"
            onClick={() => onViewProfile(profile)}
          >
            View Profile
          </Button>
          <Button
            className={cn(
              "flex-1 rounded-full",
              sent && "border border-gold-500/60 bg-gold-500/10 text-gold-700 dark:text-gold-300"
            )}
            disabled={sent}
            onClick={() => onSendInterest(profile)}
          >
            <Heart className={cn("h-4 w-4", sent && "fill-current")} aria-hidden />
            <span className="truncate">{sent ? "Proposal Sent" : "Send Proposal"}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

interface FeaturedProfilesProps {
  navigate: (view: View) => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  interestedIds: Set<string>;
}

export function FeaturedProfiles({
  navigate,
  onViewProfile,
  onSendInterest,
  interestedIds,
}: FeaturedProfilesProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-profiles-trust"],
    queryFn: fetchFeatured,
    staleTime: 30_000,
  });

  return (
    <section className="py-20 lg:py-28" aria-label="Featured profiles">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          arabic="مختارون"
          eyebrow="Featured Profiles"
          title="Sincere hearts, verified and waiting"
          description="A glimpse of our most trusted members. Photos stay blurred — out of respect — until families connect."
        />

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-border">
                  <Skeleton className="aspect-[4/4.2] rounded-none" />
                  <div className="space-y-2.5 p-5">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-full rounded-full" />
                  </div>
                </div>
              ))
            : data?.profiles.map((profile, i) => (
                <Reveal key={profile.id} delay={(i % 4) * 0.1} duration={0.8} className="h-full">
                  <FeaturedCard
                    profile={profile}
                    onViewProfile={onViewProfile}
                    onSendInterest={onSendInterest}
                    sent={interestedIds.has(profile.id)}
                  />
                </Reveal>
              ))}
        </div>

        <Reveal delay={0.2} className="mt-12 text-center">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-primary/30 px-8 hover:border-primary/60"
            onClick={() => navigate({ name: "browse" })}
          >
            View all profiles
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
