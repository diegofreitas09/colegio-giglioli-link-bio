import type { Metadata } from "next";
import InstitutionalCollectionPage from "@/components/InstitutionalCollectionPage";

export const metadata: Metadata = {
  title: "Nossos Parceiros | Colégio Giglioli",
  description: "Conheça os parceiros, editoras e plataformas do Colégio Giglioli."
};

export default function ParceirosPage() {
  return <InstitutionalCollectionPage section="parceiros" />;
}
