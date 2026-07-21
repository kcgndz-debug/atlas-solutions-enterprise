# ATLAS Enterprise Cloud v1.1

## Fixes in this release
- Connects explicitly to the Firestore database named `default`
- Removes the pre-bootstrap Firestore read that caused Safari to report the client as offline
- Forces Safari to download the new app code instead of an older service-worker cache
- Creates AES, Delamere Industries, and HDAV workspaces with the first owner
- Makes AES the owner's starting workspace
- Includes secure Firestore rules for use immediately after owner creation

## Phone update steps
1. Upload all files in this folder to the root of the GitHub repository.
2. Replace files when GitHub asks.
3. Commit directly to `main`.
4. Wait for Netlify to show the latest deploy as Published.
5. Close every Atlas browser tab.
6. Reopen `https://atlas-solutions-enterprise.netlify.app/?v=1.1.0`.
7. Tap Owner Setup and create the first owner.
8. After the owner opens the dashboard, copy `firestore.rules` into Firebase Firestore > Security > Edit rules and publish it.
