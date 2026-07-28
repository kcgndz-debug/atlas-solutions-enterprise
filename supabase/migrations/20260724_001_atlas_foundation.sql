-- Atlas Foundation Migration
-- Secure multi-company foundation for Atlas.

begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  slug text not null unique,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'suspended')),
  phone text,
  email text,
  website text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  country_code text not null default 'US',
  logo_path text,
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  display_name text,
  phone text,
  avatar_path text,
  job_title text,
  is_platform_owner boolean not null default false,
  is_active boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  rank integer not null default 100,
  is_system_role boolean not null default true,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  status text not null default 'active'
    check (status in ('invited', 'active', 'inactive', 'suspended')),
  is_primary boolean not null default false,
  invited_by uuid references auth.users(id) on delete set null,
  invited_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  company_id uuid references public.companies(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_company_memberships_user on public.company_memberships(user_id);
create index if not exists idx_company_memberships_company on public.company_memberships(company_id);
create index if not exists idx_company_memberships_role on public.company_memberships(role_id);
create index if not exists idx_audit_logs_company_created on public.audit_logs(company_id, created_at desc);
create index if not exists idx_audit_logs_actor_created on public.audit_logs(actor_user_id, created_at desc);

insert into public.roles (code, name, description, rank, permissions)
values
  ('owner', 'Owner / Super Admin', 'Full platform access across all authorized companies.', 10, '{"platform_admin": true, "all": true}'::jsonb),
  ('company_admin', 'Company Admin', 'Full administrative access inside one company.', 20, '{"company_admin": true}'::jsonb),
  ('project_manager', 'Project Manager', 'Manages assigned projects, estimates, schedules, and field activity.', 30, '{"projects": "manage", "estimates": "manage", "field": "manage"}'::jsonb),
  ('estimator', 'Estimator', 'Creates and manages estimates and pricing information.', 40, '{"estimates": "manage", "pricing": "read"}'::jsonb),
  ('finance', 'Finance', 'Access to billing, payments, financial reporting, and project financials.', 40, '{"finance": "manage", "projects": "read"}'::jsonb),
  ('purchasing', 'Purchasing', 'Manages vendors, material requests, and purchase orders.', 40, '{"purchasing": "manage", "projects": "read"}'::jsonb),
  ('crew_leader', 'Crew Leader', 'Manages assigned crew work, field reports, and material requests.', 50, '{"field": "manage_assigned", "materials": "request"}'::jsonb),
  ('crew_member', 'Crew Member', 'Views assigned jobs and submits field updates.', 60, '{"field": "update_assigned"}'::jsonb),
  ('read_only', 'Read Only', 'Read-only access to authorized company records.', 90, '{"read_only": true}'::jsonb)
on conflict (code) do update
set name = excluded.name,
    description = excluded.description,
    rank = excluded.rank,
    permissions = excluded.permissions,
    updated_at = now();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, first_name, last_name, display_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.is_platform_owner(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_platform_owner and p.is_active
     from public.profiles p
     where p.user_id = check_user_id),
    false
  );
$$;

create or replace function public.is_company_member(
  check_company_id uuid,
  check_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_memberships cm
    where cm.company_id = check_company_id
      and cm.user_id = check_user_id
      and cm.status = 'active'
  );
$$;

create or replace function public.has_company_role(
  check_company_id uuid,
  allowed_role_codes text[],
  check_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_platform_owner(check_user_id)
  or exists (
    select 1
    from public.company_memberships cm
    join public.roles r on r.id = cm.role_id
    where cm.company_id = check_company_id
      and cm.user_id = check_user_id
      and cm.status = 'active'
      and r.code = any(allowed_role_codes)
  );
$$;

revoke all on function public.is_platform_owner(uuid) from public;
revoke all on function public.is_company_member(uuid, uuid) from public;
revoke all on function public.has_company_role(uuid, text[], uuid) from public;
grant execute on function public.is_platform_owner(uuid) to authenticated;
grant execute on function public.is_company_member(uuid, uuid) to authenticated;
grant execute on function public.has_company_role(uuid, text[], uuid) to authenticated;

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_entity_id text;
begin
  v_company_id := coalesce(
    case when tg_op <> 'DELETE' then nullif(to_jsonb(new) ->> 'company_id', '')::uuid end,
    case when tg_op <> 'INSERT' then nullif(to_jsonb(old) ->> 'company_id', '')::uuid end,
    case when tg_table_name = 'companies' and tg_op <> 'DELETE' then new.id end,
    case when tg_table_name = 'companies' and tg_op = 'DELETE' then old.id end
  );

  v_entity_id := coalesce(
    case when tg_op <> 'DELETE' then to_jsonb(new) ->> 'id' end,
    case when tg_op <> 'INSERT' then to_jsonb(old) ->> 'id' end,
    case when tg_table_name = 'profiles' and tg_op <> 'DELETE' then to_jsonb(new) ->> 'user_id' end,
    case when tg_table_name = 'profiles' and tg_op = 'DELETE' then to_jsonb(old) ->> 'user_id' end
  );

  insert into public.audit_logs (
    company_id, actor_user_id, action, entity_type, entity_id, old_values, new_values
  )
  values (
    v_company_id,
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    v_entity_id,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );

  return coalesce(new, old);
end;
$$;

drop trigger if exists audit_companies on public.companies;
create trigger audit_companies after insert or update or delete on public.companies
for each row execute function public.audit_row_change();

drop trigger if exists audit_profiles on public.profiles;
create trigger audit_profiles after update or delete on public.profiles
for each row execute function public.audit_row_change();

drop trigger if exists audit_company_memberships on public.company_memberships;
create trigger audit_company_memberships after insert or update or delete on public.company_memberships
for each row execute function public.audit_row_change();

drop trigger if exists audit_roles on public.roles;
create trigger audit_roles after insert or update or delete on public.roles
for each row execute function public.audit_row_change();

drop trigger if exists set_companies_updated_at on public.companies;
create trigger set_companies_updated_at before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_roles_updated_at on public.roles;
create trigger set_roles_updated_at before update on public.roles
for each row execute function public.set_updated_at();

drop trigger if exists set_memberships_updated_at on public.company_memberships;
create trigger set_memberships_updated_at before update on public.company_memberships
for each row execute function public.set_updated_at();

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.company_memberships enable row level security;
alter table public.audit_logs enable row level security;

alter table public.companies force row level security;
alter table public.profiles force row level security;
alter table public.roles force row level security;
alter table public.company_memberships force row level security;
alter table public.audit_logs force row level security;

drop policy if exists companies_select on public.companies;
create policy companies_select on public.companies
for select to authenticated
using (public.is_platform_owner() or public.is_company_member(id));

drop policy if exists companies_insert on public.companies;
create policy companies_insert on public.companies
for insert to authenticated
with check (public.is_platform_owner());

drop policy if exists companies_update on public.companies;
create policy companies_update on public.companies
for update to authenticated
using (public.is_platform_owner() or public.has_company_role(id, array['owner','company_admin']))
with check (public.is_platform_owner() or public.has_company_role(id, array['owner','company_admin']));

drop policy if exists companies_delete on public.companies;
create policy companies_delete on public.companies
for delete to authenticated
using (public.is_platform_owner());

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select to authenticated
using (
  user_id = auth.uid()
  or public.is_platform_owner()
  or exists (
    select 1
    from public.company_memberships my_membership
    join public.company_memberships target_membership
      on target_membership.company_id = my_membership.company_id
    where my_membership.user_id = auth.uid()
      and my_membership.status = 'active'
      and target_membership.user_id = profiles.user_id
      and target_membership.status = 'active'
  )
);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
for insert to authenticated
with check (user_id = auth.uid() or public.is_platform_owner());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
for update to authenticated
using (user_id = auth.uid() or public.is_platform_owner())
with check (user_id = auth.uid() or public.is_platform_owner());

drop policy if exists roles_select on public.roles;
create policy roles_select on public.roles
for select to authenticated using (true);

drop policy if exists roles_manage on public.roles;
create policy roles_manage on public.roles
for all to authenticated
using (public.is_platform_owner())
with check (public.is_platform_owner());

drop policy if exists memberships_select on public.company_memberships;
create policy memberships_select on public.company_memberships
for select to authenticated
using (
  user_id = auth.uid()
  or public.is_platform_owner()
  or public.has_company_role(company_id, array['owner','company_admin','project_manager','finance','purchasing'])
);

drop policy if exists memberships_insert on public.company_memberships;
create policy memberships_insert on public.company_memberships
for insert to authenticated
with check (
  public.is_platform_owner()
  or public.has_company_role(company_id, array['owner','company_admin'])
);

drop policy if exists memberships_update on public.company_memberships;
create policy memberships_update on public.company_memberships
for update to authenticated
using (
  public.is_platform_owner()
  or public.has_company_role(company_id, array['owner','company_admin'])
)
with check (
  public.is_platform_owner()
  or public.has_company_role(company_id, array['owner','company_admin'])
);

drop policy if exists memberships_delete on public.company_memberships;
create policy memberships_delete on public.company_memberships
for delete to authenticated
using (
  public.is_platform_owner()
  or public.has_company_role(company_id, array['owner','company_admin'])
);

drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs
for select to authenticated
using (
  public.is_platform_owner()
  or (
    company_id is not null
    and public.has_company_role(company_id, array['owner','company_admin','finance'])
  )
);

revoke all on public.companies from anon;
revoke all on public.profiles from anon;
revoke all on public.roles from anon;
revoke all on public.company_memberships from anon;
revoke all on public.audit_logs from anon;

grant select, insert, update, delete on public.companies to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.roles to authenticated;
grant select, insert, update, delete on public.company_memberships to authenticated;
grant select on public.audit_logs to authenticated;
grant usage, select on sequence public.audit_logs_id_seq to authenticated;

commit;

-- ONE-TIME OWNER BOOTSTRAP:
-- Run separately after your first Supabase Auth user signs up.
--
-- update public.profiles
-- set is_platform_owner = true
-- where user_id = (
--   select id from auth.users where email = 'YOUR-EMAIL@example.com'
-- );
