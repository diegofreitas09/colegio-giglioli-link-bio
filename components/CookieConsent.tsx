"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "giglioli_cookie_consent";
type Consent = "accepted" | "essential";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setVisible(saved !== "accepted" && saved !== "essential");
  }, []);

  function choose(value: Consent) {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent("giglioli-cookie-consent", { detail: value }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-4xl rounded-[26px] border border-white/10 bg-[#061329]/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:bottom-5 sm:p-5"
      role="dialog"
      aria-live="polite"
      aria-label="Preferências de privacidade"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <strong className="font-[var(--font-display)] text-lg">Privacidade e cookies</strong>
          <p className="mt-1 text-xs font-bold leading-relaxed text-slate-300 sm:text-sm">
            Usamos recursos essenciais para o site funcionar. Com sua autorização, também usamos o Google Analytics para entender visitas e melhorar a experiência.
            {" "}<a href="/privacidade" className="font-black text-sky-300 underline underline-offset-2">Ver política de privacidade</a>.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs font-black text-white transition hover:bg-white/10"
          >
            Apenas necessários
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-3 text-xs font-black text-[#082047] transition hover:-translate-y-0.5"
          >
            Aceitar Analytics
          </button>
        </div>
      </div>
    </aside>
  );
}
