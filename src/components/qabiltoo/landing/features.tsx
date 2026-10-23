"use client";

import { motion } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  BadgeCheck,
  Users,
  SlidersHorizontal,
  Lock,
} from "lucide-react";
import { SectionHeading } from "./section-heading";

const FEATURES = [
  {
    icon: HeartHandshake,
    title: "Faith-Centered Matching",
    desc: "Match on what truly matters — deen, namaz, sect and family values — not just looks.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    desc: "Every profile passes manual review. Look for the verified badge before you express interest.",
    color: "bg-gold-500/15 text-gold-600",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    desc: "Names are masked until you connect. No public listings, no data selling — ever.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Family Involvement",
    desc: "Built for the walima, not just the wish. Share profiles with parents and guardians easily.",
    color: "bg-gold-500/15 text-gold-600",
  },
  {
    icon: SlidersHorizontal,
    title: "Thoughtful Filters",
    desc: "Filter by age, city, sect, profession, religious commitment and marital history.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Respectful",
    desc: "Moderated conversations, guardian-first etiquette and zero tolerance for misconduct.",
    color: "bg-gold-500/15 text-gold-600",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 lg:py-24" aria-label="Why Qabiltoo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Qabiltoo"
          title="Matrimony, the way it was meant to be"
          desc="Qabil (قابل) means worthy. We help you find a partner worthy of your deen, your dreams and your family's trust."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold-200/30 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
              <span
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
