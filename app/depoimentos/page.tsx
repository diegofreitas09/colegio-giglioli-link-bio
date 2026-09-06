import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Depoimentos | Colégio Giglioli",
  description: "Depoimentos de famílias do Colégio Giglioli, publicados após moderação da escola."
};

export default function DepoimentosPage() {
  return (
    <>
      <SiteHeader />
      <FloatingMascot />
      <main className="min-h-screen bg-[#eef7ff] pt-[78px] text-[#16314f]">
        <Testimonials />
      </main>
    </>
  );
}
