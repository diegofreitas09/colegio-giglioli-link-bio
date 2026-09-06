"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient, type Comentario } from "@/lib/supabase";

export default function Testimonials() {
  const [comments, setComments] = useState<Comentario[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    supabase
      .from("comentarios")
      .select("id,nome,depoimento,origem_url")
      .eq("aprovado", true)
      .order("destaque", { ascending: false })
      .order("ordem")
      .limit(12)
      .then(({ data }) => {
        if (data?.length) setComments(data as Comentario[]);
      });
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const nome = String(form.get("nome") || "").trim();
    const depoimento = String(form.get("depoimento") || "").trim();
    if (!nome || !depoimento) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("O envio será habilitado assim que a conexão do mural estiver disponível.");
      return;
    }

    const { error } = await supabase.from("comentarios").insert({ nome, depoimento, aprovado: false });
    if (error) {
      setStatus("Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }

    formEl.reset();
    setStatus("Depoimento enviado. A escola fará a moderação antes da publicação.");
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-[32px] bg-[#071a39] p-7 text-white shadow-2xl">
            <span className="section-kicker">VOZ DAS FAMÍLIAS</span>
            <h1 className="mt-3 font-[var(--font-display)] text-5xl font-black leading-none">Depoimentos reais, sempre moderados.</h1>
            {comments.length ? (
              <div className="mt-8 grid gap-4">
                {comments.map((comment) => (
                  <blockquote key={comment.id} className="rounded-2xl border border-white/10 bg-white/7 p-5">
                    <p className="font-bold leading-relaxed text-slate-100">“{comment.depoimento}”</p>
                    <footer className="mt-3 text-xs font-black text-sky-300">— {comment.nome}{comment.origem_url && <a href={comment.origem_url} target="_blank" rel="noopener noreferrer"> ↗</a>}</footer>
                  </blockquote>
                ))}
              </div>
            ) : (
              <p className="mt-6 max-w-2xl font-bold leading-7 text-slate-300">Os depoimentos entram aqui somente depois da aprovação da escola.</p>
            )}
          </div>

          <form onSubmit={submit} className="rounded-[32px] border border-sky-900/10 bg-white p-7 text-[#16314f] shadow-xl shadow-sky-900/8">
            <span className="section-kicker-dark">DEIXE SEU RELATO</span>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-black text-[#123c7b]">Faça parte da nossa história.</h2>
            <label className="mt-6 block text-xs font-black text-slate-600">Nome<input name="nome" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-sky-300 focus:ring-2" placeholder="Seu nome" /></label>
            <label className="mt-4 block text-xs font-black text-slate-600">Depoimento<textarea name="depoimento" required maxLength={600} className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-sky-300 focus:ring-2" placeholder="Conte sua experiência com o Colégio Giglioli" /></label>
            <button className="mt-4 w-full rounded-2xl bg-[#123c7b] px-5 py-4 text-sm font-black text-white transition hover:bg-[#0b2d61]">Enviar para moderação</button>
            <p className="mt-3 min-h-5 text-xs font-bold text-slate-500" aria-live="polite">{status}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
