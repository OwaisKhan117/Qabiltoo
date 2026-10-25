"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatternOverlay } from "../pattern";
import type { View } from "@/lib/qabiltoo/types";

export function CtaSection({ navigate }: { navigate: (view: View) => void }) {
  return (
    <section className="relative py-20 lg:py-24" aria-label="Call to action">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/20"
        >
          {/* Background image */}
          <Image
            src="/images/mosque-golden.png"
            alt=""
            fill
            sizes="(max-width: 1280px) 95vw, 1200px"
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
          <PatternOverlay className="text-white/10" />

          <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:p-16">
            <div className="text-white">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
                <Sparkles className="h-4 w-4" /> Your story starts with Salaam
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
                Your qabil match is closer than you think.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85">
                Join 50,000+ members across India who chose faith-first matrimony. Free to
                join, dignified by design, blessed by community.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row lg:flex-col">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full bg-gold-500 text-primary-foreground hover:bg-gold-400 sm:justify-center"
                onClick={() => navigate({ name: "register" })}
              >
                Create Free Profile <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:justify-center"
                onClick={() => navigate({ name: "browse" })}
              >
                Browse Profiles First
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
