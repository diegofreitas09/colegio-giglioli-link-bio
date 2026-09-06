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
  const [postIndex, setPostIndex] = useState(0);
  const [comments, setComments] = useState<Comentario[]>([]);
  const [commentIndex, setCommentIndex] = useState(0);
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
        .limit(30),
      supabase
        .from("comentarios")
        .select("id,nome,depoimento,origem_url")
        .eq("aprovado", true)
        .order("destaque", { ascending: false })
        .order("ordem")
        .limit(9)
    ]).then(([postRes, commentRes]) => {
      if (!postRes.error) {
        setPosts((postRes.data || []) as MuralPost[]);
        setPostIndex(0);
      }
      if (!commentRes.error) {
        setComments((commentRes.data || []) as Comentario[]);
        setCommentIndex(0);
      }
    });
  }, [context]);

  function previousPost() {
    setPostIndex((current) => (current <= 0 ? posts.length - 1 : current - 1));
  }

  function nextPost() {
    setPostIndex((current) => (current >= posts.length - 1 ? 0 : current + 1));
  }

  function previousComment() {
    setCommentIndex((current) => (current <= 0 ? comments.length - 1 : current - 1));
  }

  function nextComment() {
    setCommentIndex((current) => (current >= comments.length - 1 ? 0 : current + 1));
  }

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

  const activePost = posts[postIndex];
  const activeComment = comments[commentIndex];

  return (
    <section id="mural" className="space-section bg-[#f7fbff] py-24 text-[#16314f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatedSection>
          <span className="section-kicker-dark">MÓDULO 03 • MURAL DA ESTAÇÃO</span>
          <h2 className="section-title-dark">Cada registro é uma estrela da nossa história.</h2>
          <p className="section-copy-dark">Publicações, projetos, festas, vivências e momentos da rotina do Colégio Giglioli. As fotos cadastradas pela escola aparecem aqui automaticamente conforme a página escolhida no painel administrativo.</p>
        </AnimatedSection>

        {activePost ? (
          <AnimatedSection delay={.05}>
            <div className="mt-10">
              <div className="relative overflow-hidden rounded-[34px] border border-sky-900/10 bg-[#071a39] shadow-2xl shadow-sky-900/15">
                <article className="relative min-h-[430px] sm:min-h-[520px] lg:min-h-[600px]">
                  {activePost.imagem_url ? (
                    <div
                      key={activePost.id}
                      className="absolute inset-0 animate-[fadeIn_.45s_ease-out] bg-cover bg-center"
                      style={{ backgroundImage: `linear-gradient(to top, rgba(4,18,43,.97) 0%, rgba(4,18,43,.54) 38%, rgba(4,18,43,.08) 72%), url(${activePost.imagem_url})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0d3f7d] via-[#178fc9] to-[#ffd24d]" />
                  )}

                  <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_80%_20%,white_0_2px,transparent_3px)] [background-size:28px_28px]" />

                  <div className="relative z-10 flex min-h-[430px] flex-col justify-end p-6 text-white sm:min-h-[520px] sm:p-9 lg:min-h-[600px] lg:p-12">
                    <div className="max-w-3xl">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-sky-100 backdrop-blur-md">{activePost.categoria || "Giglioli"}</span>
                        <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-black text-white/80 backdrop-blur-md">{postIndex + 1} de {posts.length}</span>
                      </div>
                      <h3 className="font-[var(--font-display)] text-4xl leading-none sm:text-5xl lg:text-6xl">{activePost.titulo}</h3>
                      {activePost.texto && <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed text-white/90 sm:text-base">{activePost.texto}</p>}
                      {activePost.instagram_url && <a href={activePost.instagram_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-yellow-200 backdrop-blur-md transition hover:bg-white/20">Ver publicação ↗</a>}
                    </div>
                  </div>

                  {posts.length > 1 && (
                    <>
                      <button type="button" onClick={previousPost} aria-label="Foto anterior" className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#061329]/55 text-2xl font-black text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-[#061329]/80 sm:left-5">←</button>
                      <button type="button" onClick={nextPost} aria-label="Próxima foto" className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#061329]/55 text-2xl font-black text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-[#061329]/80 sm:right-5">→</button>
                    </>
                  )}
                </article>
              </div>

              {posts.length > 1 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-label="Selecionar foto do mural">
                  {posts.map((post, index) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setPostIndex(index)}
                      aria-label={`Ver foto ${index + 1}: ${post.titulo}`}
                      aria-current={index === postIndex ? "true" : undefined}
                      className={`h-2.5 rounded-full transition-all ${index === postIndex ? "w-9 bg-[#123c7b]" : "w-2.5 bg-[#123c7b]/25 hover:bg-[#123c7b]/50"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        ) : (
          <div className="mt-10 rounded-[28px] border border-dashed border-sky-900/15 bg-white p-8 text-center text-sm font-bold text-slate-500">As novas fotos publicadas pela escola aparecerão aqui.</div>
        )}

        <div id="depoimentos" className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <AnimatedSection>
            <div className="rounded-[30px] bg-[#071a39] p-7 text-white shadow-2xl">
              <span className="section-kicker">VOZ DAS FAMÍLIAS</span>
              <h3 className="mt-2 font-[var(--font-display)] text-4xl leading-none">Depoimentos reais, sempre moderados.</h3>

              {activeComment ? (
                <div className="mt-6">
                  <blockquote className="min-h-[220px] rounded-3xl border border-white/10 bg-white/[.07] p-6 sm:min-h-[245px] sm:p-7">
                    <div className="mb-5 text-4xl leading-none text-yellow-300" aria-hidden="true">“</div>
                    <p className="text-base font-bold leading-relaxed text-slate-100 sm:text-lg">{activeComment.depoimento}</p>
                    <footer className="mt-5 text-sm font-black text-sky-300">— {activeComment.nome}{activeComment.origem_url && <a href={activeComment.origem_url} target="_blank" rel="noopener noreferrer"> ↗</a>}</footer>
                  </blockquote>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2" aria-label="Selecionar depoimento">
                      {comments.map((comment, index) => (
                        <button
                          key={comment.id}
                          type="button"
                          onClick={() => setCommentIndex(index)}
                          aria-label={`Ver depoimento ${index + 1}`}
                          aria-current={index === commentIndex ? "true" : undefined}
                          className={`h-2.5 rounded-full transition-all ${index === commentIndex ? "w-8 bg-yellow-300" : "w-2.5 bg-white/30 hover:bg-white/55"}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400">{commentIndex + 1} de {comments.length}</span>
                      <button type="button" onClick={previousComment} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-xl font-black text-white transition hover:-translate-y-0.5 hover:border-sky-300/50 hover:bg-white/15" aria-label="Depoimento anterior">←</button>
                      <button type="button" onClick={nextComment} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-xl font-black text-white transition hover:-translate-y-0.5 hover:border-sky-300/50 hover:bg-white/15" aria-label="Próximo depoimento">→</button>
                    </div>
                  </div>
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
                <div role="status" aria-live="polite" className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-black ${statusType === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
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