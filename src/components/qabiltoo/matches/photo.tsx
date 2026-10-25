"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { initialsOf, timeAgo, type Profile } from "@/lib/qabiltoo/types";

/**
 * Graceful profile photo with automatic /api/avatar fallback when a
 * portrait file is missing from disk (seeded images generate async).
 */
export function ProfilePhoto({
  profile,
  alt,
  sizes = "96px",
  priority = false,
  className,
}: {
  profile: Pick<Profile, "fullName" | "image">;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const fallback = `/api/avatar/${encodeURIComponent(initialsOf(profile.fullName) || "QT")}`;
  const src = !profile.image || broken ? fallback : profile.image;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setBroken(true)}
      className={cn("object-cover", className)}
    />
  );
}

/** Arch-shaped photo frame used across proposal cards. */
export function ArchPhoto({
  profile,
  alt,
  className,
  sizes,
  priority,
}: {
  profile: Pick<Profile, "fullName" | "image">;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-t-[3.5rem] rounded-b-2xl ring-1 ring-gold-500/25",
        className
      )}
    >
      <ProfilePhoto profile={profile} alt={alt} sizes={sizes} priority={priority} />
    </div>
  );
}

/** Compact round avatar (thread rows, match strip, activity rows). */
export function RoundPhoto({
  profile,
  alt,
  className = "h-12 w-12",
  sizes = "48px",
  priority,
}: {
  profile: Pick<Profile, "fullName" | "image">;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-2 ring-gold-500/30",
        className
      )}
    >
      <ProfilePhoto profile={profile} alt={alt} sizes={sizes} priority={priority} />
    </div>
  );
}

/** Shared card shell for proposal rows. */
export function ProposalCardShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-3xl border border-gold-500/15 p-5 shadow-sm transition-shadow duration-300 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export { timeAgo };
