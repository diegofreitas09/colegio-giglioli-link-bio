import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Política de Privacidade | Colégio Giglioli",
  description: "Saiba como o site do Colégio Giglioli utiliza dados de contato, recursos essenciais e ferramentas de análise."
};

export default function PrivacidadePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f7fbff] pt-[110px] text-[#16314f]">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <span className="section-kicker-dark">PRIVACIDADE • LGPD</span>
          <h1 className="mt-3 font-[var(--font-display)] text-4xl font-black leading-tight text-[#123c7b] sm:text-5xl">Política de Privacidade</h1>
          <p className="mt-5 font-bold leading-7 text-slate-600">
            Esta página explica, de forma objetiva, quais dados podem ser tratados quando você utiliza o site do Colégio Giglioli.
          </p>

          <div className="mt-10 grid gap-5">
            <article className="rounded-[26px] border border-sky-900/10 bg-white p-6 shadow-lg shadow-sky-900/5">
              <h2 className="font-[var(--font-display)] text-2xl font-black text-[#123c7b]">Dados enviados por você</h2>
              <p className="mt-3 font-bold leading-7 text-slate-600">Nos formulários de matrícula e depoimento, podem ser informados dados como nome, telefone, nome do aluno, data de nascimento, série de interesse, turno e mensagem. Esses dados são usados para atendimento, matrícula, retorno de contato e moderação de depoimentos.</p>
            </article>

            <article className="rounded-[26px] border border-sky-900/10 bg-white p-6 shadow-lg shadow-sky-900/5">
              <h2 className="font-[var(--font-display)] text-2xl font-black text-[#123c7b]">Google Analytics</h2>
              <p className="mt-3 font-bold leading-7 text-slate-600">O Google Analytics somente é carregado quando você aceita o uso de Analytics no aviso de privacidade. Ele é utilizado para medir visitas e melhorar o site. A configuração do site utiliza anonimização de IP quando disponível.</p>
            </article>

            <article className="rounded-[26px] border border-sky-900/10 bg-white p-6 shadow-lg shadow-sky-900/5">
              <h2 className="font-[var(--font-display)] text-2xl font-black text-[#123c7b]">Serviços utilizados</h2>
              <p className="mt-3 font-bold leading-7 text-slate-600">O site pode utilizar serviços de infraestrutura e atendimento, como Netlify, Supabase, Google Analytics, Google Maps e WhatsApp. Ao abrir serviços externos, aplicam-se também as políticas do respectivo fornecedor.</p>
            </article>

            <article className="rounded-[26px] border border-sky-900/10 bg-white p-6 shadow-lg shadow-sky-900/5">
              <h2 className="font-[var(--font-display)] text-2xl font-black text-[#123c7b]">Sua escolha de cookies</h2>
              <p className="mt-3 font-bold leading-7 text-slate-600">O site registra no armazenamento local do navegador sua preferência entre recursos essenciais e Analytics. Você pode apagar os dados do site no navegador para refazer essa escolha.</p>
            </article>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/contato" className="rounded-full bg-[#123c7b] px-6 py-3 text-sm font-black text-white">Falar com a escola</a>
            <a href="/" className="rounded-full border border-sky-900/10 bg-white px-6 py-3 text-sm font-black text-[#123c7b]">Voltar ao site</a>
          </div>
        </section>
      </main>
    </>
  );
}
