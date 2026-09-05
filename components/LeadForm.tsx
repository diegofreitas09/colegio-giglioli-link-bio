"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";

export default function LeadForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus("Enviando...");
    const form = new FormData(e.currentTarget);
    const payload = {
      responsavel: String(form.get("responsavel") || ""),
      aluno: String(form.get("aluno") || ""),
      telefone: String(form.get("telefone") || ""),
      serie: String(form.get("serie") || ""),
      mensagem: String(form.get("mensagem") || ""),
      origem: "site"
    };

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { error } = await supabase.from("leads").insert(payload);
      if (!error) {
        e.currentTarget.reset();
        setStatus("Solicitação recebida. A equipe entrará em contato.");
        setLoading(false);
        return;
      }
    }

    const msg = [
      "Olá! Vim pelo site do Colégio Giglioli e gostaria de informações sobre matrícula. 🚀✨",
      `Responsável: ${payload.responsavel}`,
      `Aluno(a): ${payload.aluno}`,
      `Telefone: ${payload.telefone}`,
      `Série: ${payload.serie}`,
      payload.mensagem ? `Mensagem: ${payload.mensagem}` : ""
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setStatus("Abrimos o WhatsApp com os dados preenchidos.");
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur-md">
      <label className="form-label">Nome do responsável<input className="form-input" name="responsavel" required autoComplete="name" placeholder="Seu nome" /></label>
      <label className="form-label">Nome da criança<input className="form-input" name="aluno" required placeholder="Nome da criança" /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="form-label">Telefone<input className="form-input" name="telefone" required inputMode="tel" placeholder="(85) 99999-9999" /></label>
        <label className="form-label">Série de interesse<select className="form-input" name="serie" required defaultValue=""><option value="" disabled>Selecione</option><option>Infantil II</option><option>Infantil III</option><option>Infantil IV</option><option>Infantil V</option><option>1º ano</option><option>2º ano</option><option>3º ano</option><option>4º ano</option><option>5º ano</option></select></label>
      </div>
      <label className="form-label">Mensagem<textarea className="form-input min-h-24 resize-y" name="mensagem" placeholder="Conte o que você gostaria de saber" /></label>
      <label className="flex items-start gap-2 text-[11px] font-bold leading-relaxed text-slate-300"><input type="checkbox" required className="mt-1" />Autorizo o contato do Colégio Giglioli para responder esta solicitação.</label>
      <button disabled={loading} className="rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-4 text-sm font-black text-[#082047] shadow-xl shadow-orange-500/20 transition hover:-translate-y-0.5 disabled:opacity-60">{loading ? "Enviando..." : "Solicitar contato para matrícula →"}</button>
      <p className="min-h-5 text-xs font-bold text-sky-100/75" aria-live="polite">{status}</p>
    </form>
  );
}
