# ATLAS Enterprise Cloud v1.2

## Fix
Atlas now accepts the exact Firebase Config snippet copied from Firebase Console:
- comments are allowed
- `const firebaseConfig =` is allowed
- unquoted JavaScript field names are allowed
- the ending semicolon is allowed

The update clears the damaged saved Firebase configuration once and asks for a fresh copy.

## Deploy
1. Upload every file in this folder to the GitHub repository root.
2. Commit directly to `main`.
3. Wait for Netlify to publish.
4. Close all Atlas tabs.
5. Open `https://atlas-solutions-enterprise.netlify.app/?v=1.2.0`
6. In Firebase: Project settings > General > Your apps > Atlas Enterprise Web > Config.
7. Tap Firebase's copy button.
8. Paste the entire copied snippet into Atlas without editing.
9. Tap Connect Atlas, then create the owner.
