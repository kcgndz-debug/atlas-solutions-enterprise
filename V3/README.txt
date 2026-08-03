ATLAS ENTERPRISE V4 — ADMIN + DEMO FOUNDATION

WHAT THIS VERSION DOES
- Keeps the stable dashboard, project cards, smart first-name greeting, scheduler, crew operations, materials, finance, and Mission Control in one clean codebase.
- Adds realistic presentation data across five project managers: Kendall, John, Javier, Mike, and Peter.
- Includes 25+ Delamere projects, bids, crews, schedules, materials, finance values, conflicts, and activity.
- Includes working local Add User, roles, companies, and privileges.
- Includes production Supabase sign-in.
- Reads the production user directory directly from profiles, company_memberships, companies, and roles.
- Uses one secured Edge Function only for privileged authentication actions such as sending invitations and enabling/disabling users.

QUICK LOCAL TEST
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Run:
   npx.cmd serve . -l 3012
4. Open:
   http://localhost:3012
5. Select Open Owner Demo.

PRODUCTION USER SETUP
1. Run:
   supabase/migrations/20260803_v4_foundation.sql
   in Supabase SQL Editor.
2. Deploy:
   supabase functions deploy atlas-admin-users
3. In Supabase Authentication > URL Configuration, add:
   http://localhost:3012/**
   and the live Atlas URL.
4. Create or update your owner profile:
   is_active = true
   is_platform_owner = true
   first_name / last_name / display_name populated.
5. Sign in, choose Delamere Industries, open User Management, and select Add User.

WHY USER LISTING IS MORE RELIABLE
The page reads authorized profiles and memberships directly through RLS. A failed Edge Function does not leave the directory blank. The Edge Function is used only when Atlas must securely call Supabase Auth Admin.

SECURITY
Never put SUPABASE_SERVICE_ROLE_KEY in config.js, app.js, Netlify environment exposed to the browser, or any client-side file.
