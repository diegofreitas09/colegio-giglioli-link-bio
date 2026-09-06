import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacidade" }
};

export default function PrivacidadeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
