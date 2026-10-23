"use client";

import { BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VERIFICATION_TIER_META, type VerificationTier } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  tier: VerificationTier;
  /** Show the tier label next to the icon */
  showLabel?: boolean;
  /** Pulse/glow animation */
  glow?: boolean;
  className?: string;
  iconSize?: number;
}

/**
 * Tiered verification badge with a subtle pulsing glow and an
 * explanatory tooltip (what each tier means).
 */
export function VerificationBadge({
  tier,
  showLabel = false,
  glow = true,
  className,
  iconSize = 15,
}: VerificationBadgeProps) {
  const meta = VERIFICATION_TIER_META[tier] ?? VERIFICATION_TIER_META.blue;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              className
            )}
            style={{
              color: meta.color,
              background: meta.bg,
              boxShadow: glow ? `0 0 10px ${meta.glow}` : undefined,
            }}
          >
            <BadgeCheck
              className={cn("shrink-0", glow && "badge-pulse rounded-full")}
              style={{ color: meta.color }}
              width={iconSize}
              height={iconSize}
            />
            {showLabel && <span className="truncate">{meta.label}</span>}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 text-xs">
          <p className="font-semibold">{meta.label}</p>
          <p className="text-muted-foreground">{meta.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
