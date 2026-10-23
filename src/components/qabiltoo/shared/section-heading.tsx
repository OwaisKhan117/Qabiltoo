"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { OrnamentDivider } from "../pattern";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  /** Optional Arabic accent (e.g. "نكاح") shown tastefully above/beside title */
  arabic?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  arabic,
  description,
  align = "center",
  className,
  dark = false,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-10 max-w-2xl md:mb-14",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {arabic && (
        <p
          aria-hidden="true"
          className={cn(
            "font-arabic mb-1 text-xl leading-relaxed",
            dark ? "text-gold-300/80" : "text-gold-600/80"
          )}
        >
          {arabic}
        </p>
      )}
      {eyebrow && (
        <p
          className={cn(
            "mb-2 text-xs font-semibold uppercase tracking-[0.22em]",
            dark ? "text-gold-300" : "text-gold-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-semibold leading-tight sm:text-4xl",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {align === "center" && <OrnamentDivider className="mt-4" />}
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            dark ? "text-white/75" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
