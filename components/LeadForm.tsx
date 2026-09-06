"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "5585999725279";

type FormStatus = "idle" | "sending" | "fallback";

const birthMonths = [
  ["01", "Janeiro"],
  ["02", "Fevereiro"],
  ["03", "Março"],
  ["04", "Abril"],
  ["05", "Maio"],
  ["06", "Junho"],
  ["07", "Julho"],
  ["08", "Agosto"],
  ["09", "Setembro"],
  ["10", "Outubro"],
  ["11", "Novembro"],
  ["12", "Dezembro"]
] as const;

const currentYear = new Date().getFullYear();
const birthYears = Array.from({ length: 20 }, (_, index) => currentYear - index);
const birthDays = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));

function formatBirthDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function isValidDate(year: string, month: string, day: string) {
  if (!year || !month || !day) return false;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return (
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
  );
}

export default function LeadForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const responsavel = String(form.get("responsavel") || "").trim();
    const aluno = String(form.get("aluno") || "").trim();
    const diaNascimento = String(form.get("dia_nascimento") || "").trim();
    const mesNascimento = String(form.get("mes_nascimento") || "").trim();
    const anoNascimento = String(form.get("ano_nascimento") || "").trim();
    const telefone = String(form.get("telefone") || "").trim();
    const serie = String(form.get("serie") || "").trim();
    const turnoPreferencia = String(form.get("turno_preferencia") || "").trim();
    const mensagem = String(form.get("mensagem") || "").trim();

    if (!isValidDate(anoNascimento, mesNascimento, diaNascimento)) {
      setStatus("fallback");
      setMessage("Confira a data de nascimento informada.");
      return;
    }

    const dataNascimento = `${anoNascimento}-${mesNascimento}-${diaNascimento}`;

    const whatsappMessage = [
      "Olá! Vim pelo site do Colégio Giglioli e gostaria de informações sobre matrícula. 🚀✨",
      "",
      `Responsável: ${responsavel}`,
      `Aluno(a): ${aluno}`,
      `Data de nascimento: ${formatBirthDate(dataNascimento)}`,
      `Telefone: ${telefone}`,
      `Série de interesse: ${serie}`,
      `Preferência de turno: ${turnoPreferencia}`,
      mensagem ? `Mensagem: ${mensagem}` : ""
    ].filter(Boolean).join("\n");

    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    setStatus("sending");
    setMessage("Registrando seus dados e abrindo o WhatsApp...");

    try {
      const supabase = getSupabaseBrowserClient();

      if (supabase) {
        const { error } = await supabase.from("matricula_leads").insert({
          nome: responsavel,
          aluno,
          data_nascimento: dataNascimento,
          telefone,
          segmento: serie,
          turno_preferencia: turnoPreferencia || null,
          mensagem: mensagem || null,
          origem: "site",
          status: "novo"
        });

        if (error) {
          console.error("Erro ao registrar interesse de matrícula:", error.message);
        }
      }

      formEl.reset();
      window.location.assign(whatsappUrl);
    } catch (error) {
      console.error("Falha inesperada no formulário de matrícula:", error);
      setStatus("fallback");
      setMessage("Abrindo o WhatsApp para concluir seu atendimento...");
      window.location.assign(whatsappUrl);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur-md">
      <label className="form-label">
        Nome do responsável
        <input className="form-input" name="responsavel" required autoComplete="name" placeholder="Seu nome" />
      </label>

      <label className="form-label">
        Nome da criança
        <input className="form-input" name="aluno" required placeholder="Nome da criança" />
      </label>

      <fieldset className="min-w-0">
        <legend className="form-label mb-2">Data de nascimento do aluno</legend>
        <div className="grid grid-cols-[.8fr_1.35fr_1fr] gap-2">
          <select className="form-input min-w-0 px-3" name="dia_nascimento" required defaultValue="" aria-label="Dia de nascimento">
            <option value="" disabled>Dia</option>
            {birthDays.map((day) => <option key={day} value={day}>{day}</option>)}
          </select>

          <select className="form-input min-w-0 px-3" name="mes_nascimento" required defaultValue="" aria-label="Mês de nascimento">
            <option value="" disabled>Mês</option>
            {birthMonths.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          <select className="form-input min-w-0 px-3" name="ano_nascimento" required defaultValue="" aria-label="Ano de nascimento">
            <option value="" disabled>Ano</option>
            {birthYears.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <p className="mt-2 text-[10px] font-bold text-slate-300">Escolha dia, mês e ano. No celular, o ano pode ser selecionado diretamente.</p>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="form-label">
          Telefone
          <input className="form-input" name="telefone" required inputMode="tel" autoComplete="tel" placeholder="(85) 99999-9999" />
        </label>

        <label className="form-label">
          Série de interesse
          <select className="form-input" name="serie" required defaultValue="">
            <option value="" disabled>Selecione</option>
            <option>Infantil 2</option>
            <option>Infantil 3</option>
            <option>Infantil 4</option>
            <option>Infantil 5</option>
            <option>1º ano</option>
            <option>2º ano</option>
            <option>3º ano</option>
            <option>4º ano</option>
            <option>5º ano</option>
          </select>
        </label>
      </div>

      <label className="form-label">
        Preferência de turno
        <select className="form-input" name="turno_preferencia" required defaultValue="">
          <option value="" disabled>Selecione o turno</option>
          <option>Manhã</option>
          <option>Tarde</option>
          <option>Indiferente</option>
        </select>
      </label>

      <label className="form-label">
        Mensagem
        <textarea className="form-input min-h-24 resize-y" name="mensagem" placeholder="Conte o que você gostaria de saber" />
      </label>

      <label className="flex items-start gap-2 text-[11px] font-bold leading-relaxed text-slate-300">
        <input type="checkbox" required className="mt-1" />
        Autorizo o contato do Colégio Giglioli para responder esta solicitação.
      </label>

      <button disabled={status === "sending"} className="rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-4 text-sm font-black text-[#082047] shadow-xl shadow-orange-500/20 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
        {status === "sending" ? "Abrindo WhatsApp..." : "Enviar solicitação pelo WhatsApp →"}
      </button>

      {status !== "idle" && (
        <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm font-extrabold leading-relaxed text-sky-100" role="status" aria-live="polite">
          {message}
        </div>
      )}
    </form>
  );
}
