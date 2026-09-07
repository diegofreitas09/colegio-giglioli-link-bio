"use client";

import Image from "next/image";
import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    ["A escola", "/escola"],
    ["Estrutura", "/estrutura"],
    ["Segmentos", "/segmentos"],
    ["Projetos", "/projetos"],
    ["Parceiros", "/parceiros"],
    ["Mural", "/mural"],
    ["Depoimentos", "/depoimentos"],
    ["Localização", "/localizacao"],
    ["Contato", "/contato"]
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#041126]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0">
            <Image src="/assets/logo-giglioli-vetorial.svg" alt="Colégio Giglioli" fill sizes="56px" className="object-contain drop-shadow-[0_3px_10px_rgba(0,0,0,.25)]" priority />
          </span>
          <span className="hidden leading-tight xl:grid">
            <strong className="font-[var(--font-display)] text-lg text-white">Colégio Giglioli</strong>
            <small className="text-[10px] font-extrabold tracking-[.16em] text-sky-200/70">ESTAÇÃO DE APRENDIZAGEM</small>
          </span>
        </a>

        <nav className="hidden items-center gap-3 lg:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="whitespace-nowrap text-[11px] font-black text-slate-200 transition hover:text-yellow-300">{label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="/matriculas" className="rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-4 py-2.5 text-xs font-black text-[#082047] shadow-lg shadow-orange-500/20">Matrículas</a>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden" aria-expanded={open} aria-label="Abrir menu">☰</button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-78px)] overflow-y-auto border-t border-white/10 bg-[#061329]/95 px-5 py-4 lg:hidden">
          {links.map(([label, href]) => (
            <a key={href} onClick={() => setOpen(false)} href={href} className="block border-b border-white/5 py-3 text-sm font-extrabold text-white">{label}</a>
          ))}
          <a onClick={() => setOpen(false)} href="/matriculas" className="mt-4 block rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-4 text-center text-sm font-black text-[#082047]">Campanhas de Matrículas</a>
        </div>
      )}
    </header>
  );
}
