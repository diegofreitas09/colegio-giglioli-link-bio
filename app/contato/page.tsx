import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import LeadForm from "@/components/LeadForm";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Contato e matrículas | Colégio Giglioli em Fortaleza",
  description:
    "Fale com o Colégio Giglioli em Fortaleza, tire dúvidas sobre vagas e matrículas, conheça os segmentos e solicite atendimento para agendar uma visita.",
  alternates: { canonical: "/contato" },
  openGraph: {
    title: "Contato e matrículas | Colégio Giglioli em Fortaleza",
    description:
      "Entre em contato com o Colégio Giglioli para informações sobre matrícula, segmentos, visita e atendimento às famílias.",
    url: "/contato",
    type: "website"
  }
};

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Quero falar com o Colégio Giglioli e saber mais sobre matrícula. 🚀✨")}`;

export default function ContatoPage() {
  return (
    <>
      <SiteHeader />
      <FloatingMascot />
      <main className="min-h-screen bg-[#eef7ff] pt-[78px] text-[#16314f]">
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 rounded-[36px] bg-gradient-to-br from-[#071a39] via-[#0c376f] to-[#0d6da3] p-6 text-white shadow-2xl sm:p-9 lg:grid-cols-2">
              <AnimatedSection>
                <span className="section-kicker">CONTATO • MATRÍCULA</span>
                <h1 className="mt-3 font-[var(--font-display)] text-5xl font-black leading-[.95]">Pronto para conhecer o Giglioli?</h1>
                <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed text-slate-300">
                  Use este canal para tirar dúvidas sobre vagas, turmas, matrícula e visita ao Colégio Giglioli. Você pode registrar seu interesse pelo formulário ou falar diretamente com a Secretaria pelo WhatsApp.
                </p>
                <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-slate-400">
                  Antes de entrar em contato, você também pode conhecer os segmentos atendidos, a Estação Giglioli e as experiências compartilhadas por famílias. Assim, sua conversa com a equipe começa com as informações mais importantes em mãos.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25d366] px-5 py-3 text-xs font-black text-white">WhatsApp ↗</a>
                  <a href="https://www.instagram.com/colegio.giglioli/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/7 px-5 py-3 text-xs font-black">Instagram ↗</a>
                  <a href="tel:+5585999725279" className="rounded-full border border-white/10 bg-white/7 px-5 py-3 text-xs font-black">Ligar</a>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.08}><LeadForm /></AnimatedSection>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AnimatedSection>
              <div className="rounded-[30px] border border-sky-900/10 bg-white p-7 shadow-xl shadow-sky-900/5 sm:p-9">
                <span className="text-xs font-black tracking-[.16em] text-sky-600">ANTES DA VISITA</span>
                <h2 className="mt-3 max-w-3xl font-[var(--font-display)] text-3xl font-black text-[#123c7b] sm:text-4xl">
                  Explore a escola e encontre a informação certa.
                </h2>
                <p className="mt-4 max-w-4xl font-bold leading-7 text-slate-600">
                  O site reúne informações sobre Educação Infantil e Ensino Fundamental, atividades da Estação Giglioli, localização e depoimentos. Esses conteúdos ajudam a família a identificar a etapa escolar de interesse e a preparar perguntas para o atendimento.
                </p>
                <nav aria-label="Conteúdos relacionados" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <a href="/segmentos" className="rounded-2xl border border-sky-900/10 bg-sky-50 p-4 text-sm font-black text-[#123c7b] transition hover:-translate-y-1 hover:bg-sky-100">Ver segmentos →</a>
                  <a href="/estacao" className="rounded-2xl border border-sky-900/10 bg-sky-50 p-4 text-sm font-black text-[#123c7b] transition hover:-translate-y-1 hover:bg-sky-100">Conhecer a Estação →</a>
                  <a href="/depoimentos" className="rounded-2xl border border-sky-900/10 bg-sky-50 p-4 text-sm font-black text-[#123c7b] transition hover:-translate-y-1 hover:bg-sky-100">Ler depoimentos →</a>
                  <a href="/localizacao" className="rounded-2xl border border-sky-900/10 bg-[#123c7b] p-4 text-sm font-black text-white transition hover:-translate-y-1">Ver localização →</a>
                </nav>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </>
  );
}
