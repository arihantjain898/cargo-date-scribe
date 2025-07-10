# Freight Tracker Email Service Setup

## Prerequisites
1. **Firebase Service Account Key**
2. **Gmail API Credentials** (OAuth2)
3. **GCP Project** with Cloud Run and Cloud Scheduler APIs enabled

## Step 1: Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `freight-file-tracker-v2`
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely

## Step 2: Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable Gmail API:
   ```bash
   gcloud services enable gmail.googleapis.com
   ```
4. Go to APIs & Services → Credentials
5. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Freight Email Service
   - Authorized redirect URIs: `http://localhost:3000/oauth2callback`
6. Note the Client ID and Client Secret

### Get Refresh Token:
1. Use this URL (replace YOUR_CLIENT_ID):
   ```
   https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/oauth2callback&scope=https://www.googleapis.com/auth/gmail.send&access_type=offline&response_type=code
   ```
2. Authorize and get the code from the callback URL
3. Exchange code for refresh token:
   ```bash
   curl -X POST https://oauth2.googleapis.com/token \
     -d client_id=YOUR_CLIENT_ID \
     -d client_secret=YOUR_CLIENT_SECRET \
     -d code=YOUR_CODE \
     -d grant_type=authorization_code \
     -d redirect_uri=http://localhost:3000/oauth2callback
   ```

## Step 3: Deploy to Cloud Run

1. Set up environment variables in Cloud Build:
   ```bash
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

2. Create secrets in Secret Manager:
   ```bash
   # Firebase service account (paste the entire JSON)
   gcloud secrets create firebase-service-account-key --data-file=path/to/service-account.json
   
   # Gmail credentials
   gcloud secrets create gmail-client-id --data-file=- <<< "your-client-id"
   gcloud secrets create gmail-client-secret --data-file=- <<< "your-client-secret"
   gcloud secrets create gmail-refresh-token --data-file=- <<< "your-refresh-token"
   gcloud secrets create gmail-redirect-url --data-file=- <<< "http://localhost:3000/oauth2callback"
   ```

3. Deploy the service:
   ```bash
   gcloud builds submit --config cloudbuild.yaml \
     --substitutions _FIREBASE_SERVICE_ACCOUNT_KEY="$(gcloud secrets versions access latest --secret=firebase-service-account-key)",_GMAIL_CLIENT_ID="$(gcloud secrets versions access latest --secret=gmail-client-id)",_GMAIL_CLIENT_SECRET="$(gcloud secrets versions access latest --secret=gmail-client-secret)",_GMAIL_REFRESH_TOKEN="$(gcloud secrets versions access latest --secret=gmail-refresh-token)",_GMAIL_REDIRECT_URL="$(gcloud secrets versions access latest --secret=gmail-redirect-url)"
   ```

## Step 4: Set up Cloud Scheduler

1. Create a scheduled job for 8 AM daily:
   ```bash
   gcloud scheduler jobs create http daily-freight-digest \
     --location=us-central1 \
     --schedule="0 8 * * *" \
     --uri="https://freight-email-service-HASH-uc.a.run.app/send-daily-digest" \
     --http-method=GET \
     --time-zone="America/New_York"
   ```

## Step 5: Test the Service

1. **Manual test:**
   ```bash
   curl https://freight-email-service-HASH-uc.a.run.app/send-daily-digest
   ```

2. **Health check:**
   ```bash
   curl https://freight-email-service-HASH-uc.a.run.app/health
   ```

## Environment Variables Needed:
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Full JSON service account key
- `GMAIL_CLIENT_ID`: OAuth2 client ID
- `GMAIL_CLIENT_SECRET`: OAuth2 client secret  
- `GMAIL_REFRESH_TOKEN`: OAuth2 refresh token
- `GMAIL_REDIRECT_URL`: OAuth2 redirect URL

## Email Features:
- ✅ Beautiful HTML template with your branding
- ✅ Today's events highlighted in red
- ✅ Next 7 days events organized by date
- ✅ Event type icons and color coding
- ✅ Empty state handling
- ✅ Responsive design
- ✅ Professional Space Square branding

The service will send from `info@spacesquare.dev` to `info@spacesquare.dev` daily at 8 AM with all freight events.