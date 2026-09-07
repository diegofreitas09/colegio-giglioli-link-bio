import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Colégio Giglioli",
    short_name: "Giglioli",
    description: "Site oficial do Colégio Giglioli",
    start_url: "/",
    display: "standalone",
    background_color: "#061329",
    theme_color: "#061329",
    icons: [
      {
        src: "/assets/logo-giglioli-vetorial.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/assets/logo-giglioli-vetorial.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
