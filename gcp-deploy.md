
# GCP Deployment Guide

## Prerequisites
1. Install Google Cloud SDK
2. Create a GCP project
3. Enable App Engine API

## Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to GCP App Engine:**
   ```bash
   gcloud app deploy
   ```

3. **View your app:**
   ```bash
   gcloud app browse
   ```

## Environment Setup
- The app is configured for Node.js 18 runtime
- Static files are served efficiently
- All traffic is served over HTTPS

## Custom Domain (Optional)
You can map a custom domain through the GCP Console under App Engine > Settings > Custom Domains.

## Monitoring
Monitor your app through:
- GCP Console > App Engine > Versions
- Logs Viewer for debugging
- Error Reporting for issues
