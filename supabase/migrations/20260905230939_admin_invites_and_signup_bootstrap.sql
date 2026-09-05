create table if not exists public.admin_invites (
  email text primary key,
  nome text,
  ativo boolean not null default true,
  user_id uuid references auth.users(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint admin_invites_email_lowercase check (email = lower(email))
);

alter table public.admin_invites enable row level security;

create policy admin_invites_admin_select on public.admin_invites
for select to authenticated
using (public.is_school_admin());

create policy admin_invites_admin_insert on public.admin_invites
for insert to authenticated
with check (public.is_school_admin());

create policy admin_invites_admin_update on public.admin_invites
for update to authenticated
using (public.is_school_admin())
with check (public.is_school_admin());

create policy admin_invites_admin_delete on public.admin_invites
for delete to authenticated
using (public.is_school_admin());

create or replace function public.handle_giglioli_admin_signup()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  invite public.admin_invites%rowtype;
begin
  if new.email is null then
    return new;
  end if;

  select * into invite
  from public.admin_invites
  where email = lower(new.email)
    and ativo = true
  for update;

  if found then
    insert into public.school_admins (user_id, nome)
    values (new.id, invite.nome)
    on conflict (user_id) do update set nome = excluded.nome;

    update public.admin_invites
    set user_id = new.id,
        used_at = now(),
        ativo = false
    where email = lower(new.email);
  end if;

  return new;
end;
$$;

revoke all on function public.handle_giglioli_admin_signup() from public, anon, authenticated;

drop trigger if exists on_giglioli_admin_signup on auth.users;
create trigger on_giglioli_admin_signup
after insert on auth.users
for each row execute function public.handle_giglioli_admin_signup();
