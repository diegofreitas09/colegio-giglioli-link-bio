import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/escola" }
};

export default function EscolaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
