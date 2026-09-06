import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/mural" }
};

export default function MuralLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
