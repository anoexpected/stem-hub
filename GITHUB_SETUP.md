# 📝 GitHub & Vercel Setup Checklist

Follow these steps to push your project to GitHub and deploy to Vercel.

---

## ✅ Pre-Push Checklist

Before pushing to GitHub:

- [x] `.gitignore` file created and configured
- [x] All sensitive files (`.env`, `.env.local`) are ignored
- [x] Development docs excluded from git
- [x] New unified `README.md` created
- [x] `CONTRIBUTING.md` guide created
- [x] `DEPLOYMENT.md` guide created
- [ ] All code is committed and ready

---

## 🚀 Step-by-Step Guide

### Step 1: Initialize Git Repository

```bash
# Navigate to project directory
cd c:\Users\anoex\Documents\stem-hub

# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: STEM Hub MVP"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Settings:
   - **Name**: `stem-hub`
   - **Description**: "AI-ready EdTech platform for African STEM students"
   - **Visibility**: ✅ **Private** (recommended for now)
   - **Don't initialize with README** (we already have one)
4. Click "Create repository"

### Step 3: Connect Local to GitHub

```bash
# Add remote (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/stem-hub.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Verify Push

1. Refresh your GitHub repository page
2. Verify these files are visible:
   - ✅ `README.md`
   - ✅ `CONTRIBUTING.md`
   - ✅ `DEPLOYMENT.md`
   - ✅ `package.json`
   - ✅ `src/` directory
   - ✅ `.gitignore`

3. Verify these files are **NOT** visible:
   - ❌ `.env`
   - ❌ `.env.local`
   - ❌ `node_modules/`
   - ❌ `.next/`
   - ❌ Development `.md` files (like `WHERE_WE_ARE.md`, etc.)

### Step 5: Deploy to Vercel

Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide for detailed instructions.

**Quick steps**:

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your `stem-hub` repository
4. Configure environment variables (from `.env.local`)
5. Click "Deploy"

---

## 🔒 Security Checklist

Before going public, ensure:

- [ ] All API keys are in environment variables
- [ ] `.env` and `.env.local` are in `.gitignore`
- [ ] No passwords or secrets in code
- [ ] Supabase RLS policies are enabled
- [ ] Service role key is only used server-side

---

## 📋 What Gets Pushed to GitHub

### ✅ Included Files

```
✅ Source code (src/)
✅ Configuration files (package.json, tsconfig.json, etc.)
✅ Public assets (public/)
✅ Database schemas (supabase/schema*.sql)
✅ Documentation (README.md, CONTRIBUTING.md, DEPLOYMENT.md)
✅ .gitignore
✅ .env.example (template for others)
```

### ❌ Excluded Files

```
❌ .env, .env.local (secrets)
❌ node_modules/ (dependencies)
❌ .next/ (build output)
❌ Development docs (50+ internal .md files)
❌ Test scripts (.ps1, .html, debug files)
❌ IDE files (.vscode/, .cursor/, .codeium/)
```

---

## 🎯 Post-Push Tasks

After pushing to GitHub:

### 1. Update README

Replace placeholders in `README.md`:
- [ ] Your GitHub username
- [ ] Contact email
- [ ] License information (if applicable)

### 2. Create Issues

Create GitHub issues for:
- [ ] Known bugs (see README "Known Issues" section)
- [ ] High-priority tasks (see README "Contributing" section)
- [ ] Feature requests

### 3. Set Up Branch Protection (Optional)

In GitHub repository settings:
1. Go to Settings → Branches
2. Add branch protection rule for `main`:
   - [ ] Require pull request reviews
   - [ ] Require status checks to pass
   - [ ] Require branches to be up to date

### 4. Add Collaborators

If working with a team:
1. Go to Settings → Collaborators
2. Invite team members
3. Assign appropriate roles

---

## 🔄 Daily Workflow

### Making Changes

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit
git commit -m "Add: brief description"

# Push to GitHub
git push origin feature/your-feature

# Create pull request on GitHub
```

### Pulling Updates

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Update dependencies (if package.json changed)
npm install
```

---

## 🐛 Troubleshooting

### Git Issues

**Problem**: "fatal: not a git repository"
```bash
# Solution: Initialize git
git init
```

**Problem**: "remote origin already exists"
```bash
# Solution: Remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/stem-hub.git
```

**Problem**: "Updates were rejected"
```bash
# Solution: Pull first, then push
git pull origin main --rebase
git push origin main
```

### GitHub Issues

**Problem**: ".env file visible on GitHub"
```bash
# Solution: Remove from git cache
git rm --cached .env
git commit -m "Remove .env from git"
git push origin main
```

**Problem**: "Large files causing push to fail"
```bash
# Solution: Check what's being pushed
git ls-files --others --exclude-standard
# Add large files to .gitignore
```

---

## 📊 GitHub Repository Settings

### Recommended Settings

**General**:
- [ ] Add description
- [ ] Add topics: `nextjs`, `react`, `education`, `edtech`, `stem`, `africa`
- [ ] Enable Issues
- [ ] Enable Projects (optional)
- [ ] Disable Wikis (use docs/ folder instead)

**Security**:
- [ ] Enable Dependabot alerts
- [ ] Enable secret scanning (GitHub Advanced Security)

---

## 🚢 Ready to Ship?

Before marking as production-ready:

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] No console.log statements left
- [ ] Code reviewed

### Testing
- [ ] Manual testing completed
- [ ] Critical flows tested
- [ ] Authentication tested
- [ ] Database operations tested

### Documentation
- [ ] README is complete
- [ ] Contributing guidelines clear
- [ ] Deployment guide accurate
- [ ] Code comments added

### Security
- [ ] No secrets in code
- [ ] RLS policies enabled
- [ ] Input validation added
- [ ] Error handling implemented

---

## 📞 Need Help?

If you encounter issues:

1. **Git**: [Git Documentation](https://git-scm.com/doc)
2. **GitHub**: [GitHub Docs](https://docs.github.com)
3. **Vercel**: [Vercel Docs](https://vercel.com/docs)
4. **Supabase**: [Supabase Docs](https://supabase.com/docs)

---

## 🎉 Congratulations!

You're now ready to:
- ✅ Push to GitHub
- ✅ Deploy to Vercel
- ✅ Collaborate with others
- ✅ Accept contributions

**Next**: Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide to deploy to Vercel!

---

*Last updated: October 6, 2025*
