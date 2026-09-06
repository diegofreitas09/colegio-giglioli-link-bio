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
    <div className="border-t border-white/10 bg-[#020b19] px-4 py-4 text-white">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex w-fit max-w-full items-center justify-center gap-3 rounded-2xl px-3 py-2 text-center transition hover:bg-white/[0.05]"
        aria-label="Falar com a PDF Solução Educacional pelo WhatsApp"
      >
        <img
          src={logoUrl}
          alt="Logo PDF Solução Educacional"
          className="h-10 w-auto shrink-0 object-contain sm:h-12"
        />
        <span className="min-w-0 text-left">
          <span className="block text-[10px] font-black uppercase tracking-[.15em] text-slate-400">
            Desenvolvido por
          </span>
          <strong className="block text-xs font-black text-white sm:text-sm">
            PDF Solução Educacional
          </strong>
          <span className="mt-0.5 block text-[11px] font-bold text-cyan-200">
            (85) 98416-1882
          </span>
        </span>
      </a>
    </div>
  );
}
