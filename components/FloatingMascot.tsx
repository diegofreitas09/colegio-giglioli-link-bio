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
      className="fixed bottom-4 right-3 z-[70] flex items-end gap-2 md:bottom-6 md:right-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: .8, duration: .5 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: .97 }}
    >
      <span className="hidden rounded-2xl border border-white/15 bg-[#25d366] px-4 py-3 text-sm font-black text-white shadow-2xl sm:block">
        Matrículas • WhatsApp
      </span>
      <span className="relative block h-24 w-20 drop-shadow-[0_18px_22px_rgba(0,0,0,.35)] sm:h-28 sm:w-24">
        <Image src="/assets/gigi-astronauta.webp" alt="Gigi, mascote do Colégio Giglioli" fill sizes="96px" className="object-contain" />
      </span>
    </motion.a>
  );
}
