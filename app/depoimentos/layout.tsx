import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/depoimentos" }
};

export default function DepoimentosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
