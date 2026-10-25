"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin, Quote } from "lucide-react";
import { SectionHeading } from "./section-heading";

const STORIES = [
  {
    image: "/images/success-couple-1.png",
    names: "Zoya & Faizan",
    detail: "Married in New Delhi · 2024",
    quote:
      "We matched over a shared love of Quran tafsir and street food. Qabiltoo kept it respectful from the very first interest.",
  },
  {
    image: "/images/success-couple-2.png",
    names: "Aaliya & Owais",
    detail: "Nikah in Chennai · 2024",
    quote:
      "Our families spoke within a week. What I loved most — guardians were part of every conversation, just like it should be.",
  },
  {
    image: "/images/success-couple-3.png",
    names: "Hafsa & Tariq",
    detail: "Married in Bengaluru · 2025",
    quote:
      "I had almost given up on matrimony apps. Qabiltoo's verified profiles and sincere members restored my trust, alhamdulillah.",
  },
];

export function SuccessStories() {
  return (
    <section id="stories" className="py-20 lg:py-24" aria-label="Success stories">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Blessed Unions"
          title="Thousands of nikahs, countless du'aas answered"
          desc="Real couples, real love stories — written with the barakah of family and faith."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STORIES.map((story, i) => (
            <motion.article
              key={story.names}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="relative aspect-[4/3.2] overflow-hidden">
                <Image
                  src={story.image}
                  alt={`${story.names} — happy Indian Muslim couple`}
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-display text-xl font-bold drop-shadow">{story.names}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-white/85">
                    <MapPin className="h-3.5 w-3.5" /> {story.detail}
                  </p>
                </div>
                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md">
                  <Heart className="h-4.5 w-4.5 fill-gold-500 text-gold-500" />
                </span>
              </div>
              <div className="p-5">
                <Quote className="mb-2 h-5 w-5 text-gold-500" />
                <p className="text-sm leading-relaxed text-muted-foreground">{story.quote}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
