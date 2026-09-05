import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://colegio-giglioli-links.netlify.app"),
  title: {
    default: "Colégio Giglioli | Uma constelação de aprendizagem",
    template: "%s | Colégio Giglioli"
  },
  description: "Colégio Giglioli em Fortaleza — Educação Infantil ao 5º ano, com aprendizagem, cuidado, movimento e experiências que fazem cada aluno brilhar.",
  openGraph: {
    title: "Colégio Giglioli | Uma constelação de aprendizagem",
    description: "Conheça a Estação Giglioli e fale com a equipe de matrícula.",
    images: ["/assets/gigi-astronauta.webp"],
    type: "website",
    locale: "pt_BR"
  },
  icons: {
    icon: "/assets/logo-giglioli.webp",
    apple: "/assets/logo-giglioli.webp"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#061329",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
