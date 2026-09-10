import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import AnimatedSection from "@/components/AnimatedSection";
import SpaceBackground from "@/components/SpaceBackground";

export const metadata: Metadata = {
  title: "Educação Infantil e Fundamental | Colégio Giglioli",
  description:
    "Conheça a Educação Infantil e o Ensino Fundamental do Colégio Giglioli, do Infantil 2 ao 5º ano, com acompanhamento próximo e inglês desde o Infantil 3.",
  alternates: { canonical: "/segmentos" },
  openGraph: {
    title: "Educação Infantil e Fundamental | Colégio Giglioli",
    description:
      "Do Infantil 2 ao 5º ano, conheça os segmentos, a proposta de aprendizagem e os caminhos para matrícula no Colégio Giglioli em Fortaleza.",
    url: "/segmentos",
    type: "website"
  }
};

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const wa = (segmento: string) =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Olá! Quero informações sobre ${segmento} no Colégio Giglioli. 🚀✨`
  )}`;

const segmentos = [
  {
    titulo: "Educação Infantil",
    faixa: "Infantil 2 ao Infantil 5",
    texto:
      "Uma fase de acolhimento, descobertas e desenvolvimento integral, com experiências adequadas à idade e parceria próxima com a família.",
    icon: "🪐"
  },
  {
    titulo: "1º e 2º ano",
    faixa: "Primeiras órbitas do Ensino Fundamental",
    texto:
      "Aprendizagem estruturada, fortalecimento da leitura e da escrita, autonomia e novas conquistas com acompanhamento próximo.",
    icon: "🌎"
  },
  {
    titulo: "3º ao 5º ano",
    faixa: "Novas missões e mais autonomia",
    texto:
      "Desafios progressivos, participação, responsabilidade e consolidação das aprendizagens para preparar o aluno para as próximas etapas escolares.",
    icon: "🚀"
  }
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
              <span className="section-kicker">SEGMENTOS • EDUCAÇÃO INFANTIL E ENSINO FUNDAMENTAL</span>
              <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-5xl font-black leading-[.95] sm:text-6xl">
                Cada etapa tem uma missão diferente.
              </h1>
              <p className="mt-5 max-w-3xl text-base font-bold leading-8 text-slate-300">
                O Colégio Giglioli acompanha o aluno do Infantil 2 ao 5º ano do Ensino Fundamental em Fortaleza. Em cada fase, a proposta respeita o ritmo de desenvolvimento da criança, amplia a autonomia e mantém a família próxima da rotina escolar. O inglês começa no Infantil 3.
              </p>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-400">
                A jornada foi organizada para que a transição entre os segmentos aconteça com continuidade: acolhimento na Educação Infantil, consolidação das aprendizagens nos primeiros anos do Fundamental e desafios progressivos até o 5º ano.
              </p>
            </AnimatedSection>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {segmentos.map((item, i) => (
                <AnimatedSection key={item.titulo} delay={i * 0.07}>
                  <article className="station-glow-card h-full rounded-[30px] p-7">
                    <div className="text-5xl">{item.icon}</div>
                    <h2 className="mt-6 font-[var(--font-display)] text-3xl font-black">{item.titulo}</h2>
                    <p className="mt-2 text-sm font-black text-cyan-200">{item.faixa}</p>
                    <p className="mt-4 font-bold leading-7 text-slate-400">{item.texto}</p>
                    <a
                      href={wa(item.titulo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex text-sm font-black text-yellow-300"
                    >
                      Quero informações sobre esta etapa →
                    </a>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#091d3f] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AnimatedSection>
              <span className="section-kicker">CONTINUE EXPLORANDO</span>
              <h2 className="mt-3 max-w-3xl font-[var(--font-display)] text-4xl font-black sm:text-5xl">
                Conheça melhor a experiência Giglioli.
              </h2>
              <p className="mt-4 max-w-3xl font-bold leading-7 text-slate-300">
                Além dos segmentos, você pode conhecer a Estação Giglioli, entender melhor a escola, ler depoimentos de famílias e falar diretamente com a equipe para tirar dúvidas sobre vagas, matrícula e visita.
              </p>
            </AnimatedSection>

            <nav aria-label="Conteúdos relacionados" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a href="/estacao" className="rounded-2xl border border-white/10 bg-white/5 p-5 font-black transition hover:-translate-y-1 hover:border-cyan-300/40">
                Estação Giglioli →
                <span className="mt-2 block text-sm font-semibold text-slate-400">Estrutura, atividades e proposta.</span>
              </a>
              <a href="/escola" className="rounded-2xl border border-white/10 bg-white/5 p-5 font-black transition hover:-translate-y-1 hover:border-cyan-300/40">
                Conheça a escola →
                <span className="mt-2 block text-sm font-semibold text-slate-400">Identidade, valores e experiência escolar.</span>
              </a>
              <a href="/depoimentos" className="rounded-2xl border border-white/10 bg-white/5 p-5 font-black transition hover:-translate-y-1 hover:border-cyan-300/40">
                Depoimentos →
                <span className="mt-2 block text-sm font-semibold text-slate-400">Experiências compartilhadas pelas famílias.</span>
              </a>
              <a href="/contato" className="rounded-2xl border border-white/10 bg-white/5 p-5 font-black transition hover:-translate-y-1 hover:border-cyan-300/40">
                Matrícula e contato →
                <span className="mt-2 block text-sm font-semibold text-slate-400">Fale com a equipe e agende uma visita.</span>
              </a>
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
