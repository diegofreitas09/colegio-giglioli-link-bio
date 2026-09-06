"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient, type Comentario } from "@/lib/supabase";

export default function Testimonials() {
  const [comments, setComments] = useState<Comentario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoadingComments(false);
      return;
    }

    supabase
      .from("comentarios")
      .select("id,nome,depoimento,origem_url")
      .eq("aprovado", true)
      .order("destaque", { ascending: false })
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data, error }) => {
        if (!error) setComments((data || []) as Comentario[]);
        setLoadingComments(false);
      });
  }, []);

  useEffect(() => {
    if (comments.length && currentIndex > comments.length - 1) setCurrentIndex(0);
  }, [comments.length, currentIndex]);

  function previousComment() {
    if (!comments.length) return;
    setCurrentIndex((index) => (index - 1 + comments.length) % comments.length);
  }

  function nextComment() {
    if (!comments.length) return;
    setCurrentIndex((index) => (index + 1) % comments.length);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const nome = String(form.get("nome") || "").trim();
    const depoimento = String(form.get("depoimento") || "").trim();
    const website = String(form.get("website") || "").trim();

    if (website) {
      formEl.reset();
      setStatusType("success");
      setStatus("✓ Mensagem enviada! Obrigado pelo seu depoimento.");
      return;
    }

    if (nome.length < 2 || depoimento.length < 3) {
      setStatusType("error");
      setStatus("Preencha seu nome e conte um pouco da sua experiência.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatusType("error");
      setStatus("A conexão está indisponível neste instante. Tente novamente em alguns minutos.");
      return;
    }

    setSubmitting(true);
    setStatusType("idle");
    setStatus("Enviando seu depoimento...");

    const { error } = await supabase.from("comentarios").insert({
      nome,
      depoimento,
      aprovado: false,
      destaque: false
    });

    setSubmitting(false);

    if (error) {
      setStatusType("error");
      setStatus("Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }

    formEl.reset();
    setStatusType("success");
    setStatus("✓ Mensagem enviada! Obrigado pelo seu depoimento. Ele será analisado pela escola antes da publicação.");
  }

  const currentComment = comments[currentIndex];

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <span className="section-kicker-dark">VOZ DAS FAMÍLIAS</span>
          <h1 className="mt-3 font-[var(--font-display)] text-4xl font-black leading-tight text-[#123c7b] sm:text-5xl">
            Histórias que também fazem parte da nossa constelação.
          </h1>
          <p className="mt-4 max-w-2xl font-bold leading-7 text-slate-600">
            Famílias podem enviar seus relatos por aqui. Todo depoimento passa pela equipe do Colégio Giglioli antes da publicação.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <div className="rounded-[32px] bg-[#071a39] p-7 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="section-kicker">DEPOIMENTOS PUBLICADOS</span>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl font-black leading-tight sm:text-4xl">O que as famílias contam.</h2>
              </div>
              <span className="hidden text-4xl sm:block" aria-hidden="true">💬</span>
            </div>

            {loadingComments ? (
              <div className="mt-8 h-64 animate-pulse rounded-[26px] border border-white/10 bg-white/5" />
            ) : comments.length && currentComment ? (
              <div className="mt-8">
                <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/7 shadow-inner">
                  <blockquote key={currentComment.id} className="min-h-[250px] p-6 sm:p-8">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="text-sm tracking-[.2em] text-yellow-300" aria-hidden="true">★★★★★</div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black text-sky-200">
                        {currentIndex + 1} de {comments.length}
                      </span>
                    </div>

                    <p className="text-base font-bold leading-8 text-slate-100 sm:text-lg">
                      “{currentComment.depoimento}”
                    </p>

                    <footer className="mt-6 text-sm font-black text-sky-300">
                      — {currentComment.nome}
                      {currentComment.origem_url && (
                        <a href={currentComment.origem_url} target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-yellow-300">↗</a>
                      )}
                    </footer>
                  </blockquote>
                </div>

                {comments.length > 1 && (
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2" aria-label="Selecionar depoimento">
                      {comments.map((comment, index) => (
                        <button
                          key={comment.id}
                          type="button"
                          onClick={() => setCurrentIndex(index)}
                          aria-label={`Ver depoimento ${index + 1}`}
                          aria-current={index === currentIndex ? "true" : undefined}
                          className={`h-2.5 rounded-full transition-all ${index === currentIndex ? "w-8 bg-yellow-300" : "w-2.5 bg-white/25 hover:bg-white/50"}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={previousComment}
                        className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/7 text-2xl font-black text-white transition hover:border-yellow-300/50 hover:bg-yellow-300 hover:text-[#071a39]"
                        aria-label="Depoimento anterior"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={nextComment}
                        className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/7 text-2xl font-black text-white transition hover:border-yellow-300/50 hover:bg-yellow-300 hover:text-[#071a39]"
                        aria-label="Próximo depoimento"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-white/5 p-6">
                <p className="font-black text-white">Os primeiros depoimentos estão em moderação.</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-300">Assim que a escola aprovar os relatos recebidos, eles aparecerão automaticamente aqui.</p>
              </div>
            )}
          </div>

          <form onSubmit={submit} className="relative overflow-hidden rounded-[32px] border border-sky-900/10 bg-white p-7 text-[#16314f] shadow-xl shadow-sky-900/8 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-200/35 blur-2xl" />
            <div className="relative">
              <span className="section-kicker-dark">DEIXE SEU RELATO</span>
              <h2 className="mt-3 font-[var(--font-display)] text-3xl font-black text-[#123c7b]">Faça parte da nossa história.</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">Seu comentário não é publicado automaticamente. A escola aprova antes de exibir.</p>

              <label className="mt-6 block text-xs font-black uppercase tracking-wide text-slate-600">
                Nome
                <input name="nome" required minLength={2} maxLength={120} autoComplete="name" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-bold normal-case tracking-normal outline-none ring-sky-300 transition focus:ring-2" placeholder="Seu nome" />
              </label>

              <label className="mt-4 block text-xs font-black uppercase tracking-wide text-slate-600">
                Depoimento
                <textarea name="depoimento" required minLength={3} maxLength={600} className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-bold normal-case leading-6 tracking-normal outline-none ring-sky-300 transition focus:ring-2" placeholder="Conte sua experiência com o Colégio Giglioli" />
              </label>

              <label className="absolute -left-[9999px]" aria-hidden="true">
                Site
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>

              <button disabled={submitting} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#123c7b] to-[#1664a5] px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/15 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-65">
                {submitting ? "Enviando..." : "Enviar depoimento para aprovação →"}
              </button>

              <p
                className={`mt-4 min-h-12 rounded-2xl px-4 py-3 text-xs font-black leading-5 ${statusType === "success" ? "bg-emerald-50 text-emerald-700" : statusType === "error" ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-500"}`}
                aria-live="polite"
              >
                {status || "Depois do envio, a equipe poderá aprovar, destacar ou excluir o relato pelo painel administrativo."}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
