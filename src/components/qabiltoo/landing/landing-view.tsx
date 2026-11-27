"use client";

import { Hero } from "./hero";
import { StatsStrip } from "./stats-strip";
import { FeaturedProfiles } from "./featured-profiles";
import { VerseBanner } from "./verse-banner";
import { MemberSpotlight } from "./member-spotlight";
import { SuccessStories } from "./success-stories";
import { TrustBadges } from "./features";
import { ApproachPreview } from "./approach-preview";
import { Faq } from "./faq";
import { CtaSection } from "./cta-section";
import type { ProfilesResponse, Profile, View } from "@/lib/qabiltoo/types";

interface LandingViewProps {
  navigate: (view: View) => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  interestedIds: Set<string>;
  /** Server-fetched initial data (ISR) — hero + featured render in SSR HTML */
  initialHero?: ProfilesResponse;
  initialFeatured?: ProfilesResponse;
}

export function LandingView({
  navigate,
  onViewProfile,
  onSendInterest,
  interestedIds,
  initialHero,
  initialFeatured,
}: LandingViewProps) {
  return (
    <main>
      <Hero navigate={navigate} initialHero={initialHero} />
      <StatsStrip />
      <MemberSpotlight />
      <FeaturedProfiles
        navigate={navigate}
        onViewProfile={onViewProfile}
        onSendInterest={onSendInterest}
        interestedIds={interestedIds}
        initialFeatured={initialFeatured}
      />
      <VerseBanner />
      <SuccessStories navigate={navigate} />
      <TrustBadges />
      <ApproachPreview navigate={navigate} />
      <Faq navigate={navigate} />
      <CtaSection navigate={navigate} />
    </main>
  );
}
