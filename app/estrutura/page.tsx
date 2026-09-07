import type { Metadata } from "next";
import InstitutionalCollectionPage from "@/components/InstitutionalCollectionPage";

export const metadata: Metadata = {
  title: "Nossa Estrutura | Colégio Giglioli",
  description: "Conheça os espaços e ambientes do Colégio Giglioli."
};

export default function EstruturaPage() {
  return <InstitutionalCollectionPage section="estrutura" />;
}
