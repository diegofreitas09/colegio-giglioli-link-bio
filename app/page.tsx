import Image from "next/image";
import SpaceBackground from "@/components/SpaceBackground";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import HeroGiglioli from "@/components/HeroGiglioli";
import AnimatedSection from "@/components/AnimatedSection";
import LeadForm from "@/components/LeadForm";
import LazyMural from "@/components/LazyMural";
import DeferredMap from "@/components/DeferredMap";
import {
  fontFamilyFromPreset,
  getPublishedSiteModules,
  siteModuleMap,
  type PublishedSiteModule,
  type SiteModuleContent,
  type SiteModuleStyle
} from "@/lib/site-builder";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";
const wa = (text: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

const defaultSegments = [
  { title: "Educação Infantil", text: "Infantil 2 ao Infantil 5", icon: "🪐", tone: "from-fuchsia-400 to-orange-300" },
  { title: "1º e 2º ano", text: "Primeiras órbitas do Fundamental", icon: "🌎", tone: "from-cyan-400 to-blue-500" },
  { title: "3º ao 5º ano", text: "Novas missões e mais autonomia", icon: "🚀", tone: "from-yellow-300 to-orange-400" }
];

const defaultValues = [
  { title: "Aprender com sentido", text: "Experiências que conectam conteúdo, curiosidade e participação.", icon: "✦" },
  { title: "Acolher de verdade", text: "Comunicação próxima, rotina organizada e um olhar atento para cada fase.", icon: "💙" },
  { title: "Mover corpo e ideias", text: "Natação, ballet, futsal, recreação direcionada e vivências que ampliam o desenvolvimento.", icon: "⚡" }
];

function virtualModule(moduleKey: string, ordem: number): PublishedSiteModule {
  return {
    id: `fallback-${moduleKey}`,
    page_slug: "home",
    module_key: moduleKey,
    module_type: moduleKey === "hero" ? "hero" : moduleKey === "mural" ? "system" : moduleKey,
    nome: moduleKey,
    ordem,
    visible: true,
    published_content: {},
    published_style: {},
    published_at: null
  };
}

function stringValue(content: SiteModuleContent | undefined, key: string, fallback: string) {
  const value = content?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function cardsValue(content: SiteModuleContent | undefined, fallback: { title: string; text: string; icon: string }[]) {
  const cards = content?.cards;
  if (!Array.isArray(cards) || !cards.length) return fallback;
  return cards.map((item, index) => {
    const card = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return {
      title: typeof card.title === "string" && card.title.trim() ? card.title : fallback[index % fallback.length]?.title || `Item ${index + 1}`,
      text: typeof card.text === "string" ? card.text : "",
      icon: typeof card.icon === "string" && card.icon.trim() ? card.icon : "✦"
    };
  });
}

function styleColor(style: SiteModuleStyle | undefined, key: keyof SiteModuleStyle, fallback: string) {
  const value = style?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function textAlign(style?: SiteModuleStyle) {
  return style?.align === "center" || style?.align === "right" ? style.align : "left";
}

export default async function Home() {
  const modules = await getPublishedSiteModules("home");
  const moduleMap = siteModuleMap(modules);
  const orderedModules = modules.length
    ? modules.filter((item) => item.visible && item.module_key !== "footer")
    : [
        virtualModule("hero", 10),
        virtualModule("about", 20),
        virtualModule("segments", 30),
        virtualModule("mural", 40),
        virtualModule("location", 50),
        virtualModule("contact", 60)
      ];
  const footerModule = modules.length ? moduleMap.get("footer") : virtualModule("footer", 70);

  return (
    <>
      <SpaceBackground />
      <SiteHeader />
      <FloatingMascot />

      <main id="topo">
        {orderedModules.map((module) => (
          <HomeModule key={module.id} module={module} />
        ))}
      </main>

      {footerModule && footerModule.visible !== false ? <SiteFooter module={footerModule} /> : null}
    </>
  );
}

function HomeModule({ module }: { module: PublishedSiteModule }) {
  switch (module.module_key) {
    case "hero":
      return <HeroGiglioli content={module.published_content} style={module.published_style} />;
    case "about":
      return <AboutModule module={module} />;
    case "segments":
      return <SegmentsModule module={module} />;
    case "mural":
      return <LazyMural context="mural" />;
    case "location":
      return <LocationModule module={module} />;
    case "contact":
      return <ContactModule module={module} />;
    default:
      return <GenericModule module={module} />;
  }
}

function AboutModule({ module }: { module: PublishedSiteModule }) {
  const content = module.published_content;
  const style = module.published_style;
  const cards = cardsValue(content, defaultValues);
  const background = styleColor(style, "background", "#f7fbff");
  const titleColor = styleColor(style, "title_color", "#123c7b");
  const textColor = styleColor(style, "text_color", "#667a94");
  const accent = styleColor(style, "accent_color", "#4a6f99");
  const align = textAlign(style);

  return (
    <section id="sobre" className="space-section rounded-t-[42px] py-24" style={{ background, color: textColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" style={{ fontFamily: fontFamilyFromPreset(style.font_preset), textAlign: align }}>
        <AnimatedSection>
          <span className="section-kicker-dark" style={{ color: accent }}>{stringValue(content, "kicker", "MÓDULO 01 • SOBRE A ESCOLA")}</span>
          <h2 className="section-title-dark" style={{ color: titleColor }}>{stringValue(content, "title", "Uma estação de aprendizagem feita para descobrir, criar e crescer.")}</h2>
          <p className="section-copy-dark" style={{ color: textColor }}>{stringValue(content, "description", "A identidade espacial dá personalidade ao site, mas a mensagem principal é institucional: acolhimento, desenvolvimento e parceria com as famílias. O visual não repete os outros projetos escolares — aqui tudo gira em torno da Estação Giglioli.")}</p>
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((card, i) => (
            <AnimatedSection key={`${card.title}-${i}`} delay={i * .06}>
              <article className="rounded-[28px] border border-sky-900/10 bg-white p-6 text-left shadow-xl shadow-sky-900/7 transition-transform hover:-translate-y-1">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-2xl">{card.icon}</span>
                <h3 className="mt-5 text-2xl font-black" style={{ color: titleColor, fontFamily: fontFamilyFromPreset(style.font_preset) }}>{card.title}</h3>
                <p className="mt-2 text-sm font-bold leading-relaxed" style={{ color: textColor }}>{card.text}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function SegmentsModule({ module }: { module: PublishedSiteModule }) {
  const content = module.published_content;
  const style = module.published_style;
  const cards = cardsValue(content, defaultSegments);
  const background = styleColor(style, "background", "#071a39");
  const titleColor = styleColor(style, "title_color", "#ffffff");
  const textColor = styleColor(style, "text_color", "#b9c9dd");
  const accent = styleColor(style, "accent_color", "#7adfff");
  const align = textAlign(style);
  const tones = ["from-fuchsia-400 to-orange-300", "from-cyan-400 to-blue-500", "from-yellow-300 to-orange-400", "from-violet-400 to-cyan-400"];

  return (
    <section id="segmentos" className="space-section border-y border-white/8 py-24 text-white backdrop-blur-sm" style={{ background }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" style={{ fontFamily: fontFamilyFromPreset(style.font_preset), textAlign: align }}>
        <AnimatedSection>
          <span className="section-kicker" style={{ color: accent }}>{stringValue(content, "kicker", "MÓDULO 02 • PLANETAS DA CONSTELAÇÃO")}</span>
          <h2 className="section-title-light" style={{ color: titleColor }}>{stringValue(content, "title", "Cada etapa tem uma missão diferente.")}</h2>
          <p className="section-copy-light" style={{ color: textColor }}>{stringValue(content, "description", "Os segmentos aparecem como planetas conectados: a criança avança de fase sem perder o vínculo com a mesma constelação.")}</p>
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((segment, i) => (
            <AnimatedSection key={`${segment.title}-${i}`} delay={i * .08}>
              <article className="group rounded-[30px] border border-white/10 bg-white/6 p-7 text-left shadow-2xl backdrop-blur transition-transform hover:-translate-y-2 hover:border-sky-300/30">
                <span className={`grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${tones[i % tones.length]} text-4xl shadow-xl transition-transform group-hover:scale-105`}>{segment.icon}</span>
                <h3 className="mt-6 text-3xl font-black" style={{ color: titleColor, fontFamily: fontFamilyFromPreset(style.font_preset) }}>{segment.title}</h3>
                <p className="mt-2 text-sm font-bold" style={{ color: textColor }}>{segment.text}</p>
                <a href={wa(`Olá! Quero informações sobre ${segment.title} no Colégio Giglioli.`)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-xs font-black" style={{ color: accent }}>Vamos nessa nova missão →</a>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationModule({ module }: { module: PublishedSiteModule }) {
  const content = module.published_content;
  const style = module.published_style;
  const background = styleColor(style, "background", "#eef7ff");
  const titleColor = styleColor(style, "title_color", "#123c7b");
  const textColor = styleColor(style, "text_color", "#667a94");
  const accent = styleColor(style, "accent_color", "#4a6f99");
  const align = textAlign(style);

  return (
    <section id="localizacao" className="space-section py-24" style={{ background, color: textColor }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
        <AnimatedSection>
          <div style={{ fontFamily: fontFamilyFromPreset(style.font_preset), textAlign: align }}>
            <span className="section-kicker-dark" style={{ color: accent }}>{stringValue(content, "kicker", "MÓDULO 04 • COORDENADAS")}</span>
            <h2 className="section-title-dark" style={{ color: titleColor }}>{stringValue(content, "title", "Venha conhecer a nossa estação.")}</h2>
            <p className="section-copy-dark" style={{ color: textColor }}>{stringValue(content, "description", "R. Umarizeiras, 929 • Canindezinho • Fortaleza, Ceará.")}</p>
            <div className="mt-6 grid gap-3">
              <a href="https://www.google.com/maps/search/?api=1&query=R.%20Umarizeiras%2C%20929%20-%20Canindezinho%2C%20Fortaleza%20-%20CE" target="_blank" rel="noopener noreferrer" className="rounded-2xl px-5 py-4 text-sm font-black text-white" style={{ background: titleColor }}>{stringValue(content, "primary_cta", "Abrir rota no Google Maps ↗")}</a>
              <a href="tel:+5585999725279" className="rounded-2xl border border-sky-900/10 bg-white px-5 py-4 text-sm font-black" style={{ color: titleColor }}>{stringValue(content, "secondary_cta", "Ligar: (85) 99972-5279")}</a>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={.08}><DeferredMap /></AnimatedSection>
      </div>
    </section>
  );
}

function ContactModule({ module }: { module: PublishedSiteModule }) {
  const content = module.published_content;
  const style = module.published_style;
  const background = styleColor(style, "background", "#071a39");
  const titleColor = styleColor(style, "title_color", "#ffffff");
  const textColor = styleColor(style, "text_color", "#cbd5e1");
  const accent = styleColor(style, "accent_color", "#7adfff");
  const align = textAlign(style);

  return (
    <section id="contato" className="space-section bg-[#f7fbff] pb-28 pt-8 text-[#16314f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 rounded-[36px] p-6 text-white shadow-2xl sm:p-9 lg:grid-cols-2" style={{ background }}>
          <AnimatedSection>
            <div style={{ fontFamily: fontFamilyFromPreset(style.font_preset), textAlign: align }}>
              <span className="section-kicker" style={{ color: accent }}>{stringValue(content, "kicker", "MÓDULO FINAL • EMBARQUE")}</span>
              <h2 className="mt-3 text-5xl font-black leading-[.95]" style={{ color: titleColor }}>{stringValue(content, "title", "Pronto para conhecer o Giglioli?")}</h2>
              <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed" style={{ color: textColor }}>{stringValue(content, "description", "Preencha os dados e a equipe entra em contato. Se o Supabase ainda não estiver conectado, o formulário abre o WhatsApp automaticamente — ninguém fica perdido no espaço.")}</p>
              <div className={`mt-7 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : ""}`}>
                <a href="https://www.instagram.com/colegio.giglioli/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/7 px-4 py-3 text-xs font-black">{stringValue(content, "instagram_cta", "Instagram ↗")}</a>
                <a href={wa("Olá! Quero agendar uma visita ao Colégio Giglioli.")} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/7 px-4 py-3 text-xs font-black">{stringValue(content, "visit_cta", "Agendar visita")}</a>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={.1}><LeadForm /></AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function GenericModule({ module }: { module: PublishedSiteModule }) {
  const content = module.published_content;
  const style = module.published_style;
  const background = styleColor(style, "background", "#ffffff");
  const titleColor = styleColor(style, "title_color", "#123c7b");
  const textColor = styleColor(style, "text_color", "#52657a");
  const accent = styleColor(style, "accent_color", "#0ea5e9");
  const align = textAlign(style);

  return (
    <section className="space-section py-20" style={{ background, color: textColor }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" style={{ fontFamily: fontFamilyFromPreset(style.font_preset), textAlign: align }}>
        <AnimatedSection>
          {stringValue(content, "kicker", "") && <span className="text-xs font-black uppercase tracking-[.16em]" style={{ color: accent }}>{stringValue(content, "kicker", "")}</span>}
          <h2 className="mt-3 text-4xl font-black sm:text-5xl" style={{ color: titleColor }}>{stringValue(content, "title", module.nome)}</h2>
          {stringValue(content, "description", "") && <p className="mt-4 max-w-3xl text-base font-bold leading-7" style={{ color: textColor }}>{stringValue(content, "description", "")}</p>}
          {stringValue(content, "primary_cta", "") && <a href="#contato" className="mt-7 inline-flex rounded-full px-6 py-3 text-sm font-black text-[#071a39]" style={{ background: accent }}>{stringValue(content, "primary_cta", "Saiba mais")}</a>}
        </AnimatedSection>
      </div>
    </section>
  );
}

function SiteFooter({ module }: { module: PublishedSiteModule }) {
  const content = module.published_content;
  const style = module.published_style;
  const background = styleColor(style, "background", "#041025");
  const titleColor = styleColor(style, "title_color", "#ffffff");
  const textColor = styleColor(style, "text_color", "#cbd5e1");

  return (
    <footer className="border-t border-white/8 py-9 text-white" style={{ background, color: textColor, fontFamily: fontFamilyFromPreset(style.font_preset) }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative h-12 w-12"><Image src="/assets/logo-giglioli-vetorial.svg" alt="" fill sizes="48px" className="object-contain" /></span>
          <div><strong className="block text-lg font-black" style={{ color: titleColor }}>{stringValue(content, "school_name", "Colégio Giglioli")}</strong><small className="font-bold" style={{ color: textColor }}>{stringValue(content, "location", "Fortaleza • Ceará")}</small></div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-black" style={{ color: textColor }}>
          <a href="#sobre">A escola</a><a href="#segmentos">Segmentos</a><a href="#mural">Mural</a><a href="#localizacao">Localização</a><a href="#contato">Matrícula</a>
        </div>
      </div>
    </footer>
  );
}
