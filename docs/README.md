# Documentation Index

This folder contains comprehensive documentation for the STEM Hub project.

## 🚨 OAuth Authentication Fix

If OAuth login redirects to `/auth/login` instead of dashboard, **read these immediately**:

### 1. **Quick Start** 
📄 [`OAUTH_FIX_SUMMARY.md`](./OAUTH_FIX_SUMMARY.md) - Executive summary (2-minute read)

### 2. **Quick Reference**
📄 [`OAUTH_QUICK_REFERENCE.md`](./OAUTH_QUICK_REFERENCE.md) - Cheat sheet with code snippets

### 3. **Visual Guide**
📄 [`OAUTH_VISUAL_GUIDE.md`](./OAUTH_VISUAL_GUIDE.md) - Diagrams and visual explanations

### 4. **Troubleshooting**
📄 [`OAUTH_TROUBLESHOOTING.md`](./OAUTH_TROUBLESHOOTING.md) - Debug guide and common issues

### 5. **Complete Documentation**
📄 [`OAUTH_CALLBACK_FIX.md`](./OAUTH_CALLBACK_FIX.md) - Full technical documentation

---

## 📚 Reading Order

### If OAuth is broken:
1. Start with **OAUTH_FIX_SUMMARY.md** (understand the problem)
2. Read **OAUTH_QUICK_REFERENCE.md** (get the fix)
3. Try **OAUTH_TROUBLESHOOTING.md** if still broken (debug guide)
4. Check **OAUTH_VISUAL_GUIDE.md** (see diagrams)
5. Reference **OAUTH_CALLBACK_FIX.md** (deep dive)

### If you want to understand PKCE:
1. Read **OAUTH_VISUAL_GUIDE.md** first (visual learning)
2. Then **OAUTH_CALLBACK_FIX.md** (technical details)

---

## 🎯 One-Sentence Summary

**PKCE code exchange MUST be client-side because `code_verifier` is stored in browser localStorage, which server-side code cannot access.**

---

## 🔧 Quick Fix

```bash
# If OAuth redirects to login instead of dashboard:
rm src/app/auth/callback/route.ts  # Delete server-side handler
npm run dev                         # Restart dev server
# Clear browser cookies/localStorage
# Test OAuth login again
```

---

## 📁 Related Files

### Application Files:
- `src/app/auth/callback/page.tsx` ✅ (Client-side handler - KEEP THIS)
- `src/app/auth/callback/route.ts` ❌ (Server-side handler - DELETE THIS)
- `src/lib/supabase/client.ts` (Supabase client configuration)

### Helper Scripts:
- `scripts/clear-auth.html` (Browser data clearing tool)

---

## ✅ Success Indicators

You know OAuth is working when:
- ✅ After "Continue with Google", you see `[Callback]` logs in console
- ✅ Users redirect to `/auth/onboarding/location` or `/dashboard`
- ✅ No redirect back to `/auth/login`
- ✅ Session persists across page reloads

---

## 🆘 Getting Help

If you're still stuck after reading the docs:

1. Check browser console for errors
2. Check Supabase Dashboard → Authentication → Logs
3. Verify redirect URLs in Supabase settings
4. Ensure environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

**Last Updated:** October 6, 2025  
**Status:** ✅ OAuth Fix Documented & Working
