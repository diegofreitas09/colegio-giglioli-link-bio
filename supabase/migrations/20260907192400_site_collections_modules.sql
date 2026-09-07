create table if not exists public.site_collections (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('estrutura','parceiros','projetos','campanhas')),
  titulo text not null,
  descricao text,
  imagem_url text,
  link_url text,
  link_label text,
  publicado boolean not null default false,
  destaque boolean not null default false,
  ordem integer not null default 100,
  inicio_em timestamptz,
  fim_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_collections_public_idx on public.site_collections(section, publicado, destaque desc, ordem, created_at desc);

drop trigger if exists site_collections_set_updated_at on public.site_collections;
create trigger site_collections_set_updated_at
before update on public.site_collections
for each row execute function public.set_updated_at();

alter table public.site_collections enable row level security;

create policy site_collections_public_read on public.site_collections
for select to anon, authenticated
using (publicado = true or public.is_school_admin());

create policy site_collections_admin_insert on public.site_collections
for insert to authenticated
with check (public.is_school_admin());

create policy site_collections_admin_update on public.site_collections
for update to authenticated
using (public.is_school_admin())
with check (public.is_school_admin());

create policy site_collections_admin_delete on public.site_collections
for delete to authenticated
using (public.is_school_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media-public', 'site-media-public', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy site_media_admin_insert on storage.objects
for insert to authenticated
with check (bucket_id = 'site-media-public' and public.is_school_admin());

create policy site_media_admin_update on storage.objects
for update to authenticated
using (bucket_id = 'site-media-public' and public.is_school_admin())
with check (bucket_id = 'site-media-public' and public.is_school_admin());

create policy site_media_admin_delete on storage.objects
for delete to authenticated
using (bucket_id = 'site-media-public' and public.is_school_admin());