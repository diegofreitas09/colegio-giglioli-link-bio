import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import LeadForm from "@/components/LeadForm";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Contato e matrícula | Colégio Giglioli",
  description: "Fale com o Colégio Giglioli, solicite informações de matrícula e agende uma visita."
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
                <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed text-slate-300">Preencha os dados para registrar seu interesse e seguir o atendimento pelo WhatsApp.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25d366] px-5 py-3 text-xs font-black text-white">WhatsApp ↗</a>
                  <a href="https://www.instagram.com/colegio.giglioli/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/7 px-5 py-3 text-xs font-black">Instagram ↗</a>
                  <a href="tel:+5585999725279" className="rounded-full border border-white/10 bg-white/7 px-5 py-3 text-xs font-black">Ligar</a>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={.08}><LeadForm /></AnimatedSection>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
