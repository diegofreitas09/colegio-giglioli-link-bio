"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient, type Comentario, type MuralPost } from "@/lib/supabase";
import AnimatedSection from "./AnimatedSection";

const fallbackPosts: MuralPost[] = [
  { id: "colonia", titulo: "Colônia 2026", texto: "Vivências, brincadeiras e descobertas que fortalecem vínculos.", imagem_url: null, categoria: "Vivências", instagram_url: "https://www.instagram.com/colegio.giglioli/", publicado_em: null },
  { id: "abc", titulo: "ABC Giglioli", texto: "Momentos que celebram cada conquista da infância.", imagem_url: null, categoria: "Eventos", instagram_url: "https://www.instagram.com/colegio.giglioli/", publicado_em: null },
  { id: "expocogi", titulo: "ExpoCoGi", texto: "Projetos, criatividade e aprendizagem compartilhada com as famílias.", imagem_url: null, categoria: "Projetos", instagram_url: "https://www.instagram.com/colegio.giglioli/", publicado_em: null }
];

export default function Mural() {
  const [posts, setPosts] = useState<MuralPost[]>(fallbackPosts);
  const [comments, setComments] = useState<Comentario[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    Promise.all([
      supabase.from("mural_posts").select("id,titulo,texto,imagem_url,categoria,instagram_url,publicado_em").eq("publicado", true).order("ordem").order("publicado_em", { ascending: false }).limit(9),
      supabase.from("comentarios").select("id,nome,depoimento,origem_url").eq("aprovado", true).order("destaque", { ascending: false }).order("ordem").limit(9)
    ]).then(([postRes, commentRes]) => {
      if (postRes.data?.length) setPosts(postRes.data as MuralPost[]);
      if (commentRes.data?.length) setComments(commentRes.data as Comentario[]);
    });
  }, []);

  async function submitComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nome = String(form.get("nome") || "").trim();
    const depoimento = String(form.get("depoimento") || "").trim();
    if (!nome || !depoimento) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("O mural será habilitado assim que o Supabase do site for conectado.");
      return;
    }
    const { error } = await supabase.from("comentarios").insert({ nome, depoimento, aprovado: false });
    if (error) {
      setStatus("Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }
    e.currentTarget.reset();
    setStatus("Depoimento enviado. Ele será publicado após moderação da escola.");
  }

  return (
    <section id="mural" className="space-section bg-[#f7fbff] py-24 text-[#16314f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatedSection>
          <span className="section-kicker-dark">MÓDULO 03 • MURAL DA ESTAÇÃO</span>
          <h2 className="section-title-dark">Cada registro é uma estrela da nossa história.</h2>
          <p className="section-copy-dark">Publicações, avisos, projetos e momentos da rotina entram aqui. Fotos do Instagram serão tratadas e publicadas sem a interface da rede social, preservando apenas o registro da escola.</p>
        </AnimatedSection>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {posts.map((post, index) => (
            <AnimatedSection key={post.id} delay={index * .05}>
              <article className="group relative min-h-72 overflow-hidden rounded-[28px] border border-sky-900/10 bg-gradient-to-br from-[#0d3f7d] via-[#178fc9] to-[#ffd24d] p-6 text-white shadow-xl shadow-sky-900/10 transition hover:-translate-y-1">
                {post.imagem_url && <div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(to top, rgba(4,18,43,.9), rgba(4,18,43,.1)), url(${post.imagem_url})` }} />}
                <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_80%_20%,white_0_2px,transparent_3px)] [background-size:26px_26px]" />
                <div className="relative flex h-full min-h-60 flex-col justify-end">
                  <span className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-sky-100">{post.categoria || "Giglioli"}</span>
                  <h3 className="font-[var(--font-display)] text-3xl leading-none">{post.titulo}</h3>
                  {post.texto && <p className="mt-3 text-sm font-bold leading-relaxed text-white/85">{post.texto}</p>}
                  {post.instagram_url && <a href={post.instagram_url} target="_blank" rel="noopener noreferrer" className="mt-4 text-xs font-black text-yellow-200">Ver publicação ↗</a>}
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <div id="depoimentos" className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <AnimatedSection>
            <div className="rounded-[30px] bg-[#071a39] p-7 text-white shadow-2xl">
              <span className="section-kicker">VOZ DAS FAMÍLIAS</span>
              <h3 className="mt-2 font-[var(--font-display)] text-4xl leading-none">Depoimentos reais, sempre moderados.</h3>
              {comments.length ? (
                <div className="mt-6 grid gap-3">
                  {comments.map((comment) => <blockquote key={comment.id} className="rounded-2xl border border-white/10 bg-white/7 p-5"><p className="font-bold leading-relaxed text-slate-100">“{comment.depoimento}”</p><footer className="mt-3 text-xs font-black text-sky-300">— {comment.nome}{comment.origem_url && <a href={comment.origem_url} target="_blank" rel="noopener noreferrer"> ↗</a>}</footer></blockquote>)}
                </div>
              ) : (
                <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed text-slate-300">Não vou inventar depoimentos. Assim que validarmos comentários reais do Instagram ou recebermos novos relatos pelo site, eles aparecem aqui após aprovação.</p>
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
              <p className="mt-3 min-h-5 text-xs font-bold text-slate-500" aria-live="polite">{status}</p>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
