# Freight Tracker Email Service Setup (Simple Console Method)

## Prerequisites
- Google Cloud Project with billing enabled
- Firebase project (freight-file-tracker-v2)
- Gmail account for sending emails
- GitHub repository containing this code

## Step 1: Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `freight-file-tracker-v2`
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely - you'll need this content

## Step 2: Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Gmail API:
   - Go to APIs & Services → Library
   - Search for "Gmail API" and enable it
3. Create OAuth2 credentials:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Add authorized redirect URI: `https://developers.google.com/oauthplayground`
4. Note down your Client ID and Client Secret

## Step 3: Get Gmail Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click settings (gear icon), check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In Step 1, select "Gmail API v1" → "https://www.googleapis.com/auth/gmail.send"
5. Click "Authorize APIs" and sign in with info@spacesquare.dev
6. In Step 2, click "Exchange authorization code for tokens"
7. Copy the refresh_token value

## Step 4: Deploy to Cloud Run (Simple Console Method)

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click "Create Service"
3. Choose "Continuously deploy from a repository"
4. Connect your GitHub repository
5. Select the branch and set source location to: `cloud-run-email-service`
6. Configure service:
   - Service name: `freight-email-service`
   - Region: `us-central1`
   - Allow unauthenticated invocations: Yes
   - Port: 8080
7. Set environment variables:
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: [paste the entire JSON content from step 1]
   - `GMAIL_CLIENT_ID`: [from step 2]
   - `GMAIL_CLIENT_SECRET`: [from step 2]
   - `GMAIL_REFRESH_TOKEN`: [from step 3]
   - `GMAIL_REDIRECT_URL`: `https://developers.google.com/oauthplayground`

## Step 5: Set up Daily Schedule (Cloud Scheduler)

1. Go to [Cloud Scheduler Console](https://console.cloud.google.com/cloudscheduler)
2. Click "Create Job"
3. Configure:
   - Name: `daily-freight-digest`
   - Frequency: `0 8 * * *` (8 AM daily)
   - Timezone: Your timezone
   - Target Type: HTTP
   - URL: `https://YOUR_SERVICE_URL/send-daily-digest`
   - HTTP Method: GET
4. Click "Create"

## Step 6: Test the Service

Test manually by visiting: `https://YOUR_SERVICE_URL/send-daily-digest`

## Email Features:
- ✅ Beautiful HTML template with your branding
- ✅ Today's events highlighted in red
- ✅ Next 7 days events organized by date
- ✅ Event type icons and color coding
- ✅ Empty state handling
- ✅ Responsive design
- ✅ Professional Space Square branding

The service will send from `info@spacesquare.dev` to `info@spacesquare.dev` daily at 8 AM with all freight events.