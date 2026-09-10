import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import Testimonials from "@/components/Testimonials";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Depoimentos de famílias | Colégio Giglioli Fortaleza",
  description:
    "Leia depoimentos de famílias do Colégio Giglioli em Fortaleza e conheça experiências compartilhadas sobre acolhimento, aprendizagem e rotina escolar.",
  alternates: { canonical: "/depoimentos" },
  openGraph: {
    title: "Depoimentos de famílias | Colégio Giglioli Fortaleza",
    description:
      "Conheça experiências compartilhadas por famílias do Colégio Giglioli e veja outros caminhos para conhecer a escola e falar com a equipe.",
    url: "/depoimentos",
    type: "website"
  }
};

export default function DepoimentosPage() {
  return (
    <>
      <SiteHeader />
      <FloatingMascot />
      <main className="min-h-screen bg-[#eef7ff] pt-[78px] text-[#16314f]">
        <section className="border-b border-sky-900/10 bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <AnimatedSection>
              <span className="text-xs font-black tracking-[.18em] text-sky-600">DEPOIMENTOS • FAMÍLIAS GIGLIOLI</span>
              <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-black leading-tight text-[#123c7b] sm:text-5xl">
                Experiências que ajudam outras famílias a conhecer a escola.
              </h1>
              <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-600">
                Esta página reúne depoimentos publicados após moderação da escola. Eles ajudam quem está conhecendo o Colégio Giglioli a entender melhor a relação com as famílias, a rotina escolar e a experiência vivida no dia a dia.
              </p>
              <p className="mt-4 max-w-4xl text-base font-semibold leading-8 text-slate-500">
                Cada família tem uma trajetória própria. Por isso, os depoimentos devem ser lidos como relatos individuais, complementando as informações sobre os segmentos, a proposta da escola, as atividades e os canais oficiais de atendimento.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <Testimonials />

        <section className="border-t border-sky-900/10 bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="font-[var(--font-display)] text-3xl font-black text-[#123c7b] sm:text-4xl">
                Quer conhecer o Giglioli além dos depoimentos?
              </h2>
              <p className="mt-4 max-w-3xl font-bold leading-7 text-slate-600">
                Veja os segmentos atendidos, conheça a Estação Giglioli e, quando estiver pronto, fale diretamente com a equipe para tirar dúvidas e agendar uma visita.
              </p>
              <nav aria-label="Conteúdos relacionados" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <a href="/segmentos" className="rounded-2xl border border-sky-900/10 bg-sky-50 p-4 text-sm font-black text-[#123c7b] transition hover:-translate-y-1 hover:bg-sky-100">Segmentos →</a>
                <a href="/estacao" className="rounded-2xl border border-sky-900/10 bg-sky-50 p-4 text-sm font-black text-[#123c7b] transition hover:-translate-y-1 hover:bg-sky-100">Estação Giglioli →</a>
                <a href="/escola" className="rounded-2xl border border-sky-900/10 bg-sky-50 p-4 text-sm font-black text-[#123c7b] transition hover:-translate-y-1 hover:bg-sky-100">A escola →</a>
                <a href="/contato" className="rounded-2xl border border-sky-900/10 bg-[#123c7b] p-4 text-sm font-black text-white transition hover:-translate-y-1">Contato e matrícula →</a>
              </nav>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </>
  );
}
