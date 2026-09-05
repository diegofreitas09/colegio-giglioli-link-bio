"use client";

import { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    const pointer = { x: .5, y: .5 };

    type Star = { x:number; y:number; r:number; vx:number; vy:number; phase:number; alpha:number };
    let stars: Star[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const amount = Math.max(80, Math.min(190, Math.round(width * height / 7800)));
      stars = Array.from({ length: amount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: .35 + Math.random() * 1.55,
        vx: (Math.random() - .5) * .1,
        vy: .025 + Math.random() * .16,
        phase: Math.random() * Math.PI * 2,
        alpha: .25 + Math.random() * .7
      }));
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / Math.max(1, width);
      pointer.y = e.clientY / Math.max(1, height);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const px = (pointer.x - .5) * 20;
      const py = (pointer.y - .5) * 14;

      for (const star of stars) {
        if (!reduceMotion) {
          star.x += star.vx;
          star.y += star.vy;
          if (star.y > height + 3) star.y = -3;
          if (star.x > width + 3) star.x = -3;
          if (star.x < -3) star.x = width + 3;
        }
        const alpha = Math.max(.08, star.alpha * (.72 + Math.sin(t * .0015 + star.phase) * .28));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(star.x + px * star.r / 2.5, star.y + py * star.r / 2.5, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const limit = Math.min(width < 760 ? 38 : 54, stars.length);
      for (let i = 0; i < limit; i++) {
        for (let j = i + 1; j < limit; j++) {
          const a = stars[i], b = stars[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79,194,245,${(1 - dist / 120) * .14})`;
            ctx.lineWidth = .7;
            ctx.moveTo(a.x + px * .25, a.y + py * .25);
            ctx.lineTo(b.x + px * .25, b.y + py * .25);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 -z-30 h-full w-full bg-[#061329]" aria-hidden="true" />;
}
