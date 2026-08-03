-- Atlas Enterprise V4 foundation.
-- Run in Supabase SQL Editor.

begin;

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  display_name text,
  is_active boolean not null default true,
  is_platform_owner boolean not null default false,
  invite_status text not null default 'active',
  invited_at timestamptz,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.company_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(company_id,user_id)
);

insert into public.roles(code,display_name) values
('owner','Owner / Superuser'),
('company_admin','Company Admin'),
('project_manager','Project Manager'),
('estimator','Estimator'),
('finance','Finance'),
('crew_leader','Crew Lead'),
('crew_member','Crew Member'),
('purchasing','Purchasing'),
('read_only','Read Only')
on conflict(code) do update set display_name=excluded.display_name;

insert into public.companies(name,slug) values
('Delamere Industries','delamere-industries'),
('Day Metal','day-metal')
on conflict(slug) do update set name=excluded.name;

alter table public.profiles enable row level security;
alter table public.company_memberships enable row level security;
alter table public.companies enable row level security;
alter table public.roles enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select to authenticated using (
  user_id=auth.uid()
  or exists(
    select 1 from public.profiles p
    where p.user_id=auth.uid() and p.is_platform_owner=true and p.is_active=true
  )
  or exists(
    select 1
    from public.company_memberships mine
    join public.roles r on r.id=mine.role_id
    join public.company_memberships theirs on theirs.company_id=mine.company_id
    where mine.user_id=auth.uid()
      and mine.is_active=true
      and r.code in ('owner','company_admin')
      and theirs.user_id=profiles.user_id
  )
);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());

drop policy if exists "memberships read authorized" on public.company_memberships;
create policy "memberships read authorized" on public.company_memberships for select to authenticated using(
  user_id=auth.uid()
  or exists(select 1 from public.profiles p where p.user_id=auth.uid() and p.is_platform_owner=true and p.is_active=true)
  or exists(
    select 1 from public.company_memberships mine
    join public.roles r on r.id=mine.role_id
    where mine.user_id=auth.uid()
      and mine.company_id=company_memberships.company_id
      and mine.is_active=true
      and r.code in ('owner','company_admin')
  )
);

drop policy if exists "companies read membership" on public.companies;
create policy "companies read membership" on public.companies for select to authenticated using(
  exists(select 1 from public.company_memberships m where m.company_id=companies.id and m.user_id=auth.uid() and m.is_active=true)
  or exists(select 1 from public.profiles p where p.user_id=auth.uid() and p.is_platform_owner=true and p.is_active=true)
);

drop policy if exists "roles readable" on public.roles;
create policy "roles readable" on public.roles for select to authenticated using(true);

commit;
