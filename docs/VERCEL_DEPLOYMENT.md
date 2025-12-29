# Vercel Deployment Guide

This guide explains how to deploy the Astronomy Discovery Game to Vercel.

## Overview

The project consists of two separate deployments:
1. **Frontend** - React application (Static site)
2. **Backend** - Node.js API (Serverless functions)

## Prerequisites

- Vercel account (free tier available)
- Vercel CLI installed: `npm install -g vercel`
- PostgreSQL database (we recommend Vercel Postgres or Supabase)
- Redis instance (Upstash Redis recommended)

## Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Set Up External Services

#### Option A: Vercel Postgres (Recommended)
```bash
# This will be done through Vercel dashboard
# Go to your project → Storage → Create Database → Postgres
```

#### Option B: Supabase (Alternative)
1. Create account at https://supabase.com
2. Create new project
3. Get connection string from Settings → Database

#### Redis Setup (Upstash)
1. Create account at https://upstash.com
2. Create Redis database
3. Copy connection details

### Step 4: Deploy Backend

```bash
cd backend

# Deploy to Vercel
vercel

# Add environment variables
vercel env add DB_HOST
vercel env add DB_PORT
vercel env add DB_NAME
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add REDIS_HOST
vercel env add REDIS_PORT
vercel env add REDIS_PASSWORD
vercel env add JWT_SECRET
vercel env add NASA_API_KEY
vercel env add CORS_ORIGIN

# Deploy to production
vercel --prod
```

### Step 5: Deploy Frontend

```bash
cd ../frontend

# Add API URL environment variable
vercel env add VITE_API_URL

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

## Method 2: Deploy via GitHub Integration

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will detect the monorepo structure

### Step 3: Configure Projects

#### Backend Configuration

**Framework Preset:** Other
**Root Directory:** `backend`
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

**Environment Variables:**
```
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=astronomy_game
DB_USER=your-db-user
DB_PASSWORD=your-db-password
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRE=7d
NASA_API_KEY=your-nasa-api-key
ESA_API_URL=https://esahubble.org/api/v1
CORS_ORIGIN=https://your-frontend-domain.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Configuration

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

### Step 4: Deploy

Click "Deploy" and Vercel will build and deploy both applications.

## Database Setup on Vercel

### Using Vercel Postgres

1. In Vercel Dashboard, go to Storage
2. Create new Postgres database
3. Copy connection string
4. Add to environment variables
5. Run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Run migrations
vercel env pull .env.local
cd backend
npm run db:migrate
```

## Alternative: Supabase Database

1. Create Supabase project at https://supabase.com
2. Go to Settings → Database
3. Copy connection details
4. Add to Vercel environment variables
5. Enable connection pooling
6. Run migrations

## Redis Setup with Upstash

1. Create Redis database at https://upstash.com
2. Copy REST URL and token
3. Update Redis client to use REST API:

```typescript
// backend/src/config/redis.ts
import { Redis } from '@upstash/redis';

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
```

4. Add environment variables to Vercel

## Post-Deployment Steps

### 1. Initialize Database

```bash
# Connect to your database and run migrations
npm run db:migrate
```

### 2. Seed Initial Data (Optional)

```bash
npm run db:seed
```

### 3. Test Endpoints

```bash
# Health check
curl https://your-backend.vercel.app/health

# Test API
curl https://your-backend.vercel.app/api
```

### 4. Configure CORS

Ensure `CORS_ORIGIN` in backend environment variables matches your frontend URL.

### 5. Update Frontend API URL

Ensure `VITE_API_URL` points to your deployed backend.

## Environment Variables Checklist

### Backend (.env)
- [x] `NODE_ENV=production`
- [x] `DB_HOST`
- [x] `DB_PORT`
- [x] `DB_NAME`
- [x] `DB_USER`
- [x] `DB_PASSWORD`
- [x] `REDIS_HOST`
- [x] `REDIS_PORT`
- [x] `REDIS_PASSWORD` (if required)
- [x] `JWT_SECRET`
- [x] `JWT_EXPIRE`
- [x] `NASA_API_KEY`
- [x] `CORS_ORIGIN`

### Frontend (.env)
- [x] `VITE_API_URL`

## Troubleshooting

### Build Failures

**Issue:** Build fails with missing dependencies
**Solution:** Ensure `package.json` has all dependencies listed

**Issue:** TypeScript errors during build
**Solution:** Run `npm run build` locally first to catch errors

### Database Connection Issues

**Issue:** Cannot connect to database
**Solution:**
- Check connection string format
- Enable SSL if required
- Verify firewall rules
- Use connection pooling

### CORS Errors

**Issue:** CORS errors in browser
**Solution:**
- Update `CORS_ORIGIN` environment variable
- Ensure it matches frontend domain exactly
- Include protocol (https://)

### Cold Starts

**Issue:** First request is slow
**Solution:**
- This is normal for serverless functions
- Consider upgrading to Vercel Pro for faster cold starts
- Implement caching strategies

## Custom Domain Setup

1. Go to Vercel project settings
2. Navigate to Domains
3. Add custom domain
4. Configure DNS settings
5. Wait for SSL certificate provisioning

## Monitoring and Analytics

### Enable Vercel Analytics

1. Go to project settings
2. Enable Analytics
3. Add analytics to frontend:

```bash
npm install @vercel/analytics
```

```typescript
// frontend/src/main.tsx
import { inject } from '@vercel/analytics';
inject();
```

### Enable Logging

Vercel automatically captures logs. View them in:
- Project → Deployments → Select deployment → Logs

## Scaling Considerations

### Serverless Function Limits (Hobby Tier)
- Execution timeout: 10 seconds
- Max payload: 4.5 MB
- Concurrent executions: Automatic

### Upgrade to Pro for:
- 60 second execution timeout
- Priority support
- Better cold start performance
- Team collaboration features

## Cost Estimation

### Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth
- Serverless function executions
- Automatic SSL

### Paid Services:
- Vercel Postgres: ~$0.102/GB storage
- Upstash Redis: Free tier available, then ~$0.20/100K requests
- Vercel Pro: $20/month per member

## Security Best Practices

1. Use environment variables for all secrets
2. Enable branch protection
3. Review deployment previews before merging
4. Use Vercel's built-in DDoS protection
5. Implement rate limiting
6. Regular dependency updates
7. Monitor error logs

## Continuous Deployment

Vercel automatically deploys:
- Production: Commits to `main` branch
- Preview: Pull requests and other branches

Configure in `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "preview": true
    }
  }
}
```

## Rollback Procedure

If deployment fails:

1. Go to Vercel Dashboard
2. Select project
3. Go to Deployments
4. Find previous working deployment
5. Click "..." → "Promote to Production"

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Upstash Redis](https://docs.upstash.com/)
- [Supabase](https://supabase.com/docs)

## Getting Help

- Vercel Discord: https://vercel.com/discord
- GitHub Issues: Create an issue in your repository
- Vercel Support: support@vercel.com (Pro users)
