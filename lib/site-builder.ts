import { createClient } from "@supabase/supabase-js";

export type SiteModuleContent = Record<string, unknown>;
export type SiteModuleStyle = {
  background?: string;
  text_color?: string;
  accent_color?: string;
  title_color?: string;
  font_preset?: "display" | "body" | "serif" | "mono";
  align?: "left" | "center" | "right";
};

export type PublishedSiteModule = {
  id: string;
  page_slug: string;
  module_key: string;
  module_type: string;
  nome: string;
  ordem: number;
  visible: boolean;
  published_content: SiteModuleContent;
  published_style: SiteModuleStyle;
  published_at: string | null;
};

export async function getPublishedSiteModules(pageSlug: string): Promise<PublishedSiteModule[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  try {
    const client = createClient(url, key, {
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" })
      },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });

    const { data, error } = await client
      .from("site_modules")
      .select("id,page_slug,module_key,module_type,nome,ordem,visible,published_content,published_style,published_at")
      .eq("page_slug", pageSlug)
      .not("published_at", "is", null)
      .order("ordem", { ascending: true });

    if (error || !data) return [];
    return data as PublishedSiteModule[];
  } catch {
    return [];
  }
}

export function siteModuleMap(modules: PublishedSiteModule[]) {
  return new Map(modules.map((item) => [item.module_key, item]));
}

export function fontFamilyFromPreset(preset?: string) {
  switch (preset) {
    case "serif":
      return "Georgia, 'Times New Roman', serif";
    case "mono":
      return "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    case "body":
      return "Nunito, ui-sans-serif, system-ui, sans-serif";
    case "display":
    default:
      return "var(--font-display)";
  }
}

export function contentString(content: SiteModuleContent | undefined, key: string, fallback: string) {
  const value = content?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}
