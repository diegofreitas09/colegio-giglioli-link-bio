"use client";

import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SpaceBackground from "@/components/SpaceBackground";
import FloatingMascot from "@/components/FloatingMascot";
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
  destaque: boolean;
  ordem: number;
  inicio_em: string | null;
  fim_em: string | null;
  created_at: string;
};

const pdfWhatsapp = `https://wa.me/5585984161882?text=${encodeURIComponent("Olá! Vim pelo site do Colégio Giglioli e gostaria de falar com a PDF Solução Educacional.")}`;
const matriculaWhatsapp = `https://wa.me/5585999725279?text=${encodeURIComponent("Olá! Vim pelo site do Colégio Giglioli e quero informações sobre matrícula.")}`;

const config: Record<Section, { kicker: string; title: string; description: string; empty: string; icon: string }> = {
  estrutura: {
    kicker: "NOSSA ESTRUTURA",
    title: "Espaços preparados para aprender, brincar e crescer.",
    description: "Conheça os ambientes do Colégio Giglioli. As fotos desta página serão atualizadas pela escola para que as famílias possam visualizar cada espaço.",
    empty: "As fotos dos nossos espaços serão publicadas aqui.",
    icon: "🏫"
  },
  parceiros: {
    kicker: "NOSSOS PARCEIROS",
    title: "Serviços e plataformas que fazem parte da rotina escolar.",
    description: "Editoras, sistemas educacionais e parceiros institucionais em um só lugar. Quando houver acesso on-line, a família poderá entrar diretamente por aqui.",
    empty: "Os parceiros e seus canais de acesso serão publicados aqui.",
    icon: "🤝"
  },
  projetos: {
    kicker: "NOSSOS PROJETOS",
    title: "Experiências que ganham vida ao longo do ano.",
    description: "Projetos pedagógicos, culturais, esportivos e vivências especiais com fotos e legendas para acompanhar tudo o que acontece na nossa estação.",
    empty: "Os projetos do ano letivo serão publicados aqui.",
    icon: "🚀"
  },
  campanhas: {
    kicker: "CAMPANHAS DE MATRÍCULAS",
    title: "Condições e oportunidades para embarcar com a gente.",
    description: "Acompanhe campanhas vigentes, plantões, condições especiais e chamadas de matrícula do Colégio Giglioli.",
    empty: "Não há campanha publicada neste momento. Fale com a equipe para consultar as condições atuais.",
    icon: "🎟️"
  }
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Fortaleza"
  }).format(new Date(value));
}

export default function InstitutionalCollectionPage({ section }: { section: Section }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const copy = config[section];

  useEffect(() => {
    let active = true;

    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("site_collections")
        .select("id,section,titulo,descricao,imagem_url,link_url,link_label,destaque,ordem,inicio_em,fim_em,created_at")
        .eq("section", section)
        .eq("publicado", true)
        .order("destaque", { ascending: false })
        .order("ordem", { ascending: true })
        .order("created_at", { ascending: false });

      if (!active) return;

      const now = Date.now();
      const visible = ((data || []) as Item[]).filter((item) => {
        if (section !== "campanhas") return true;
        const starts = item.inicio_em ? new Date(item.inicio_em).getTime() : null;
        const ends = item.fim_em ? new Date(item.fim_em).getTime() : null;
        return (!starts || starts <= now) && (!ends || ends >= now);
      });

      setItems(visible);
      setLoading(false);
    }

    load();
    return () => { active = false; };
  }, [section, supabase]);

  return (
    <>
      <SpaceBackground />
      <SiteHeader />
      <FloatingMascot />

      <main className="min-h-screen bg-[#041329] text-white">
        <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-40">
          <div className="pointer-events-none absolute left-[-8rem] top-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-xs font-black tracking-[.18em] text-cyan-200">
              <span>{copy.icon}</span>{copy.kicker}
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl font-[var(--font-display)] text-4xl font-black leading-[.98] tracking-[-.04em] sm:text-6xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm font-bold leading-7 text-slate-300 sm:text-lg">
              {copy.description}
            </p>
          </div>
        </section>

        <section className="rounded-t-[40px] bg-[#f5faff] px-4 py-14 text-[#16314f] sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-80 animate-pulse rounded-[30px] bg-sky-100" />
                ))}
              </div>
            ) : items.length ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <article key={item.id} className="group overflow-hidden rounded-[30px] border border-sky-900/10 bg-white shadow-xl shadow-sky-900/7 transition hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0b376b] via-[#0c5d98] to-[#0a95be]">
                      {item.imagem_url ? (
                        <img src={item.imagem_url} alt={item.titulo} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="grid h-full place-items-center text-7xl opacity-80">{copy.icon}</div>
                      )}
                      {item.destaque ? (
                        <span className="absolute left-4 top-4 rounded-full bg-yellow-300 px-3 py-1.5 text-[10px] font-black tracking-[.12em] text-[#09274c]">DESTAQUE</span>
                      ) : null}
                    </div>
                    <div className="p-6">
                      <h2 className="font-[var(--font-display)] text-2xl font-black text-[#123c7b]">{item.titulo}</h2>
                      {item.descricao ? <p className="mt-3 text-sm font-bold leading-6 text-slate-500">{item.descricao}</p> : null}

                      {section === "campanhas" && (item.inicio_em || item.fim_em) ? (
                        <p className="mt-4 text-xs font-black text-sky-700">
                          {item.inicio_em ? `Início: ${formatDate(item.inicio_em)}` : ""}
                          {item.inicio_em && item.fim_em ? " • " : ""}
                          {item.fim_em ? `Até: ${formatDate(item.fim_em)}` : ""}
                        </p>
                      ) : null}

                      {item.link_url ? (
                        <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#123c7b] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0b529d]">
                          {item.link_label || (section === "parceiros" ? "Acessar plataforma ↗" : "Saiba mais ↗")}
                        </a>
                      ) : section === "campanhas" ? (
                        <a href={matriculaWhatsapp} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-5 text-xs font-black text-[#082047]">
                          Quero saber mais →
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-2xl rounded-[30px] border border-sky-900/10 bg-white p-8 text-center shadow-xl shadow-sky-900/7 sm:p-12">
                <div className="text-6xl">{copy.icon}</div>
                <h2 className="mt-5 font-[var(--font-display)] text-3xl font-black text-[#123c7b]">Conteúdo em atualização</h2>
                <p className="mt-3 font-bold leading-7 text-slate-500">{copy.empty}</p>
                {section === "campanhas" ? (
                  <a href={matriculaWhatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-orange-400 to-yellow-300 px-6 text-sm font-black text-[#082047]">
                    Falar com a matrícula →
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#031126] px-4 py-8 text-center text-white sm:px-6">
        <p className="text-xs font-black tracking-[.12em] text-slate-400">COLÉGIO GIGLIOLI • FORTALEZA, CEARÁ</p>
        <a href={pdfWhatsapp} target="_blank" rel="noopener noreferrer" className="mx-auto mt-3 inline-flex flex-wrap items-center justify-center gap-x-2 text-xs font-black text-cyan-200 transition hover:text-yellow-300">
          Desenvolvido por PDF Solução Educacional <span>•</span> <span>(85) 98416-1882</span>
        </a>
      </footer>
    </>
  );
}
