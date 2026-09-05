"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".space-section").forEach((section) => {
        gsap.fromTo(section, { backgroundPositionY: "0px" }, {
          backgroundPositionY: "-42px",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: .8 }
        });
      });
      gsap.utils.toArray<HTMLElement>(".orbit-dot").forEach((dot, i) => {
        gsap.to(dot, {
          y: i % 2 ? 18 : -18,
          x: i % 3 ? 8 : -8,
          duration: 2.8 + i * .25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}
