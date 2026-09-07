"use client";

import { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let cancelled = false;
    let raf = 0;
    let resizeTimer = 0;
    let removeListeners = () => {};

    const startTimer = window.setTimeout(() => {
      if (cancelled) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let width = 0;
      let height = 0;
      let paused = document.hidden;

      type Star = { x: number; y: number; r: number; speed: number; phase: number; alpha: number };
      type Meteor = { x: number; y: number; wait: number; active: boolean };
      let stars: Star[] = [];
      const meteor: Meteor = { x: 0, y: 0, wait: 260, active: false };

      const seedScene = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const amount = width < 760 ? 52 : 76;
        stars = Array.from({ length: amount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: .45 + Math.random() * 1.35,
          speed: .025 + Math.random() * .09,
          phase: Math.random() * Math.PI * 2,
          alpha: .24 + Math.random() * .65
        }));
        meteor.x = width * .78;
        meteor.y = -70;
        meteor.wait = 260;
        meteor.active = false;
      };

      const paintBackdrop = (t: number) => {
        ctx.fillStyle = "#061329";
        ctx.fillRect(0, 0, width, height);

        const drift = reduceMotion ? 0 : Math.sin(t * .00012) * 12;
        const g1 = ctx.createRadialGradient(width * .18 + drift, height * .22, 0, width * .18 + drift, height * .22, Math.max(width, height) * .42);
        g1.addColorStop(0, "rgba(26,126,209,.12)");
        g1.addColorStop(.58, "rgba(24,74,151,.05)");
        g1.addColorStop(1, "rgba(6,19,41,0)");
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        const g2 = ctx.createRadialGradient(width * .82 - drift, height * .35, 0, width * .82 - drift, height * .35, Math.max(width, height) * .3);
        g2.addColorStop(0, "rgba(255,145,56,.07)");
        g2.addColorStop(1, "rgba(6,19,41,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
      };

      const draw = (t: number) => {
        if (cancelled || paused) return;
        paintBackdrop(t);

        for (const star of stars) {
          if (!reduceMotion) {
            star.y += star.speed;
            if (star.y > height + 3) star.y = -3;
          }
          const twinkle = .75 + Math.sin(t * .0011 + star.phase) * .25;
          const alpha = Math.max(.08, star.alpha * twinkle);
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }

        const connectionCount = Math.min(24, stars.length);
        for (let i = 0; i < connectionCount; i++) {
          for (let j = i + 1; j < connectionCount; j++) {
            const a = stars[i];
            const b = stars[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < 118 * 118) {
              const opacity = (1 - Math.sqrt(dist2) / 118) * .12;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(83,198,245,${opacity})`;
              ctx.lineWidth = .7;
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        if (!reduceMotion && width >= 760) {
          if (!meteor.active) {
            meteor.wait -= 1;
            if (meteor.wait <= 0) meteor.active = true;
          } else {
            const endX = meteor.x + 92;
            const endY = meteor.y - 62;
            const gradient = ctx.createLinearGradient(meteor.x, meteor.y, endX, endY);
            gradient.addColorStop(0, "rgba(255,255,255,.65)");
            gradient.addColorStop(1, "rgba(110,215,255,0)");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.35;
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            meteor.x -= 2.4;
            meteor.y += 3.2;
            if (meteor.y > height + 110) {
              meteor.x = width * (.65 + Math.random() * .28);
              meteor.y = -80;
              meteor.wait = 300 + Math.random() * 260;
              meteor.active = false;
            }
          }
        }

        if (!reduceMotion) raf = requestAnimationFrame(draw);
      };

      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          seedScene();
          if (reduceMotion) draw(0);
        }, 120);
      };

      const onVisibility = () => {
        paused = document.hidden;
        if (!paused && !reduceMotion) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        }
      };

      seedScene();
      draw(0);
      window.addEventListener("resize", onResize, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      removeListeners = () => {
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, 900);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
      removeListeners();
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 -z-30 h-full w-full bg-[#061329]" aria-hidden="true" />;
}
