# Setting Up Google OAuth Credentials

Follow these steps to set up Google OAuth credentials for LazyNoteTaker:

## 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top and select "New Project"
3. Name your project (e.g., "LazyNoteTaker") and click "Create"
4. Select your new project from the dropdown once it's created

## 2. Enable Required APIs

1. Go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Google Docs API
   - Google Drive API

## 3. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: "LazyNoteTaker"
   - User support email: Your email
   - Developer contact information: Your email
   - Click "Save and Continue"
   - Add the following scopes:
     - `.../auth/documents.readonly`
     - `.../auth/drive.readonly`
   - Click "Save and Continue"
   - Add yourself as a test user
   - Click "Save and Continue"

4. Create OAuth client ID:
   - Application type: Web application
   - Name: "LazyNoteTaker Web Client"
   - Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
   - Click "Create"

5. Note your Client ID and Client Secret

## 4. Update Your Application

1. Open the file `/d:/Projects/LazyNoteTaker/src/config/credentials.js`
2. Replace 'YOUR_CLIENT_ID_HERE' with your actual Client ID
3. Replace 'YOUR_CLIENT_SECRET_HERE' with your actual Client Secret

## 5. Run Your Application

Now your application should successfully authenticate with Google.

## Troubleshooting

If you still see authorization errors:

1. Verify that the redirect URI exactly matches what you entered in Google Cloud Console
2. Make sure the required APIs are enabled
3. Check if you're still in the testing phase and your email is added as a test user
4. Verify that the scopes requested match what you've configured
