"use client";

import dynamic from "next/dynamic";
import { CountUp } from "../shared/count-up";
import { Reveal } from "../shared/reveal";

const LightMotes = dynamic(
  () => import("../shared/light-motes").then((m) => ({ default: m.LightMotes })),
  { ssr: false }
);

const STATS = [
  { value: 50000, suffix: "+", label: "Verified Profiles" },
  { value: 12400, suffix: "+", label: "Matches This Year" },
  { value: 28, suffix: "", label: "Countries" },
  { value: 96, suffix: "%", label: "Family Approved" },
];

export function StatsStrip() {
  return (
    <section
      className="relative overflow-hidden border-y border-gold-500/15 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 py-12 text-white lg:py-14"
      aria-label="Community statistics"
    >
      {/* atmosphere */}
      <div className="absolute inset-0 opacity-70">
        <LightMotes count={22} speed={0.7} />
      </div>
      <div className="pointer-events-none absolute left-1/4 top-0 h-40 w-72 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.12} className="text-center">
              <p className="font-display text-4xl font-bold text-gold-300 sm:text-5xl">
                <CountUp to={stat.value} suffix={stat.suffix} duration={2.4} />
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-white/70">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.5}>
          <p className="mt-10 text-center text-[11px] text-white/35">
            Figures shown are illustrative sample data for this prototype
          </p>
        </Reveal>
      </div>
    </section>
  );
}
