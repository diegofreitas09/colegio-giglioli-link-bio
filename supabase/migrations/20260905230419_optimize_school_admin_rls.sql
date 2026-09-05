drop policy if exists school_admins_select_self on public.school_admins;
create policy school_admins_select_self on public.school_admins
for select to authenticated
using ((select auth.uid()) = user_id);
