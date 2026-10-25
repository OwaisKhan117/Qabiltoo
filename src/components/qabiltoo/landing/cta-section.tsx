"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatternOverlay } from "../pattern";
import { Reveal } from "../shared/reveal";
import type { View } from "@/lib/qabiltoo/types";

const GirihCanvas = dynamic(
  () => import("../shared/girih-canvas").then((m) => ({ default: m.GirihCanvas })),
  { ssr: false }
);

export function CtaSection({ navigate }: { navigate: (view: View) => void }) {
  return (
    <section className="py-20 lg:py-24" aria-label="Begin your journey">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="scale" duration={1}>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 px-6 py-16 text-center text-white shadow-2xl shadow-emerald-950/30 sm:px-12 lg:py-20">
            {/* faint girih lattice + pattern */}
            <div className="absolute inset-0 opacity-30">
              <GirihCanvas color="#d4af37" density={5} speed={0.6} opacity={0.7} />
            </div>
            <PatternOverlay className="text-white/5" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <p
                className="font-arabic text-3xl text-gold-300/90 sm:text-4xl"
                lang="ar"
                aria-hidden="true"
              >
                رِزْقٌ مَكْتُوب
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
                Your nikah is written — we help you find it
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80">
                Trust in Allah, take the dignified first step. Join thousands of families who
                began with a single Salaam — free, private and blessed with barakah.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate({ name: "register" })}
                  className="btn-gold-shimmer w-full rounded-full bg-gold-500 text-base font-semibold text-emerald-950 shadow-lg shadow-gold-500/30 hover:bg-gold-400 sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Begin Free — Create Profile
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ name: "pricing" })}
                  className="w-full rounded-full border-white/35 bg-white/5 text-base text-white hover:border-gold-300/60 hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  Explore Membership
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
