# ATLAS Enterprise Cloud v1

## Deployment
1. Upload all files to the root of the `atlas-solutions-enterprise` GitHub repository.
2. Netlify will deploy automatically.
3. In Firebase: Firestore > Security > Rules. Paste the contents of `firestore.rules` and publish.
4. Open the Netlify URL. Paste your Firebase configuration JSON.
5. Use **Owner Setup** once to create the first owner account.

## Included
Firebase authentication, first-owner bootstrap, company workspaces, Delamere starter database, customers, estimates, offline Firestore persistence, PWA installation, Netlify configuration, and production Firestore rules.

Storage and cloud file uploads remain disabled until billing is enabled.
