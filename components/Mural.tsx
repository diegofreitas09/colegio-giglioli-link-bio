"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient, type Comentario, type MuralPost } from "@/lib/supabase";
import AnimatedSection from "./AnimatedSection";

const fallbackPosts: MuralPost[] = [
  { id: "colonia", titulo: "Colônia 2026", texto: "Vivências, brincadeiras e descobertas que fortalecem vínculos.", imagem_url: null, categoria: "Vivências", instagram_url: "https://www.instagram.com/colegio.giglioli/", pagina: "ambas", publicado_em: null },
  { id: "abc", titulo: "ABC Giglioli", texto: "Momentos que celebram cada conquista da infância.", imagem_url: null, categoria: "Eventos", instagram_url: "https://www.instagram.com/colegio.giglioli/", pagina: "ambas", publicado_em: null },
  { id: "expocogi", titulo: "ExpoCoGi", texto: "Projetos, criatividade e aprendizagem compartilhada com as famílias.", imagem_url: null, categoria: "Projetos", instagram_url: "https://www.instagram.com/colegio.giglioli/", pagina: "ambas", publicado_em: null }
];

type MuralContext = "home" | "mural";
type StatusType = "idle" | "success" | "error";

export default function Mural({ context = "home" }: { context?: MuralContext }) {
  const [posts, setPosts] = useState<MuralPost[]>(fallbackPosts);
  const [comments, setComments] = useState<Comentario[]>([]);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("idle");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    Promise.all([
      supabase
        .from("mural_posts")
        .select("id,titulo,texto,imagem_url,categoria,instagram_url,pagina,publicado_em")
        .eq("publicado", true)
        .in("pagina", [context, "ambas"])
        .order("destaque", { ascending: false })
        .order("ordem")
        .order("publicado_em", { ascending: false })
        .limit(12),
      supabase
        .from("comentarios")
        .select("id,nome,depoimento,origem_url")
        .eq("aprovado", true)
        .order("destaque", { ascending: false })
        .order("ordem")
        .limit(9)
    ]).then(([postRes, commentRes]) => {
      if (!postRes.error) setPosts((postRes.data || []) as MuralPost[]);
      if (!commentRes.error) setComments((commentRes.data || []) as Comentario[]);
    });
  }, [context]);

  async function submitComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");
    setStatusType("idle");

    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const nome = String(form.get("nome") || "").trim();
    const depoimento = String(form.get("depoimento") || "").trim();
    if (!nome || !depoimento) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatusType("error");
      setStatus("Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }

    const { error } = await supabase.from("comentarios").insert({ nome, depoimento, aprovado: false });
    if (error) {
      setStatusType("error");
      setStatus("Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }

    formElement.reset();
    setStatusType("success");
    setStatus("✓ Mensagem enviada! Obrigado pelo seu depoimento. Ele será analisado pela escola antes da publicação.");
  }

  return (
    <section id="mural" className="space-section bg-[#f7fbff] py-24 text-[#16314f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatedSection>
          <span className="section-kicker-dark">MÓDULO 03 • MURAL DA ESTAÇÃO</span>
          <h2 className="section-title-dark">Cada registro é uma estrela da nossa história.</h2>
          <p className="section-copy-dark">Publicações, projetos, festas, vivências e momentos da rotina do Colégio Giglioli. As fotos cadastradas pela escola aparecem aqui automaticamente conforme a página escolhida no painel administrativo.</p>
        </AnimatedSection>

        {posts.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <AnimatedSection key={post.id} delay={index * .05}>
                <article className="group relative min-h-80 overflow-hidden rounded-[28px] border border-sky-900/10 bg-gradient-to-br from-[#0d3f7d] via-[#178fc9] to-[#ffd24d] p-6 text-white shadow-xl shadow-sky-900/10 transition hover:-translate-y-1">
                  {post.imagem_url && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `linear-gradient(to top, rgba(4,18,43,.94), rgba(4,18,43,.08)), url(${post.imagem_url})` }}
                    />
                  )}
                  <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_80%_20%,white_0_2px,transparent_3px)] [background-size:26px_26px]" />
                  <div className="relative flex h-full min-h-68 flex-col justify-end">
                    <span className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-sky-100">{post.categoria || "Giglioli"}</span>
                    <h3 className="font-[var(--font-display)] text-3xl leading-none">{post.titulo}</h3>
                    {post.texto && <p className="mt-3 text-sm font-bold leading-relaxed text-white/90">{post.texto}</p>}
                    {post.instagram_url && <a href={post.instagram_url} target="_blank" rel="noopener noreferrer" className="mt-4 text-xs font-black text-yellow-200">Ver publicação ↗</a>}
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[28px] border border-dashed border-sky-900/15 bg-white p-8 text-center text-sm font-bold text-slate-500">As novas fotos publicadas pela escola aparecerão aqui.</div>
        )}

        <div id="depoimentos" className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <AnimatedSection>
            <div className="rounded-[30px] bg-[#071a39] p-7 text-white shadow-2xl">
              <span className="section-kicker">VOZ DAS FAMÍLIAS</span>
              <h3 className="mt-2 font-[var(--font-display)] text-4xl leading-none">Depoimentos reais, sempre moderados.</h3>
              {comments.length ? (
                <div className="mt-6 grid gap-3">
                  {comments.map((comment) => (
                    <blockquote key={comment.id} className="rounded-2xl border border-white/10 bg-white/7 p-5">
                      <p className="font-bold leading-relaxed text-slate-100">“{comment.depoimento}”</p>
                      <footer className="mt-3 text-xs font-black text-sky-300">— {comment.nome}{comment.origem_url && <a href={comment.origem_url} target="_blank" rel="noopener noreferrer"> ↗</a>}</footer>
                    </blockquote>
                  ))}
                </div>
              ) : (
                <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed text-slate-300">Assim que validarmos comentários reais do Instagram ou recebermos novos relatos pelo site, eles aparecem aqui após aprovação.</p>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={.1}>
            <form onSubmit={submitComment} className="rounded-[30px] border border-sky-900/10 bg-white p-6 shadow-xl shadow-sky-900/8">
              <span className="section-kicker-dark">DEIXE SEU RELATO</span>
              <h3 className="mt-2 font-[var(--font-display)] text-3xl text-[#123c7b]">Faça parte do mural.</h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-500">O comentário não entra automaticamente. A escola aprova antes da publicação.</p>
              <label className="mt-5 block text-xs font-black text-slate-600">Nome<input name="nome" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-sky-300 focus:ring-2" placeholder="Seu nome" /></label>
              <label className="mt-4 block text-xs font-black text-slate-600">Depoimento<textarea name="depoimento" required maxLength={600} className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-sky-300 focus:ring-2" placeholder="Conte sua experiência com o Colégio Giglioli" /></label>
              <button className="mt-4 w-full rounded-2xl bg-[#123c7b] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#0b2d61]">Enviar para moderação</button>

              {status && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-black ${statusType === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
                >
                  {status}
                </div>
              )}
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
