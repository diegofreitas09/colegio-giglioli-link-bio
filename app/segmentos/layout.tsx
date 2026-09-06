import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/segmentos" }
};

export default function SegmentosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
