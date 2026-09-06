"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Tab = "dashboard" | "mural" | "comentarios" | "leads";
type Post = { id:string; titulo:string; texto:string|null; imagem_url:string|null; categoria:string|null; instagram_url:string|null; publicado:boolean; destaque:boolean; ordem:number; publicado_em:string|null; created_at:string };
type Comment = { id:string; nome:string; depoimento:string; origem_url:string|null; aprovado:boolean; destaque:boolean; ordem:number; created_at:string };
type Lead = { id:string; nome:string; aluno:string|null; telefone:string; email:string|null; segmento:string|null; mensagem:string|null; origem:string; status:string; created_at:string };

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Visão geral", icon: "✦" },
  { id: "mural", label: "Mural", icon: "🖼️" },
  { id: "comentarios", label: "Depoimentos", icon: "💬" },
  { id: "leads", label: "Matrículas", icon: "🚀" }
];

export default function AdminDashboard() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notice, setNotice] = useState("");

  const verifyAdmin = useCallback(async () => {
    if (!supabase) {
      setAuthMessage("Supabase não configurado neste ambiente.");
      setSessionChecked(true);
      return false;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setAuthorized(false);
      setSessionChecked(true);
      return false;
    }
    const { data } = await supabase.from("school_admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
    const ok = Boolean(data);
    setAuthorized(ok);
    setSessionChecked(true);
    if (!ok) setAuthMessage("Este usuário não possui permissão administrativa.");
    return ok;
  }, [supabase]);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const [p, c, l] = await Promise.all([
      supabase.from("mural_posts").select("*").order("destaque", { ascending: false }).order("ordem").order("created_at", { ascending: false }),
      supabase.from("comentarios").select("*").order("aprovado", { ascending: true }).order("destaque", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("matricula_leads").select("*").order("created_at", { ascending: false })
    ]);
    if (p.data) setPosts(p.data as Post[]);
    if (c.data) setComments(c.data as Comment[]);
    if (l.data) setLeads(l.data as Lead[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { verifyAdmin().then((ok) => { if (ok) refresh(); }); }, [verifyAdmin, refresh]);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setAuthMessage("Entrando...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthMessage("E-mail ou senha inválidos.");
      return;
    }
    const ok = await verifyAdmin();
    if (ok) {
      setAuthMessage("");
      await refresh();
    } else {
      await supabase.auth.signOut();
    }
  }

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthorized(false);
    setPosts([]); setComments([]); setLeads([]);
  }

  async function createPost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setNotice("Publicando...");
    const form = e.currentTarget;
    const fd = new FormData(form);
    let imageUrl: string | null = null;
    const file = fd.get("imagem");
    if (file instanceof File && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) { setNotice("A imagem deve ter no máximo 10 MB."); return; }
      const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
      const safe = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("mural-public").upload(`mural/${safe}`, file, { cacheControl: "3600", upsert: false });
      if (uploadError) { setNotice("Não foi possível enviar a imagem."); return; }
      imageUrl = supabase.storage.from("mural-public").getPublicUrl(`mural/${safe}`).data.publicUrl;
    }
    const published = fd.get("publicado") === "on";
    const { error } = await supabase.from("mural_posts").insert({
      titulo: String(fd.get("titulo") || "").trim(),
      texto: String(fd.get("texto") || "").trim() || null,
      categoria: String(fd.get("categoria") || "").trim() || null,
      instagram_url: String(fd.get("instagram_url") || "").trim() || null,
      imagem_url: imageUrl,
      publicado: published,
      destaque: fd.get("destaque") === "on",
      publicado_em: published ? new Date().toISOString() : null
    });
    if (error) { setNotice("Erro ao salvar publicação."); return; }
    form.reset();
    setNotice("Publicação salva.");
    await refresh();
  }

  async function togglePost(post: Post, field: "publicado" | "destaque") {
    if (!supabase) return;
    const value = !post[field];
    const patch: Record<string, unknown> = { [field]: value };
    if (field === "publicado") patch.publicado_em = value ? (post.publicado_em || new Date().toISOString()) : null;
    await supabase.from("mural_posts").update(patch).eq("id", post.id);
    await refresh();
  }

  async function deletePost(post: Post) {
    if (!supabase || !confirm(`Excluir “${post.titulo}”?`)) return;
    await supabase.from("mural_posts").delete().eq("id", post.id);
    await refresh();
  }

  async function toggleComment(comment: Comment, field: "aprovado" | "destaque") {
    if (!supabase) return;
    await supabase.from("comentarios").update({ [field]: !comment[field] }).eq("id", comment.id);
    await refresh();
  }

  async function deleteComment(comment: Comment) {
    if (!supabase || !confirm(`Excluir depoimento de ${comment.nome}?`)) return;
    await supabase.from("comentarios").delete().eq("id", comment.id);
    await refresh();
  }

  async function updateLead(id: string, status: string) {
    if (!supabase) return;
    await supabase.from("matricula_leads").update({ status }).eq("id", id);
    await refresh();
  }

  if (!sessionChecked) return <LoadingScreen />;
  if (!authorized) return <LoginScreen email={email} password={password} setEmail={setEmail} setPassword={setPassword} message={authMessage} onSubmit={login} />;

  const pendingComments = comments.filter((c) => !c.aprovado).length;
  const newLeads = leads.filter((l) => l.status === "novo").length;
  const publishedPosts = posts.filter((p) => p.publicado).length;

  return (
    <main className="min-h-screen bg-[#061329] text-white">
      <div className="fixed inset-0 -z-0 opacity-70 [background-image:radial-gradient(circle_at_10%_15%,rgba(39,183,238,.18),transparent_28%),radial-gradient(circle_at_88%_5%,rgba(255,158,61,.13),transparent_24%),radial-gradient(circle_at_70%_85%,rgba(141,73,255,.12),transparent_25%)]" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#061329]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-sky-300">Estação Giglioli</p><h1 className="font-[var(--font-display)] text-2xl font-extrabold">Painel da Escola</h1></div>
          <div className="flex items-center gap-2"><a href="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black hover:bg-white/10">Ver site</a><button onClick={logout} className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#0a2856]">Sair</button></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl border border-white/10 bg-white/6 p-3 backdrop-blur-xl lg:sticky lg:top-24">
          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {tabs.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${tab === item.id ? "bg-white text-[#0a2856] shadow-xl" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}><span>{item.icon}</span>{item.label}</button>)}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-sky-300">Controle de missão</p><h2 className="mt-1 font-[var(--font-display)] text-3xl font-extrabold">{tabs.find((t) => t.id === tab)?.label}</h2></div><button onClick={refresh} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-black">{loading ? "Atualizando..." : "Atualizar"}</button></div>

          {tab === "dashboard" && <DashboardCards posts={publishedPosts} comments={pendingComments} leads={newLeads} totalLeads={leads.length} />}
          {tab === "mural" && <MuralPanel posts={posts} notice={notice} createPost={createPost} togglePost={togglePost} deletePost={deletePost} />}
          {tab === "comentarios" && <CommentsPanel comments={comments} toggleComment={toggleComment} deleteComment={deleteComment} />}
          {tab === "leads" && <LeadsPanel leads={leads} updateLead={updateLead} />}
        </section>
      </div>
    </main>
  );
}

function LoadingScreen() { return <main className="grid min-h-screen place-items-center bg-[#061329] text-white"><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-300/20 border-t-sky-300"/><p className="mt-4 text-sm font-black">Conectando à estação...</p></div></main>; }

function LoginScreen({ email, password, setEmail, setPassword, message, onSubmit }:{ email:string; password:string; setEmail:(v:string)=>void; setPassword:(v:string)=>void; message:string; onSubmit:(e:FormEvent<HTMLFormElement>)=>void }) {
  const [showPassword, setShowPassword] = useState(false);
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#061329] px-4 text-white"><div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(39,183,238,.20),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(255,158,61,.15),transparent_22%)]"/><form onSubmit={onSubmit} className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/7 p-7 shadow-2xl backdrop-blur-xl"><div className="mb-6"><p className="text-[10px] font-black uppercase tracking-[.2em] text-sky-300">Área restrita</p><h1 className="mt-2 font-[var(--font-display)] text-4xl font-extrabold">Painel Giglioli</h1><p className="mt-2 text-sm font-bold leading-relaxed text-slate-300">Acesso exclusivo da equipe autorizada da escola.</p></div><label className="grid gap-2 text-xs font-black text-slate-200">E-mail<input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-300" placeholder="equipe@colegio..."/></label><label className="mt-4 grid gap-2 text-xs font-black text-slate-200">Senha<span className="relative block"><input type={showPassword ? "text" : "password"} required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 pr-14 text-white outline-none placeholder:text-slate-500 focus:border-sky-300" placeholder="••••••••"/><button type="button" onClick={()=>setShowPassword((value)=>!value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} title={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute inset-y-1 right-1 grid w-11 place-items-center rounded-xl text-lg text-white/80 transition hover:bg-white/10 hover:text-white">{showPassword ? "🙈" : "👁️"}</button></span></label><button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-4 text-sm font-black text-[#082047]">Entrar na estação →</button><p className="mt-3 min-h-5 text-xs font-bold text-rose-200" aria-live="polite">{message}</p><a href="/" className="mt-4 block text-center text-xs font-black text-sky-300">← Voltar ao site</a></form></main>;
}

function DashboardCards({ posts, comments, leads, totalLeads }:{ posts:number; comments:number; leads:number; totalLeads:number }) {
  const items = [["Publicações ativas", posts, "🖼️"], ["Depoimentos pendentes", comments, "💬"], ["Novos contatos", leads, "🚀"], ["Total de leads", totalLeads, "✦"]] as const;
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map(([label, value, icon]) => <article key={label} className="rounded-3xl border border-white/10 bg-white/7 p-5 shadow-xl backdrop-blur"><span className="text-2xl">{icon}</span><strong className="mt-4 block font-[var(--font-display)] text-4xl">{value}</strong><span className="mt-1 block text-xs font-black text-slate-300">{label}</span></article>)}</div>;
}

function MuralPanel({ posts, notice, createPost, togglePost, deletePost }:{ posts:Post[]; notice:string; createPost:(e:FormEvent<HTMLFormElement>)=>void; togglePost:(p:Post,f:"publicado"|"destaque")=>void; deletePost:(p:Post)=>void }) {
  return <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><form onSubmit={createPost} className="h-fit rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur"><h3 className="font-[var(--font-display)] text-2xl font-extrabold">Nova publicação</h3><div className="mt-4 grid gap-3"><AdminInput name="titulo" label="Título" required/><AdminInput name="categoria" label="Categoria" placeholder="Eventos, Projetos, Vivências..."/><label className="grid gap-2 text-xs font-black text-slate-300">Texto<textarea name="texto" className="min-h-28 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none focus:border-sky-300"/></label><AdminInput name="instagram_url" label="Link do Instagram" type="url"/><label className="grid gap-2 text-xs font-black text-slate-300">Imagem<input name="imagem" type="file" accept="image/jpeg,image/png,image/webp" className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-4 text-xs"/></label><div className="flex flex-wrap gap-4 text-xs font-black text-slate-300"><label className="flex items-center gap-2"><input type="checkbox" name="publicado" defaultChecked/> Publicar agora</label><label className="flex items-center gap-2"><input type="checkbox" name="destaque"/> Destacar</label></div><button className="rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-4 text-sm font-black text-[#082047]">Salvar no mural</button><p className="min-h-5 text-xs font-bold text-sky-200">{notice}</p></div></form><div className="grid gap-3">{posts.map((post)=><article key={post.id} className="rounded-3xl border border-white/10 bg-white/7 p-4 backdrop-blur"><div className="flex gap-4">{post.imagem_url ? <img src={post.imagem_url} alt="" className="h-24 w-24 rounded-2xl object-cover"/> : <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-white/8 text-3xl">✦</div>}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-black uppercase tracking-[.14em] text-sky-300">{post.categoria || "Giglioli"}</span>{post.publicado && <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-black text-emerald-300">Publicado</span>}{post.destaque && <span className="rounded-full bg-yellow-300/15 px-2 py-1 text-[10px] font-black text-yellow-200">Destaque</span>}</div><h4 className="mt-1 truncate font-[var(--font-display)] text-xl font-extrabold">{post.titulo}</h4><p className="mt-1 line-clamp-2 text-xs font-bold leading-relaxed text-slate-300">{post.texto}</p></div></div><div className="mt-4 flex flex-wrap gap-2"><MiniButton onClick={()=>togglePost(post,"publicado")}>{post.publicado ? "Despublicar" : "Publicar"}</MiniButton><MiniButton onClick={()=>togglePost(post,"destaque")}>{post.destaque ? "Remover destaque" : "Destacar"}</MiniButton><MiniButton danger onClick={()=>deletePost(post)}>Excluir</MiniButton></div></article>)}{!posts.length && <Empty text="Nenhuma publicação cadastrada."/>}</div></div>;
}

function CommentsPanel({ comments, toggleComment, deleteComment }:{ comments:Comment[]; toggleComment:(c:Comment,f:"aprovado"|"destaque")=>void; deleteComment:(c:Comment)=>void }) {
  return <div className="grid gap-3">{comments.map((c)=><article key={c.id} className="rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{c.nome}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-black ${c.aprovado ? "bg-emerald-400/15 text-emerald-300" : "bg-orange-400/15 text-orange-200"}`}>{c.aprovado ? "Aprovado" : "Aguardando moderação"}</span>{c.destaque && <span className="rounded-full bg-yellow-300/15 px-2 py-1 text-[10px] font-black text-yellow-200">Destaque</span>}</div><blockquote className="mt-3 text-sm font-bold leading-relaxed text-slate-200">“{c.depoimento}”</blockquote><div className="mt-4 flex flex-wrap gap-2"><MiniButton onClick={()=>toggleComment(c,"aprovado")}>{c.aprovado ? "Ocultar" : "Aprovar"}</MiniButton><MiniButton onClick={()=>toggleComment(c,"destaque")}>{c.destaque ? "Remover destaque" : "Destacar"}</MiniButton>{c.origem_url && <a className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-black" href={c.origem_url} target="_blank" rel="noopener noreferrer">Origem ↗</a>}<MiniButton danger onClick={()=>deleteComment(c)}>Excluir</MiniButton></div></article>)}{!comments.length && <Empty text="Nenhum depoimento recebido ainda."/>}</div>;
}

function LeadsPanel({ leads, updateLead }:{ leads:Lead[]; updateLead:(id:string,status:string)=>void }) {
  return <div className="grid gap-3">{leads.map((lead)=><article key={lead.id} className="rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-[var(--font-display)] text-xl font-extrabold">{lead.nome}</h3><Status status={lead.status}/></div><p className="mt-1 text-xs font-bold text-slate-300">Aluno(a): {lead.aluno || "—"} • {lead.segmento || "Série não informada"}</p><p className="mt-3 text-sm font-black text-sky-200">{lead.telefone}</p>{lead.mensagem && <p className="mt-2 max-w-2xl text-xs font-bold leading-relaxed text-slate-300">{lead.mensagem}</p>}<p className="mt-3 text-[10px] font-black uppercase tracking-[.12em] text-slate-500">{new Date(lead.created_at).toLocaleString("pt-BR")}</p></div><div className="flex min-w-44 flex-col gap-2"><select value={lead.status} onChange={(e)=>updateLead(lead.id,e.target.value)} className="rounded-2xl border border-white/10 bg-[#0c2448] px-3 py-2 text-xs font-black text-white outline-none"><option value="novo">Novo</option><option value="contatado">Contatado</option><option value="visita_agendada">Visita agendada</option><option value="matriculado">Matriculado</option><option value="encerrado">Encerrado</option></select><a href={`https://wa.me/55${lead.telefone.replace(/\D/g,"").replace(/^55/,"")}?text=${encodeURIComponent(`Olá, ${lead.nome}! Aqui é do Colégio Giglioli. Recebemos seu contato pelo nosso site. 🚀✨`)}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-emerald-500 px-3 py-2 text-center text-xs font-black">Chamar no WhatsApp</a></div></div></article>)}{!leads.length && <Empty text="Nenhum contato de matrícula recebido ainda."/>}</div>;
}

function AdminInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label:string }) { return <label className="grid gap-2 text-xs font-black text-slate-300">{label}<input {...props} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300"/></label>; }
function MiniButton({ children, danger=false, ...props }:{ children:React.ReactNode; danger?:boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} className={`rounded-full border px-3 py-2 text-[11px] font-black ${danger ? "border-rose-400/20 bg-rose-400/10 text-rose-200" : "border-white/10 bg-white/5 text-white"}`}>{children}</button>; }
function Empty({ text }:{ text:string }) { return <div className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-sm font-bold text-slate-400">{text}</div>; }
function Status({ status }:{ status:string }) { const map:Record<string,string>={novo:"bg-orange-400/15 text-orange-200",contatado:"bg-sky-400/15 text-sky-200",visita_agendada:"bg-violet-400/15 text-violet-200",matriculado:"bg-emerald-400/15 text-emerald-200",encerrado:"bg-slate-400/15 text-slate-300"}; return <span className={`rounded-full px-2 py-1 text-[10px] font-black ${map[status]||map.novo}`}>{status.replaceAll("_"," ")}</span>; }
