"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  /** Distance in px for slide directions */
  distance?: number;
  duration?: number;
  once?: boolean;
}

const variants = {
  up: (d: number) => ({ y: d, x: 0, scale: 1 }),
  down: (d: number) => ({ y: -d, x: 0, scale: 1 }),
  left: (d: number) => ({ x: d, y: 0, scale: 1 }),
  right: (d: number) => ({ x: -d, y: 0, scale: 1 }),
  scale: (_d: number) => ({ x: 0, y: 0, scale: 0.92 }),
};

/**
 * Scroll-triggered reveal — sections fade/slide in elegantly as the user
 * scrolls. Slow, tasteful easing. Runs once by default.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 28,
  duration = 0.9,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...variants[direction](distance) }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
