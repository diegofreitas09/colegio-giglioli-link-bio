import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import AnimatedSection from "@/components/AnimatedSection";
import SpaceBackground from "@/components/SpaceBackground";

export const metadata: Metadata = {
  title: "Segmentos | Colégio Giglioli",
  description: "Conheça os segmentos do Colégio Giglioli: Educação Infantil ao 5º ano, com inglês desde o Infantil 3."
};

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const wa = (segmento: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Quero informações sobre ${segmento} no Colégio Giglioli. 🚀✨`)}`;

const segmentos = [
  { titulo: "Educação Infantil", faixa: "Infantil 2 ao Infantil 5", texto: "Acolhimento, descobertas, brincadeiras e desenvolvimento em cada etapa.", icon: "🪐" },
  { titulo: "1º e 2º ano", faixa: "Primeiras órbitas do Fundamental", texto: "Aprendizagem estruturada, autonomia e novas conquistas com acompanhamento próximo.", icon: "🌎" },
  { titulo: "3º ao 5º ano", faixa: "Novas missões e mais autonomia", texto: "Desafios progressivos, participação, responsabilidade e preparação para as próximas etapas.", icon: "🚀" }
];

export default function SegmentosPage() {
  return (
    <>
      <SpaceBackground />
      <SiteHeader />
      <FloatingMascot />
      <main className="min-h-screen bg-[#061329] pt-[78px] text-white">
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AnimatedSection>
              <span className="section-kicker">SEGMENTOS</span>
              <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-5xl font-black leading-[.95] sm:text-6xl">Cada etapa tem uma missão diferente.</h1>
              <p className="mt-5 max-w-3xl text-base font-bold leading-8 text-slate-300">Do Infantil 2 ao 5º ano, a criança avança sem perder o vínculo com a mesma constelação de cuidado, aprendizagem e parceria com a família. O inglês começa no Infantil 3.</p>
            </AnimatedSection>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {segmentos.map((item, i) => (
                <AnimatedSection key={item.titulo} delay={i * .07}>
                  <article className="station-glow-card h-full rounded-[30px] p-7">
                    <div className="text-5xl">{item.icon}</div>
                    <h2 className="mt-6 font-[var(--font-display)] text-3xl font-black">{item.titulo}</h2>
                    <p className="mt-2 text-sm font-black text-cyan-200">{item.faixa}</p>
                    <p className="mt-4 font-bold leading-7 text-slate-400">{item.texto}</p>
                    <a href={wa(item.titulo)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex text-sm font-black text-yellow-300">Vamos nessa nova missão →</a>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
