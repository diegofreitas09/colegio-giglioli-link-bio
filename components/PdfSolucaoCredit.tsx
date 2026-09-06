"use client";

import { usePathname } from "next/navigation";

const whatsappUrl = `https://wa.me/5585984161882?text=${encodeURIComponent(
  "Olá! Vim por um projeto desenvolvido pela PDF Solução Educacional e gostaria de falar com vocês."
)}`;

const logoUrl =
  "https://raw.githubusercontent.com/diegofreitas09/coracoralina/main/logo-pdf-web.png";

export default function PdfSolucaoCredit() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="relative z-30 border-t border-white/10 bg-[#020b19] px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4 text-white sm:py-4">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex w-full max-w-[430px] items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center shadow-[0_14px_35px_rgba(0,0,0,.18)] transition hover:border-cyan-300/25 hover:bg-white/[0.07] sm:w-fit"
        aria-label="Falar com a PDF Solução Educacional pelo WhatsApp"
      >
        <img
          src={logoUrl}
          alt="Logo PDF Solução Educacional"
          className="h-12 w-auto shrink-0 object-contain sm:h-14"
        />
        <span className="min-w-0 text-left">
          <span className="block text-[10px] font-black uppercase tracking-[.15em] text-slate-400">
            Desenvolvido por
          </span>
          <strong className="block text-sm font-black text-white">
            PDF Solução Educacional
          </strong>
          <span className="mt-1 block text-sm font-black text-cyan-200">
            WhatsApp: (85) 98416-1882
          </span>
        </span>
      </a>
    </div>
  );
}
