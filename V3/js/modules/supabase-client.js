(() => {
  "use strict";

  const SUPABASE_URL = "https://hoiwyekhesluaqmtqkbs.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_gvvJkY5cpVBeN7tpq1_3pg_bwzdbAFX";

  if (!window.supabase) {
    console.error("Supabase library failed to load.");
    return;
  }

  window.atlasSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("Atlas Supabase client initialized.");
})();