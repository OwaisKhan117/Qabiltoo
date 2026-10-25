"use client";

import dynamic from "next/dynamic";
import { OrnamentDivider, PatternOverlay } from "../pattern";
import { Reveal } from "../shared/reveal";

const LightMotes = dynamic(
  () => import("../shared/light-motes").then((m) => ({ default: m.LightMotes })),
  { ssr: false }
);

export function VerseBanner() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 py-20 text-white lg:py-24"
      aria-label="Quranic verse about marriage"
    >
      <div className="absolute inset-0 opacity-60">
        <LightMotes count={26} speed={0.7} />
      </div>
      <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal direction="scale" duration={1}>
          {/* Gold ornament frame */}
          <figure className="relative rounded-[2rem] border border-gold-400/35 bg-emerald-950/40 px-6 py-12 text-center shadow-2xl shadow-emerald-950/50 backdrop-blur-sm sm:px-14">
            {/* corner ornaments */}
            <span className="absolute left-3 top-3 h-7 w-7 rounded-tl-xl border-l-2 border-t-2 border-gold-400/70" aria-hidden="true" />
            <span className="absolute right-3 top-3 h-7 w-7 rounded-tr-xl border-r-2 border-t-2 border-gold-400/70" aria-hidden="true" />
            <span className="absolute bottom-3 left-3 h-7 w-7 rounded-bl-xl border-b-2 border-l-2 border-gold-400/70" aria-hidden="true" />
            <span className="absolute bottom-3 right-3 h-7 w-7 rounded-br-xl border-b-2 border-r-2 border-gold-400/70" aria-hidden="true" />

            <PatternOverlay className="text-white/5" />

            <blockquote className="relative">
              <p
                className="font-arabic text-2xl leading-[2.1] text-gold-100 sm:text-[1.75rem] sm:leading-[2.1]"
                lang="ar"
                dir="rtl"
              >
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا
                إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
              </p>
              <OrnamentDivider className="my-7" />
              <p className="font-display text-lg italic leading-relaxed text-white/90 sm:text-xl">
                &ldquo;And of His signs is that He created for you spouses from among
                yourselves, that you may find tranquility in them; and He placed between you
                affection and mercy.&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-gold-300">
              Surah Ar-Rum · 30:21
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
