"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees */
  maxTilt?: number;
  /** Parallax depth for the inner content (px translate) */
  depth?: number;
}

/**
 * A card that gently tilts in 3D following the mouse — premium parallax
 * feel. Spring-smoothed so motion is slow and dignified, never twitchy.
 */
export function ParallaxCard({ children, className, maxTilt = 8, depth = 14 }: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 60,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 60,
    damping: 18,
  });
  const translateX = useSpring(useTransform(mx, [-0.5, 0.5], [-depth, depth]), {
    stiffness: 50,
    damping: 20,
  });
  const translateY = useSpring(useTransform(my, [-0.5, 0.5], [-depth, depth]), {
    stiffness: 50,
    damping: 20,
  });

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div className="perspective-1200" style={{ width: "100%" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("preserve-3d", className)}
      >
        {children}
        {/* subtle floating shadow layer */}
        <motion.div
          aria-hidden
          style={{ x: translateX, y: translateY }}
          className="pointer-events-none absolute inset-0 -z-10"
        />
      </motion.div>
    </div>
  );
}
