"use client";

import Image from "next/image";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlurredPhotoProps {
  src: string;
  alt: string;
  /** Photo is visible (unblurred) */
  revealed?: boolean;
  className?: string;
  /** Label on the lock overlay, e.g. "Verified members can view" */
  overlayLabel?: string;
  onClick?: () => void;
  sizes?: string;
  priority?: boolean;
}

/**
 * Frosted-glass blurred profile photo with a lock overlay.
 * Photos stay private until a match/subscription reveals them.
 */
export function BlurredPhoto({
  src,
  alt,
  revealed = false,
  className,
  overlayLabel = "Photo visible to verified members",
  onClick,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: BlurredPhotoProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-gradient-to-br from-emerald-100 via-gold-100 to-blush-100 dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-950",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-all duration-700",
          revealed
            ? "blur-0 scale-100"
            : "scale-110 blur-2xl saturate-[0.8] group-hover:scale-[1.14]"
        )}
      />
      {!revealed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white/20 backdrop-blur-[2px] dark:bg-emerald-950/30">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md ring-1 ring-gold-400/50 dark:bg-emerald-950/80">
            <Lock className="h-4 w-4 text-gold-600 dark:text-gold-400" aria-hidden />
          </span>
          <span className="max-w-[90%] text-center text-[10px] font-medium leading-tight text-charcoal/80 dark:text-foreground/80">
            {overlayLabel}
          </span>
        </div>
      )}
    </div>
  );
}
