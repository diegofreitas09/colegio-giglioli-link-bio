"use client";

import Image from "next/image";
import { motion } from "motion/react";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Vim pelo site do Colégio Giglioli e gostaria de mais informações. 🚀✨")}`;

export default function FloatingMascot() {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Colégio Giglioli pelo WhatsApp"
      className="fixed bottom-6 right-6 z-[70] hidden items-end gap-2 md:flex"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: .5 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: .97 }}
    >
      <span className="hidden rounded-2xl border border-white/15 bg-[#25d366] px-4 py-3 text-sm font-black text-white shadow-2xl lg:block">
        Matrículas • WhatsApp
      </span>
      <span className="relative block h-28 w-24 drop-shadow-[0_18px_22px_rgba(0,0,0,.35)]">
        <Image src="/assets/gigi-astronauta.webp" alt="Gigi, mascote do Colégio Giglioli" fill sizes="96px" className="object-contain" />
      </span>
    </motion.a>
  );
}
