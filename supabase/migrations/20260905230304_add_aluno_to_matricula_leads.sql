alter table public.matricula_leads
add column if not exists aluno text;

create index if not exists matricula_leads_aluno_idx
on public.matricula_leads(aluno);
