-- Colégio Giglioli — Site institucional / PWA
create extension if not exists pgcrypto;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_giglioli_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.site_admins where user_id = auth.uid());
$$;

grant execute on function public.is_giglioli_admin() to anon, authenticated;

create table if not exists public.mural_posts (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  texto text,
  imagem_url text,
  categoria text,
  instagram_url text,
  publicado boolean not null default false,
  ordem integer not null default 0,
  publicado_em timestamptz,
  criado_por uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comentarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 100),
  depoimento text not null check (char_length(depoimento) between 3 and 600),
  origem_url text,
  aprovado boolean not null default false,
  destaque boolean not null default false,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  responsavel text not null,
  aluno text,
  telefone text not null,
  serie text,
  mensagem text,
  origem text not null default 'site',
  created_at timestamptz not null default now()
);

create index if not exists mural_posts_public_idx on public.mural_posts(publicado, ordem, publicado_em desc);
create index if not exists comentarios_public_idx on public.comentarios(aprovado, destaque desc, ordem);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

alter table public.site_admins enable row level security;
alter table public.mural_posts enable row level security;
alter table public.comentarios enable row level security;
alter table public.leads enable row level security;

drop policy if exists "site_admins self read" on public.site_admins;
create policy "site_admins self read" on public.site_admins for select to authenticated using (user_id = auth.uid());

drop policy if exists "mural public read" on public.mural_posts;
create policy "mural public read" on public.mural_posts for select to anon, authenticated using (publicado = true);

drop policy if exists "mural admin all" on public.mural_posts;
create policy "mural admin all" on public.mural_posts for all to authenticated using (public.is_giglioli_admin()) with check (public.is_giglioli_admin());

drop policy if exists "comentarios public read" on public.comentarios;
create policy "comentarios public read" on public.comentarios for select to anon, authenticated using (aprovado = true);

drop policy if exists "comentarios public submit" on public.comentarios;
create policy "comentarios public submit" on public.comentarios for insert to anon, authenticated with check (aprovado = false and destaque = false);

drop policy if exists "comentarios admin all" on public.comentarios;
create policy "comentarios admin all" on public.comentarios for all to authenticated using (public.is_giglioli_admin()) with check (public.is_giglioli_admin());

drop policy if exists "leads public insert" on public.leads;
create policy "leads public insert" on public.leads for insert to anon, authenticated with check (true);

drop policy if exists "leads admin read" on public.leads;
create policy "leads admin read" on public.leads for select to authenticated using (public.is_giglioli_admin());

drop policy if exists "leads admin update" on public.leads;
create policy "leads admin update" on public.leads for update to authenticated using (public.is_giglioli_admin()) with check (public.is_giglioli_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mural', 'mural', true, 6291456, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "mural storage public read" on storage.objects;
create policy "mural storage public read" on storage.objects for select to public using (bucket_id = 'mural');

drop policy if exists "mural storage admin insert" on storage.objects;
create policy "mural storage admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'mural' and public.is_giglioli_admin());

drop policy if exists "mural storage admin update" on storage.objects;
create policy "mural storage admin update" on storage.objects for update to authenticated using (bucket_id = 'mural' and public.is_giglioli_admin()) with check (bucket_id = 'mural' and public.is_giglioli_admin());

drop policy if exists "mural storage admin delete" on storage.objects;
create policy "mural storage admin delete" on storage.objects for delete to authenticated using (bucket_id = 'mural' and public.is_giglioli_admin());
