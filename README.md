# ATLAS Enterprise V2.1.1 — Black Screen Hotfix

Fixes:
- Prevents a missing page control from stopping application startup.
- Adds a visible startup error page instead of a blank black screen.
- Removes fragile inline customer-mode handlers.
- Adds missing tax and equipment-contingency controls.
- Forces a fresh service-worker cache.
- Preserves the V2.1 existing/new customer workflow.

Deployment:
1. Upload every file to the GitHub repository root and replace the old files.
2. Commit directly to main.
3. Wait for Netlify to show Published.
4. Open https://atlas-solutions-enterprise.netlify.app/?v=2.1.1 in Safari.
