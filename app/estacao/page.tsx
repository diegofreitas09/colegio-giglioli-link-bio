import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SpaceBackground from "@/components/SpaceBackground";
import FloatingMascot from "@/components/FloatingMascot";

export const metadata: Metadata = {
  title: "Conheça a Estação Giglioli",
  description: "Conheça a proposta, os espaços, as atividades e a experiência educacional do Colégio Giglioli em Fortaleza."
};

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Conheci a Estação Giglioli pelo site e quero informações sobre matrícula. 🚀✨")}`;

const atividades = [
  ["✦", "Educação Infantil ao 5º ano", "Uma jornada contínua de aprendizagem, descoberta e autonomia."],
  ["◎", "Inglês desde o Infantil 2", "Contato com o idioma desde cedo, integrado à rotina escolar."],
  ["≋", "Natação", "Movimento, segurança aquática e desenvolvimento corporal."],
  ["⚽", "Futsal", "Esporte, convivência, coordenação e espírito de equipe."],
  ["♢", "Ballet", "Expressão, postura, musicalidade e sensibilidade artística."],
  ["◫", "Hidroginástica", "Atividade física orientada e bem-estar em ambiente aquático."],
  ["✺", "Recreação direcionada", "Brincadeiras com intencionalidade, convivência e desenvolvimento."],
  ["★", "Acolhimento", "Uma escola próxima das famílias e atenta às necessidades de cada etapa."]
];

export default function EstacaoPage() {
  return (
    <>
      <SpaceBackground />
      <SiteHeader />
      <FloatingMascot />

      <main className="min-h-screen overflow-hidden bg-[#041329] text-white">
        <section className="relative pt-32 pb-20 sm:pt-40">
          <div className="pointer-events-none absolute left-[-8rem] top-28 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute right-[-8rem] top-16 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-xs font-black tracking-[.16em] text-cyan-200">
                <i className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,.9)]" />
                ESTAÇÃO GIGLIOLI
              </span>
              <h1 className="mt-6 max-w-3xl font-[var(--font-display)] text-5xl font-black leading-[.94] tracking-[-.045em] sm:text-6xl lg:text-7xl">
                Uma escola para <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-yellow-200 to-orange-300">descobrir, crescer e brilhar.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-slate-300 sm:text-lg">
                A Estação Giglioli é o jeito que encontramos de representar uma escola viva: cada aluno percorre sua própria jornada, encontra novos desafios e continua conectado à mesma constelação de cuidado, aprendizagem e parceria com a família.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-6 text-sm font-black text-[#082047] shadow-[0_18px_45px_rgba(255,166,37,.28)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(255,190,45,.38)]">
                  Quero conhecer para matrícula →
                </a>
                <a href="/" className="inline-flex min-h-14 items-center justify-center rounded-full border border-cyan-300/25 bg-white/5 px-6 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:border-cyan-200/60 hover:shadow-[0_0_28px_rgba(74,210,255,.18)]">
                  ← Voltar para a página inicial
                </a>
              </div>
            </div>

            <div className="relative min-h-[470px] sm:min-h-[560px]">
              <div className="absolute inset-[8%] rounded-full border border-cyan-300/15 motion-safe:animate-[spin_22s_linear_infinite]" />
              <div className="absolute inset-x-[13%] top-[22%] h-[44%] rounded-[50%] border border-orange-300/15 motion-safe:animate-[spin_17s_linear_infinite_reverse]" />
              <div className="absolute left-[12%] top-[12%] text-5xl text-yellow-300 drop-shadow-[0_0_22px_rgba(253,224,71,.8)] motion-safe:animate-pulse">★</div>
              <div className="absolute inset-0 drop-shadow-[0_30px_35px_rgba(0,0,0,.36)]">
                <Image src="/assets/gigi-astronauta.webp" alt="Gigi, mascote astronauta do Colégio Giglioli" fill priority sizes="(max-width: 768px) 92vw, 560px" className="object-contain object-bottom motion-safe:animate-[float_5s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#071b3c]/78 py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <span className="text-xs font-black tracking-[.18em] text-cyan-300">EXPERIÊNCIAS DA ESTAÇÃO</span>
            <h2 className="mt-3 max-w-3xl font-[var(--font-display)] text-4xl font-black tracking-tight sm:text-5xl">Muito além da sala de aula.</h2>
            <p className="mt-4 max-w-3xl font-bold leading-7 text-slate-300">Passe o mouse sobre os módulos: cada um acende como uma estrela da constelação Giglioli.</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {atividades.map(([icon, title, text]) => (
                <article key={title} className="station-glow-card rounded-[26px] p-6" tabIndex={0}>
                  <span className="text-3xl text-cyan-300 drop-shadow-[0_0_12px_rgba(71,210,255,.3)]">{icon}</span>
                  <h3 className="mt-5 font-[var(--font-display)] text-xl font-black text-white">{title}</h3>
                  <p className="mt-3 text-sm font-bold leading-6 text-slate-400">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eef7ff] py-20 text-[#143456]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <article className="rounded-[30px] bg-white p-7 shadow-xl shadow-sky-900/8">
                <span className="text-xs font-black tracking-[.16em] text-sky-600">MISSÃO</span>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl font-black">Aprender com sentido.</h2>
                <p className="mt-4 font-bold leading-7 text-slate-500">Conteúdo, curiosidade, participação e experiências conectadas à realidade de cada fase.</p>
              </article>
              <article className="rounded-[30px] bg-white p-7 shadow-xl shadow-sky-900/8">
                <span className="text-xs font-black tracking-[.16em] text-sky-600">ACOLHIMENTO</span>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl font-black">Família e escola próximas.</h2>
                <p className="mt-4 font-bold leading-7 text-slate-500">Comunicação, rotina organizada e parceria para acompanhar o desenvolvimento de cada aluno.</p>
              </article>
              <article className="rounded-[30px] bg-white p-7 shadow-xl shadow-sky-900/8">
                <span className="text-xs font-black tracking-[.16em] text-sky-600">MOVIMENTO</span>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl font-black">Corpo e mente em ação.</h2>
                <p className="mt-4 font-bold leading-7 text-slate-500">Natação, futsal, ballet, hidroginástica e recreação ampliam a experiência escolar.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#05152f] py-20 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-4xl text-yellow-300 drop-shadow-[0_0_18px_rgba(253,224,71,.55)]">★</div>
            <h2 className="mt-5 font-[var(--font-display)] text-4xl font-black sm:text-5xl">Pronto para embarcar?</h2>
            <p className="mx-auto mt-4 max-w-2xl font-bold leading-7 text-slate-300">Fale com a equipe e agende uma visita para conhecer o Colégio Giglioli de perto.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-8 text-sm font-black text-[#082047] shadow-[0_18px_45px_rgba(255,166,37,.25)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(255,190,45,.38)]">
              Falar com a matrícula →
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
