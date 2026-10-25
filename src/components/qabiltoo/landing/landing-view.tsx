"use client";

import { ActivityTicker } from "./activity-ticker";
import { Hero } from "./hero";
import { StatsStrip } from "./stats-strip";
import { HowItWorks } from "./how-it-works";
import { FeaturedProfiles } from "./featured-profiles";
import { VerseBanner } from "./verse-banner";
import { SuccessStories } from "./success-stories";
import { TrustBadges } from "./features";
import { ApproachPreview } from "./approach-preview";
import { Faq } from "./faq";
import { CtaSection } from "./cta-section";
import type { Profile, View } from "@/lib/qabiltoo/types";

interface LandingViewProps {
  navigate: (view: View) => void;
  onViewProfile: (profile: Profile) => void;
  onSendInterest: (profile: Profile) => void;
  interestedIds: Set<string>;
}

export function LandingView({
  navigate,
  onViewProfile,
  onSendInterest,
  interestedIds,
}: LandingViewProps) {
  return (
    <main>
      <Hero navigate={navigate} />
      <ActivityTicker />
      <StatsStrip />
      <HowItWorks />
      <FeaturedProfiles
        navigate={navigate}
        onViewProfile={onViewProfile}
        onSendInterest={onSendInterest}
        interestedIds={interestedIds}
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
