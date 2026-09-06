"use client";

import { useEffect, useState } from "react";

const MAPS_ROUTE_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Col%C3%A9gio%20Giglioli%2C%20R.%20Umarizeiras%2C%20929%2C%20Fortaleza%20-%20CE&destination_place_id=ChIJFaMyY45NxwcRVSWyhKbvG_0";

const MAPS_EMBED_URL =
  "https://maps.google.com/maps?hl=pt-BR&q=Col%C3%A9gio%20Giglioli%2C%20R.%20Umarizeiras%2C%20929%2C%20Canindezinho%2C%20Fortaleza%20-%20CE&z=17&ie=UTF8&iwloc=B&output=embed";

type MapMode = "loading" | "embed" | "fallback";

export default function LocationMap() {
  const [mode, setMode] = useState<MapMode>("loading");

  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    const isRestrictedWebView = /(Instagram|FBAN|FBAV|\bwv\b)/i.test(userAgent);

    setMode(isRestrictedWebView ? "fallback" : "embed");
  }, []);

  if (mode !== "embed") {
    return (
      <a
        href={MAPS_ROUTE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-[470px] w-full items-center justify-center rounded-[24px] bg-gradient-to-br from-[#eef7ff] via-white to-[#e6f2ff] p-6 text-center"
        aria-label="Abrir a localização do Colégio Giglioli no Google Maps"
      >
        <div className="max-w-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#123c7b] text-4xl text-white shadow-xl shadow-sky-900/20 transition-transform group-hover:scale-105">
            📍
          </div>
          <h2 className="text-2xl font-black text-[#123c7b]">Colégio Giglioli</h2>
          <p className="mt-3 text-base font-semibold leading-relaxed text-[#36536f]">
            R. Umarizeiras, 929 • Canindezinho • Fortaleza, Ceará
          </p>
          <div className="mt-6 inline-flex rounded-2xl bg-[#123c7b] px-5 py-4 text-sm font-black text-white shadow-lg shadow-sky-900/15">
            {mode === "loading" ? "Preparando o mapa…" : "Abrir rota no Google Maps ↗"}
          </div>
          {mode === "fallback" && (
            <p className="mt-4 text-sm font-semibold leading-relaxed text-[#58728b]">
              O navegador interno do Instagram pode bloquear mapas incorporados. Toque acima para abrir a rota sem erro.
            </p>
          )}
        </div>
      </a>
    );
  }

  return (
    <iframe
      title="Localização do Colégio Giglioli"
      src={MAPS_EMBED_URL}
      className="h-[470px] w-full rounded-[24px] border-0"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
