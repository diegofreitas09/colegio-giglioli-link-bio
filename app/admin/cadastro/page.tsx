"use client";

import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminCadastroPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) {
      setMessage("A conexão administrativa ainda não está disponível.");
      return;
    }
    if (password.length < 8) {
      setMessage("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("As senhas não conferem.");
      return;
    }

    setBusy(true);
    setMessage("Criando acesso...");
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` }
    });

    if (error) {
      setBusy(false);
      setMessage(error.message.includes("already registered") ? "Este e-mail já possui cadastro. Use a tela de login." : "Não foi possível criar o acesso agora.");
      return;
    }

    if (data.session?.user) {
      const { data: admin } = await supabase
        .from("school_admins")
        .select("user_id")
        .eq("user_id", data.session.user.id)
        .maybeSingle();

      setBusy(false);
      if (admin) {
        window.location.href = "/admin";
        return;
      }
      setMessage("Cadastro criado, mas este e-mail não está autorizado como administrador.");
      await supabase.auth.signOut();
      return;
    }

    setBusy(false);
    setMessage("Cadastro recebido. Confira seu e-mail para confirmar o acesso e depois entre no painel administrativo.");
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#061329] px-4 py-10 text-white">
      <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_20%_20%,rgba(39,183,238,.22),transparent_26%),radial-gradient(circle_at_82%_12%,rgba(255,158,61,.16),transparent_24%),radial-gradient(circle_at_60%_85%,rgba(255,220,68,.10),transparent_25%)]" />

      <form onSubmit={submit} className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/7 p-7 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[.22em] text-sky-300">Primeiro acesso</p>
        <h1 className="mt-2 font-[var(--font-display)] text-4xl font-extrabold">Painel Giglioli</h1>
        <p className="mt-3 text-sm font-bold leading-relaxed text-slate-300">
          Crie sua senha administrativa. Apenas e-mails previamente autorizados pela escola recebem acesso ao painel.
        </p>

        <label className="mt-6 grid gap-2 text-xs font-black text-slate-200">
          E-mail autorizado
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-300" placeholder="seu@email.com" />
        </label>

        <label className="mt-4 grid gap-2 text-xs font-black text-slate-200">
          Criar senha
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-300" placeholder="Mínimo de 8 caracteres" />
        </label>

        <label className="mt-4 grid gap-2 text-xs font-black text-slate-200">
          Confirmar senha
          <input type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-300" placeholder="Repita a senha" />
        </label>

        <button disabled={busy} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-orange-400 to-yellow-300 px-5 py-4 text-sm font-black text-[#082047] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70">
          {busy ? "Criando acesso..." : "Criar acesso administrativo →"}
        </button>

        <p className="mt-4 min-h-10 rounded-2xl bg-white/5 px-4 py-3 text-xs font-bold leading-relaxed text-slate-200" aria-live="polite">{message}</p>

        <div className="mt-5 flex items-center justify-between gap-3 text-xs font-black">
          <a href="/admin" className="text-sky-300 hover:text-white">Já tenho acesso</a>
          <a href="/" className="text-slate-400 hover:text-white">Voltar ao site</a>
        </div>
      </form>
    </main>
  );
}
