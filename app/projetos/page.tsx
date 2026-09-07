import type { Metadata } from "next";
import InstitutionalCollectionPage from "@/components/InstitutionalCollectionPage";

export const metadata: Metadata = {
  title: "Nossos Projetos | Colégio Giglioli",
  description: "Acompanhe os projetos pedagógicos, culturais e esportivos do Colégio Giglioli."
};

export default function ProjetosPage() {
  return <InstitutionalCollectionPage section="projetos" />;
}
