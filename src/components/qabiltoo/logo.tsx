"use client";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-9 w-9", className)} aria-hidden="true">
      <defs>
        <linearGradient id="qab-gold" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e5b84b" />
          <stop offset="1" stopColor="#c98f1f" />
        </linearGradient>
      </defs>
      {/* Crescent embracing */}
      <path
        d="M31.5 3.5c8.6 2.6 14.5 10.6 14.5 19.7 0 11.3-9.2 20.5-20.5 20.5-9.1 0-17.1-6-19.7-14.5C9.4 38 18.6 44.4 27.7 42.5 37.2 40.6 43.5 31.5 42 22c-1.2-7.6-6.4-13.7-13.4-16.2-1-.4 1.9-2.6 2.9-2.3Z"
        fill="url(#qab-gold)"
      />
      {/* Heart nested in crescent */}
      <path
        d="M15.2 21.6c-2.7-2.6-2.7-6.9 0-9.5 2.4-2.3 6.2-2.3 8.6 0l.7.7.7-.7c2.4-2.3 6.2-2.3 8.6 0 2.7 2.6 2.7 6.9 0 9.5l-9.3 9-9.3-9Z"
        fill="#0d6b4f"
      />
    </svg>
  );
}

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="h-8 w-8" />
      <span
        className={cn(
          "font-display text-2xl font-bold tracking-tight",
          dark ? "text-white" : "text-primary"
        )}
      >
        Qabiltoo
      </span>
    </span>
  );
}
