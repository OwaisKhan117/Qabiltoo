"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const STAGES = ["Intent", "Verify", "Basics", "Faith", "Career", "Trust"] as const;

/** Eight-pointed Islamic star (two overlapping squares). */
function Star8({ filled, muted }: { filled: boolean; muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
        className={cn(
          filled
            ? "text-gold-500"
            : muted
              ? "text-muted-foreground/35"
              : "text-gold-600/70 dark:text-gold-400/70"
        )}
      >
        <rect x="6.8" y="6.8" width="10.4" height="10.4" rx="1" />
        <rect x="6.8" y="6.8" width="10.4" height="10.4" rx="1" transform="rotate(45 12 12)" />
      </g>
      {!filled && !muted && <circle cx="12" cy="12" r="2.2" className="fill-gold-500" />}
    </svg>
  );
}

/**
 * Decorative onboarding progress — six 8-pointed stars connected by lines
 * that fill with gold as stages complete. Not a plain percentage bar.
 */
export function StarProgress({ step, complete = false }: { step: number; complete?: boolean }) {
  const reduce = useReducedMotion();
  const activeIdx = complete
    ? STAGES.length
    : Math.min(Math.max(step - 1, 0), STAGES.length - 1);
  const doneCount = complete ? STAGES.length : activeIdx;

  return (
    <div
      role="img"
      aria-label={`Onboarding progress: ${doneCount} of ${STAGES.length} stages complete`}
      className="mx-auto flex w-full max-w-xl items-start"
    >
      {STAGES.map((label, i) => {
        const done = complete || i < activeIdx;
        const current = !complete && i === activeIdx;
        const star = (
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <motion.div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                current && "bg-gold-500/10"
              )}
              animate={current && !reduce ? { scale: [1, 1.14, 1] } : { scale: 1 }}
              transition={
                current && !reduce
                  ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            >
              <Star8 filled={done} muted={!done && !current} />
            </motion.div>
            <span
              aria-hidden
              className={cn(
                "hidden text-[10px] font-semibold uppercase tracking-[0.16em] sm:block",
                done
                  ? "text-gold-600 dark:text-gold-300"
                  : current
                    ? "text-foreground"
                    : "text-muted-foreground/50"
              )}
            >
              {label}
            </span>
          </div>
        );

        if (i === STAGES.length - 1) return <div key={label}>{star}</div>;

        const linePassed = complete || i < activeIdx;
        return (
          <div key={label} className="flex min-w-0 flex-1 items-start">
            {star}
            <div className="relative mx-1 mt-[17px] h-[2px] min-w-2 flex-1 overflow-hidden rounded-full bg-border">
              <motion.div
                className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400"
                initial={false}
                animate={{ scaleX: linePassed ? 1 : 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
