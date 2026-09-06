import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import Mural from "@/components/Mural";

export const metadata: Metadata = {
  title: "Mural | Colégio Giglioli",
  description: "Acompanhe vivências, eventos, projetos e registros do Colégio Giglioli."
};

export default function MuralPage() {
  return (
    <>
      <SiteHeader />
      <FloatingMascot />
      <main className="min-h-screen bg-[#f7fbff] pt-[78px] text-[#16314f]">
        <Mural />
      </main>
    </>
  );
}
