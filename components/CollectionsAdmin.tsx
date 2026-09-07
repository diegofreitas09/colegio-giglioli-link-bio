"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Section = "estrutura" | "parceiros" | "projetos" | "campanhas";

type Item = {
  id: string;
  section: Section;
  titulo: string;
  descricao: string | null;
  imagem_url: string | null;
  link_url: string | null;
  link_label: string | null;
  publicado: boolean;
  destaque: boolean;
  ordem: number;
  data_evento: string | null;
  inicio_em: string | null;
  fim_em: string | null;
  created_at: string;
};

type ItemDraft = {
  titulo: string;
  descricao: string;
  link_url: string;
  link_label: string;
  data_evento: string;
  inicio_em: string;
  fim_em: string;
  ordem: string;
  publicado: boolean;
  destaque: boolean;
};

const sectionLabels: Record<Section, string> = {
  estrutura: "Nossa Estrutura",
  parceiros: "Nossos Parceiros",
  projetos: "Nossos Projetos",
  campanhas: "Campanhas de Matrículas"
};

const sectionDescriptions: Record<Section, string> = {
  estrutura: "Cadastre fotos dos espaços e escreva uma legenda para cada ambiente.",
  parceiros: "Cadastre plataformas e serviços. O link abre diretamente para boleto, boletim, agenda ou outro canal.",
  projetos: "Cadastre cada projeto com foto, legenda e a data do evento ou da atividade.",
  campanhas: "Publique campanhas, promoções e plantões com período de validade."
};

function localDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function toIso(value: string) {
  if (!value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function formatDay(value: string | null) {
  if (!value) return "";
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Fortaleza"
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Fortaleza"
  }).format(date);
}

function draftFromItem(item: Item): ItemDraft {
  return {
    titulo: item.titulo,
    descricao: item.descricao || "",
    link_url: item.link_url || "",
    link_label: item.link_label || "",
    data_evento: item.data_evento ? item.data_evento.slice(0, 10) : "",
    inicio_em: localDateTime(item.inicio_em),
    fim_em: localDateTime(item.fim_em),
    ordem: String(item.ordem ?? 100),
    publicado: item.publicado,
    destaque: item.destaque
  };
}

export default function CollectionsAdmin() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<Section | "todos">("todos");
  const [newSection, setNewSection] = useState<Section>("projetos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ItemDraft | null>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = useCallback(async () => {
    if (!supabase) {
      setSessionChecked(true);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setSessionChecked(true);
      return;
    }

    const { data } = await supabase
      .from("school_admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    setAuthorized(Boolean(data));
    setSessionChecked(true);
  }, [supabase]);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("site_collections")
      .select("*")
      .order("section")
      .order("destaque", { ascending: false })
      .order("ordem")
      .order("created_at", { ascending: false });

    if (error) setNotice(`Erro ao carregar: ${error.message}`);
    else setItems((data || []) as Item[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    verify();
  }, [verify]);

  useEffect(() => {
    if (authorized) refresh();
  }, [authorized, refresh]);

  async function upload(file: File, section: Section) {
    if (!supabase || !file.size) return null;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Use uma foto JPG, PNG ou WEBP.");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("A imagem deve ter no máximo 10 MB.");
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const objectPath = `${section}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("site-media-public")
      .upload(objectPath, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;
    return supabase.storage.from("site-media-public").getPublicUrl(objectPath).data.publicUrl;
  }

  async function createItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const titulo = String(fd.get("titulo") || "").trim();
    if (!titulo) {
      setNotice("Informe o título.");
      return;
    }

    setNotice("Salvando conteúdo...");
    try {
      const file = fd.get("imagem");
      const imagem_url = file instanceof File && file.size ? await upload(file, newSection) : null;
      const { error } = await supabase.from("site_collections").insert({
        section: newSection,
        titulo,
        descricao: String(fd.get("descricao") || "").trim() || null,
        imagem_url,
        link_url: String(fd.get("link_url") || "").trim() || null,
        link_label: String(fd.get("link_label") || "").trim() || null,
        data_evento: String(fd.get("data_evento") || "").trim() || null,
        publicado: fd.get("publicado") === "on",
        destaque: fd.get("destaque") === "on",
        ordem: Number(fd.get("ordem") || 100) || 100,
        inicio_em: toIso(String(fd.get("inicio_em") || "")),
        fim_em: toIso(String(fd.get("fim_em") || ""))
      });

      if (error) throw error;
      form.reset();
      setNotice("Conteúdo salvo com sucesso.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar.");
    }
  }

  async function patchItem(item: Item, patch: Partial<Item>) {
    if (!supabase) return false;
    setNotice("Atualizando...");
    const { error } = await supabase.from("site_collections").update(patch).eq("id", item.id);
    setNotice(error ? `Erro: ${error.message}` : "Atualizado com sucesso.");
    if (!error) await refresh();
    return !error;
  }

  function beginEdit(item: Item) {
    setEditingId(item.id);
    setEditDraft(draftFromItem(item));
    setNotice("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  async function saveEdit(e: FormEvent<HTMLFormElement>, item: Item) {
    e.preventDefault();
    if (!editDraft) return;
    if (!editDraft.titulo.trim()) {
      setNotice("Informe o título.");
      return;
    }

    const saved = await patchItem(item, {
      titulo: editDraft.titulo.trim(),
      descricao: editDraft.descricao.trim() || null,
      link_url: editDraft.link_url.trim() || null,
      link_label: editDraft.link_label.trim() || null,
      data_evento: editDraft.data_evento.trim() || null,
      inicio_em: toIso(editDraft.inicio_em),
      fim_em: toIso(editDraft.fim_em),
      ordem: Number(editDraft.ordem) || 100,
      publicado: editDraft.publicado,
      destaque: editDraft.destaque
    });

    if (saved) cancelEdit();
  }

  async function replaceImage(item: Item, file: File | null) {
    if (!file || !supabase) return;
    setNotice("Trocando imagem...");
    try {
      const url = await upload(file, item.section);
      if (!url) return;
      await patchItem(item, { imagem_url: url });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível trocar a imagem.");
    }
  }

  async function deleteItem(item: Item) {
    if (!supabase || !confirm(`Excluir “${item.titulo}”?`)) return;
    const { error } = await supabase.from("site_collections").delete().eq("id", item.id);
    setNotice(error ? `Erro: ${error.message}` : "Conteúdo excluído.");
    if (!error) await refresh();
  }

  if (!sessionChecked) {
    return <main className="grid min-h-screen place-items-center bg-[#061329] text-white">Carregando...</main>;
  }

  if (!authorized) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#061329] px-5 text-center text-white">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-black">Acesso administrativo necessário</h1>
          <p className="mt-3 text-sm font-bold text-slate-300">Entre primeiro no Painel da Escola e depois volte para esta área.</p>
          <a href="/admin" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-[#0a2856]">Ir para o painel</a>
        </div>
      </main>
    );
  }

  const visible = filter === "todos" ? items : items.filter((item) => item.section === filter);

  return (
    <main className="min-h-screen bg-[#061329] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-sky-300">Conteúdo institucional</p>
            <h1 className="mt-1 font-[var(--font-display)] text-3xl font-black">Módulos do site</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-300">Aqui o proprietário controla as fotos, legendas, datas, links, ordem e publicação de cada módulo.</p>
          </div>
          <div className="flex gap-2">
            <a href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black">← Painel</a>
            <a href="/" className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#0a2856]">Ver site</a>
          </div>
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <form onSubmit={createItem} className="h-fit rounded-[30px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-7">
            <p className="text-[10px] font-black uppercase tracking-[.16em] text-orange-300">Novo cadastro</p>
            <h2 className="mt-1 text-xl font-black">Adicionar conteúdo</h2>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-400">{sectionDescriptions[newSection]}</p>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-xs font-black text-slate-300">Módulo
                <select name="section" value={newSection} onChange={(e) => setNewSection(e.target.value as Section)} required className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white">
                  {(Object.keys(sectionLabels) as Section[]).map((key) => <option key={key} value={key}>{sectionLabels[key]}</option>)}
                </select>
              </label>

              <label className="grid gap-2 text-xs font-black text-slate-300">Título
                <input name="titulo" required className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white" placeholder={newSection === "projetos" ? "Ex.: Projeto Festa do ABC" : "Nome do conteúdo"} />
              </label>

              <label className="grid gap-2 text-xs font-black text-slate-300">Descrição / legenda
                <textarea name="descricao" rows={4} className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white" placeholder={newSection === "estrutura" ? "Ex.: Pátio coberto onde acontecem as vivências..." : "Escreva a legenda que aparecerá no site."} />
              </label>

              <label className="grid gap-2 text-xs font-black text-slate-300">Foto do módulo
                <input name="imagem" type="file" accept="image/jpeg,image/png,image/webp" className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-xs" />
                <span className="text-[10px] font-bold text-slate-500">JPG, PNG ou WEBP • até 10 MB</span>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-black text-slate-300">Data do projeto / evento
                  <input name="data_evento" type="date" className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white" />
                </label>
                <label className="grid gap-2 text-xs font-black text-slate-300">Ordem de exibição
                  <input name="ordem" type="number" defaultValue={100} className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-black text-slate-300">Link direto {newSection === "parceiros" ? "(boleto, boletim, agenda...)" : "(opcional)"}
                  <input name="link_url" type="url" placeholder="https://..." className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white" />
                </label>
                <label className="grid gap-2 text-xs font-black text-slate-300">Texto do botão
                  <input name="link_label" placeholder={newSection === "parceiros" ? "Acessar boleto" : "Saiba mais"} className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white" />
                </label>
              </div>

              {newSection === "campanhas" ? (
                <div className="grid gap-4 rounded-2xl border border-orange-300/10 bg-orange-300/[0.04] p-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs font-black text-slate-300">Início da campanha
                    <input name="inicio_em" type="datetime-local" className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white" />
                  </label>
                  <label className="grid gap-2 text-xs font-black text-slate-300">Fim da campanha
                    <input name="fim_em" type="datetime-local" className="rounded-2xl border border-white/10 bg-[#0b2448] px-4 py-3 text-white" />
                  </label>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-4 text-xs font-black">
                <label className="flex items-center gap-2"><input name="publicado" type="checkbox" /> Publicar agora</label>
                <label className="flex items-center gap-2"><input name="destaque" type="checkbox" /> Destacar</label>
              </div>

              <button className="rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-4 text-sm font-black text-[#082047]">Salvar conteúdo →</button>
              {notice ? <p className="rounded-2xl bg-white/7 px-4 py-3 text-xs font-bold text-sky-200" aria-live="polite">{notice}</p> : null}
            </div>
          </form>

          <section>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilter("todos")} className={`rounded-full px-4 py-2 text-xs font-black ${filter === "todos" ? "bg-white text-[#0a2856]" : "bg-white/6"}`}>Todos</button>
              {(Object.keys(sectionLabels) as Section[]).map((key) => (
                <button key={key} onClick={() => setFilter(key)} className={`rounded-full px-4 py-2 text-xs font-black ${filter === key ? "bg-white text-[#0a2856]" : "bg-white/6"}`}>{sectionLabels[key]}</button>
              ))}
            </div>

            <div className="mt-4 grid gap-4">
              {loading ? <p className="text-sm font-bold text-slate-300">Atualizando...</p> : null}
              {visible.map((item) => (
                <article key={item.id} className="grid gap-4 rounded-[26px] border border-white/10 bg-white/6 p-4 sm:grid-cols-[150px_1fr]">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#0b2448]">
                    {item.imagem_url ? <img src={item.imagem_url} alt={item.titulo} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-4xl">🖼️</div>}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.12em] text-cyan-200">{sectionLabels[item.section]}</span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black ${item.publicado ? "bg-emerald-400/15 text-emerald-200" : "bg-slate-400/10 text-slate-300"}`}>{item.publicado ? "Publicado" : "Oculto"}</span>
                      {item.destaque ? <span className="rounded-full bg-yellow-300 px-3 py-1 text-[10px] font-black text-[#082047]">Destaque</span> : null}
                    </div>

                    {editingId === item.id && editDraft ? (
                      <CollectionEditForm
                        section={item.section}
                        draft={editDraft}
                        onChange={(patch) => setEditDraft((current) => current ? { ...current, ...patch } : current)}
                        onSubmit={(e) => saveEdit(e, item)}
                        onCancel={cancelEdit}
                      />
                    ) : (
                      <>
                        <h3 className="mt-3 text-xl font-black">{item.titulo}</h3>
                        {item.descricao ? <p className="mt-1 text-sm font-bold leading-6 text-slate-300">{item.descricao}</p> : null}
                        {item.section === "projetos" && item.data_evento ? <p className="mt-2 text-xs font-black text-yellow-200">📅 Data do projeto: {formatDay(item.data_evento)}</p> : null}
                        {item.link_url ? <p className="mt-2 truncate text-xs font-bold text-cyan-300">{item.link_label || "Acessar"}: {item.link_url}</p> : null}
                        {item.section === "campanhas" && (item.inicio_em || item.fim_em) ? <p className="mt-2 text-xs font-bold text-slate-400">{item.inicio_em ? `Início: ${formatDateTime(item.inicio_em)}` : ""} {item.fim_em ? `• Fim: ${formatDateTime(item.fim_em)}` : ""}</p> : null}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button onClick={() => beginEdit(item)} className="rounded-full bg-white px-3 py-2 text-[11px] font-black text-[#0a2856]">Editar tudo</button>
                          <label className="cursor-pointer rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] font-black">Trocar foto<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => replaceImage(item, e.target.files?.[0] || null)} /></label>
                          <button onClick={() => patchItem(item, { publicado: !item.publicado })} className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] font-black">{item.publicado ? "Ocultar" : "Publicar"}</button>
                          <button onClick={() => patchItem(item, { destaque: !item.destaque })} className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] font-black">{item.destaque ? "Remover destaque" : "Destacar"}</button>
                          <button onClick={() => deleteItem(item)} className="rounded-full border border-red-300/20 bg-red-400/10 px-3 py-2 text-[11px] font-black text-red-200">Excluir</button>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              ))}
              {!loading && !visible.length ? <div className="rounded-[26px] border border-dashed border-white/15 p-8 text-center text-sm font-bold text-slate-400">Nenhum conteúdo cadastrado neste módulo. Use o formulário ao lado para adicionar a primeira foto.</div> : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function CollectionEditForm({
  section,
  draft,
  onChange,
  onSubmit,
  onCancel
}: {
  section: Section;
  draft: ItemDraft;
  onChange: (patch: Partial<ItemDraft>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-2xl border border-cyan-300/15 bg-[#071a39] p-4">
      <p className="text-[10px] font-black uppercase tracking-[.15em] text-cyan-300">Edição completa</p>
      <label className="grid gap-1.5 text-xs font-black text-slate-300">Título
        <input value={draft.titulo} onChange={(e) => onChange({ titulo: e.target.value })} required className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" />
      </label>
      <label className="grid gap-1.5 text-xs font-black text-slate-300">Descrição / legenda
        <textarea value={draft.descricao} onChange={(e) => onChange({ descricao: e.target.value })} rows={4} className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-black text-slate-300">Data do projeto / evento
          <input type="date" value={draft.data_evento} onChange={(e) => onChange({ data_evento: e.target.value })} className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" />
        </label>
        <label className="grid gap-1.5 text-xs font-black text-slate-300">Ordem
          <input type="number" value={draft.ordem} onChange={(e) => onChange({ ordem: e.target.value })} className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-black text-slate-300">Link direto {section === "parceiros" ? "(boleto, boletim, agenda...)" : "(opcional)"}
          <input type="url" value={draft.link_url} onChange={(e) => onChange({ link_url: e.target.value })} placeholder="https://..." className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" />
        </label>
        <label className="grid gap-1.5 text-xs font-black text-slate-300">Texto do botão
          <input value={draft.link_label} onChange={(e) => onChange({ link_label: e.target.value })} placeholder={section === "parceiros" ? "Acessar boleto" : "Saiba mais"} className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" />
        </label>
      </div>
      {(section === "campanhas" || draft.inicio_em || draft.fim_em) ? (
        <div className="grid gap-3 rounded-xl border border-orange-300/10 bg-orange-300/[0.04] p-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-black text-slate-300">Início da campanha
            <input type="datetime-local" value={draft.inicio_em} onChange={(e) => onChange({ inicio_em: e.target.value })} className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-300" />
          </label>
          <label className="grid gap-1.5 text-xs font-black text-slate-300">Fim da campanha
            <input type="datetime-local" value={draft.fim_em} onChange={(e) => onChange({ fim_em: e.target.value })} className="rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-300" />
          </label>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-4 text-xs font-black text-slate-300">
        <label className="flex items-center gap-2"><input type="checkbox" checked={draft.publicado} onChange={(e) => onChange({ publicado: e.target.checked })} /> Publicado</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={draft.destaque} onChange={(e) => onChange({ destaque: e.target.checked })} /> Destaque</label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-full bg-cyan-300 px-4 py-2 text-[11px] font-black text-[#082047]">Salvar alterações</button>
        <button type="button" onClick={onCancel} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-black">Cancelar</button>
      </div>
    </form>
  );
}
