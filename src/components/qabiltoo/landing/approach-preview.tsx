"use client";

import Image from "next/image";
import { ArrowRight, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "../shared/reveal";
import type { View } from "@/lib/qabiltoo/types";

const VALUES = [
  {
    title: "Halal by design",
    desc: "Every interaction is purposeful, respectful and intended for nikah.",
  },
  {
    title: "Privacy-first",
    desc: "Photos blurred and names masked — you choose what the world sees.",
  },
  {
    title: "Family involvement",
    desc: "Guardians can view, guide and approve every step of the journey.",
  },
  {
    title: "Verified trust",
    desc: "Tiered ID verification keeps our community sincere and safe.",
  },
];

export function ApproachPreview({ navigate }: { navigate: (view: View) => void }) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28" aria-label="Our Islamic approach">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Editorial text */}
        <div>
          <Reveal>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-600 dark:text-gold-400">
              Our Islamic Approach
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Matchmaking the way Islam{" "}
              <span className="italic text-primary dark:text-emerald-300">intended</span> it
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Nikah is half of one&apos;s deen — too important to leave to chance, and too
              sacred to rush. Qabiltoo honours the sunnah: sincere intention, guarded
              interaction, and two families united in blessing.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={0.1 + i * 0.1} direction="left" distance={20}>
                <li className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold-500/15">
                    <Diamond className="h-3.5 w-3.5 text-gold-600 dark:text-gold-400" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{value.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {value.desc}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.4}>
            <Button
              size="lg"
              className="btn-gold-shimmer mt-9 rounded-full bg-gold-500 font-semibold text-emerald-950 shadow-lg shadow-gold-500/25 hover:bg-gold-400"
              onClick={() => navigate({ name: "approach" })}
            >
              Read Our Approach
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Reveal>
        </div>

        {/* Mosque image in an elegant arch frame */}
        <Reveal direction="scale" duration={1.1} className="relative">
          <div className="relative mx-auto w-64 sm:w-80 lg:w-[22rem]">
            <div
              className="absolute -inset-4 rounded-t-full rounded-b-[2.5rem] border border-gold-400/40 sm:-inset-6"
              aria-hidden="true"
            />
            <div
              className="absolute -inset-4 translate-x-4 translate-y-4 rounded-t-full rounded-b-[2.5rem] bg-gold-200/30 sm:-inset-6"
              aria-hidden="true"
            />
            <div className="relative aspect-[3/4.4] overflow-hidden rounded-t-full rounded-b-[2rem] shadow-2xl shadow-primary/15">
              <Image
                src="/images/mosque-golden.png"
                alt="A mosque bathed in golden hour light — a symbol of the blessed nikah journey"
                fill
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 352px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
