"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GirihCanvasProps {
  className?: string;
  /** Stroke color of the lattice */
  color?: string;
  /** Tiles across the minor axis — lower = larger stars */
  density?: number;
  /** Rotation speed multiplier (keep low & tasteful) */
  speed?: number;
  /** Overall opacity */
  opacity?: number;
}

/**
 * Lightweight pseudo-3D animated Islamic girih (8-pointed star) lattice.
 * A plane of interlocking stars slowly rotates in perspective — rendered
 * with pure Canvas 2D math (no WebGL/heavy deps) so it stays performant,
 * degrades to a single static frame under prefers-reduced-motion, and
 * pauses when offscreen or when the tab is hidden.
 */
export function GirihCanvas({
  className,
  color = "#d4af37",
  density = 5,
  speed = 1,
  opacity = 1,
}: GirihCanvasProps) {
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

    /* 8-pointed star vertices (two rotated squares) in unit space */
    const starSquares = (r: number): [number, number][][] => {
      const sqA: [number, number][] = [];
      const sqB: [number, number][] = [];
      for (let i = 0; i < 4; i++) {
        const aA = (Math.PI / 2) * i + Math.PI / 4;
        sqA.push([Math.cos(aA) * r, Math.sin(aA) * r]);
        const aB = (Math.PI / 2) * i;
        sqB.push([Math.cos(aB) * r, Math.sin(aB) * r]);
      }
      return [sqA, sqB];
    };

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      const angleY = t * 0.00005 * speed;
      const tiltX = Math.PI / 3.6;
      const rotZ = t * 0.000018 * speed;
      const cam = 1.7;

      const project = (x: number, y: number): [number, number, number] => {
        let X = x * Math.cos(angleY);
        let Z = x * Math.sin(angleY);
        let Y = y * Math.cos(tiltX) - Z * Math.sin(tiltX);
        Z = y * Math.sin(tiltX) + Z * Math.cos(tiltX);
        const x2 = X * Math.cos(rotZ) - Y * Math.sin(rotZ);
        const y2 = X * Math.sin(rotZ) + Y * Math.cos(rotZ);
        X = x2;
        Y = y2;
        const k = cam / (cam - Z * 0.85);
        return [X * k, Y * k, k];
      };

      // Tile grid sized to cover the rotated plane projection
      const span = 2.6;
      const n = Math.max(3, Math.round(density));
      const step = (span * 2) / n;
      const r = step * 0.46;

      // Center + scale projection to canvas
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.42;

      ctx.lineWidth = Math.max(0.6, Math.min(1.4, w / 900));
      ctx.strokeStyle = color;

      for (let gx = -n; gx <= n; gx++) {
        for (let gy = -n; gy <= n; gy++) {
          const ox = gx * step;
          const oy = gy * step;
          const [px, py, k] = project(ox, oy);
          if (px * scale + cx < -step * scale || px * scale + cx > w + step * scale) continue;
          if (py * scale + cy < -step * scale || py * scale + cy > h + step * scale) continue;

          // Depth-based alpha: front stars brighter
          const alpha = Math.max(0.05, Math.min(0.55, 0.34 * k - 0.12));
          ctx.globalAlpha = alpha * opacity;

          for (const sq of starSquares(r)) {
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
              const [lx, ly] = sq[i];
              const [vx, vy] = project(ox + lx, oy + ly);
              const X = cx + vx * scale;
              const Y = cy + vy * scale;
              if (i === 0) ctx.moveTo(X, Y);
              else ctx.lineTo(X, Y);
            }
            ctx.closePath();
            ctx.stroke();

            // Inner diamond accent
            const ir = r * 0.22;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
              const a = (Math.PI / 2) * i;
              const [vx, vy] = project(ox + Math.cos(a) * ir, oy + Math.sin(a) * ir);
              const X = cx + vx * scale;
              const Y = cy + vy * scale;
              if (i === 0) ctx.moveTo(X, Y);
              else ctx.lineTo(X, Y);
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !running) return;
      // Cap at ~30fps — slow, elegant, battery-friendly
      if (t - lastFrame < 33) return;
      lastFrame = t;
      draw(reduced ? 12000 : t);
      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [color, density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}
