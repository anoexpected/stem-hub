# ✅ Deployment Checklist - Print & Follow

**Date**: ________________  
**Deployed By**: ________________

---

## Pre-Deployment Checklist

### Local Environment
- [ ] All changes committed and tested locally
- [ ] `npm run build` succeeds without errors
- [ ] `npm run dev` works correctly
- [ ] No console errors in browser
- [ ] All features tested manually

### Documentation
- [ ] README.md reviewed and accurate
- [ ] GitHub username updated in README (if needed)
- [ ] Contact email added (if needed)
- [ ] .env.example file exists with all variables

### Security
- [ ] No API keys or secrets in code
- [ ] .env and .env.local in .gitignore
- [ ] No passwords in git history
- [ ] Service role key only used server-side

---

## GitHub Setup

### Create Repository
- [ ] Go to github.com/new
- [ ] Repository name: `stem-hub`
- [ ] Visibility: **Private** selected
- [ ] Don't initialize with README
- [ ] Repository created successfully

### Initialize Git Locally
```bash
□ cd c:\Users\anoex\Documents\stem-hub
□ git init
□ git add .
□ git commit -m "Initial commit: STEM Hub MVP"
```

### Push to GitHub
```bash
□ git remote add origin https://github.com/YOUR_USERNAME/stem-hub.git
□ git branch -M main
□ git push -u origin main
```

### Verify GitHub
- [ ] All source files visible on GitHub
- [ ] .env files NOT visible
- [ ] node_modules/ NOT visible
- [ ] Development .md files NOT visible
- [ ] README.md displays correctly

---

## Vercel Deployment

### Create Vercel Project
- [ ] Go to vercel.com/new
- [ ] Sign in with GitHub
- [ ] Import stem-hub repository
- [ ] Repository imported successfully

### Configure Environment Variables

Copy from your `.env.local`:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
  ```
  Value: _________________________________
  ```

- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  ```
  Value: _________________________________
  ```

- [ ] `SUPABASE_SERVICE_ROLE_KEY`
  ```
  Value: _________________________________
  ```

- [ ] `NEXT_PUBLIC_SITE_URL`
  ```
  Value: https://_____________.vercel.app
  ```

### Deploy
- [ ] All environment variables added
- [ ] Click "Deploy"
- [ ] Wait for build (2-5 minutes)
- [ ] Build succeeded
- [ ] Deployment URL: ___________________________

---

## Supabase Configuration

### Update Redirect URLs
- [ ] Go to Supabase Dashboard
- [ ] Navigate to Authentication > URL Configuration
- [ ] Add redirect URL:
  ```
  https://_____________.vercel.app/auth/callback
  ```
- [ ] Save changes

### Update Site URL
- [ ] In same URL Configuration page
- [ ] Set Site URL to:
  ```
  https://_____________.vercel.app
  ```
- [ ] Save changes

---

## Post-Deployment Testing

### Basic Functionality
- [ ] Homepage loads without errors
- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works
- [ ] OAuth providers work (if configured)

### Student Features
- [ ] Can access /select
- [ ] Can view dashboard
- [ ] Can add subjects
- [ ] Can view notes
- [ ] Can take quizzes
- [ ] Can download past papers

### Contributor Features (if applicable)
- [ ] Can access /contribute
- [ ] Can create notes
- [ ] Can create quizzes
- [ ] Can upload past papers
- [ ] Can view own content

### Admin Features (after creating admin user)
- [ ] Can access /admin
- [ ] Can view review queue
- [ ] Can approve/reject content
- [ ] Can manage users
- [ ] Can view analytics

---

## Create Admin User

### Sign Up on Production
- [ ] Go to deployed site
- [ ] Sign up with email: ___________________________
- [ ] Verify email (if required)
- [ ] Sign in successfully

### Update Role in Supabase
- [ ] Go to Supabase Dashboard
- [ ] Navigate to Table Editor > users
- [ ] Find user by email
- [ ] Change `role` from 'student' to 'admin'
- [ ] Save changes

### Verify Admin Access
- [ ] Log out from deployed site
- [ ] Log back in
- [ ] Should redirect to /admin
- [ ] Admin dashboard loads successfully

---

## Monitoring Setup

### Vercel
- [ ] Enable Vercel Analytics
- [ ] Check deployment logs
- [ ] Note any errors or warnings

### Supabase
- [ ] Check database tables populated correctly
- [ ] Check auth users created successfully
- [ ] Check RLS policies working

---

## Documentation

### Update Records
- [ ] Note deployment URL: ___________________________
- [ ] Note deployment date: ___________________________
- [ ] Note admin email: ___________________________
- [ ] Save Vercel project ID (for reference)
- [ ] Save Supabase project ID (for reference)

### Create Issues (on GitHub)
- [ ] Create issue for high-priority bugs
- [ ] Label issues appropriately
- [ ] Add good-first-issue labels

---

## Troubleshooting Log

If you encounter errors, document them here:

### Error 1
```
Time: ___________
Error: _________________________________________________
Solution: ______________________________________________
```

### Error 2
```
Time: ___________
Error: _________________________________________________
Solution: ______________________________________________
```

### Error 3
```
Time: ___________
Error: _________________________________________________
Solution: ______________________________________________
```

---

## Success Criteria

Your deployment is successful when:

- [✓] Site loads without errors
- [✓] Authentication works end-to-end
- [✓] Database operations work
- [✓] File uploads work
- [✓] All user roles function correctly
- [✓] No critical console errors
- [✓] Admin can access admin dashboard

---

## Rollback Plan

If deployment fails critically:

### Option 1: Rollback in Vercel
- [ ] Go to Vercel Dashboard > Deployments
- [ ] Find previous working deployment
- [ ] Click "..." > "Promote to Production"

### Option 2: Revert Git Commit
```bash
□ git revert HEAD
□ git push origin main
□ Wait for automatic redeploy
```

---

## Post-Deployment Tasks

### Immediate (Today)
- [ ] Test all critical flows
- [ ] Fix any blocking bugs
- [ ] Monitor error logs

### This Week
- [ ] Create more test content
- [ ] Invite beta testers
- [ ] Gather initial feedback

### This Month
- [ ] Set up testing framework
- [ ] Fix high-priority bugs
- [ ] Add monitoring tools

---

## Celebration! 🎉

If all checkboxes are checked:

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   🎉 CONGRATULATIONS! STEM HUB IS LIVE! 🎉                       ║
║                                                                   ║
║   Your deployed site: https://_____________.vercel.app           ║
║   Your GitHub repo: https://github.com/_________/stem-hub        ║
║                                                                   ║
║   Share with your team and start testing!                        ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

**Deployment Date**: ________________  
**Deployed By**: ________________  
**Status**: ⬜ In Progress  ⬜ Completed  ⬜ Failed  
**Notes**: ___________________________________________________

---

*Print this checklist and tick off items as you complete them*  
*Save for future deployments and troubleshooting reference*
