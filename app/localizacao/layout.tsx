import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/localizacao" }
};

export default function LocalizacaoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
