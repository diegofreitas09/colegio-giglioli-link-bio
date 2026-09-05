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

    type Star = { x:number; y:number; r:number; vx:number; vy:number; phase:number; alpha:number; depth:number };
    type Meteor = { x:number; y:number; len:number; speed:number; alpha:number; active:boolean; wait:number };
    let stars: Star[] = [];
    let meteors: Meteor[] = [];

    const makeMeteor = (): Meteor => ({
      x: width * (.45 + Math.random() * .55),
      y: -40 - Math.random() * 180,
      len: 90 + Math.random() * 110,
      speed: 3.3 + Math.random() * 2.3,
      alpha: .28 + Math.random() * .42,
      active: false,
      wait: 90 + Math.random() * 360
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const amount = Math.max(95, Math.min(220, Math.round(width * height / 6500)));
      stars = Array.from({ length: amount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: .35 + Math.random() * 1.75,
        vx: (Math.random() - .5) * .11,
        vy: .025 + Math.random() * .18,
        phase: Math.random() * Math.PI * 2,
        alpha: .2 + Math.random() * .78,
        depth: .35 + Math.random() * 1.15
      }));
      meteors = Array.from({ length: width < 760 ? 1 : 3 }, makeMeteor);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / Math.max(1, width);
      pointer.y = e.clientY / Math.max(1, height);
    };

    const drawNebula = (t: number) => {
      const drift = reduceMotion ? 0 : Math.sin(t * .00012) * 18;
      const g1 = ctx.createRadialGradient(width * .18 + drift, height * .22, 0, width * .18 + drift, height * .22, Math.max(width, height) * .42);
      g1.addColorStop(0, "rgba(26,126,209,.12)");
      g1.addColorStop(.55, "rgba(24,74,151,.06)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * .82 - drift, height * .35, 0, width * .82 - drift, height * .35, Math.max(width, height) * .32);
      g2.addColorStop(0, "rgba(255,145,56,.075)");
      g2.addColorStop(.5, "rgba(116,50,150,.045)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);
    };

    const drawMeteor = (m: Meteor) => {
      if (reduceMotion) return;
      if (!m.active) {
        m.wait -= 1;
        if (m.wait <= 0) m.active = true;
        return;
      }
      const angle = Math.PI * .77;
      const tx = m.x + Math.cos(angle) * m.len;
      const ty = m.y + Math.sin(angle) * m.len;
      const gradient = ctx.createLinearGradient(m.x, m.y, tx, ty);
      gradient.addColorStop(0, `rgba(255,255,255,${m.alpha})`);
      gradient.addColorStop(.25, `rgba(110,215,255,${m.alpha * .75})`);
      gradient.addColorStop(1, "rgba(110,215,255,0)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, m.alpha + .25)})`;
      ctx.arc(m.x, m.y, 1.7, 0, Math.PI * 2);
      ctx.fill();

      m.x -= m.speed * .75;
      m.y += m.speed;
      if (m.y > height + m.len || m.x < -m.len) Object.assign(m, makeMeteor());
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      drawNebula(t);

      const px = (pointer.x - .5) * 28;
      const py = (pointer.y - .5) * 20;

      for (const star of stars) {
        if (!reduceMotion) {
          star.x += star.vx * star.depth;
          star.y += star.vy * star.depth;
          if (star.y > height + 4) star.y = -4;
          if (star.x > width + 4) star.x = -4;
          if (star.x < -4) star.x = width + 4;
        }
        const twinkle = .68 + Math.sin(t * (.0012 + star.depth * .00035) + star.phase) * .32;
        const alpha = Math.max(.08, star.alpha * twinkle);
        const sx = star.x + px * star.depth * .35;
        const sy = star.y + py * star.depth * .35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(sx, sy, star.r * star.depth, 0, Math.PI * 2);
        ctx.fill();
        if (star.r > 1.35) {
          ctx.strokeStyle = `rgba(126,215,255,${alpha * .22})`;
          ctx.lineWidth = .7;
          ctx.beginPath();
          ctx.moveTo(sx - 4, sy);
          ctx.lineTo(sx + 4, sy);
          ctx.moveTo(sx, sy - 4);
          ctx.lineTo(sx, sy + 4);
          ctx.stroke();
        }
      }

      const limit = Math.min(width < 760 ? 42 : 68, stars.length);
      for (let i = 0; i < limit; i++) {
        for (let j = i + 1; j < limit; j++) {
          const a = stars[i], b = stars[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 128) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(83,198,245,${(1 - dist / 128) * .17})`;
            ctx.lineWidth = .75;
            ctx.moveTo(a.x + px * .22, a.y + py * .22);
            ctx.lineTo(b.x + px * .22, b.y + py * .22);
            ctx.stroke();
          }
        }
      }

      meteors.forEach(drawMeteor);
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
