"use client";

import { motion } from "framer-motion";
import { PatternOverlay } from "../pattern";

const STATS = [
  { value: "50,000+", label: "Verified Members" },
  { value: "12,400+", label: "Nikahs Solemnized" },
  { value: "400+", label: "Cities & Towns" },
  { value: "4.8★", label: "Community Rating" },
];

export function StatsStrip() {
  return (
    <section className="relative overflow-hidden bg-primary py-10 text-primary-foreground" aria-label="Community statistics">
      <PatternOverlay className="text-white/10" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center"
          >
            <p className="font-display text-3xl font-bold text-gold-300 sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-primary-foreground/80">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
