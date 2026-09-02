"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const LOGO_SRC = "/assets/logo/logo_solvro_mono.svg";
const POINTER_RADIUS = 90;
const POINTER_FORCE = 4;
const SPRING = 0.045;
const FRICTION = 0.84;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  phase: number;
  /** 0 at the top of the logo, 1 at the bottom – drives the hue gradient. */
  depth: number;
}

/**
 * The Solvro mark drawn from a few hundred drifting particles that assemble
 * into the logo, shimmer, and scatter around the pointer. One canvas, one
 * animation frame loop, paused when off-screen. Static under reduced motion.
 */
export function ParticleLogo({
  className,
  /** Distance between sampled points in CSS pixels; lower = more particles. */
  density = 4,
}: {
  className?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas == null || context == null) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let disposed = false;

    const image = new Image();
    image.src = LOGO_SRC;

    const buildTargets = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      if (width === 0 || height === 0 || image.width === 0) {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const stencil = document.createElement("canvas");
      stencil.width = width;
      stencil.height = height;
      const stencilContext = stencil.getContext("2d");
      if (stencilContext == null) {
        return;
      }
      const scale = Math.min(width / image.width, height / image.height) * 0.9;
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;
      stencilContext.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      const pixels = stencilContext.getImageData(0, 0, width, height).data;

      const targets: { x: number; y: number }[] = [];
      for (let y = 0; y < height; y += density) {
        for (let x = 0; x < width; x += density) {
          if (pixels[(y * width + x) * 4 + 3] > 128) {
            targets.push({
              x: x + (Math.random() - 0.5) * density,
              y: y + (Math.random() - 0.5) * density,
            });
          }
        }
      }

      particles = targets.map((target, index) => {
        const existing = particles[index] as Particle | undefined;
        return {
          x: existing?.x ?? Math.random() * width,
          y: existing?.y ?? Math.random() * height,
          vx: existing?.vx ?? 0,
          vy: existing?.vy ?? 0,
          targetX: target.x,
          targetY: target.y,
          size: 0.9 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
          depth: (target.y - offsetY) / drawHeight,
        };
      });
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const render = (time: number) => {
      const seconds = time / 1000;
      const dark = isDark();
      const lightness = dark ? 66 : 50;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const driftX = Math.sin(seconds * 0.8 + particle.phase) * 1.4;
        const driftY = Math.cos(seconds * 0.6 + particle.phase) * 1.4;
        let ax = (particle.targetX + driftX - particle.x) * SPRING;
        let ay = (particle.targetY + driftY - particle.y) * SPRING;

        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < POINTER_RADIUS * POINTER_RADIUS) {
          const distance = Math.sqrt(distanceSquared) || 1;
          const force = (1 - distance / POINTER_RADIUS) * POINTER_FORCE;
          ax += (dx / distance) * force;
          ay += (dy / distance) * force;
        }

        particle.vx = (particle.vx + ax) * FRICTION;
        particle.vy = (particle.vy + ay) * FRICTION;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const alpha = 0.6 + 0.4 * Math.sin(seconds * 2 + particle.phase);
        const hue = 216 + particle.depth * 50;
        context.fillStyle = `hsla(${hue.toFixed(0)} 90% ${lightness.toString()}% / ${alpha.toFixed(2)})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
    };

    const loop = (time: number) => {
      if (disposed) {
        return;
      }
      render(time);
      if (visible) {
        frame = requestAnimationFrame(loop);
      }
    };

    const renderStatic = () => {
      for (const particle of particles) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
      }
      render(0);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reducedMotion) {
        renderStatic();
      } else {
        frame = requestAnimationFrame(loop);
      }
    };

    image.addEventListener("load", () => {
      buildTargets();
      start();
    });

    const resizeObserver = new ResizeObserver(() => {
      if (image.complete && image.width > 0) {
        buildTargets();
        if (reducedMotion) {
          renderStatic();
        }
      }
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        start();
      } else {
        cancelAnimationFrame(frame);
      }
    });
    intersectionObserver.observe(canvas);

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Logo Koła Naukowego Solvro"
      role="img"
      className={cn("block h-full w-full", className)}
    />
  );
}
