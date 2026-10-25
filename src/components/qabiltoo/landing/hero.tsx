"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, BadgeCheck, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatternOverlay } from "../pattern";
import type { View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

interface HeroProps {
  navigate: (view: View) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero({ navigate }: HeroProps) {
  const [gender, setGender] = useState<string>("female");
  const [ageMin, setAgeMin] = useState("21");
  const [ageMax, setAgeMax] = useState("30");
  const [city, setCity] = useState("");

  function handleSearch() {
    navigate({
      name: "browse",
      gender,
    });
    // stash extra filters for browse view
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "qabiltoo-search",
        JSON.stringify({ gender, ageMin, ageMax, city })
      );
    }
  }

  return (
    <section className="relative overflow-hidden" aria-label="Hero">
      <PatternOverlay className="text-primary/40 opacity-40" />
      {/* soft gold radial glow */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-gold-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        {/* ---- Left: copy + search ---- */}
        <div className="max-w-xl">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-4 flex items-center gap-3 text-sm font-medium text-gold-700 dark:text-gold-400"
          >
            <span className="font-serif text-xl leading-none text-gold-600 dark:text-gold-400" lang="ar">
              السَّلَامُ عَلَيْكُمْ
            </span>
            <span className="h-px w-8 bg-gold-500/60" />
            <span>Welcome to Qabiltoo</span>
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Where <span className="italic text-primary">Faith</span> Finds Its{" "}
            <span className="relative inline-block text-gradient-gold">
              Forever
              <svg
                viewBox="0 0 220 12"
                className="absolute -bottom-1 left-0 w-full text-gold-500/70"
                aria-hidden="true"
              >
                <path
                  d="M3 9c40-6 120-8 214-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            India&apos;s most trusted Muslim matrimony — built on the belief that every heart
            deserves a <span className="font-semibold text-foreground">qabil</span> partner.
            Verified profiles, halal interactions, and families involved every step of the way.
          </motion.p>

          {/* Search card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 rounded-2xl border border-border bg-card/90 p-4 shadow-xl shadow-primary/5 backdrop-blur sm:p-5"
          >
            <div className="mb-4 flex gap-2" role="tablist" aria-label="I am looking for">
              {[
                { value: "female", label: "A Bride" },
                { value: "male", label: "A Groom" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  role="tab"
                  aria-selected={gender === opt.value}
                  onClick={() => setGender(opt.value)}
                  className={cn(
                    "flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                    gender === opt.value
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1.3fr]">
              <Select value={ageMin} onValueChange={setAgeMin}>
                <SelectTrigger aria-label="Minimum age">
                  <SelectValue placeholder="Age from" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 42 }, (_, i) => i + 18).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} yrs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ageMax} onValueChange={setAgeMax}>
                <SelectTrigger aria-label="Maximum age">
                  <SelectValue placeholder="Age to" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 42 }, (_, i) => i + 18).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} yrs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="City (e.g. Mumbai)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="col-span-2 sm:col-span-1"
                aria-label="City"
              />
            </div>

            <Button size="lg" className="mt-4 w-full gap-2 text-base" onClick={handleSearch}>
              <Search className="h-5 w-5" />
              Find My Qabil Match
            </Button>
          </motion.div>

          {/* Trust row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2.5">
              {["/images/profile-f1.png", "/images/profile-m2.png", "/images/profile-f3.png", "/images/profile-m4.png"].map(
                (src, i) => (
                  <span
                    key={i}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-background"
                  >
                    <Image src={src} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                )
              )}
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gold-500 text-[10px] font-bold text-primary-foreground">
                50K+
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-primary" /> Verified profiles
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Privacy first
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 fill-primary text-primary" /> 12,400+ nikahs
            </span>
          </motion.div>
        </div>

        {/* ---- Right: hero image in Islamic arch ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          {/* decorative ring */}
          <div className="absolute -inset-4 rounded-t-[14rem] rounded-b-[2.5rem] border border-gold-400/40 sm:-inset-6" aria-hidden="true" />
          <div className="absolute -inset-4 translate-x-3 translate-y-3 rounded-t-[14rem] rounded-b-[2.5rem] bg-gold-200/40 sm:-inset-6" aria-hidden="true" />

          <div className="relative aspect-[4/4.6] overflow-hidden rounded-t-[13rem] rounded-b-[2rem] shadow-2xl shadow-primary/20">
            <Image
              src="/images/hero-couple.png"
              alt="Happy Indian Muslim couple on their wedding day — bride in emerald and gold, groom in ivory sherwani"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent" />
          </div>

          {/* floating badge: verified */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-3 top-24 flex items-center gap-2.5 rounded-2xl border border-border bg-card/95 px-3.5 py-2.5 shadow-lg backdrop-blur sm:-left-8"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <BadgeCheck className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="text-xs font-bold">100% Verified</p>
              <p className="text-[11px] text-muted-foreground">Manual review</p>
            </div>
          </motion.div>

          {/* floating badge: match */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-2 bottom-16 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:-right-6"
          >
            <p className="flex items-center gap-1.5 text-xs font-bold">
              Nikah Fixed!
              <Heart className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Zoya &amp; Faizan · Delhi</p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-primary to-gold-500" />
            </div>
          </motion.div>

          {/* CTA link under image (mobile-friendly) */}
          <button
            onClick={() => navigate({ name: "browse" })}
            className="group mx-auto mt-8 flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 lg:hidden"
          >
            Explore profiles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
