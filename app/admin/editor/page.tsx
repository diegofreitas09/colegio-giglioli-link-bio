import type { Metadata } from "next";
import SiteEditor from "@/components/SiteEditor";

export const metadata: Metadata = {
  title: "Editor Visual | Painel Giglioli",
  robots: { index: false, follow: false }
};

export default function AdminEditorPage() {
  return <SiteEditor />;
}
