import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/contato" }
};

export default function ContatoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
