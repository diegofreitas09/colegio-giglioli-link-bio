alter table public.site_collections
  add column if not exists data_evento date;

comment on column public.site_collections.data_evento is
  'Data principal do projeto, evento ou conteúdo apresentado no módulo.';
