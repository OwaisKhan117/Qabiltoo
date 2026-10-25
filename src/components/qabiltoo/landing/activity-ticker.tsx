"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Heart, MailOpen, Sparkles, UserPlus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/qabiltoo/types";
import { useSocketEvent } from "@/lib/qabiltoo/socket";

interface TickerItem extends ActivityItem {
  sample?: boolean;
}

const ROTATE_MS = 4000;
const REFETCH_MS = 20_000;
const CAP = 12;

const TYPE_ICON: Record<ActivityItem["type"], LucideIcon> = {
  join: UserPlus,
  proposal: MailOpen,
  match: Sparkles,
  verification: BadgeCheck,
  success: Heart,
};

async function fetchActivity(): Promise<{ items: TickerItem[] }> {
  const res = await fetch("/api/activity");
  if (!res.ok) throw new Error("Failed to fetch activity");
  return res.json();
}

/**
 * Slim live-activity pill sitting between the hero and the stats band.
 * Items stream in from /api/activity (20s polling) and the realtime
 * "ticker" socket event, capped at 12 — rotating with a gentle fade/slide.
 */
export function ActivityTicker() {
  const [liveItems, setLiveItems] = useState<TickerItem[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  /* Seed + refresh from the REST API */
  const { data } = useQuery({
    queryKey: ["activity"],
    queryFn: fetchActivity,
    refetchInterval: REFETCH_MS,
    staleTime: REFETCH_MS,
  });

  /* Realtime prepend from the socket service */
  useSocketEvent("ticker", (...args: unknown[]) => {
    const payload = args[0] as { item?: TickerItem } | undefined;
    const item = payload?.item;
    if (!item?.id || !item.text) return;
    setLiveItems((prev) => [item, ...prev.filter((p) => p.id !== item.id)].slice(0, CAP));
  });

  /* Derive the merged feed: realtime first, then API items — capped, deduped */
  const items: TickerItem[] = [];
  const seen = new Set<string>();
  for (const item of [...liveItems, ...(data?.items ?? [])]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
    if (items.length >= CAP) break;
  }

  /* Rotate one visible item every 4s (pause on hover) */
  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      if (!paused) setIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [items.length, paused]);

  const visible = items.length > 0 ? items[index % items.length] : null;
  const Icon = visible ? (TYPE_ICON[visible.type] ?? Sparkles) : Sparkles;

  return (
    <section aria-label="Live community activity" className="relative z-20 -mt-7 px-4">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="glass-card mx-auto flex min-h-11 max-w-2xl items-center gap-3 rounded-full border border-border px-4 py-2 shadow-xl shadow-emerald-950/10"
      >
        {/* live pulse */}
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-500 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-500" />
        </span>

        {visible ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${visible.id}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-w-0 flex-1 items-center gap-2.5"
              aria-live="polite"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15">
                <Icon className="h-3.5 w-3.5 text-gold-600 dark:text-gold-400" aria-hidden />
              </span>
              <p className="truncate text-[13px] text-foreground/85">{visible.text}</p>
              {visible.sample && (
                <span
                  className={cn(
                    "hidden shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold",
                    "uppercase tracking-wide text-muted-foreground sm:inline-block"
                  )}
                >
                  sample
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="flex-1 truncate text-[13px] text-muted-foreground">
            Welcome to Qabiltoo — the community is gathered here.
          </p>
        )}
      </div>
    </section>
  );
}
