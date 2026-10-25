"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LightMotes } from "../shared/light-motes";
import { RingsConnection } from "../shared/rings-connection";
import { RoundPhoto } from "./photo";
import type { Profile } from "@/lib/qabiltoo/types";

/**
 * Mutual-acceptance reveal — two geometric rings interlocking, gold dust,
 * and the duaa for the couple. Shown when a proposal becomes a match.
 */
export function MatchReveal({
  open,
  onOpenChange,
  user,
  other,
  onOpenChat,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile;
  other: Profile;
  onOpenChat: () => void;
  onContinue: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92dvh] overflow-y-auto border-gold-500/30 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 p-0 text-white sm:max-w-lg"
        showCloseButton
      >
        <DialogTitle className="sr-only">It&apos;s a match</DialogTitle>
        <DialogDescription className="sr-only">
          You and {other.fullName.split(" ")[0]} have both accepted each other&apos;s proposals.
        </DialogDescription>

        {/* gold radial glow + light motes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <div
            className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)" }}
            aria-hidden
          />
          <LightMotes count={26} speed={0.8} />
          <div className="absolute inset-0 text-white/[0.06]">
            {/* faint geometric lattice */}
            <svg aria-hidden className="h-full w-full">
              <defs>
                <pattern id="match-reveal-lattice" width="64" height="64" patternUnits="userSpaceOnUse">
                  <g fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="19" y="19" width="26" height="26" />
                    <rect x="19" y="19" width="26" height="26" transform="rotate(45 32 32)" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#match-reveal-lattice)" />
            </svg>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-5 px-6 py-10 text-center sm:px-10">
          {/* the two people orbiting the interlocked rings */}
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={reduceMotion ? false : { scale: 0.4, opacity: 0, x: -46 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.15 }}
              className="relative z-10"
            >
              <RoundPhoto
                profile={user}
                alt={user.fullName}
                className="h-16 w-16 ring-emerald-300/70"
                sizes="64px"
              />
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="mx-1"
            >
              <RingsConnection size={132} />
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { scale: 0.4, opacity: 0, x: 46 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.45 }}
              className="relative z-10"
            >
              <RoundPhoto
                profile={other}
                alt={other.fullName}
                className="h-16 w-16 ring-gold-400/80"
                sizes="64px"
              />
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <p className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Alhamdulillah
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            </p>
            <h2 className="font-display text-3xl font-semibold">
              <span className="text-gradient-gold">It&apos;s a match</span>
            </h2>
            <p className="font-arabic text-xl text-gold-200/90" lang="ar" dir="rtl">
              بارك الله لكما
            </p>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/75">
              You and {other.fullName.split(" ")[0]} have both accepted each other&apos;s
              proposals. May Allah fill this beginning with barakah — a respectful
              conversation has opened, and families may now connect.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="mt-1 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Button
              onClick={onOpenChat}
              className="btn-gold-shimmer gap-2 bg-gold-500 font-semibold text-emerald-950 hover:bg-gold-400"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Open Conversation
            </Button>
            <Button
              variant="outline"
              onClick={onContinue}
              className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Continue Browsing
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
