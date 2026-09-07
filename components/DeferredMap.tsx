"use client";

import { useEffect, useRef, useState } from "react";

const mapEmbedUrl = "https://www.google.com/maps?q=R.%20Umarizeiras%2C%20929%20-%20Canindezinho%2C%20Fortaleza%20-%20CE&output=embed";
const mapRouteUrl = "https://www.google.com/maps/search/?api=1&query=R.%20Umarizeiras%2C%20929%20-%20Canindezinho%2C%20Fortaleza%20-%20CE";

export default function DeferredMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const element = containerRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [loaded]);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-[30px] border border-sky-900/10 bg-white p-2 shadow-2xl shadow-sky-900/10">
      {loaded ? (
        <iframe
          title="Localização do Colégio Giglioli"
          src={mapEmbedUrl}
          className="h-[430px] w-full rounded-[24px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="relative grid h-[430px] place-items-center overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_30%_25%,rgba(56,189,248,.2),transparent_28%),linear-gradient(145deg,#eaf6ff,#dbeeff)] px-6 text-center">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(18,60,123,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(18,60,123,.08)_1px,transparent_1px)] [background-size:34px_34px]" aria-hidden="true" />
          <div className="relative z-10 max-w-md">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#123c7b] text-3xl text-white shadow-xl" aria-hidden="true">⌖</span>
            <strong className="mt-5 block font-[var(--font-display)] text-2xl text-[#123c7b]">Mapa interativo sob demanda</strong>
            <p className="mt-2 text-sm font-bold leading-relaxed text-slate-500">O Google Maps só é carregado quando você chega nesta área, deixando a abertura do site muito mais leve.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setLoaded(true)} className="rounded-full bg-[#123c7b] px-5 py-3 text-xs font-black text-white transition-transform hover:-translate-y-0.5">Carregar mapa</button>
              <a href={mapRouteUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-sky-900/10 bg-white px-5 py-3 text-xs font-black text-[#123c7b]">Abrir rota ↗</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
