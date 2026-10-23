"use client";

import { cn } from "@/lib/utils";

interface RingsConnectionProps {
  className?: string;
  size?: number;
  /** Animate the interlocking sequence (default true) */
  animated?: boolean;
}

/**
 * "Two rings forming a connection" — the visual metaphor for matchmaking.
 * An emerald ring and a gold ring slowly orbit toward each other and
 * interlock, with a small radiant gem where they meet. Loops gently.
 */
export function RingsConnection({ className, size = 200, animated = true }: RingsConnectionProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* radiant core */}
      <span className="absolute h-1/3 w-1/3 rounded-full bg-gold-400/25 blur-2xl" />

      <svg width={size} height={size} viewBox="0 0 200 200" className={animated ? "overflow-visible" : ""}>
        <defs>
          <linearGradient id="ring-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9ce7a" />
            <stop offset="55%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#96771f" />
          </linearGradient>
          <linearGradient id="ring-emerald" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0b5345" />
            <stop offset="60%" stopColor="#1a6b58" />
            <stop offset="100%" stopColor="#4ea28c" />
          </linearGradient>
        </defs>

        {/* Left ring (emerald) — slides right then settles overlapping */}
        <g className={animated ? "qab-ring-left" : undefined}>
          <circle
            cx="78"
            cy="100"
            r="42"
            fill="none"
            stroke="url(#ring-emerald)"
            strokeWidth="10"
            style={{ filter: "drop-shadow(0 6px 14px rgba(11,83,69,0.35))" }}
          />
          {/* diamond gem on the ring */}
          <rect
            x="70"
            y="50"
            width="14"
            height="14"
            transform="rotate(45 77 57)"
            fill="#0b5345"
            stroke="#d4af37"
            strokeWidth="1.6"
          />
        </g>

        {/* Right ring (gold) — slides left then settles interlocked */}
        <g className={animated ? "qab-ring-right" : undefined}>
          <circle
            cx="122"
            cy="100"
            r="42"
            fill="none"
            stroke="url(#ring-gold)"
            strokeWidth="10"
            style={{ filter: "drop-shadow(0 6px 14px rgba(212,175,55,0.4))" }}
          />
          <rect
            x="115"
            y="136"
            width="12"
            height="12"
            transform="rotate(45 121 142)"
            fill="#d4af37"
            stroke="#0b5345"
            strokeWidth="1.4"
          />
        </g>

        {/* meeting spark */}
        <circle cx="100" cy="100" r="3.2" fill="#e9ce7a" className={animated ? "qab-ring-spark" : undefined} />
      </svg>

      <style jsx>{`
        @keyframes qab-ring-left-kf {
          0%, 12% { transform: translateX(-26px); }
          38%, 78% { transform: translateX(0); }
          100% { transform: translateX(-26px); }
        }
        @keyframes qab-ring-right-kf {
          0%, 12% { transform: translateX(26px); }
          38%, 78% { transform: translateX(0); }
          100% { transform: translateX(26px); }
        }
        @keyframes qab-ring-spark-kf {
          0%, 20% { opacity: 0; }
          34%, 76% { opacity: 1; }
          92%, 100% { opacity: 0; }
        }
        .qab-ring-left { animation: qab-ring-left-kf 9s ease-in-out infinite; }
        .qab-ring-right { animation: qab-ring-right-kf 9s ease-in-out infinite; }
        .qab-ring-spark { animation: qab-ring-spark-kf 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .qab-ring-left, .qab-ring-right { transform: none; animation: none; }
          .qab-ring-spark { opacity: 1; animation: none; }
        }
      `}</style>
    </div>
  );
}
