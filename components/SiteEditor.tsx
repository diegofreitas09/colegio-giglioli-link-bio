"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Device = "desktop" | "tablet" | "mobile";
type EditorModule = {
  id: string;
  page_slug: string;
  module_key: string;
  module_type: string;
  nome: string;
  ordem: number;
  visible: boolean;
  draft_content: Record<string, any>;
  published_content: Record<string, any>;
  draft_style: Record<string, any>;
  published_style: Record<string, any>;
  published_at: string | null;
  updated_at: string;
};

type PageOption = { slug: string; label: string; live: boolean };

const pages: PageOption[] = [
  { slug: "home", label: "Página inicial", live: true },
  { slug: "estacao", label: "Estação Giglioli", live: false },
  { slug: "segmentos", label: "Segmentos", live: false },
  { slug: "mural", label: "Mural", live: false },
  { slug: "depoimentos", label: "Depoimentos", live: false },
  { slug: "contato", label: "Contato", live: false },
  { slug: "bio", label: "Link da Bio", live: false }
];

const fontOptions = [
  ["display", "Baloo / Destaque"],
  ["body", "Nunito / Corpo"],
  ["serif", "Serif institucional"],
  ["mono", "Mono técnico"]
] as const;

function safeColor(value: unknown, fallback: string) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function fontFamily(preset: unknown) {
  if (preset === "body") return "Nunito, ui-sans-serif, system-ui, sans-serif";
  if (preset === "serif") return "Georgia, 'Times New Roman', serif";
  if (preset === "mono") return "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  return "var(--font-display)";
}

function fieldText(content: Record<string, any>, key: string, fallback = "") {
  return typeof content[key] === "string" ? content[key] : fallback;
}

export default function SiteEditor() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [pageSlug, setPageSlug] = useState("home");
  const [modules, setModules] = useState<EditorModule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = modules.find((item) => item.id === selectedId) || modules[0] || null;

  const verify = useCallback(async () => {
    if (!supabase) {
      setChecked(true);
      return false;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setChecked(true);
      return false;
    }
    const { data } = await supabase.from("school_admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
    const ok = Boolean(data);
    setAuthorized(ok);
    setChecked(true);
    return ok;
  }, [supabase]);

  const loadModules = useCallback(async (slug: string) => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("site_modules")
      .select("*")
      .eq("page_slug", slug)
      .order("ordem", { ascending: true });
    if (error) {
      setNotice(`Erro ao carregar módulos: ${error.message}`);
      setModules([]);
      setSelectedId(null);
    } else {
      const rows = (data || []) as EditorModule[];
      setModules(rows);
      setSelectedId((current) => rows.some((m) => m.id === current) ? current : rows[0]?.id || null);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    verify().then((ok) => {
      if (ok) loadModules("home");
    });
  }, [verify, loadModules]);

  useEffect(() => {
    if (authorized) loadModules(pageSlug);
  }, [pageSlug, authorized, loadModules]);

  function updateLocal(id: string, patch: Partial<EditorModule>) {
    setModules((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function updateContent(key: string, value: any) {
    if (!selected) return;
    updateLocal(selected.id, { draft_content: { ...selected.draft_content, [key]: value } });
  }

  function updateStyle(key: string, value: any) {
    if (!selected) return;
    updateLocal(selected.id, { draft_style: { ...selected.draft_style, [key]: value } });
  }

  async function saveDraft() {
    if (!supabase || !selected) return;
    setNotice("Salvando rascunho...");
    const { error } = await supabase
      .from("site_modules")
      .update({
        nome: selected.nome,
        visible: selected.visible,
        draft_content: selected.draft_content,
        draft_style: selected.draft_style
      })
      .eq("id", selected.id);
    setNotice(error ? `Erro ao salvar: ${error.message}` : "Rascunho salvo. Nada foi publicado ainda.");
    if (!error) await loadModules(pageSlug);
  }

  async function publishModule() {
    if (!supabase || !selected) return;
    setNotice("Publicando módulo...");

    if (selected.published_at) {
      await supabase.from("site_module_revisions").insert({
        module_id: selected.id,
        content: selected.published_content,
        style: selected.published_style,
        visible: selected.visible
      });
    }

    const { error } = await supabase
      .from("site_modules")
      .update({
        nome: selected.nome,
        visible: selected.visible,
        draft_content: selected.draft_content,
        draft_style: selected.draft_style,
        published_content: selected.draft_content,
        published_style: selected.draft_style,
        published_at: new Date().toISOString()
      })
      .eq("id", selected.id);

    setNotice(error ? `Erro ao publicar: ${error.message}` : "Publicado. A versão pública já pode usar essas alterações.");
    if (!error) await loadModules(pageSlug);
  }

  async function discardDraft() {
    if (!supabase || !selected) return;
    if (!confirm("Descartar o rascunho e voltar para a última versão publicada?")) return;
    const { error } = await supabase
      .from("site_modules")
      .update({ draft_content: selected.published_content, draft_style: selected.published_style })
      .eq("id", selected.id);
    setNotice(error ? `Erro: ${error.message}` : "Rascunho descartado.");
    if (!error) await loadModules(pageSlug);
  }

  async function addModule() {
    if (!supabase) return;
    const key = `custom_${Date.now()}`;
    const order = (modules.at(-1)?.ordem || 0) + 10;
    const { data, error } = await supabase.from("site_modules").insert({
      page_slug: pageSlug,
      module_key: key,
      module_type: "content",
      nome: "Novo módulo",
      ordem: order,
      visible: true,
      draft_content: {
        kicker: "NOVO MÓDULO",
        title: "Título do novo módulo",
        description: "Edite este conteúdo no painel antes de publicar.",
        primary_cta: "Saiba mais"
      },
      published_content: {},
      draft_style: {
        background: "#ffffff",
        text_color: "#52657a",
        accent_color: "#0ea5e9",
        title_color: "#123c7b",
        font_preset: "display",
        align: "left"
      },
      published_style: {}
    }).select("id").single();

    if (error) {
      setNotice(`Erro ao criar módulo: ${error.message}`);
      return;
    }
    await loadModules(pageSlug);
    if (data?.id) setSelectedId(String(data.id));
    setNotice("Novo módulo criado como rascunho.");
  }

  async function removeModule() {
    if (!supabase || !selected) return;
    if (!confirm(`Excluir definitivamente o módulo “${selected.nome}”?`)) return;
    const { error } = await supabase.from("site_modules").delete().eq("id", selected.id);
    setNotice(error ? `Erro ao excluir: ${error.message}` : "Módulo excluído.");
    if (!error) await loadModules(pageSlug);
  }

  async function moveModule(direction: -1 | 1) {
    if (!supabase || !selected) return;
    const index = modules.findIndex((item) => item.id === selected.id);
    const other = modules[index + direction];
    if (!other) return;
    const currentOrder = selected.ordem;
    await Promise.all([
      supabase.from("site_modules").update({ ordem: other.ordem }).eq("id", selected.id),
      supabase.from("site_modules").update({ ordem: currentOrder }).eq("id", other.id)
    ]);
    await loadModules(pageSlug);
  }

  function updateCard(index: number, key: string, value: string) {
    if (!selected) return;
    const cards = Array.isArray(selected.draft_content.cards) ? [...selected.draft_content.cards] : [];
    cards[index] = { ...(cards[index] || {}), [key]: value };
    updateContent("cards", cards);
  }

  function addCard() {
    if (!selected) return;
    const cards = Array.isArray(selected.draft_content.cards) ? [...selected.draft_content.cards] : [];
    cards.push({ icon: "✦", title: "Novo item", text: "Descrição do item." });
    updateContent("cards", cards);
  }

  function removeCard(index: number) {
    if (!selected) return;
    const cards = Array.isArray(selected.draft_content.cards) ? [...selected.draft_content.cards] : [];
    cards.splice(index, 1);
    updateContent("cards", cards);
  }

  if (!checked) return <EditorGate text="Verificando acesso administrativo..." />;
  if (!authorized) {
    return (
      <EditorGate
        text="Entre primeiro no Painel da Escola para acessar o editor visual."
        action={<a href="/admin" className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#0a2856]">Ir para o login do admin</a>}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#050f22] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#061329]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Editor visual do site</p>
            <h1 className="font-[var(--font-display)] text-xl font-black sm:text-2xl">Estúdio Giglioli</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black">← Painel</a>
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black">Abrir site ↗</a>
            <button onClick={saveDraft} disabled={!selected} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-100 disabled:opacity-40">Salvar rascunho</button>
            <button onClick={publishModule} disabled={!selected} className="rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-2 text-xs font-black text-[#092149] shadow-lg disabled:opacity-40">Publicar módulo</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1700px] gap-4 px-3 py-4 sm:px-5 xl:grid-cols-[270px_minmax(0,1fr)_360px]">
        <aside className="rounded-[28px] border border-white/10 bg-white/[0.045] p-3 xl:sticky xl:top-20 xl:h-[calc(100vh-96px)] xl:overflow-y-auto">
          <label className="block text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Página</label>
          <select value={pageSlug} onChange={(e) => setPageSlug(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0b1d3b] px-4 py-3 text-sm font-black text-white outline-none">
            {pages.map((page) => <option key={page.slug} value={page.slug}>{page.label}{page.live ? " • integrado" : ""}</option>)}
          </select>

          <div className="mt-5 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Módulos</p>
              <p className="text-xs font-bold text-slate-500">{modules.length} cadastrados</p>
            </div>
            <button onClick={addModule} className="grid h-9 w-9 place-items-center rounded-xl bg-white text-lg font-black text-[#0a2856]" title="Adicionar módulo">+</button>
          </div>

          <div className="mt-3 grid gap-2">
            {modules.map((item, index) => {
              const hasDraft = JSON.stringify(item.draft_content) !== JSON.stringify(item.published_content) || JSON.stringify(item.draft_style) !== JSON.stringify(item.published_style);
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`group rounded-2xl border p-3 text-left transition ${selected?.id === item.id ? "border-cyan-300/35 bg-cyan-300/10" : "border-white/8 bg-white/[0.035] hover:bg-white/[0.07]"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                    <div className="flex gap-1">
                      {!item.visible && <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[9px] font-black">OCULTO</span>}
                      {hasDraft && <span className="rounded-full bg-yellow-300/15 px-2 py-0.5 text-[9px] font-black text-yellow-200">RASCUNHO</span>}
                      {item.published_at && !hasDraft && <span className="rounded-full bg-emerald-300/10 px-2 py-0.5 text-[9px] font-black text-emerald-200">PUBLICADO</span>}
                    </div>
                  </div>
                  <strong className="mt-2 block text-sm font-black text-white">{item.nome}</strong>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">{item.module_type}</span>
                </button>
              );
            })}
            {!modules.length && !loading && <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-xs font-bold text-slate-500">Nenhum módulo nesta página. Use + para começar.</div>}
          </div>
        </aside>

        <section className="min-w-0 rounded-[28px] border border-white/10 bg-[#0a1730] p-3 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.17em] text-cyan-300">Pré-visualização</p>
              <h2 className="mt-1 font-[var(--font-display)] text-2xl font-black">{selected?.nome || "Selecione um módulo"}</h2>
            </div>
            <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
              {(["desktop", "tablet", "mobile"] as Device[]).map((mode) => (
                <button key={mode} onClick={() => setDevice(mode)} className={`rounded-full px-3 py-2 text-[10px] font-black uppercase ${device === mode ? "bg-white text-[#0a2856]" : "text-slate-400"}`}>{mode}</button>
              ))}
            </div>
          </div>

          <div className="grid min-h-[620px] place-items-center overflow-auto rounded-[24px] border border-white/8 bg-[#020914] p-4 sm:p-6">
            {selected ? <ModulePreview module={selected} device={device} /> : <p className="text-sm font-bold text-slate-500">Selecione ou crie um módulo para editar.</p>}
          </div>

          {notice && <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07] px-4 py-3 text-xs font-bold text-cyan-100">{notice}</div>}
        </section>

        <aside className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4 xl:sticky xl:top-20 xl:h-[calc(100vh-96px)] xl:overflow-y-auto">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.17em] text-orange-300">Inspector</p>
                  <h2 className="mt-1 font-[var(--font-display)] text-xl font-black">Conteúdo e aparência</h2>
                </div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-300">
                  <input type="checkbox" checked={selected.visible} onChange={(e) => updateLocal(selected.id, { visible: e.target.checked })} /> Visível
                </label>
              </div>

              <div className="mt-5 grid gap-4">
                <EditorInput label="Nome interno do módulo" value={selected.nome} onChange={(value) => updateLocal(selected.id, { nome: value })} />
                {"kicker" in selected.draft_content && <EditorInput label="Chamada pequena" value={fieldText(selected.draft_content, "kicker")} onChange={(value) => updateContent("kicker", value)} />}
                {"eyebrow" in selected.draft_content && <EditorInput label="Chamada pequena" value={fieldText(selected.draft_content, "eyebrow")} onChange={(value) => updateContent("eyebrow", value)} />}

                {selected.module_type === "hero" ? (
                  <>
                    <EditorInput label="Título - início" value={fieldText(selected.draft_content, "title_before")} onChange={(value) => updateContent("title_before", value)} />
                    <EditorInput label="Título - destaque" value={fieldText(selected.draft_content, "title_highlight")} onChange={(value) => updateContent("title_highlight", value)} />
                    <EditorInput label="Título - final" value={fieldText(selected.draft_content, "title_after")} onChange={(value) => updateContent("title_after", value)} />
                    <EditorTextarea label="Frase da constelação" value={fieldText(selected.draft_content, "constellation")} onChange={(value) => updateContent("constellation", value)} />
                  </>
                ) : (
                  "title" in selected.draft_content && <EditorInput label="Título" value={fieldText(selected.draft_content, "title")} onChange={(value) => updateContent("title", value)} />
                )}

                {"description" in selected.draft_content && <EditorTextarea label="Descrição" value={fieldText(selected.draft_content, "description")} onChange={(value) => updateContent("description", value)} />}
                {"primary_cta" in selected.draft_content && <EditorInput label="Botão principal" value={fieldText(selected.draft_content, "primary_cta")} onChange={(value) => updateContent("primary_cta", value)} />}
                {"secondary_cta" in selected.draft_content && <EditorInput label="Botão secundário" value={fieldText(selected.draft_content, "secondary_cta")} onChange={(value) => updateContent("secondary_cta", value)} />}
                {"instagram_cta" in selected.draft_content && <EditorInput label="Botão Instagram" value={fieldText(selected.draft_content, "instagram_cta")} onChange={(value) => updateContent("instagram_cta", value)} />}
                {"visit_cta" in selected.draft_content && <EditorInput label="Botão visita" value={fieldText(selected.draft_content, "visit_cta")} onChange={(value) => updateContent("visit_cta", value)} />}
                {"school_name" in selected.draft_content && <EditorInput label="Nome da escola" value={fieldText(selected.draft_content, "school_name")} onChange={(value) => updateContent("school_name", value)} />}
                {"location" in selected.draft_content && <EditorInput label="Localização do rodapé" value={fieldText(selected.draft_content, "location")} onChange={(value) => updateContent("location", value)} />}

                {Array.isArray(selected.draft_content.cards) && (
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black">Cards / itens</span>
                      <button onClick={addCard} className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#0a2856]">+ Adicionar</button>
                    </div>
                    <div className="mt-3 grid gap-3">
                      {selected.draft_content.cards.map((card: any, index: number) => (
                        <div key={index} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                          <div className="grid grid-cols-[64px_1fr] gap-2">
                            <EditorInput label="Ícone" value={String(card?.icon || "")} onChange={(value) => updateCard(index, "icon", value)} compact />
                            <EditorInput label="Título" value={String(card?.title || "")} onChange={(value) => updateCard(index, "title", value)} compact />
                          </div>
                          <div className="mt-2"><EditorTextarea label="Texto" value={String(card?.text || "")} onChange={(value) => updateCard(index, "text", value)} compact /></div>
                          <button onClick={() => removeCard(index)} className="mt-2 text-[10px] font-black text-rose-300">Remover item</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Aparência</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <ColorField label="Fundo" value={safeColor(selected.draft_style.background, "#ffffff")} onChange={(value) => updateStyle("background", value)} />
                    <ColorField label="Título" value={safeColor(selected.draft_style.title_color, "#123c7b")} onChange={(value) => updateStyle("title_color", value)} />
                    <ColorField label="Texto" value={safeColor(selected.draft_style.text_color, "#52657a")} onChange={(value) => updateStyle("text_color", value)} />
                    <ColorField label="Destaque" value={safeColor(selected.draft_style.accent_color, "#0ea5e9")} onChange={(value) => updateStyle("accent_color", value)} />
                  </div>
                  <label className="mt-3 grid gap-1.5 text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
                    Fonte
                    <select value={String(selected.draft_style.font_preset || "display")} onChange={(e) => updateStyle("font_preset", e.target.value)} className="rounded-xl border border-white/10 bg-[#0b1d3b] px-3 py-2.5 text-xs font-black normal-case tracking-normal text-white">
                      {fontOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <label className="mt-3 grid gap-1.5 text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
                    Alinhamento
                    <select value={String(selected.draft_style.align || "left")} onChange={(e) => updateStyle("align", e.target.value)} className="rounded-xl border border-white/10 bg-[#0b1d3b] px-3 py-2.5 text-xs font-black normal-case tracking-normal text-white">
                      <option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={() => moveModule(-1)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black">↑ Subir</button>
                <button onClick={() => moveModule(1)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black">↓ Descer</button>
                <button onClick={discardDraft} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black">Desfazer rascunho</button>
                <button onClick={removeModule} className="rounded-xl border border-rose-300/15 bg-rose-300/5 px-3 py-2 text-[10px] font-black text-rose-200">Excluir módulo</button>
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-black/10 p-3 text-[10px] font-bold leading-5 text-slate-500">
                {selected.published_at ? `Última publicação: ${new Date(selected.published_at).toLocaleString("pt-BR")}` : "Este módulo ainda não foi publicado."}
              </div>
            </>
          ) : <p className="text-sm font-bold text-slate-500">Selecione um módulo.</p>}
        </aside>
      </div>
    </main>
  );
}

function ModulePreview({ module, device }: { module: EditorModule; device: Device }) {
  const content = module.draft_content || {};
  const style = module.draft_style || {};
  const width = device === "mobile" ? 390 : device === "tablet" ? 760 : 1120;
  const background = safeColor(style.background, "#ffffff");
  const titleColor = safeColor(style.title_color, "#123c7b");
  const textColor = safeColor(style.text_color, "#52657a");
  const accent = safeColor(style.accent_color, "#0ea5e9");
  const align = ["left", "center", "right"].includes(String(style.align)) ? style.align : "left";
  const family = fontFamily(style.font_preset);
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const title = module.module_type === "hero"
    ? `${fieldText(content, "title_before")} ${fieldText(content, "title_highlight")} ${fieldText(content, "title_after")}`.trim()
    : fieldText(content, "title", fieldText(content, "school_name", module.nome));
  const kicker = fieldText(content, "kicker", fieldText(content, "eyebrow"));
  const description = fieldText(content, "description", fieldText(content, "constellation", fieldText(content, "location")));

  return (
    <div className="transition-all duration-300" style={{ width: `min(100%, ${width}px)` }}>
      <div className="overflow-hidden rounded-[30px] shadow-2xl" style={{ background, color: textColor, textAlign: align as any }}>
        <div className="p-6 sm:p-10" style={{ fontFamily: family }}>
          {kicker && <div className="text-[10px] font-black uppercase tracking-[.18em]" style={{ color: accent }}>{kicker}</div>}
          <h3 className="mt-3 text-3xl font-black leading-tight sm:text-5xl" style={{ color: titleColor }}>{title || module.nome}</h3>
          {description && <p className="mt-4 text-sm font-bold leading-7 sm:text-base" style={{ color: textColor }}>{description}</p>}

          {cards.length > 0 && (
            <div className={`mt-7 grid gap-3 ${device === "mobile" ? "grid-cols-1" : "grid-cols-3"}`}>
              {cards.map((card: any, index: number) => (
                <div key={index} className="rounded-2xl border p-4 text-left" style={{ borderColor: `${accent}38`, background: "rgba(255,255,255,.08)" }}>
                  <span className="text-2xl">{String(card?.icon || "✦")}</span>
                  <strong className="mt-3 block text-base" style={{ color: titleColor }}>{String(card?.title || "Item")}</strong>
                  <p className="mt-1 text-xs font-bold leading-5" style={{ color: textColor }}>{String(card?.text || "")}</p>
                </div>
              ))}
            </div>
          )}

          <div className={`mt-7 flex flex-wrap gap-2 ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`}>
            {fieldText(content, "primary_cta") && <span className="rounded-full px-5 py-3 text-xs font-black" style={{ background: accent, color: "#071a39" }}>{fieldText(content, "primary_cta")}</span>}
            {fieldText(content, "secondary_cta") && <span className="rounded-full border px-5 py-3 text-xs font-black" style={{ borderColor: `${accent}66`, color: titleColor }}>{fieldText(content, "secondary_cta")}</span>}
            {fieldText(content, "instagram_cta") && <span className="rounded-full border px-5 py-3 text-xs font-black" style={{ borderColor: `${accent}66`, color: titleColor }}>{fieldText(content, "instagram_cta")}</span>}
            {fieldText(content, "visit_cta") && <span className="rounded-full border px-5 py-3 text-xs font-black" style={{ borderColor: `${accent}66`, color: titleColor }}>{fieldText(content, "visit_cta")}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorInput({ label, value, onChange, compact = false }: { label: string; value: string; onChange: (value: string) => void; compact?: boolean }) {
  return (
    <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className={`rounded-xl border border-white/10 bg-[#0b1d3b] px-3 ${compact ? "py-2" : "py-2.5"} text-xs font-bold normal-case tracking-normal text-white outline-none focus:border-cyan-300/40`} />
    </label>
  );
}

function EditorTextarea({ label, value, onChange, compact = false }: { label: string; value: string; onChange: (value: string) => void; compact?: boolean }) {
  return (
    <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
      {label}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={compact ? 2 : 4} className="resize-y rounded-xl border border-white/10 bg-[#0b1d3b] px-3 py-2.5 text-xs font-bold normal-case leading-5 tracking-normal text-white outline-none focus:border-cyan-300/40" />
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
      {label}
      <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b1d3b] p-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-9 cursor-pointer rounded border-0 bg-transparent" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[10px] font-black text-white outline-none" />
      </span>
    </label>
  );
}

function EditorGate({ text, action }: { text: string; action?: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#061329] px-5 text-white">
      <div className="max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cyan-300/10 text-2xl">✦</div>
        <p className="mt-5 text-sm font-bold leading-6 text-slate-300">{text}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </main>
  );
}
