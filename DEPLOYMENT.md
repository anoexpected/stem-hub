# 🚀 Deployment Guide - Vercel

This guide will help you deploy STEM Hub to Vercel.

---

## Prerequisites

- A Vercel account ([vercel.com](https://vercel.com))
- A Supabase project with the database schema deployed
- GitHub repository with your code

---

## Step 1: Prepare Your Project

### 1.1 Ensure `.gitignore` is Correct

Make sure these files are ignored:
```
.env
.env.local
node_modules/
.next/
```

### 1.2 Commit All Changes

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Step 2: Set Up Vercel

### 2.1 Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2.2 Link Your GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select "stem-hub" repository

---

## Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

### Required Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

### How to Get These Values

1. Go to your Supabase project
2. Navigate to **Settings > API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 4: Configure Build Settings

In Vercel, use these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

---

## Step 5: Deploy

### Option A: Deploy via Dashboard

1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete (2-5 minutes)
3. Visit your deployment URL

### Option B: Deploy via CLI

```bash
vercel --prod
```

---

## Step 6: Configure Supabase for Production

### 6.1 Update Supabase Redirect URLs

1. Go to Supabase Dashboard
2. Navigate to **Authentication > URL Configuration**
3. Add your Vercel domain to **Redirect URLs**:
   ```
   https://your-vercel-domain.vercel.app/auth/callback
   https://your-vercel-domain.vercel.app/auth/login
   ```

### 6.2 Update Site URL

In Supabase **Authentication > URL Configuration**:
- Set **Site URL** to: `https://your-vercel-domain.vercel.app`

---

## Step 7: Set Up Custom Domain (Optional)

### 7.1 Add Domain in Vercel

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 7.2 Update Environment Variables

Update `NEXT_PUBLIC_SITE_URL` to your custom domain:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 7.3 Update Supabase URLs

Update redirect URLs in Supabase to include your custom domain.

---

## Step 8: Create Admin User

After deployment, you need to manually create an admin user:

### 8.1 Sign Up

1. Visit your deployed site
2. Sign up with an email

### 8.2 Update Role in Supabase

1. Go to Supabase Dashboard
2. Navigate to **Table Editor > users**
3. Find your user by email
4. Change `role` to `admin`

### 8.3 Test Admin Access

1. Log out and log back in
2. You should be redirected to `/admin`

---

## Step 9: Verify Deployment

### Checklist

- [ ] Site loads without errors
- [ ] Authentication works (sign up, sign in, sign out)
- [ ] OAuth providers work (Google, GitHub)
- [ ] Student dashboard loads
- [ ] Contributor platform loads
- [ ] Admin dashboard loads (for admin users)
- [ ] Database queries work
- [ ] File uploads work (images, PDFs)
- [ ] All pages are accessible

---

## Troubleshooting

### Build Fails

**Error: "Type errors"**
```bash
# Run type check locally
npm run type-check

# Fix any TypeScript errors
```

**Error: "Module not found"**
```bash
# Ensure all dependencies are in package.json
npm install
```

### Runtime Errors

**Error: "Supabase client error"**
- Check environment variables are set correctly
- Ensure `NEXT_PUBLIC_` prefix for client-side vars

**Error: "Authentication fails"**
- Check redirect URLs in Supabase
- Ensure `NEXT_PUBLIC_SITE_URL` is correct

**Error: "RLS policy violation"**
- Check Row Level Security policies in Supabase
- Ensure policies allow necessary operations

### OAuth Not Working

1. Check OAuth providers are enabled in Supabase
2. Verify redirect URLs include your Vercel domain
3. Check OAuth credentials (Client ID, Secret)

---

## Monitoring

### Vercel Analytics

Enable Vercel Analytics:
1. Go to Project Settings > Analytics
2. Enable Web Analytics
3. Enable Speed Insights (optional)

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Logs for debugging

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment

### Preview Deployments

Every pull request gets a unique preview URL for testing.

---

## Environment-Specific Settings

### Development
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Staging (optional)
```env
NEXT_PUBLIC_SITE_URL=https://stem-hub-staging.vercel.app
```

### Production
```env
NEXT_PUBLIC_SITE_URL=https://stemhub.com
```

---

## Post-Deployment Tasks

### 1. Seed Database

If starting fresh:
1. Run `supabase/schema.sql`
2. Run `supabase/schema_phase2.sql`
3. Seed exam boards, subjects, and topics

### 2. Create Initial Content

As admin:
1. Add exam boards
2. Add subjects for each board
3. Add topics for each subject

### 3. Invite Contributors

Use admin dashboard to:
1. Invite contributors
2. Approve contributor applications
3. Review and publish initial content

---

## Rollback

If deployment has issues:

### Via Dashboard
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Via CLI
```bash
vercel rollback
```

---

## Security Best Practices

1. **Never commit `.env` files**
2. **Use environment variables** for all secrets
3. **Enable RLS policies** in Supabase
4. **Use service role key** only in API routes (server-side)
5. **Validate all user inputs** on the server
6. **Rate limit** API endpoints
7. **Keep dependencies updated**

---

## Performance Optimization

1. **Enable caching** in Vercel settings
2. **Optimize images** using next/image
3. **Use ISR** (Incremental Static Regeneration) where appropriate
4. **Minimize bundle size**
5. **Use CDN** for static assets

---

## Cost Considerations

### Vercel Pricing
- **Hobby**: Free (100GB bandwidth/month)
- **Pro**: $20/month (1TB bandwidth/month)

### Supabase Pricing
- **Free**: 500MB database, 1GB file storage
- **Pro**: $25/month (8GB database, 100GB storage)

---

## Support

If you encounter issues:

1. Check [Vercel Docs](https://vercel.com/docs)
2. Check [Supabase Docs](https://supabase.com/docs)
3. Search [Stack Overflow](https://stackoverflow.com)
4. Open an issue in the repository

---

## Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. ✅ Monitor error logs
3. ✅ Set up alerts
4. ✅ Create backup strategy
5. ✅ Document any custom configurations

---

**🎉 Congratulations! Your STEM Hub is now live!**

*Last updated: October 6, 2025*
