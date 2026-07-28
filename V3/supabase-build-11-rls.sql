-- Atlas Build 11 RLS foundation
-- REVIEW AND ADAPT TABLE/COLUMN NAMES BEFORE RUNNING IN PRODUCTION.

create or replace function public.atlas_profile()
returns public.profiles
language sql
stable
security definer
set search_path = public
as $$
  select p from public.profiles p where p.user_id = auth.uid() limit 1;
$$;

create or replace function public.atlas_is_platform_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_platform_owner from public.profiles where user_id = auth.uid()), false);
$$;

create or replace function public.atlas_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select nullif((preferences->>'company_id'), '')::uuid
  from public.profiles where user_id = auth.uid();
$$;

create or replace function public.atlas_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case when is_platform_owner then 'platform-owner'
    else coalesce(preferences->>'role', 'crew-member') end
  from public.profiles where user_id = auth.uid();
$$;

-- Example for every company-scoped table:
-- alter table public.projects enable row level security;
-- create policy "projects_company_read" on public.projects for select
-- using (public.atlas_is_platform_owner() or company_id = public.atlas_company_id());
-- create policy "projects_company_write" on public.projects for all
-- using (
--   public.atlas_is_platform_owner() or
--   (company_id = public.atlas_company_id() and public.atlas_role() in
--    ('company-owner','company-admin','operations-manager','project-manager'))
-- )
-- with check (
--   public.atlas_is_platform_owner() or
--   (company_id = public.atlas_company_id() and public.atlas_role() in
--    ('company-owner','company-admin','operations-manager','project-manager'))
-- );

-- Assigned-project policies should use a membership table in production:
-- project_assignments(project_id uuid, user_id uuid, assignment_role text, company_id uuid)
-- and allow project access when an assignment exists for auth.uid().
