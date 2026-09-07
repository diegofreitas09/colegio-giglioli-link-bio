import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://colegiogiglioli.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"]
      }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
