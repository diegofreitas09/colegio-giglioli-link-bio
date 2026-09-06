import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="grid min-h-screen place-items-center overflow-hidden bg-[#061329] px-4 pt-[90px] text-white">
        <section className="mx-auto grid max-w-5xl items-center gap-8 py-16 lg:grid-cols-[1fr_.8fr]">
          <div>
            <span className="section-kicker">ERRO 404 • ROTA NÃO ENCONTRADA</span>
            <h1 className="mt-4 font-[var(--font-display)] text-5xl font-black leading-[.95] sm:text-6xl">Essa nave saiu da rota.</h1>
            <p className="mt-5 max-w-xl text-base font-bold leading-8 text-slate-300">A página que você tentou acessar não existe ou mudou de endereço. O Gigi ajuda você a voltar para a Estação Giglioli.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/" className="rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-6 py-3 text-sm font-black text-[#082047]">Voltar para a página inicial →</a>
              <a href="/contato" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-white">Falar com a escola</a>
            </div>
          </div>
          <div className="relative mx-auto min-h-[330px] w-full max-w-[420px]">
            <Image src="/assets/gigi-astronauta.webp" alt="Gigi, mascote astronauta do Colégio Giglioli" fill sizes="420px" className="object-contain" />
          </div>
        </section>
      </main>
    </>
  );
}
