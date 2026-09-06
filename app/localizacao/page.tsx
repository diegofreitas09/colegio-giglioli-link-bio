import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingMascot from "@/components/FloatingMascot";
import AnimatedSection from "@/components/AnimatedSection";
import LocationMap from "@/components/LocationMap";

export const metadata: Metadata = {
  title: "Localização | Colégio Giglioli",
  description: "Encontre o Colégio Giglioli na Rua Umarizeiras, 929, Canindezinho, Fortaleza."
};

// Usa o Place ID oficial para abrir a escola correta mesmo dentro de navegadores de apps.
const mapsRouteUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Col%C3%A9gio%20Giglioli%2C%20R.%20Umarizeiras%2C%20929%2C%20Fortaleza%20-%20CE&destination_place_id=ChIJFaMyY45NxwcRVSWyhKbvG_0";

export default function LocalizacaoPage() {
  return (
    <>
      <SiteHeader />
      <FloatingMascot />
      <main className="min-h-screen bg-[#eef7ff] pt-[78px] text-[#16314f]">
        <section className="py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
            <AnimatedSection>
              <span className="section-kicker-dark">LOCALIZAÇÃO</span>
              <h1 className="section-title-dark">Venha conhecer a nossa estação.</h1>
              <p className="section-copy-dark">R. Umarizeiras, 929 • Canindezinho • Fortaleza, Ceará.</p>
              <div className="mt-7 grid gap-3">
                <a
                  href={mapsRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-[#123c7b] px-5 py-4 text-sm font-black text-white"
                >
                  Abrir rota no Google Maps ↗
                </a>
                <a
                  href="tel:+5585999725279"
                  className="rounded-2xl border border-sky-900/10 bg-white px-5 py-4 text-sm font-black text-[#123c7b]"
                >
                  Ligar: (85) 99972-5279
                </a>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={.08}>
              <div className="overflow-hidden rounded-[30px] border border-sky-900/10 bg-white p-2 shadow-2xl shadow-sky-900/10">
                <LocationMap />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </>
  );
}
