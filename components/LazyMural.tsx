"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Mural = dynamic(() => import("./Mural"), { ssr: false });

type MuralContext = "home" | "mural";

function MuralPlaceholder() {
  return (
    <section id="mural" className="space-section min-h-[1250px] bg-[#f7fbff] py-24 text-[#16314f]" aria-busy="true" aria-label="Carregando mural da escola">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="section-kicker-dark">MÓDULO 03 • MURAL DA ESTAÇÃO</span>
        <h2 className="section-title-dark">Cada registro é uma estrela da nossa história.</h2>
        <p className="section-copy-dark">Publicações, projetos, festas, vivências e momentos da rotina do Colégio Giglioli.</p>

        <div className="mt-10 min-h-[600px] animate-pulse rounded-[34px] border border-sky-900/10 bg-gradient-to-br from-[#0d3f7d] via-[#178fc9] to-[#ffd24d] opacity-70" />
        <div className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div className="min-h-[360px] animate-pulse rounded-[30px] bg-[#071a39]/90" />
          <div className="min-h-[360px] animate-pulse rounded-[30px] border border-sky-900/10 bg-white" />
        </div>
      </div>
    </section>
  );
}

export default function LazyMural({ context = "home" }: { context?: MuralContext }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ready]);

  return <div ref={ref}>{ready ? <Mural context={context} /> : <MuralPlaceholder />}</div>;
}
