"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LightMotesProps {
  className?: string;
  count?: number;
  color?: string;
  speed?: number;
}

/**
 * Gentle floating gold light-motes (dust particles) rendered on canvas.
 * Pauses offscreen / hidden tab; clear fallback for prefers-reduced-motion.
 */
export function LightMotes({ className, count = 36, color = "#d4af37", speed = 1 }: LightMotesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    let running = true;
    let lastFrame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    interface Mote {
      x: number;
      y: number;
      r: number;
      vy: number;
      wobble: number;
      phase: number;
      twinkle: number;
      alpha: number;
    }

    let motes: Mote[] = [];
    const seed = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.2,
        vy: (0.08 + Math.random() * 0.25) * speed,
        wobble: 8 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.4 + Math.random() * 0.6,
        alpha: 0.12 + Math.random() * 0.3,
      }));
    };
    seed();

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;

      for (const m of motes) {
        const y = (((m.y - t * 0.012 * m.vy * speed) % (h + 40)) + h + 40) % (h + 40) - 20;
        const x = m.x + Math.sin(t * 0.0004 + m.phase) * m.wobble * 0.4;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.001 * m.twinkle + m.phase);
        ctx.globalAlpha = m.alpha * tw;
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fill();

        // Soft halo for larger motes
        if (m.r > 2) {
          ctx.globalAlpha = m.alpha * tw * 0.25;
          ctx.beginPath();
          ctx.arc(x, y, m.r * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !running) return;
      if (t - lastFrame < 33) return;
      lastFrame = t;
      if (reduced) {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        cancelAnimationFrame(raf);
        return;
      }
      draw(t);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [count, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}
