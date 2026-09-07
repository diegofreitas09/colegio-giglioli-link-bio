import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://colegiogiglioli.com.br";
  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/escola", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/estacao", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/segmentos", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/estrutura", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/projetos", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/parceiros", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/matriculas", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/depoimentos", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/localizacao", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contato", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/privacidade", changeFrequency: "yearly" as const, priority: 0.3 }
  ];

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    changeFrequency,
    priority
  }));
}
