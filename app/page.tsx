import Image from "next/image";
import SpaceBackground from "@/components/SpaceBackground";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
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
        <section className="relative min-h-[900px] overflow-hidden pt-32 text-white md:pt-40">
          <div className="absolute -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="absolute -right-40 top-12 -z-10 h-[420px] w-[420px] rounded-full bg-orange-400/10 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
            <AnimatedSection className="pt-6">
              <span className="mission-chip"><i /> ESTAÇÃO GIGLIOLI • MATRÍCULAS ABERTAS</span>
              <h1 className="mt-6 max-w-3xl font-[var(--font-display)] text-5xl font-extrabold leading-[.95] tracking-[-.045em] sm:text-6xl lg:text-7xl">
                Cada aluno é uma estrela. <span className="text-gradient">Juntos, formamos uma constelação.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base font-bold leading-relaxed text-slate-300 sm:text-lg">Educação Infantil ao 5º ano em uma escola que combina aprendizagem, acolhimento, inglês desde o Infantil II, movimento e experiências que tornam a rotina mais viva.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Infantil II ao 5º ano", "Inglês desde o Inf. II", "Natação", "Ballet", "Hidroginástica", "Recreação direcionada"].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/7 px-3 py-2 text-xs font-black text-sky-100 backdrop-blur">{item}</span>)}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={wa("Olá! Vim pelo site do Colégio Giglioli e quero saber mais sobre matrícula. 🚀✨")} target="_blank" rel="noopener noreferrer" className="pulse-enrollment inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-6 py-4 text-sm font-black text-[#082047] shadow-2xl shadow-orange-500/20">Quero falar com a matrícula <span>→</span></a>
                <a href="#sobre" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/7 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/12">Conhecer a estação</a>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><small className="block text-[10px] font-black uppercase tracking-[.12em] text-slate-400">Matrícula / Secretaria</small><strong className="mt-1 block text-white">(85) 99972-5279</strong></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><small className="block text-[10px] font-black uppercase tracking-[.12em] text-slate-400">Instagram</small><strong className="mt-1 block text-white">@colegio.giglioli</strong></div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="relative min-h-[560px]" delay={.12}>
              <div className="absolute inset-8 rounded-full border border-dashed border-sky-300/20 motion-safe:animate-[spin_18s_linear_infinite]" />
              <div className="absolute inset-x-12 top-20 h-72 rounded-[50%] border border-dashed border-orange-300/15 motion-safe:animate-[spin_13s_linear_infinite_reverse]" />
              <span className="orbit-dot absolute right-8 top-16 h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_28%,#fff,#77dcff_28%,#1471c4_62%,#072d6e)] shadow-[0_0_45px_rgba(37,166,227,.35)]" />
              <span className="orbit-dot absolute left-4 top-48 h-8 w-8 rounded-full bg-[radial-gradient(circle_at_30%_28%,#fff,#ffd24d_35%,#ff9138)] shadow-[0_0_30px_rgba(255,145,56,.35)]" />
              <div className="absolute left-2 top-14 z-20 max-w-[190px] rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#0a2856] shadow-2xl">Oi! Eu sou o <strong>Gigi</strong>. Vamos embarcar? 🚀</div>
              <div className="absolute -right-20 bottom-[-28px] h-[590px] w-[530px] max-w-[120%] drop-shadow-[0_35px_34px_rgba(0,0,0,.36)] sm:right-[-24px]">
                <Image src="/assets/gigi-astronauta.webp" alt="Gigi, mascote astronauta do Colégio Giglioli" fill priority sizes="(max-width: 768px) 430px, 530px" className="object-contain object-bottom motion-safe:animate-[float_4.8s_ease-in-out_infinite]" />
              </div>
              <a href={wa("Olá! O Gigi me trouxe até aqui e eu quero informações sobre matrícula. 🚀")} target="_blank" rel="noopener noreferrer" className="absolute bottom-20 left-2 z-30 rounded-full border border-yellow-200/30 bg-yellow-100 px-4 py-2 text-xs font-black text-amber-800 shadow-xl motion-safe:animate-[point_2s_ease-in-out_infinite]">← Matrícula por aqui</a>
            </AnimatedSection>
          </div>
          <div className="pointer-events-none absolute bottom-[-60px] left-1/2 h-52 w-[1200px] -translate-x-1/2 border border-sky-300/10 opacity-70 [background-image:linear-gradient(rgba(73,186,235,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(73,186,235,.09)_1px,transparent_1px)] [background-size:60px_45px]" />
        </section>

        <section id="sobre" className="space-section rounded-t-[42px] bg-[#f7fbff] py-24 text-[#16314f]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AnimatedSection>
              <span className="section-kicker-dark">MÓDULO 01 • SOBRE A ESCOLA</span>
              <h2 className="section-title-dark">Uma estação de aprendizagem feita para descobrir, criar e crescer.</h2>
              <p className="section-copy-dark">A identidade espacial dá personalidade ao site, mas a mensagem principal é institucional: acolhimento, desenvolvimento e parceria com as famílias. O visual não repete os outros projetos escolares — aqui tudo gira em torno da Estação Giglioli.</p>
            </AnimatedSection>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {values.map(([title, text, icon], i) => <AnimatedSection key={title} delay={i * .06}><article className="rounded-[28px] border border-sky-900/10 bg-white p-6 shadow-xl shadow-sky-900/7 transition hover:-translate-y-1"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-2xl">{icon}</span><h3 className="mt-5 font-[var(--font-display)] text-2xl text-[#123c7b]">{title}</h3><p className="mt-2 text-sm font-bold leading-relaxed text-slate-500">{text}</p></article></AnimatedSection>)}
            </div>
          </div>
        </section>

        <section id="segmentos" className="space-section border-y border-white/8 bg-[#071a39]/78 py-24 text-white backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <AnimatedSection><span className="section-kicker">MÓDULO 02 • PLANETAS DA CONSTELAÇÃO</span><h2 className="section-title-light">Cada etapa tem uma missão diferente.</h2><p className="section-copy-light">Os segmentos aparecem como planetas conectados: a criança avança de fase sem perder o vínculo com a mesma constelação.</p></AnimatedSection>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {segments.map((segment, i) => <AnimatedSection key={segment.title} delay={i * .08}><article className="group rounded-[30px] border border-white/10 bg-white/6 p-7 shadow-2xl backdrop-blur transition hover:-translate-y-2 hover:border-sky-300/30"><span className={`grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${segment.tone} text-4xl shadow-xl transition group-hover:scale-105`}>{segment.icon}</span><h3 className="mt-6 font-[var(--font-display)] text-3xl">{segment.title}</h3><p className="mt-2 text-sm font-bold text-slate-300">{segment.text}</p><a href={wa(`Olá! Quero informações sobre ${segment.title} no Colégio Giglioli.`)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-xs font-black text-yellow-300">Consultar matrícula →</a></article></AnimatedSection>)}
            </div>
          </div>
        </section>

        <Mural />

        <section id="localizacao" className="space-section bg-[#eef7ff] py-24 text-[#16314f]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
            <AnimatedSection>
              <span className="section-kicker-dark">MÓDULO 04 • COORDENADAS</span>
              <h2 className="section-title-dark">Venha conhecer a nossa estação.</h2>
              <p className="section-copy-dark">R. Umarizeiras, 940 • Canindezinho • Fortaleza, Ceará. O mapa atual do Google confirma este endereço e o telefone principal da escola.</p>
              <div className="mt-6 grid gap-3">
                <a href="https://www.google.com/maps/search/?api=1&query=R.%20Umarizeiras%2C%20940%20-%20Canindezinho%2C%20Fortaleza%20-%20CE%2C%2060810-670" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#123c7b] px-5 py-4 text-sm font-black text-white">Abrir rota no Google Maps ↗</a>
                <a href="tel:+5585999725279" className="rounded-2xl border border-sky-900/10 bg-white px-5 py-4 text-sm font-black text-[#123c7b]">Ligar: (85) 99972-5279</a>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={.08}>
              <div className="overflow-hidden rounded-[30px] border border-sky-900/10 bg-white p-2 shadow-2xl shadow-sky-900/10">
                <iframe title="Localização do Colégio Giglioli" src="https://www.google.com/maps?q=R.%20Umarizeiras%2C%20940%20-%20Canindezinho%2C%20Fortaleza%20-%20CE%2C%2060810-670&output=embed" className="h-[430px] w-full rounded-[24px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
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
                <div className="mt-7 flex flex-wrap gap-3"><a href="https://www.instagram.com/colegio.giglioli/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/7 px-4 py-3 text-xs font-black">Instagram ↗</a><a href={wa("Olá! Quero agendar uma visita ao Colégio Giglioli.")} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/7 px-4 py-3 text-xs font-black">Agendar visita</a></div>
              </AnimatedSection>
              <AnimatedSection delay={.1}><LeadForm /></AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-[#041025] py-9 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3"><span className="relative h-12 w-12"><Image src="/assets/logo-giglioli.webp" alt="" fill sizes="48px" className="object-contain" /></span><div><strong className="block font-[var(--font-display)] text-lg">Colégio Giglioli</strong><small className="font-bold text-slate-400">Fortaleza • Ceará</small></div></div>
          <div className="flex flex-wrap gap-4 text-xs font-black text-slate-300"><a href="#sobre">A escola</a><a href="#segmentos">Segmentos</a><a href="#mural">Mural</a><a href="#localizacao">Localização</a><a href="#contato">Matrícula</a></div>
        </div>
      </footer>
    </>
  );
}
