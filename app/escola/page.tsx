import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "A escola | Colégio Giglioli",
  description: "Conheça a proposta pedagógica, o acolhimento e a experiência educacional do Colégio Giglioli em Fortaleza."
};

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Quero conhecer melhor o Colégio Giglioli e receber informações sobre matrícula. 🚀✨")}`;

const pilares = [
  ["Aprender com sentido", "Experiências que conectam conteúdo, curiosidade, participação e desenvolvimento."],
  ["Acolher de verdade", "Uma escola próxima das famílias, com rotina organizada e olhar atento para cada fase."],
  ["Mover corpo e ideias", "Natação, futsal, ballet, hidroginástica e recreação direcionada ampliam a vivência escolar."]
];

export default function EscolaPage() {
  return (
    <>
      <SiteHeader />
      <FloatingMascot />
      <main className="min-h-screen bg-[#f7fbff] pt-[78px] text-[#16314f]">
        <section className="bg-[#061a39] py-24 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AnimatedSection>
              <span className="section-kicker">A ESCOLA</span>
              <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-5xl font-black leading-[.95] sm:text-6xl">Uma estação de aprendizagem feita para descobrir, criar e crescer.</h1>
              <p className="mt-6 max-w-3xl text-base font-bold leading-8 text-slate-300 sm:text-lg">O Colégio Giglioli acompanha a criança do Infantil 2 ao 5º ano, com inglês desde o Infantil 3, acolhimento, movimento e experiências que tornam a rotina escolar mais viva.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/estacao" className="rounded-full border border-cyan-300/25 bg-white/5 px-6 py-3 text-sm font-black text-white">Conhecer a Estação Giglioli →</a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-6 py-3 text-sm font-black text-[#082047]">Falar com a matrícula →</a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-5 md:grid-cols-3">
              {pilares.map(([title, text], i) => (
                <AnimatedSection key={title} delay={i * .06}>
                  <article className="h-full rounded-[30px] border border-sky-900/10 bg-white p-7 shadow-xl shadow-sky-900/8 transition hover:-translate-y-1 hover:shadow-2xl">
                    <span className="text-3xl text-sky-500">✦</span>
                    <h2 className="mt-5 font-[var(--font-display)] text-3xl font-black text-[#123c7b]">{title}</h2>
                    <p className="mt-3 font-bold leading-7 text-slate-500">{text}</p>
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
