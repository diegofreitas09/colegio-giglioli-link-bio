import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./hero.css";
import PwaRegister from "@/components/PwaRegister";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colegio-giglioli-links.netlify.app";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Colégio Giglioli | Educação Infantil ao 5º ano em Fortaleza",
    template: "%s | Colégio Giglioli"
  },
  description: "Colégio Giglioli em Fortaleza — Educação Infantil ao 5º ano, inglês desde o Infantil II, natação, ballet, hidroginástica e recreação direcionada.",
  keywords: [
    "Colégio Giglioli",
    "escola em Fortaleza",
    "escola no Canindezinho",
    "Educação Infantil Fortaleza",
    "Ensino Fundamental Fortaleza",
    "Infantil II",
    "5º ano",
    "matrículas escola Fortaleza"
  ],
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  verification: googleVerification ? { google: googleVerification } : undefined,
  openGraph: {
    title: "Colégio Giglioli | Uma constelação de aprendizagem",
    description: "Conheça a Estação Giglioli e fale com a equipe de matrícula.",
    url: siteUrl,
    siteName: "Colégio Giglioli",
    images: ["/assets/gigi-astronauta.webp"],
    type: "website",
    locale: "pt_BR"
  },
  twitter: {
    card: "summary_large_image",
    title: "Colégio Giglioli | Uma constelação de aprendizagem",
    description: "Educação Infantil ao 5º ano em Fortaleza.",
    images: ["/assets/gigi-astronauta.webp"]
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

const schoolJsonLd = {
  "@context": "https://schema.org",
  "@type": "School",
  name: "Colégio Giglioli",
  url: siteUrl,
  image: `${siteUrl}/assets/logo-giglioli.webp`,
  telephone: "+55 85 99972-5279",
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Umarizeiras, 929",
    addressLocality: "Fortaleza",
    addressRegion: "CE",
    postalCode: "60810-670",
    addressCountry: "BR"
  },
  sameAs: ["https://www.instagram.com/colegio.giglioli/"],
  areaServed: "Fortaleza, Ceará",
  description: "Escola de Educação Infantil ao 5º ano do Ensino Fundamental em Fortaleza."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <GoogleAnalytics />
        <PwaRegister />
      </body>
    </html>
  );
}
