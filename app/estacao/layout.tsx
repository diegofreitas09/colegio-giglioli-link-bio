import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/estacao" }
};

export default function EstacaoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
