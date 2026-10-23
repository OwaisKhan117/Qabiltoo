"use client";

import { Hero } from "./hero";
import { StatsStrip } from "./stats-strip";
import { Features } from "./features";
import { HowItWorks } from "./how-it-works";
import { VerseBanner } from "./verse-banner";
import { SuccessStories } from "./success-stories";
import { FeaturedProfiles } from "./featured-profiles";
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
      <StatsStrip />
      <Features />
      <FeaturedProfiles
        navigate={navigate}
        onViewProfile={onViewProfile}
        onSendInterest={onSendInterest}
        interestedIds={interestedIds}
      />
      <HowItWorks navigate={navigate} />
      <VerseBanner />
      <SuccessStories />
      <Faq />
      <CtaSection navigate={navigate} />
    </main>
  );
}
