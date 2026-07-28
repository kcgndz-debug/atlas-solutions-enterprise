# Atlas V3 Build 11 — Role-Based Access Control

Build 11 is cumulative and replaces Build 10.

## Added
- Ten enterprise roles from Platform Owner through Customer
- Dynamic sidebar based on the authenticated user's permissions
- Protected view routing with safe role-specific landing pages
- Company workspace lock for non-platform users
- Assigned-project filtering for PM, crew, estimator, and customer roles
- Edit/delete authorization checks
- User Management workspace and role access matrix
- Supabase RLS deployment template
- Updated offline/PWA cache

## Profile configuration
Build 11 reads role and company assignments from `profiles.preferences` so it remains compatible with the current profiles table.

Example preferences JSON:
```json
{
  "role": "project-manager",
  "company_id": "COMPANY_UUID",
  "company_name": "Delamere Industries",
  "assigned_project_ids": ["p1", "p2"]
}
```

Platform owners continue to use `is_platform_owner = true`.

## Important production step
Browser permissions improve the interface, but database security requires the included `supabase-build-11-rls.sql` policies to be adapted to the exact production table names and deployed in Supabase. Do not deploy the template without reviewing table and column names.
