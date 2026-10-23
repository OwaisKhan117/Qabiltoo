"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../shared/section-heading";
import { Reveal } from "../shared/reveal";
import type { View } from "@/lib/qabiltoo/types";

/* The 3D carousel is client-only and lazy-loaded */
const StoriesCarousel = dynamic(
  () => import("./stories-carousel").then((m) => ({ default: m.StoriesCarousel })),
  { ssr: false }
);

export function SuccessStories({ navigate }: { navigate: (view: View) => void }) {
  return (
    <section className="relative bg-cream py-20 lg:py-28 dark:bg-card/40" aria-label="Success stories">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          arabic="قصص مباركة"
          eyebrow="Blessed Unions"
          title="Nikahs written, du'aas answered"
          description="Real couples who found each other the dignified way — with families involved and barakah throughout."
        />

        <Reveal direction="scale" duration={1}>
          <StoriesCarousel />
        </Reveal>

        <Reveal delay={0.15} className="mt-10 text-center">
          <button
            onClick={() => navigate({ name: "stories" })}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-gold-600 dark:text-emerald-300 dark:hover:text-gold-300"
          >
            Read their stories
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
