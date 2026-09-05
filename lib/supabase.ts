import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { persistSession: true } });
  return client;
}

export type MuralPost = {
  id: string;
  titulo: string;
  texto: string | null;
  imagem_url: string | null;
  categoria: string | null;
  instagram_url: string | null;
  publicado_em: string | null;
};

export type Comentario = {
  id: string;
  nome: string;
  depoimento: string;
  origem_url: string | null;
};
