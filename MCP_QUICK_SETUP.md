# 🎯 Quick MCP Setup (5 Minutes)

Follow these steps to enable automatic Vercel deployment!

---

## Step 1: Install MCP Servers (1 minute)

Open a **new** PowerShell terminal and run:

```powershell
npm install -g @vercel/mcp-server
npm install -g @github/mcp-server
```

---

## Step 2: Get Tokens (2 minutes)

### Vercel Token:
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Copy the token

### GitHub Token:
1. Go to: https://github.com/settings/tokens/new
2. Select: `repo`, `workflow`, `read:org`
3. Click "Generate token"
4. Copy the token

---

## Step 3: Configure VS Code (2 minutes)

1. **Open Settings JSON**:
   - Press `Ctrl+Shift+P`
   - Type: "Preferences: Open User Settings (JSON)"
   - Press Enter

2. **Add This Configuration**:

```json
{
  "github.copilot.chat.mcp.servers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_ACCESS_TOKEN": "paste_your_vercel_token_here"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "paste_your_github_token_here"
      }
    }
  }
}
```

3. **Save** the file (`Ctrl+S`)

---

## Step 4: Reload VS Code

1. Press `Ctrl+Shift+P`
2. Type: "Developer: Reload Window"
3. Press Enter

---

## Step 5: Test & Deploy!

Open GitHub Copilot Chat and say:

```
List my Vercel projects
```

If it works, then say:

```
Deploy stem-hub to Vercel with these environment variables:
- NEXT_PUBLIC_SUPABASE_URL: [your url]
- NEXT_PUBLIC_SUPABASE_ANON_KEY: [your key]
- SUPABASE_SERVICE_ROLE_KEY: [your service key]
```

---

## ✅ Done!

Once setup, you can ask Copilot to:
- Deploy to Vercel
- Check deployment status
- Update environment variables
- Create GitHub issues
- Manage repositories

---

**See MCP_SETUP_GUIDE.md for detailed instructions!**
