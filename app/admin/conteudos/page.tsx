import type { Metadata } from "next";
import CollectionsAdmin from "@/components/CollectionsAdmin";

export const metadata: Metadata = {
  title: "Conteúdos do Site | Painel Giglioli",
  robots: { index: false, follow: false }
};

export default function ConteudosAdminPage() {
  return <CollectionsAdmin />;
}
