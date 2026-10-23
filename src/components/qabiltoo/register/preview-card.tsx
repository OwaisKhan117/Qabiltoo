"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Eye, Lock, MapPin } from "lucide-react";
import { VerificationBadge } from "../shared/verification-badge";
import { initialsOf } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "./onboarding";

/**
 * Plain <img> for local dataURL previews (FileReader uploads stay client-side).
 */
export function LocalPhoto({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={className} draggable={false} />;
}

/** Text that softly fades/scales in whenever its value changes. */
function FadeText({ k, className, children }: { k: string; className?: string; children: ReactNode }) {
  return (
    <motion.p
      key={k}
      initial={{ opacity: 0.5, y: 3, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

/**
 * Live mini profile card — mirrors the onboarding form in real time.
 * Shown sticky on desktop (steps 3-6) and as a collapsible toggle on mobile.
 */
export function PreviewCard({ data, className }: { data: OnboardingData; className?: string }) {
  const name = data.fullName.trim() || "Your Name";
  const initials = initialsOf(data.fullName) || "QT";
  const showUpload = data.photoOption === "upload" && !!data.photoDataUrl;
  const metaBits = [
    data.age ? `${data.age} yrs` : "",
    data.height,
    [data.city.trim(), data.state.trim()].filter(Boolean).join(", "),
  ].filter(Boolean);
  const profession = data.profession.trim();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-gold-500/25 bg-card shadow-xl shadow-gold-500/5",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-gold-500/15 bg-gradient-to-r from-gold-500/10 via-transparent to-transparent px-4 py-2.5">
        <Eye className="h-3.5 w-3.5 text-gold-600 dark:text-gold-300" aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700 dark:text-gold-300">
          Live preview
        </p>
        <p className="ml-auto text-[11px] text-muted-foreground">updates as you type</p>
      </div>

      <div className="px-5 pb-5 pt-5 text-center">
        {/* Arch-framed photo / initials avatar */}
        <div className="relative mx-auto h-24 w-20 overflow-hidden rounded-t-[2.5rem] rounded-b-xl border-2 border-gold-500/50 bg-gold-500/5 shadow-md shadow-gold-500/10">
          {showUpload ? (
            <LocalPhoto
              src={data.photoDataUrl}
              alt="Your uploaded photo preview"
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <Image
              src={`/api/avatar/${encodeURIComponent(initials)}`}
              alt="Initials avatar preview"
              fill
              sizes="80px"
              className="object-cover"
            />
          )}
          {showUpload && (
            <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-background/85 px-1.5 py-0.5 text-[9px] font-medium text-foreground/80 backdrop-blur">
              <Lock className="h-2.5 w-2.5" aria-hidden /> Private
            </span>
          )}
        </div>

        <FadeText k={name} className="mt-3 font-display text-lg font-bold leading-tight">
          {name}
        </FadeText>

        {metaBits.length > 0 && (
          <FadeText
            k={metaBits.join("|")}
            className="mt-1 flex items-center justify-center gap-1 text-[13px] text-muted-foreground"
          >
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{metaBits.join(" · ")}</span>
          </FadeText>
        )}

        <FadeText
          k={profession}
          className={cn(
            "mt-1 flex items-center justify-center gap-1.5 text-[13px]",
            profession ? "text-foreground/85" : "text-muted-foreground/60"
          )}
        >
          <Briefcase className="h-3 w-3 shrink-0" aria-hidden />
          <span className="truncate">{profession || "Profession"}</span>
        </FadeText>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
          <VerificationBadge tier="blue" showLabel />
          {data.sect && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {data.sect}
            </span>
          )}
          {data.religiousLevel && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {data.religiousLevel}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
          {data.about.trim() ||
            "Your about section appears here — a few sincere lines about your deen, your work and the home you hope to build."}
        </p>
      </div>
    </div>
  );
}
