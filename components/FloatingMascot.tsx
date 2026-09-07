import Image from "next/image";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const greeting = "Olá! 👋 Eu vim pelo site do Colégio Giglioli e gostaria de informações sobre matrícula, séries e turnos. 🚀✨";
const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(greeting)}`;

export default function FloatingMascot() {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a equipe de matrícula do Colégio Giglioli pelo WhatsApp"
      className="floating-mascot-enter group fixed bottom-4 right-3 z-[300] flex items-end gap-2 sm:bottom-5 sm:right-5 md:gap-3"
    >
      <span className="floating-mascot-bubble-enter relative mb-1 max-w-[180px] rounded-[22px] border border-sky-100/80 bg-white px-4 py-3 text-[12px] font-extrabold leading-snug text-[#0b2b58] shadow-[0_18px_46px_rgba(0,0,0,.28)] sm:max-w-[220px] sm:text-sm md:-translate-x-7 md:translate-y-3">
        <span className="block text-[#0d6da3]">Olá! Eu sou o Gigi 🚀</span>
        Quer falar com a nossa equipe de matrícula?
        <span className="absolute -right-2 bottom-5 h-4 w-4 rotate-45 border-r border-b border-sky-100/80 bg-white" aria-hidden="true" />
      </span>

      <span className="relative block h-[108px] w-[92px] sm:h-[132px] sm:w-[112px] md:h-[150px] md:w-[128px]">
        <span className="absolute inset-2 rounded-full bg-cyan-300/25 blur-2xl transition duration-300 group-hover:bg-yellow-300/45 group-hover:blur-3xl" aria-hidden="true" />
        <span className="absolute -inset-1 rounded-full border border-white/10 opacity-0 shadow-[0_0_34px_rgba(56,189,248,.65)] transition duration-300 group-hover:opacity-100" aria-hidden="true" />
        <Image
          src="/assets/gigi-mascote.png"
          alt="Gigi, mascote astronauta do Colégio Giglioli"
          fill
          quality={65}
          sizes="(max-width: 640px) 92px, (max-width: 768px) 112px, 128px"
          className="object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,.4)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.02]"
        />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-[#25d366] px-3 py-1 text-[10px] font-black text-white shadow-lg sm:text-[11px]">
          WhatsApp
        </span>
      </span>
    </a>
  );
}
