# Deployment Guide - OnlyFoods

This guide will help you deploy OnlyFoods to GitHub Pages (frontend) and Supabase (backend).

## Prerequisites

1. A GitHub account
2. A Supabase account (free tier available)
3. A Resend account (free tier available) for email functionality

## Step 1: Set Up GitHub Pages

### 1.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `onlyfoods` (or your preferred name)
3. Initialize it with a README

### 1.2 Push Your Code

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/onlyfoods.git

# Push to main branch
git push -u origin main
```

### 1.3 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: `main`
   - Folder: `/public`
4. Click **Save**

Your site will be available at: `https://YOUR_USERNAME.github.io/onlyfoods/`

**Note:** The GitHub Actions workflow will automatically deploy when you push to main.

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click **New Project**
3. Fill in:
   - **Name**: OnlyFoods
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to you
4. Click **Create new project**
5. Wait for the project to be set up (takes 1-2 minutes)

### 2.2 Run Database Migrations

1. Install Supabase CLI (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Find your project ref in Supabase dashboard → Settings → General)

4. Run migrations:
   ```bash
   supabase db push
   ```

   Or manually run the SQL in `supabase/migrations/20240101000000_initial_schema.sql` via the Supabase SQL Editor.

### 2.3 Deploy Edge Functions

1. Install Deno (required for Edge Functions):
   - macOS: `brew install deno`
   - Or download from [deno.land](https://deno.land)

2. Deploy the join function:
   ```bash
   supabase functions deploy join
   ```

3. Deploy the order function:
   ```bash
   supabase functions deploy order
   ```

### 2.4 Set Environment Variables

1. Go to Supabase Dashboard → **Edge Functions** → **Settings**
2. Add the following secrets:

   - `RESEND_API_KEY`: Your Resend API key (see Step 3)
   - `ADMIN_EMAIL`: Your admin email address (e.g., `admin@onlyfoods.com`)

   To set secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=your_resend_api_key
   supabase secrets set ADMIN_EMAIL=admin@onlyfoods.com
   ```

### 2.5 Get Your Supabase Credentials

1. Go to Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**

## Step 3: Set Up Resend for Email

### 3.1 Create Resend Account

1. Go to [Resend](https://resend.com) and sign up (free tier available)
2. Verify your email address
3. Go to **API Keys** → **Create API Key**
4. Copy your API key

### 3.2 Add Domain (Optional but Recommended)

1. In Resend dashboard, go to **Domains**
2. Add your domain (or use Resend's test domain for development)
3. Add the required DNS records

**Note:** For testing, you can use Resend's test domain, but emails will be limited.

## Step 4: Configure Frontend

### 4.1 Update config.js

1. Open `public/config.js`
2. Replace the placeholders:
   ```javascript
   const SUPABASE_CONFIG = {
     url: 'https://YOUR_PROJECT_REF.supabase.co',
     anonKey: 'YOUR_ANON_KEY'
   };
   ```

3. Commit and push:
   ```bash
   git add public/config.js
   git commit -m "Update Supabase configuration"
   git push
   ```

## Step 5: Test Your Deployment

1. Visit your GitHub Pages URL: `https://YOUR_USERNAME.github.io/onlyfoods/`
2. Test the forms:
   - Submit a membership application
   - Submit an order
3. Check:
   - Supabase Dashboard → **Table Editor** → Verify data is being stored
   - Your email inbox → Verify emails are being sent

## Troubleshooting

### Forms Not Submitting

- Check browser console for errors
- Verify `config.js` has correct Supabase URL and key
- Check Supabase Edge Functions logs: Dashboard → Edge Functions → Logs

### Emails Not Sending

- Verify Resend API key is set in Supabase secrets
- Check Resend dashboard for email logs
- Verify `ADMIN_EMAIL` secret is set correctly

### CORS Errors

- Edge Functions should handle CORS automatically
- If issues persist, check Edge Function code

### GitHub Pages Not Updating

- Wait a few minutes after pushing (GitHub Pages can take 1-5 minutes)
- Check GitHub Actions tab for deployment status
- Verify Pages settings point to `/public` folder

## Updating Your Site

1. Make changes to your files
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. GitHub Pages will automatically redeploy
4. Supabase Edge Functions need to be redeployed if changed:
   ```bash
   supabase functions deploy join
   supabase functions deploy order
   ```

## Cost Estimate

- **GitHub Pages**: Free
- **Supabase**: Free tier includes:
  - 500 MB database
  - 2 GB bandwidth
  - 2 million Edge Function invocations/month
- **Resend**: Free tier includes:
  - 3,000 emails/month
  - 100 emails/day

All services offer free tiers suitable for small to medium projects!
