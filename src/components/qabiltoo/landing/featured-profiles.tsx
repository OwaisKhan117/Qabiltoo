"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard } from "../browse/profile-card";
import { SectionHeading } from "./section-heading";
import type { Profile, ProfilesResponse, View } from "@/lib/qabiltoo/types";

async function fetchFeatured(): Promise<ProfilesResponse> {
  // Fetch extra and interleave genders for a balanced showcase
  const res = await fetch("/api/profiles?limit=48&page=1");
  if (!res.ok) throw new Error("Failed to fetch featured profiles");
  const data: ProfilesResponse = await res.json();
  const brides = data.profiles.filter((p) => p.gender === "female");
  const grooms = data.profiles.filter((p) => p.gender === "male");
  const mixed: Profile[] = [];
  for (let i = 0; mixed.length < 4 && i < Math.max(brides.length, grooms.length); i++) {
    if (grooms[i]) mixed.push(grooms[i]);
    if (brides[i]) mixed.push(brides[i]);
  }
  return { profiles: mixed.slice(0, 4), total: data.total, page: 1, totalPages: 1 };
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
    queryKey: ["featured-profiles"],
    queryFn: fetchFeatured,
    staleTime: 30_000,
  });

  return (
    <section className="py-20 lg:py-24" aria-label="New faces on Qabiltoo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="New Faces"
          title="Fresh profiles, seeking their other half"
          desc="Handpicked newcomers on Qabiltoo — every profile manually verified before joining."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border">
                  <Skeleton className="aspect-[4/4.4] rounded-none" />
                  <div className="space-y-2.5 p-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full rounded-full" />
                  </div>
                </div>
              ))
            : data?.profiles.map((profile, i) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  index={i}
                  onView={onViewProfile}
                  onSendInterest={onSendInterest}
                  isInterested={interestedIds.has(profile.id)}
                />
              ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" variant="outline" className="rounded-full" onClick={() => navigate({ name: "browse" })}>
            View All Profiles <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
