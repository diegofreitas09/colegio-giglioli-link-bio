import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Painel Administrativo",
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return (
    <>
      <AdminDashboard />
      <a
        href="/admin/editor"
        className="fixed bottom-5 left-5 z-[70] inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-[#0b2d5c]/95 px-5 py-3 text-xs font-black text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-[#12427e]"
      >
        <span className="text-yellow-300">✦</span>
        Editor do site
      </a>
    </>
  );
}
