import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import AdminMuralEnhancer from "@/components/AdminMuralEnhancer";

export const metadata: Metadata = {
  title: "Painel Administrativo",
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return (
    <>
      <AdminDashboard />
      <AdminMuralEnhancer />
    </>
  );
}
