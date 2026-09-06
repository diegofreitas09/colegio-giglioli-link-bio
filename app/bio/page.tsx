import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Links | Colégio Giglioli",
  description: "Acesse os principais canais oficiais do Colégio Giglioli."
};

const secretaria = "5585999725279";
const direcao = "5585996030509";
const pdfSolucao = "5585984161882";

const secretariaWhatsapp = `https://wa.me/${secretaria}?text=${encodeURIComponent(
  "Olá! Vim pelo Link da Bio do Colégio Giglioli e gostaria de falar com a Secretaria."
)}`;

const direcaoWhatsapp = `https://wa.me/${direcao}?text=${encodeURIComponent(
  "Olá! Vim pelo Link da Bio do Colégio Giglioli e gostaria de falar com a Direção."
)}`;

const pdfSolucaoWhatsapp = `https://wa.me/${pdfSolucao}?text=${encodeURIComponent(
  "Olá! Vim pelo projeto do Colégio Giglioli e gostaria de falar com a PDF Solução Educacional."
)}`;

const localizacao =
  "https://www.google.com/maps/search/?api=1&query=Col%C3%A9gio%20Giglioli%20Fortaleza%20CE";
const avaliacao =
  "https://www.google.com/maps/search/?api=1&query=Col%C3%A9gio%20Giglioli%20Fortaleza%20CE";

const floatingLogos = [
  { left: "4%", top: "8%", size: 72, delay: "0s", duration: "11s", opacity: 0.08 },
  { left: "80%", top: "5%", size: 96, delay: "-2s", duration: "14s", opacity: 0.07 },
  { left: "7%", top: "42%", size: 86, delay: "-6s", duration: "13s", opacity: 0.06 },
  { left: "84%", top: "48%", size: 68, delay: "-4s", duration: "10s", opacity: 0.08 },
  { left: "12%", top: "78%", size: 104, delay: "-8s", duration: "16s", opacity: 0.055 },
  { left: "76%", top: "82%", size: 82, delay: "-1s", duration: "12s", opacity: 0.07 }
];

function LinkCard({
  href,
  icon,
  title,
  subtitle,
  disabled = false
}: {
  href?: string;
  icon: string;
  title: string;
  subtitle?: string;
  disabled?: boolean;
}) {
  const classes =
    "bio-link group relative flex min-h-[84px] w-full items-center gap-4 overflow-hidden rounded-[26px] border border-white/15 bg-white/[0.075] px-5 py-4 text-left shadow-[0_18px_55px_rgba(0,0,0,.22)] backdrop-blur-xl transition duration-300 sm:px-6";

  const content = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-2xl shadow-[0_0_24px_rgba(77,212,255,.12)] transition duration-300 group-hover:scale-110 group-hover:bg-cyan-200/15">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block font-[var(--font-display)] text-lg font-black tracking-[.01em] text-white sm:text-xl">
          {title}
        </strong>
        {subtitle ? (
          <span className="mt-0.5 block text-sm font-bold text-slate-300">{subtitle}</span>
        ) : null}
      </span>
      <span className="text-xl font-black text-yellow-300 transition duration-300 group-hover:translate-x-1">
        {disabled ? "•" : "→"}
      </span>
    </>
  );

  if (disabled) {
    return (
      <div className={`${classes} cursor-default opacity-80`} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`${classes} hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/[0.11] hover:shadow-[0_24px_65px_rgba(8,92,150,.25)]`}
    >
      {content}
    </a>
  );
}

export default function BioPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03142c] px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(36,159,221,.28),transparent_38%),radial-gradient(circle_at_15%_55%,rgba(255,166,34,.12),transparent_32%),radial-gradient(circle_at_90%_70%,rgba(27,121,199,.18),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle,rgba(255,255,255,.5)_1px,transparent_1.5px)] [background-size:42px_42px]" />

      {floatingLogos.map((logo, index) => (
        <span
          key={index}
          className="bio-floating-logo pointer-events-none absolute"
          style={{
            left: logo.left,
            top: logo.top,
            width: logo.size,
            height: logo.size,
            opacity: logo.opacity,
            animationDelay: logo.delay,
            animationDuration: logo.duration
          }}
          aria-hidden="true"
        >
          <Image
            src="/assets/logo-giglioli-vetorial.svg"
            alt=""
            fill
            sizes={`${logo.size}px`}
            className="object-contain"
          />
        </span>
      ))}

      <div className="pointer-events-none absolute left-1/2 top-[-8rem] h-72 w-72 -translate-x-1/2 rounded-full border border-cyan-300/10" />
      <div className="pointer-events-none absolute left-1/2 top-[-4rem] h-56 w-56 -translate-x-1/2 rounded-full border border-orange-300/10" />

      <section className="relative z-10 mx-auto flex w-full max-w-[590px] flex-col items-center">
        <div className="bio-logo-main relative h-28 w-28 sm:h-32 sm:w-32">
          <div className="absolute inset-[-14px] rounded-full bg-cyan-300/10 blur-2xl" />
          <Image
            src="/assets/logo-giglioli-vetorial.svg"
            alt="Logo do Colégio Giglioli"
            fill
            priority
            sizes="128px"
            className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,.35)]"
          />
        </div>

        <span className="mt-5 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-2 text-[10px] font-black tracking-[.22em] text-cyan-200">
          CONEXÕES OFICIAIS
        </span>
        <h1 className="mt-4 text-center font-[var(--font-display)] text-4xl font-black tracking-[-.035em] sm:text-5xl">
          Colégio Giglioli
        </h1>
        <p className="mt-3 max-w-md text-center text-sm font-bold leading-6 text-slate-300 sm:text-base">
          Escolha abaixo como você deseja falar com a nossa escola.
        </p>

        <div className="bio-mascot relative mt-3 h-28 w-28 sm:absolute sm:-right-20 sm:top-24 sm:mt-0 sm:h-40 sm:w-40" aria-hidden="true">
          <div className="absolute inset-4 rounded-full bg-cyan-300/10 blur-2xl" />
          <Image
            src="/assets/gigi-mascote.png"
            alt=""
            fill
            sizes="160px"
            className="object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,.3)]"
          />
        </div>

        <div className="mt-5 grid w-full gap-3.5 sm:mt-8">
          <LinkCard
            href={secretariaWhatsapp}
            icon="💬"
            title="SECRETARIA"
            subtitle="(85) 99972-5279"
          />
          <LinkCard
            icon="🎓"
            title="COORDENAÇÃO"
            subtitle="Contato será adicionado em breve"
            disabled
          />
          <LinkCard
            href={direcaoWhatsapp}
            icon="⭐"
            title="DIREÇÃO"
            subtitle="(85) 99603-0509"
          />
          <LinkCard
            href="https://colegiogiglioli.com.br/"
            icon="🌐"
            title="SITE"
            subtitle="Conheça o Colégio Giglioli"
          />
          <LinkCard
            href={localizacao}
            icon="📍"
            title="LOCALIZAÇÃO"
            subtitle="Abra a rota no Google Maps"
          />
          <LinkCard
            href={avaliacao}
            icon="★"
            title="AVALIAÇÃO"
            subtitle="Veja e deixe sua avaliação no Google"
          />
        </div>

        <div className="mt-8 flex items-center gap-2 text-center text-[10px] font-black tracking-[.12em] text-slate-500">
          <span className="text-yellow-300">✦</span>
          COLÉGIO GIGLIOLI • FORTALEZA, CEARÁ
          <span className="text-cyan-300">✦</span>
        </div>

        <a
          href={pdfSolucaoWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-center transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
          aria-label="Falar com a PDF Solução Educacional pelo WhatsApp"
        >
          <span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-400">
            Criação PDF Solução Educacional
          </span>
          <span className="mt-1 text-xs font-black text-cyan-200">(85) 98416-1882</span>
        </a>
      </section>

      <style>{`
        @keyframes bioFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-6deg) scale(1); }
          50% { transform: translate3d(0, -24px, 0) rotate(7deg) scale(1.06); }
        }
        @keyframes bioPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 10px 25px rgba(0,0,0,.22)); }
          50% { transform: scale(1.035); filter: drop-shadow(0 14px 34px rgba(55,194,255,.24)); }
        }
        @keyframes bioShine {
          0% { transform: translateX(-160%) rotate(18deg); }
          45%, 100% { transform: translateX(230%) rotate(18deg); }
        }
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .bio-floating-logo { animation-name: bioFloat; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .bio-logo-main { animation: bioPulse 5s ease-in-out infinite; }
        .bio-mascot { animation: mascotFloat 4.5s ease-in-out infinite; }
        .bio-link::before {
          content: "";
          position: absolute;
          inset: -30% auto -30% -24%;
          width: 18%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
          transform: translateX(-160%) rotate(18deg);
          animation: bioShine 7s ease-in-out infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .bio-floating-logo, .bio-logo-main, .bio-mascot, .bio-link::before { animation: none !important; }
        }
      `}</style>
    </main>
  );
}
