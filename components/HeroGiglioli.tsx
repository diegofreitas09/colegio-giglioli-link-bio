import Image from "next/image";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const wa = (text: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

const features = [
  { icon: "✦", title: "Infantil 2 ao 5º ano", accent: "cyan" },
  { icon: "◎", title: "Inglês desde o Infantil 3", accent: "orange" },
  { icon: "≋", title: "Natação", accent: "cyan" },
  { icon: "♢", title: "Ballet", accent: "yellow" },
  { icon: "◫", title: "Hidroginástica", accent: "orange" },
  { icon: "⚽", title: "Futsal", accent: "yellow" },
  { icon: "✺", title: "Recreação direcionada", accent: "cyan" }
];

export default function HeroGiglioli() {
  return (
    <section className="giglioli-hero relative overflow-hidden pt-[108px] text-white md:pt-[122px]">
      <div className="hero-nebula hero-nebula-a" aria-hidden="true" />
      <div className="hero-nebula hero-nebula-b" aria-hidden="true" />

      <svg className="hero-constellation hero-constellation-a" viewBox="0 0 520 300" aria-hidden="true">
        <path d="M20 150 115 74 206 122 294 42 410 104 492 66" />
        <path d="M206 122 256 222 390 242 410 104" />
        {[[20,150],[115,74],[206,122],[294,42],[410,104],[492,66],[256,222],[390,242]].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 3 ? 5 : 3} />
        ))}
      </svg>

      <div className="hero-shooting-star hero-shooting-star-a" aria-hidden="true" />
      <div className="hero-shooting-star hero-shooting-star-b" aria-hidden="true" />

      <div className="mx-auto grid min-h-[850px] max-w-7xl items-center gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-[.96fr_1.04fr] lg:gap-8 lg:pb-20">
        <div className="relative z-20 pt-6 lg:pt-0">
          <div className="hero-eyebrow"><span /> EDUCAÇÃO QUE ILUMINA O AMANHÃ</div>

          <h1 className="hero-title mt-5">
            Seu filho <span className="hero-title-highlight">brilha</span> aqui.
          </h1>

          <p className="hero-constellation-copy mt-5 max-w-xl">
            No Colégio Giglioli, cada aluno faz parte de uma <strong>grande constelação.</strong>
          </p>

          <p className="hero-copy mt-5 max-w-xl">
            Educação Infantil ao 5º ano com aprendizagem, acolhimento, inglês desde o Infantil 3, esporte, movimento e experiências que tornam a rotina mais viva.
          </p>

          <div className="hero-features mt-7">
            {features.map((item) => (
              <div key={item.title} className={`hero-feature hero-feature-${item.accent}`} tabIndex={0}>
                <span className="hero-feature-icon">{item.icon}</span>
                <strong>{item.title}</strong>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={wa("Olá! Vim pelo site do Colégio Giglioli e quero informações sobre matrícula. 🚀✨")}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-enrollment-cta"
            >
              <span className="hero-chat-icon">◯</span>
              Quero falar com a matrícula
              <span className="hero-arrow">→</span>
            </a>
            <a href="/estacao" className="hero-secondary-cta" aria-label="Conhecer a Estação Giglioli">
              Conhecer a estação <span>→</span>
            </a>
          </div>
        </div>

        <div className="hero-mascot-stage relative z-10 min-h-[550px] lg:min-h-[690px]">
          <div className="hero-star-beacon" aria-hidden="true">★</div>
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="hero-planet hero-planet-left" aria-hidden="true" />
          <div className="hero-planet hero-planet-right" aria-hidden="true" />

          <div className="hero-mascot-wrap">
            <Image
              src="/assets/capa-do-site.png"
              alt="Gigi, mascote astronauta do Colégio Giglioli"
              fill
              priority
              sizes="(max-width: 768px) 92vw, 620px"
              className="hero-mascot-image object-contain object-bottom"
            />
          </div>

          <div className="hero-hand-note hero-hand-note-top">SONHOS<br/>APRENDIZADO<br/>CONQUISTAS<br/>SEMPRE JUNTOS</div>
        </div>
      </div>

      <div className="hero-horizon" aria-hidden="true">
        <div className="hero-station">
          <span className="station-dome" />
          <span className="station-wing station-wing-left" />
          <span className="station-wing station-wing-right" />
          <span className="station-sign">COLÉGIO <b>GIGLIOLI</b></span>
        </div>
      </div>
    </section>
  );
}
