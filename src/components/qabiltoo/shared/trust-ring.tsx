"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrustRingProps {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Elegant circular progress ring for Trust Score — fills with an
 * emerald→gold gradient as verification completeness grows.
 */
export function TrustRing({ value, size = 132, strokeWidth = 9, className, children }: TrustRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setProgress(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const id = `trust-ring-${value}-${size}`;

  return (
    <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b5345" />
            <stop offset="60%" stopColor="#2e8469" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gold-500/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * progress) / 100}
          style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.35))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children ?? (
          <>
            <span className="font-display text-2xl font-semibold text-foreground">
              {Math.round(progress)}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Trust Score
            </span>
          </>
        )}
      </div>
    </div>
  );
}
