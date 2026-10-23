"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Ban,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Cake,
  Flag,
  Gem,
  GraduationCap,
  Heart,
  Loader2,
  MapPin,
  Moon,
  MoonStar,
  PencilLine,
  Plane,
  Quote,
  Ruler,
  ShieldCheck,
  Shirt,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PatternOverlay, OrnamentDivider } from "../pattern";
import { BlurredPhoto } from "../shared/blurred-photo";
import { VerificationBadge } from "../shared/verification-badge";
import { TrustRing } from "../shared/trust-ring";
import { useAuthStore } from "@/lib/qabiltoo/store";
import { toast } from "@/hooks/use-toast";
import { displayName, initialsOf, timeAgo, type Profile, type View } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

/* ── Props ──────────────────────────────────────────────────────────── */

interface ProfileDetailViewProps {
  id: string;
  navigate: (view: View) => void;
  onSendInterest: (profile: Profile) => void;
  isInterested: boolean;
  isOwnProfile: boolean;
}

interface ProfileDetailResponse {
  profile: Profile;
}

const REPORT_REASONS = [
  "Inappropriate request",
  "Suspected inaccuracy",
  "Spam messages",
  "Harassment",
  "Fake profile",
  "Other",
] as const;

/* ── Helpers ────────────────────────────────────────────────────────── */

/** Mask a guardian phone: "+91 9820012345" → "+91 98200 •• ••23" */
function maskPhone(phone: string | null): string | null {
  if (!phone) return null;
  const trimmed = phone.trim();
  const prefixMatch = trimmed.match(/^\+(\d{1,3})\s*/);
  const prefix = prefixMatch ? `+${prefixMatch[1]} ` : "";
  const digits = trimmed.replace(/\D/g, "");
  const local = prefixMatch ? digits.slice(prefixMatch[1].length) : digits;
  if (local.length >= 8) return `${prefix}${local.slice(0, 5)} •• ••${local.slice(-2)}`;
  if (local.length >= 6) return `${prefix}${local.slice(0, 2)} •• ••${local.slice(-2)}`;
  if (local.length > 0) return `${prefix}${"•".repeat(local.length)}`;
  return null;
}

function lastActiveLabel(iso: string): string {
  const t = timeAgo(iso);
  return /^now$/.test(t) ? "Active now" : /^\d+[mhd]$/.test(t) ? `Active ${t} ago` : `Last active ${t}`;
}

const TIER_CHIP: Record<Profile["tier"], string> = {
  Free: "border-border bg-secondary text-secondary-foreground",
  Silver: "border-slate-300 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 dark:border-slate-500 dark:from-slate-600 dark:to-slate-500 dark:text-slate-100",
  Gold: "border-gold-500 bg-gradient-to-r from-gold-400 to-gold-600 text-white shadow-sm shadow-gold-500/30",
  Platinum: "border-blush-400 bg-gradient-to-r from-blush-200 to-blush-400 text-blush-800 dark:text-blush-100 dark:from-blush-600 dark:to-blush-500",
};

/* ── Photo with graceful fallback ───────────────────────────────────── */

function DetailPhoto({
  profile,
  alt,
  sizes,
  priority,
  className,
  onClick,
}: {
  profile: Profile;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const [src, setSrc] = useState(profile.image || profile.photos[0] || "");
  const fallback = `/api/avatar/${initialsOf(profile.fullName) || "QT"}`;

  return (
    <div
      className={cn("relative h-full w-full", onClick && "cursor-zoom-in")}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `Enlarge photo of ${displayName(profile.fullName)}` : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      tabIndex={onClick ? 0 : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setSrc(fallback)}
          className={cn("object-cover", className)}
        />
      ) : (
        <Image src={fallback} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} />
      )}
    </div>
  );
}

/* ── Section shell ──────────────────────────────────────────────────── */

function DetailSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-label={title} className={cn("rounded-3xl border border-border bg-card p-5 sm:p-6", className)}>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

export function ProfileDetailView({
  id,
  navigate,
  onSendInterest,
  isInterested,
  isOwnProfile,
}: ProfileDetailViewProps) {
  const user = useAuthStore((s) => s.user);
  const savedIds = useAuthStore((s) => s.savedIds);
  const toggleSaved = useAuthStore((s) => s.toggleSaved);
  const reduceMotion = useReducedMotion();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetails, setReportDetails] = useState("");
  const [reporting, setReporting] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const viewRecordedRef = useRef(false);

  /* Record the view once (24h dedupe server-side) */
  useEffect(() => {
    if (viewRecordedRef.current) return;
    if (!user || user.id === id) return;
    viewRecordedRef.current = true;
    fetch(`/api/profiles/${id}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerId: user.id, profileId: id }),
    }).catch(() => undefined);
  }, [user, id]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", id],
    queryFn: async (): Promise<ProfileDetailResponse> => {
      const res = await fetch(`/api/profiles/${id}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });

  /* ── Report submit ───────────────────────────────────────────────── */

  async function submitReport() {
    if (!reportReason) {
      toast({
        title: "Please choose a reason",
        description: "Select the reason that best describes the concern.",
        variant: "destructive",
      });
      return;
    }
    setReporting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterId: user?.id ?? null,
          reporterName: user?.fullName ?? "Guest",
          profileId: id,
          reason: reportReason,
          details: reportDetails.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setReportOpen(false);
      setReportReason("");
      setReportDetails("");
      toast({
        title: "Report received",
        description: "Our moderation team will review within 24 hours. JazakAllah khair for keeping the community safe.",
      });
    } catch {
      toast({
        title: "Could not submit report",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setReporting(false);
    }
  }

  function handleBlock() {
    setBlocked(true);
    toast({
      title: "Profile blocked",
      description: "You will no longer see this profile in your suggestions.",
    });
  }

  /* ── Error / loading states ──────────────────────────────────────── */

  if (isError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-arabic text-2xl text-gold-600/80" aria-hidden>
          سبحان الله
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold">Profile not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
          This profile may have been removed or is no longer available. Perhaps your page is
          still being written, Insha&rsquo;Allah.
        </p>
        <Button className="mt-6 rounded-full" onClick={() => navigate({ name: "browse" })}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Discover
        </Button>
      </main>
    );
  }

  if (isLoading || !data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading profile">
        <Skeleton className="mb-6 h-9 w-44 rounded-full" />
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="space-y-4">
            <Skeleton className="aspect-[4/4.4] rounded-t-[9rem] rounded-b-[2rem]" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-32 w-full rounded-3xl" />
          </div>
        </div>
      </main>
    );
  }

  const profile = data.profile;
  const isFemale = profile.gender === "female";
  const name = displayName(profile.fullName);
  const saved = savedIds.includes(profile.id);
  const photos = profile.photos.length > 0 ? profile.photos : [profile.image];
  const photoLocked = profile.verificationTier === "blue" && !profile.idVerified;
  const hasWali = Boolean(profile.waliName);

  const quickFacts: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: Cake, label: "Age", value: `${profile.age} yrs` },
    { icon: Ruler, label: "Height", value: profile.height || "—" },
    {
      icon: MapPin,
      label: "Location",
      value: profile.country && profile.country !== "India" ? `${profile.city}, ${profile.country}` : profile.city || "—",
    },
    { icon: Heart, label: "Marital Status", value: profile.maritalStatus || "—" },
    { icon: BriefcaseBusiness, label: "Profession", value: profile.profession || "—" },
    { icon: GraduationCap, label: "Education", value: profile.education || "—" },
    { icon: Banknote, label: "Annual Income", value: profile.income || "Prefer not to say" },
    { icon: Plane, label: "Relocation", value: profile.relocate ? "Open to relocation" : "Prefers home region" },
  ];

  const practice: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: MoonStar, label: "Sect", value: profile.sect || "Just Muslim" },
    { icon: Sparkles, label: "Religious Level", value: profile.religiousLevel || "—" },
    { icon: Moon, label: "Namaz", value: profile.namaz || "—" },
    { icon: BookOpen, label: "Quran", value: profile.quranLevel || "—" },
    { icon: Shirt, label: isFemale ? "Hijab" : "Beard", value: profile.hijabBeard || "—" },
  ].filter((item) => item.value !== "—");

  return (
    <main className="relative">
      {/* ── Header band ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-primary pb-24 pt-8 text-primary-foreground">
        <PatternOverlay className="text-white/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ name: "browse" })}
            className="flex items-center gap-1.5 text-sm text-primary-foreground/75 transition-colors hover:text-gold-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Discover
          </button>
        </div>
      </div>

      <div className="mx-auto -mt-20 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* ── Left: photo gallery ─────────────────────────────────── */}
          <div className="relative z-10 mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <div className="relative overflow-hidden rounded-t-[9rem] rounded-b-[2rem] border-4 border-card shadow-2xl shadow-primary/15">
              <div className="relative aspect-[4/4.6]">
                {photoLocked ? (
                  <BlurredPhoto
                    src={photos[0] || ""}
                    alt={`Profile photo of ${name}`}
                    overlayLabel="Photo visible after basic verification"
                    className="h-full w-full"
                    sizes="(max-width: 1024px) 90vw, 400px"
                    priority
                  />
                ) : (
                  <DetailPhoto
                    profile={profile}
                    alt={`Profile photo of ${name}`}
                    sizes="(max-width: 1024px) 90vw, 400px"
                    priority
                    onClick={() => setLightboxOpen(true)}
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-bold backdrop-blur-sm",
                      isFemale ? "bg-gold-600/85" : "bg-emerald-700/85"
                    )}
                  >
                    {isFemale ? "Bride" : "Groom"} · {profile.age} yrs
                  </span>
                </div>
                {!photoLocked && photos.length > 1 && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    {activePhoto + 1} / {photos.length}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {!photoLocked && photos.length > 1 && (
              <div className="mt-4 flex justify-center gap-2.5">
                {photos.map((photo, i) => (
                  <button
                    key={`${photo}-${i}`}
                    onClick={() => setActivePhoto(i)}
                    aria-label={`View photo ${i + 1}`}
                    aria-pressed={activePhoto === i}
                    className={cn(
                      "relative h-16 w-14 overflow-hidden rounded-xl border-2 transition-all",
                      activePhoto === i
                        ? "border-gold-500 shadow-md shadow-gold-500/25"
                        : "border-transparent opacity-65 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={photo}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Wali / guardian card under the photo */}
            {hasWali && (
              <div className="mt-5 rounded-2xl border border-gold-500/40 bg-gold-50/70 p-4 dark:bg-gold-500/10">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/15">
                    <ShieldCheck className="h-5 w-5 text-gold-600 dark:text-gold-400" aria-hidden />
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold text-gold-800 dark:text-gold-300">Guardian / Wali</p>
                    <p className="mt-0.5 text-foreground">
                      {profile.waliName}
                      {profile.waliRelation ? ` · ${profile.waliRelation}` : ""}
                    </p>
                    {maskPhone(profile.waliPhone) && (
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {maskPhone(profile.waliPhone)}
                      </p>
                    )}
                    <p className="mt-1.5 text-xs italic text-muted-foreground">
                      Contact details are shared only after a proposal is kindly accepted.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: details rail ─────────────────────────────────── */}
          <div className="relative z-10 space-y-5">
            {isOwnProfile && (
              <div className="flex items-center gap-2 rounded-xl border border-gold-500/40 bg-gold-50 px-4 py-2.5 text-sm text-gold-800 dark:bg-gold-500/10 dark:text-gold-300">
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                <span>
                  This is you — your profile as members see it. Update your details anytime from
                  the onboarding flow.
                </span>
              </div>
            )}
            {blocked && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
                <Ban className="h-4 w-4 shrink-0" aria-hidden />
                <span>You have blocked this profile.</span>
              </div>
            )}

            {/* Identity card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h1 className="flex flex-wrap items-center gap-2 font-display text-3xl font-bold">
                    {name}
                  </h1>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <VerificationBadge tier={profile.verificationTier} showLabel glow />
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        TIER_CHIP[profile.tier]
                      )}
                    >
                      {profile.tier === "Gold" && <Gem className="h-3 w-3" aria-hidden />}
                      {profile.tier === "Platinum" && <Sparkles className="h-3 w-3" aria-hidden />}
                      {profile.tier} Member
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                      {lastActiveLabel(profile.lastActive)}
                    </span>
                  </div>
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      {profile.city}
                      {profile.country && profile.country !== "India" ? `, ${profile.country}` : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      {profile.profession}
                    </span>
                  </p>
                </div>

                <TrustRing value={profile.trustScore} size={116} strokeWidth={8} className="shrink-0 self-center" />
              </div>

              <OrnamentDivider className="my-6" />

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {isOwnProfile ? (
                  <Button
                    size="lg"
                    disabled
                    className="h-13 flex-1 rounded-full bg-muted text-muted-foreground"
                  >
                    <PencilLine className="h-4 w-4" aria-hidden /> Your Profile
                  </Button>
                ) : (
                  <motion.div
                    className="flex-1"
                    animate={
                      isInterested || reduceMotion ? { scale: 1 } : { scale: [1, 1.025, 1] }
                    }
                    transition={isInterested || reduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Button
                      size="lg"
                      disabled={isInterested}
                      onClick={() => onSendInterest(profile)}
                      className="btn-gold-shimmer h-13 w-full rounded-full bg-gold-500 text-base font-bold text-white shadow-lg shadow-gold-500/30 hover:bg-gold-600"
                    >
                      {isInterested ? (
                        <>
                          <Heart className="h-5 w-5 fill-current" aria-hidden /> Proposal Sent
                        </>
                      ) : (
                        <>
                          <Gem className="h-5 w-5" aria-hidden /> Send Proposal
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleSaved(profile.id)}
                  aria-pressed={saved}
                  className={cn(
                    "rounded-full",
                    saved && "border-gold-500 text-gold-700 dark:text-gold-400"
                  )}
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 fill-current" aria-hidden /> Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" aria-hidden /> Save for Later
                    </>
                  )}
                </Button>
              </div>

              {/* Quick facts */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {quickFacts.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-2.5 rounded-2xl border border-border bg-background/60 p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700/10 dark:bg-emerald-400/10">
                      <item.icon className="h-4 w-4 text-emerald-700 dark:text-emerald-400" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="truncate text-sm font-medium" title={item.value}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Religious practice */}
            {practice.length > 0 && (
              <DetailSection title="Religious Practice">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {practice.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-gold-400/25 bg-gold-50/50 px-3 py-4 text-center dark:bg-gold-500/5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15">
                        <item.icon className="h-5 w-5 text-gold-600 dark:text-gold-400" aria-hidden />
                      </span>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold leading-tight">{item.value}</p>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

            {/* About */}
            <DetailSection title={`About ${profile.fullName.split(" ")[0]}`}>
              <p className="leading-relaxed text-muted-foreground">{profile.about}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge variant="secondary">{isFemale ? "Bride" : "Groom"}</Badge>
                {profile.sect && <Badge variant="secondary">{profile.sect}</Badge>}
                {profile.maritalStatus && <Badge variant="secondary">{profile.maritalStatus}</Badge>}
                {profile.onBehalfOf === "family" && (
                  <Badge variant="secondary">Managed by family</Badge>
                )}
              </div>
            </DetailSection>

            {/* Partner preference */}
            {profile.partnerPreference && (
              <DetailSection title="Partner Preference">
                <blockquote className="relative rounded-2xl border-l-4 border-gold-500 bg-gold-50/50 py-4 pl-5 pr-4 dark:bg-gold-500/5">
                  <Quote className="absolute right-4 top-4 h-5 w-5 text-gold-400/50" aria-hidden />
                  <p className="leading-relaxed text-muted-foreground">{profile.partnerPreference}</p>
                </blockquote>
              </DetailSection>
            )}

            {/* Family background */}
            {profile.familyInfo && (
              <DetailSection title="Family Background">
                <p className="leading-relaxed text-muted-foreground">{profile.familyInfo}</p>
              </DetailSection>
            )}

            {/* Report / block — quiet, bottom */}
            {!isOwnProfile && (
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                <button
                  onClick={() => setReportOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Flag className="h-3.5 w-3.5" aria-hidden /> Report this profile
                </button>
                <button
                  onClick={handleBlock}
                  disabled={blocked}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                >
                  <Ban className="h-3.5 w-3.5" aria-hidden /> {blocked ? "Blocked" : "Block"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl border-none bg-black/90 p-2 sm:p-3">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo of {name}</DialogTitle>
            <DialogDescription>Enlarged profile photo</DialogDescription>
          </DialogHeader>
          <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-2xl sm:aspect-[4/3.6]">
            <AnimatePresence mode="wait">
              <motion.div
                key={photos[activePhoto] ?? "photo"}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full w-full"
              >
                <Image
                  src={photos[activePhoto] || profile.image}
                  alt={`Photo ${activePhoto + 1} of ${name}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 720px"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {photos.length > 1 && (
            <div className="mt-2 flex justify-center gap-2 pb-1">
              {photos.map((photo, i) => (
                <button
                  key={`${photo}-lb-${i}`}
                  onClick={() => setActivePhoto(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-pressed={activePhoto === i}
                  className={cn(
                    "relative h-12 w-10 overflow-hidden rounded-lg border-2 transition-all",
                    activePhoto === i ? "border-gold-400" : "border-white/20 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={photo} alt="" fill sizes="40px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
            aria-label="Close photo viewer"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </DialogContent>
      </Dialog>

      {/* ── Report dialog ─────────────────────────────────────────────── */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                <Flag className="h-4.5 w-4.5 text-destructive" aria-hidden />
              </span>
              Report this profile
            </DialogTitle>
            <DialogDescription>
              Concerns are handled confidentially by our moderation team — reviewed within 24
              hours, Insha&rsquo;Allah.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="report-reason">Reason</Label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger id="report-reason" aria-label="Report reason">
                  <SelectValue placeholder="Choose a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="report-details">Details (optional)</Label>
              <Textarea
                id="report-details"
                rows={4}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                maxLength={1000}
                placeholder="Share anything that would help our team review this profile."
                className="resize-none"
              />
              <p className="text-right text-xs text-muted-foreground">{reportDetails.length}/1000</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setReportOpen(false)} disabled={reporting}>
              Cancel
            </Button>
            <Button
              onClick={submitReport}
              disabled={reporting || !reportReason}
              variant="destructive"
            >
              {reporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Submitting…
                </>
              ) : (
                <>
                  <Flag className="h-4 w-4" aria-hidden /> Submit Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
