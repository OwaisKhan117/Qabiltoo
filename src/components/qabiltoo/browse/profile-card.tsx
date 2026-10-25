"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, GraduationCap, Heart, MapPin, BriefcaseBusiness, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { displayName, type Profile } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Photo */}
      <div className="relative aspect-[4/4.4] w-full overflow-hidden">
        <Image
          src={profile.image}
          alt={`Profile photo of ${displayName(profile.fullName)}`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* gender tint chip */}
        <span
          className={cn(
            "absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow",
            isFemale ? "bg-gold-600/90" : "bg-primary/90"
          )}
        >
          {isFemale ? "Bride" : "Groom"}
        </span>
        {/* interest heart */}
        {onSendInterest && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSendInterest(profile);
            }}
            aria-label={isInterested ? "Interest already sent" : `Send interest to ${displayName(profile.fullName)}`}
            className={cn(
              "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all active:scale-90",
              isInterested
                ? "bg-gold-500 text-white"
                : "bg-white/90 text-primary hover:bg-white hover:scale-110"
            )}
          >
            <Heart className={cn("h-4.5 w-4.5", isInterested && "fill-current")} />
          </button>
        )}
        {/* overlay button to view profile */}
        <button
          onClick={() => onView(profile)}
          className="absolute inset-0 z-0 cursor-pointer"
          aria-label={`View ${displayName(profile.fullName)}'s profile`}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 text-white">
          <p className="flex items-center gap-1.5 font-display text-lg font-bold drop-shadow">
            {displayName(profile.fullName)}
            <BadgeCheck className="h-4 w-4 shrink-0 text-gold-300" />
          </p>
          <p className="text-xs text-white/85">
            {profile.age} yrs · {profile.height}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">
            {profile.city}, {profile.state}
          </span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <BriefcaseBusiness className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{profile.profession}</span>
        </p>
        {!compact && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{profile.education}</span>
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {profile.maritalStatus === "Never Married" && (
            <Badge variant="secondary" className="text-[11px]">
              Never Married
            </Badge>
          )}
          {profile.sect && (
            <Badge variant="secondary" className="text-[11px]">
              {profile.sect}
            </Badge>
          )}
          {profile.namaz && (
            <Badge variant="secondary" className="text-[11px]">
              {profile.namaz}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 rounded-full"
            onClick={() => onView(profile)}
          >
            View <ArrowRight className="h-4 w-4" />
          </Button>
          {onSendInterest && (
            <Button
              size="sm"
              variant="outline"
              className={cn("rounded-full", isInterested && "border-gold-500 text-gold-600")}
              onClick={() => onSendInterest(profile)}
              disabled={isInterested}
            >
              <Heart className={cn("h-4 w-4", isInterested && "fill-current")} />
              <span className="sr-only sm:not-sr-only sm:ml-1">
                {isInterested ? "Sent" : "Interest"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
