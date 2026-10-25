"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { UserRoundPlus, Search, HeartHandshake, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import type { View } from "@/lib/qabiltoo/types";

const STEPS = [
  {
    icon: UserRoundPlus,
    step: "01",
    title: "Create Your Profile",
    desc: "Share your values, deen and dreams. Takes less than 3 minutes — and it's free forever.",
  },
  {
    icon: Search,
    step: "02",
    title: "Discover Qabil Matches",
    desc: "Browse verified profiles filtered by faith, sect, city and family background.",
  },
  {
    icon: HeartHandshake,
    step: "03",
    title: "Express Interest, Respectfully",
    desc: "Send a heartfelt interest. Families connect, guardians stay involved — always halal.",
  },
  {
    icon: Gem,
    step: "04",
    title: "Nikah & Blessings",
    desc: "From istikhara to walima — thousands found their forever through Qabiltoo.",
  },
];

export function HowItWorks({ navigate }: { navigate: (view: View) => void }) {
  return (
    <section id="how-it-works" className="relative bg-cream py-20 lg:py-24 dark:bg-card/40" aria-label="How it works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] shadow-xl shadow-primary/10">
              <Image
                src="/images/couple-hands.png"
                alt="Couple holding hands — bride with mehndi and gold bangles"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 backdrop-blur dark:bg-card/90">
                <p className="font-display text-sm font-semibold">
                  “Verily, love is completed through nikah.”
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  From first Salaam to forever — together every step.
                </p>
              </div>
            </div>
            <div
              className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl border-2 border-gold-400/50 sm:-right-6 sm:-top-6"
              aria-hidden="true"
            />
          </motion.div>

          {/* Right: steps */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="The Journey"
              title="From Salaam to Nikah in four graceful steps"
              desc="No endless swiping. No awkward small talk. A dignified path designed around Islamic values and Indian family traditions."
            />

            <ol className="mt-10 space-y-6">
              {STEPS.map((s, i) => (
                <motion.li
                  key={s.step}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex gap-4"
                >
                  {i < STEPS.length - 1 && (
                    <span
                      className="absolute left-[27px] top-14 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary/40 to-transparent"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                    <s.icon className="h-6 w-6" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-primary-foreground">
                      {s.step}
                    </span>
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-lg font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <Button size="lg" className="mt-8 rounded-full" onClick={() => navigate({ name: "register" })}>
              Start Your Journey — Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
