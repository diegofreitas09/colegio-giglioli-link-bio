import type { Metadata } from "next";
import InstitutionalCollectionPage from "@/components/InstitutionalCollectionPage";

export const metadata: Metadata = {
  title: "Campanhas de Matrículas | Colégio Giglioli",
  description: "Acompanhe campanhas, plantões e condições de matrícula do Colégio Giglioli."
};

export default function MatriculasPage() {
  return <InstitutionalCollectionPage section="campanhas" />;
}
