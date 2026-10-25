"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Check,
  Gem,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlurredPhoto } from "../shared/blurred-photo";
import { VerificationBadge } from "../shared/verification-badge";
import { ParallaxCard } from "../shared/parallax-card";
import { displayName, initialsOf, type Profile } from "@/lib/qabiltoo/types";
import { useAuthStore } from "@/lib/qabiltoo/store";
import { cn } from "@/lib/utils";

/* ── Photo with graceful fallback (missing files → initials avatar) ── */

function ProfilePhoto({
  profile,
  alt,
  sizes,
  priority,
  className,
}: {
  profile: Profile;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [src, setSrc] = useState(profile.image || profile.photos[0] || "");
  const fallback = `/api/avatar/${initialsOf(profile.fullName) || "QT"}`;

  if (!src) {
    return <Image src={fallback} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setSrc(fallback)}
      className={cn("object-cover", className)}
    />
  );
}

/* ── Save-for-later bookmark with satisfying micro-animation ───────── */

function SaveButton({ profile, floating = false }: { profile: Profile; floating?: boolean }) {
  const savedIds = useAuthStore((s) => s.savedIds);
  const toggleSaved = useAuthStore((s) => s.toggleSaved);
  const saved = savedIds.includes(profile.id);
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleSaved(profile.id);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${displayName(profile.fullName)} from saved profiles` : `Save ${displayName(profile.fullName)} for later`}
      animate={saved && !reduceMotion ? { scale: [1, 1.35, 1] } : { scale: 1 }}
      transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
      whileTap={reduceMotion ? undefined : { scale: 0.82 }}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
        floating
          ? saved
            ? "bg-gold-500 text-white shadow-md"
            : "bg-white/90 text-charcoal/70 shadow-sm hover:bg-white hover:text-gold-600"
          : "border border-border bg-background/60 text-muted-foreground hover:border-gold-400 hover:text-gold-600",
        saved && !floating && "border-gold-500 text-gold-600"
      )}
    >
      {saved ? (
        <BookmarkCheck className="h-4 w-4 fill-current" aria-hidden />
      ) : (
        <Bookmark className="h-4 w-4" aria-hidden />
      )}
    </motion.button>
  );
}

/* ── Shared bits ────────────────────────────────────────────────────── */

function locationLabel(profile: Profile): string {
  return profile.country && profile.country !== "India"
    ? `${profile.city}, ${profile.country}`
    : profile.city;
}

function ProposalButton({
  profile,
  isInterested,
  onSendInterest,
  size = "sm",
}: {
  profile: Profile;
  isInterested: boolean;
  onSendInterest?: (profile: Profile) => void;
  size?: "sm" | "lg";
}) {
  if (!onSendInterest) return null;
  return (
    <Button
      size={size}
      variant="outline"
      disabled={isInterested}
      onClick={(e) => {
        e.stopPropagation();
        onSendInterest(profile);
      }}
      className={cn(
        "rounded-full border-gold-500/70 font-semibold text-gold-700 hover:bg-gold-50 hover:text-gold-800 dark:text-gold-400 dark:hover:bg-gold-500/10",
        isInterested && "border-gold-500/40 text-gold-600/80 dark:text-gold-500/80"
      )}
    >
      {isInterested ? <Check className="h-4 w-4" aria-hidden /> : <Gem className="h-4 w-4" aria-hidden />}
      {isInterested ? "Proposal Sent" : "Send Proposal"}
    </Button>
  );
}

/* ── Grid card ──────────────────────────────────────────────────────── */

interface ProfileCardProps {
  profile: Profile;
  index?: number;
  onView: (profile: Profile) => void;
  onSendInterest?: (profile: Profile) => void;
  isInterested?: boolean;
  compact?: boolean;
}

export function ProfileCard({
  profile,
  index = 0,
  onView,
  onSendInterest,
  isInterested = false,
  compact = false,
}: ProfileCardProps) {
  const isFemale = profile.gender === "female";
  const name = displayName(profile.fullName);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/50 hover:shadow-xl hover:shadow-gold-500/10"
    >
      {/* Photo — stays private until a proposal is accepted */}
      <div className="relative aspect-[4/4.2] w-full overflow-hidden">
        <BlurredPhoto
          src={profile.image || profile.photos[0] || ""}
          alt={`Profile photo of ${name}`}
          className="absolute inset-0 h-full w-full"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        <span
          className={cn(
            "absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow backdrop-blur-sm",
            isFemale ? "bg-gold-600/85" : "bg-emerald-700/85"
          )}
        >
          {isFemale ? "Bride" : "Groom"}
        </span>
        <span className="absolute right-3 top-3 z-10 flex items-center gap-2">
          <VerificationBadge tier={profile.verificationTier} />
          <SaveButton profile={profile} floating />
        </span>

        {/* overlay button to view profile */}
        <button
          onClick={() => onView(profile)}
          className="absolute inset-0 z-0 cursor-pointer"
          aria-label={`View ${name}'s profile`}
        />

        <div className="pointer-events-none absolute inset-x-4 bottom-3 z-10 text-white">
          <p className="flex items-center gap-1.5 font-display text-lg font-bold drop-shadow">
            {name}
          </p>
          <p className="text-xs text-white/85">
            {profile.age} yrs · {profile.height}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <span className="truncate">{locationLabel(profile)}</span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <BriefcaseBusiness className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <span className="truncate">{profile.profession}</span>
        </p>
        {!compact && profile.about && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">{profile.about}</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {profile.sect && (
            <Badge variant="secondary" className="text-[11px]">
              {profile.sect}
            </Badge>
          )}
          {profile.maritalStatus && (
            <Badge variant="secondary" className="text-[11px]">
              {profile.maritalStatus}
            </Badge>
          )}
          {profile.relocate && (
            <Badge variant="secondary" className="text-[11px]">
              Open to relocation
            </Badge>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Button size="sm" className="flex-1 rounded-full" onClick={() => onView(profile)}>
            View Profile <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <ProposalButton profile={profile} isInterested={isInterested} onSendInterest={onSendInterest} />
        </div>
      </div>
    </motion.article>
  );
}

/* ── List row card ──────────────────────────────────────────────────── */

export function ProfileCardRow({
  profile,
  index = 0,
  onView,
  onSendInterest,
  isInterested = false,
}: ProfileCardProps) {
  const name = displayName(profile.fullName);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-gold-400/50 hover:shadow-lg hover:shadow-gold-500/10 sm:flex-row sm:items-center"
    >
      {/* Photo left */}
      <button
        onClick={() => onView(profile)}
        className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24"
        aria-label={`View ${name}'s profile`}
      >
        <BlurredPhoto
          src={profile.image || profile.photos[0] || ""}
          alt={`Profile photo of ${name}`}
          className="h-full w-full"
          sizes="96px"
        />
      </button>

      {/* Info middle */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-bold">{name}</h3>
          <VerificationBadge tier={profile.verificationTier} />
          <Badge variant="secondary" className="text-[11px]">
            {profile.gender === "female" ? "Bride" : "Groom"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.age} yrs · {profile.height} · {locationLabel(profile)}
        </p>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {profile.profession}
          {profile.sect ? ` · ${profile.sect}` : ""}
        </p>
      </div>

      {/* Actions right */}
      <div className="flex items-center gap-2 sm:flex-col sm:items-stretch lg:flex-row">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-full"
          onClick={() => onView(profile)}
        >
          View Profile
        </Button>
        <ProposalButton profile={profile} isInterested={isInterested} onSendInterest={onSendInterest} />
        <SaveButton profile={profile} />
      </div>
    </motion.article>
  );
}

/* ── Curated carousel card (subtle 3D card-stack feel) ─────────────── */

export function CuratedProfileCard({
  profile,
  index = 0,
  onView,
  onSendInterest,
  isInterested = false,
}: ProfileCardProps) {
  const name = displayName(profile.fullName);
  const isFemale = profile.gender === "female";
  const tilt = index % 2 === 0 ? "rotate-[1.4deg]" : "-rotate-[1.4deg]";
  const drop = index % 2 === 0 ? "translate-y-1" : "-translate-y-0.5";

  return (
    <div
      className={cn("relative w-[248px] shrink-0 snap-start sm:w-[264px]", tilt, drop)}
    >
      {/* stacked cards behind — deck feel */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-3xl border border-border bg-card/70",
          index % 2 === 0 ? "-rotate-[3.5deg] translate-x-2 translate-y-2" : "rotate-[3.5deg] -translate-x-2 translate-y-2"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-3xl border border-border bg-card/90",
          index % 2 === 0 ? "rotate-[1.8deg] -translate-x-1.5 translate-y-1" : "-rotate-[1.8deg] translate-x-1.5 translate-y-1"
        )}
      />

      <ParallaxCard maxTilt={6} depth={10} className="relative">
        <motion.article
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: Math.min(index, 6) * 0.07, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gold-400/30 bg-card shadow-lg shadow-gold-500/10"
        >
          <div className="relative aspect-[4/3.4] w-full overflow-hidden">
            <BlurredPhoto
              src={profile.image || profile.photos[0] || ""}
              alt={`Profile photo of ${name}`}
              className="absolute inset-0 h-full w-full"
              sizes="264px"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <span
              className={cn(
                "absolute left-3 top-3 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow backdrop-blur-sm",
                isFemale ? "bg-gold-600/85" : "bg-emerald-700/85"
              )}
            >
              {isFemale ? "Bride" : "Groom"}
            </span>
            <span className="absolute right-3 top-3 z-10">
              <VerificationBadge tier={profile.verificationTier} />
            </span>
            <button
              onClick={() => onView(profile)}
              className="absolute inset-0 z-0 cursor-pointer"
              aria-label={`View ${name}'s profile`}
            />
            <div className="pointer-events-none absolute inset-x-3.5 bottom-2.5 z-10 text-white">
              <p className="font-display text-base font-bold drop-shadow">{name}</p>
              <p className="text-[11px] text-white/85">
                {profile.age} yrs · {locationLabel(profile)}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-3.5">
            <p className="truncate text-xs text-muted-foreground">{profile.profession}</p>
            <div className="mt-auto flex items-center gap-1.5">
              <Button
                size="sm"
                className="h-8 flex-1 rounded-full text-xs"
                onClick={() => onView(profile)}
              >
                View Profile
              </Button>
              <ProposalButton profile={profile} isInterested={isInterested} onSendInterest={onSendInterest} />
            </div>
          </div>
        </motion.article>
      </ParallaxCard>
    </div>
  );
}
