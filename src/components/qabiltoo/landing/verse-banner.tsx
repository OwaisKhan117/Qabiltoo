"use client";

import { motion } from "framer-motion";
import { PatternOverlay, OrnamentDivider } from "../pattern";

export function VerseBanner() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-emerald-900 py-16 text-primary-foreground dark:from-primary dark:to-emerald-950"
      aria-label="Quranic verse about marriage"
    >
      <PatternOverlay className="text-white/10" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold-500/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <p className="font-serif text-3xl leading-relaxed text-gold-300 sm:text-4xl" lang="ar" dir="rtl">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
          وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </p>
        <OrnamentDivider className="my-6" />
        <blockquote className="font-display text-lg italic leading-relaxed text-primary-foreground/95 sm:text-xl">
          “And of His signs is that He created for you spouses from among yourselves, that you
          may find tranquility in them; and He placed between you affection and mercy.”
        </blockquote>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
          Surah Ar-Rum · 30:21
        </p>
      </motion.div>
    </section>
  );
}
