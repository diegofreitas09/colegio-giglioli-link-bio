import Image from "next/image";
import SpaceBackground from "@/components/SpaceBackground";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import HeroGiglioli from "@/components/HeroGiglioli";
import AnimatedSection from "@/components/AnimatedSection";
import LeadForm from "@/components/LeadForm";
import Mural from "@/components/Mural";
import ScrollEffects from "@/components/ScrollEffects";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const wa = (text: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

const segments = [
  { title: "Educação Infantil", text: "Infantil II ao Infantil V", icon: "🪐", tone: "from-fuchsia-400 to-orange-300" },
  { title: "1º e 2º ano", text: "Primeiras órbitas do Fundamental", icon: "🌎", tone: "from-cyan-400 to-blue-500" },
  { title: "3º ao 5º ano", text: "Novas missões e mais autonomia", icon: "🚀", tone: "from-yellow-300 to-orange-400" }
];

const values = [
  ["Aprender com sentido", "Experiências que conectam conteúdo, curiosidade e participação.", "✦"],
  ["Acolher de verdade", "Comunicação próxima, rotina organizada e um olhar atento para cada fase.", "💙"],
  ["Mover corpo e ideias", "Natação, ballet, recreação direcionada e vivências que ampliam o desenvolvimento.", "⚡"]
];

export default function Home() {
  return (
    <>
      <SpaceBackground />
      <ScrollEffects />
      <SiteHeader />
      <FloatingMascot />

      <main id="topo">
        <HeroGiglioli />

        <section id="sobre" className="space-section rounded-t-[42px] bg-[#f7fbff] py-24 text-[#16314f]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AnimatedSection>
              <span className="section-kicker-dark">MÓDULO 01 • SOBRE A ESCOLA</span>
              <h2 className="section-title-dark">Uma estação de aprendizagem feita para descobrir, criar e crescer.</h2>
              <p className="section-copy-dark">A identidade espacial dá personalidade ao site, mas a mensagem principal é institucional: acolhimento, desenvolvimento e parceria com as famílias. O visual não repete os outros projetos escolares — aqui tudo gira em torno da Estação Giglioli.</p>
            </AnimatedSection>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {values.map(([title, text, icon], i) => (
                <AnimatedSection key={title} delay={i * .06}>
                  <article className="rounded-[28px] border border-sky-900/10 bg-white p-6 shadow-xl shadow-sky-900/7 transition hover:-translate-y-1">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-2xl">{icon}</span>
                    <h3 className="mt-5 font-[var(--font-display)] text-2xl text-[#123c7b]">{title}</h3>
                    <p className="mt-2 text-sm font-bold leading-relaxed text-slate-500">{text}</p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section id="segmentos" className="space-section border-y border-white/8 bg-[#071a39]/78 py-24 text-white backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AnimatedSection>
              <span className="section-kicker">MÓDULO 02 • PLANETAS DA CONSTELAÇÃO</span>
              <h2 className="section-title-light">Cada etapa tem uma missão diferente.</h2>
              <p className="section-copy-light">Os segmentos aparecem como planetas conectados: a criança avança de fase sem perder o vínculo com a mesma constelação.</p>
            </AnimatedSection>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {segments.map((segment, i) => (
                <AnimatedSection key={segment.title} delay={i * .08}>
                  <article className="group rounded-[30px] border border-white/10 bg-white/6 p-7 shadow-2xl backdrop-blur transition hover:-translate-y-2 hover:border-sky-300/30">
                    <span className={`grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${segment.tone} text-4xl shadow-xl transition group-hover:scale-105`}>{segment.icon}</span>
                    <h3 className="mt-6 font-[var(--font-display)] text-3xl">{segment.title}</h3>
                    <p className="mt-2 text-sm font-bold text-slate-300">{segment.text}</p>
                    <a href={wa(`Olá! Quero informações sobre ${segment.title} no Colégio Giglioli.`)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-xs font-black text-yellow-300">Consultar matrícula →</a>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <Mural />

        <section id="localizacao" className="space-section bg-[#eef7ff] py-24 text-[#16314f]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
            <AnimatedSection>
              <span className="section-kicker-dark">MÓDULO 04 • COORDENADAS</span>
              <h2 className="section-title-dark">Venha conhecer a nossa estação.</h2>
              <p className="section-copy-dark">R. Umarizeiras, 929 • Canindezinho • Fortaleza, Ceará.</p>
              <div className="mt-6 grid gap-3">
                <a href="https://www.google.com/maps/search/?api=1&query=R.%20Umarizeiras%2C%20929%20-%20Canindezinho%2C%20Fortaleza%20-%20CE" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#123c7b] px-5 py-4 text-sm font-black text-white">Abrir rota no Google Maps ↗</a>
                <a href="tel:+5585999725279" className="rounded-2xl border border-sky-900/10 bg-white px-5 py-4 text-sm font-black text-[#123c7b]">Ligar: (85) 99972-5279</a>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={.08}>
              <div className="overflow-hidden rounded-[30px] border border-sky-900/10 bg-white p-2 shadow-2xl shadow-sky-900/10">
                <iframe title="Localização do Colégio Giglioli" src="https://www.google.com/maps?q=R.%20Umarizeiras%2C%20929%20-%20Canindezinho%2C%20Fortaleza%20-%20CE&output=embed" className="h-[430px] w-full rounded-[24px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="contato" className="space-section bg-[#f7fbff] pb-28 pt-8 text-[#16314f]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 rounded-[36px] bg-gradient-to-br from-[#071a39] via-[#0c376f] to-[#0d6da3] p-6 text-white shadow-2xl sm:p-9 lg:grid-cols-2">
              <AnimatedSection>
                <span className="section-kicker">MÓDULO FINAL • EMBARQUE</span>
                <h2 className="mt-3 font-[var(--font-display)] text-5xl leading-[.95]">Pronto para conhecer o Giglioli?</h2>
                <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed text-slate-300">Preencha os dados e a equipe entra em contato. Se o Supabase ainda não estiver conectado, o formulário abre o WhatsApp automaticamente — ninguém fica perdido no espaço.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="https://www.instagram.com/colegio.giglioli/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/7 px-4 py-3 text-xs font-black">Instagram ↗</a>
                  <a href={wa("Olá! Quero agendar uma visita ao Colégio Giglioli.")} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/7 px-4 py-3 text-xs font-black">Agendar visita</a>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={.1}><LeadForm /></AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-[#041025] py-9 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12"><Image src="/assets/logo-giglioli-vetorial.svg" alt="" fill sizes="48px" className="object-contain" /></span>
            <div><strong className="block font-[var(--font-display)] text-lg">Colégio Giglioli</strong><small className="font-bold text-slate-400">Fortaleza • Ceará</small></div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-black text-slate-300">
            <a href="#sobre">A escola</a><a href="#segmentos">Segmentos</a><a href="#mural">Mural</a><a href="#localizacao">Localização</a><a href="#contato">Matrícula</a>
          </div>
        </div>
      </footer>
    </>
  );
}
