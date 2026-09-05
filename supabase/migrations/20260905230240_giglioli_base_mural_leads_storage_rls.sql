-- Colégio Giglioli — base do site, mural, depoimentos, leads e Storage
create extension if not exists pgcrypto;

create table if not exists public.school_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  created_at timestamptz not null default now()
);

create or replace function public.is_school_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.school_admins sa where sa.user_id = auth.uid()
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.mural_posts (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  texto text,
  imagem_url text,
  categoria text,
  instagram_url text,
  publicado boolean not null default false,
  destaque boolean not null default false,
  ordem integer not null default 100,
  publicado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comentarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 120),
  depoimento text not null check (char_length(depoimento) between 3 and 600),
  origem_url text,
  aprovado boolean not null default false,
  destaque boolean not null default false,
  ordem integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matricula_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 120),
  telefone text not null check (char_length(telefone) between 8 and 30),
  email text,
  segmento text,
  mensagem text,
  origem text not null default 'site',
  status text not null default 'novo' check (status in ('novo','contatado','visita_agendada','matricula_em_andamento','matriculado','encerrado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mural_posts_publicados_idx on public.mural_posts(publicado, ordem, publicado_em desc);
create index if not exists comentarios_aprovados_idx on public.comentarios(aprovado, destaque desc, ordem, created_at desc);
create index if not exists matricula_leads_status_created_idx on public.matricula_leads(status, created_at desc);

drop trigger if exists mural_posts_set_updated_at on public.mural_posts;
create trigger mural_posts_set_updated_at before update on public.mural_posts for each row execute function public.set_updated_at();

drop trigger if exists comentarios_set_updated_at on public.comentarios;
create trigger comentarios_set_updated_at before update on public.comentarios for each row execute function public.set_updated_at();

drop trigger if exists matricula_leads_set_updated_at on public.matricula_leads;
create trigger matricula_leads_set_updated_at before update on public.matricula_leads for each row execute function public.set_updated_at();

alter table public.school_admins enable row level security;
alter table public.mural_posts enable row level security;
alter table public.comentarios enable row level security;
alter table public.matricula_leads enable row level security;

create policy school_admins_select_self on public.school_admins
for select to authenticated
using (auth.uid() = user_id);

create policy mural_public_read_published on public.mural_posts
for select to anon, authenticated
using (publicado = true or public.is_school_admin());
create policy mural_admin_insert on public.mural_posts
for insert to authenticated with check (public.is_school_admin());
create policy mural_admin_update on public.mural_posts
for update to authenticated using (public.is_school_admin()) with check (public.is_school_admin());
create policy mural_admin_delete on public.mural_posts
for delete to authenticated using (public.is_school_admin());

create policy comentarios_public_read_approved on public.comentarios
for select to anon, authenticated
using (aprovado = true or public.is_school_admin());
create policy comentarios_public_submit_for_moderation on public.comentarios
for insert to anon, authenticated
with check (aprovado = false and destaque = false);
create policy comentarios_admin_update on public.comentarios
for update to authenticated using (public.is_school_admin()) with check (public.is_school_admin());
create policy comentarios_admin_delete on public.comentarios
for delete to authenticated using (public.is_school_admin());

create policy leads_public_insert on public.matricula_leads
for insert to anon, authenticated
with check (status = 'novo');
create policy leads_admin_select on public.matricula_leads
for select to authenticated using (public.is_school_admin());
create policy leads_admin_update on public.matricula_leads
for update to authenticated using (public.is_school_admin()) with check (public.is_school_admin());
create policy leads_admin_delete on public.matricula_leads
for delete to authenticated using (public.is_school_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mural-public', 'mural-public', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy mural_storage_admin_insert on storage.objects
for insert to authenticated
with check (bucket_id = 'mural-public' and public.is_school_admin());
create policy mural_storage_admin_update on storage.objects
for update to authenticated
using (bucket_id = 'mural-public' and public.is_school_admin())
with check (bucket_id = 'mural-public' and public.is_school_admin());
create policy mural_storage_admin_delete on storage.objects
for delete to authenticated
using (bucket_id = 'mural-public' and public.is_school_admin());
