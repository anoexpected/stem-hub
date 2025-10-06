# 🚀 Quick Start: Push to GitHub & Deploy

**TL;DR** - Get your project on GitHub and Vercel in 10 minutes!

---

## ⚡ Super Quick Setup

### 1️⃣ Initialize Git (30 seconds)

```bash
cd c:\Users\anoex\Documents\stem-hub
git init
git add .
git commit -m "Initial commit: STEM Hub MVP"
```

### 2️⃣ Create GitHub Repo (1 minute)

1. Go to [github.com/new](https://github.com/new)
2. Name: `stem-hub`
3. Visibility: **Private** ✅
4. Don't initialize with README
5. Click "Create repository"

### 3️⃣ Push to GitHub (30 seconds)

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/stem-hub.git
git branch -M main
git push -u origin main
```

### 4️⃣ Deploy to Vercel (5 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `stem-hub` repository
3. Add environment variables from `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```
4. Click "Deploy"
5. Wait 2-3 minutes ☕

### 5️⃣ Update Supabase (2 minutes)

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add redirect URL:
   ```
   https://your-app.vercel.app/auth/callback
   ```
3. Update Site URL:
   ```
   https://your-app.vercel.app
   ```

### 6️⃣ Create Admin User (1 minute)

1. Visit your deployed site
2. Sign up with an email
3. Go to Supabase → Table Editor → users
4. Change your `role` to `admin`
5. Log back in → You should see `/admin`

---

## ✅ Verification Checklist

After deployment, test:

- [ ] Homepage loads
- [ ] Can sign up
- [ ] Can log in
- [ ] Student dashboard works
- [ ] Contributor platform loads (if contributor)
- [ ] Admin dashboard loads (if admin)

---

## 🆘 Common Issues

### "Git not found"
```bash
# Install git: https://git-scm.com/download/win
```

### "Authentication failed"
```bash
# Use Personal Access Token (PAT) instead of password
# Create PAT: https://github.com/settings/tokens
```

### "Vercel build fails"
```bash
# Check Vercel build logs
# Common fix: Ensure all env vars are set
```

### "Supabase connection error"
```bash
# Verify environment variables
# Ensure NEXT_PUBLIC_ prefix for client vars
```

---

## 📚 Full Documentation

- **Detailed GitHub Setup**: [GITHUB_SETUP.md](GITHUB_SETUP.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Main README**: [README.md](README.md)

---

## 🎯 What's Next?

After deployment:

1. **Test everything** - Try all features
2. **Fix bugs** - See README "Known Issues"
3. **Add contributors** - Share GitHub repo
4. **Monitor** - Check Vercel Analytics
5. **Iterate** - Keep improving!

---

## 💡 Pro Tips

- **Keep secrets safe**: Never commit `.env` files
- **Use branches**: Don't commit directly to `main`
- **Write good commits**: `Add:`, `Fix:`, `Update:`
- **Test locally first**: Before pushing to production
- **Monitor costs**: Keep an eye on Vercel/Supabase usage

---

**Need help?** Check the full guides above or create an issue on GitHub!

---

*Last updated: October 6, 2025*
