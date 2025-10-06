# 🔧 MCP Setup Guide for STEM Hub

This guide will help you set up Vercel MCP and GitHub MCP servers so GitHub Copilot can directly interact with Vercel and GitHub.

---

## 📋 Prerequisites

- VS Code with GitHub Copilot extension
- Node.js 18+ installed
- A Vercel account
- A GitHub account with access token

---

## 🚀 Step 1: Install MCP Servers

### Install Vercel MCP Server

```bash
npm install -g @vercel/mcp-server
```

### Install GitHub MCP Server

```bash
npm install -g @github/mcp-server
```

---

## 🔑 Step 2: Get Your API Keys

### Vercel Access Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it: `MCP Server Access`
4. Click "Create"
5. Copy the token (save it somewhere safe)

### GitHub Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `MCP Server Access`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Actions workflows)
   - ✅ `read:org` (Read organization data)
5. Click "Generate token"
6. Copy the token (save it somewhere safe)

---

## ⚙️ Step 3: Configure VS Code Settings

### Open VS Code Settings JSON

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `Preferences: Open User Settings (JSON)`
3. Press Enter

### Add MCP Configuration

Add this configuration to your `settings.json`:

```json
{
  "github.copilot.chat.mcp.servers": {
    "vercel": {
      "command": "npx",
      "args": [
        "-y",
        "@vercel/mcp-server"
      ],
      "env": {
        "VERCEL_ACCESS_TOKEN": "your_vercel_token_here"
      }
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@github/mcp-server"
      ],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

**Important**: Replace `your_vercel_token_here` and `your_github_token_here` with your actual tokens!

---

## 🔒 Step 4: Secure Your Tokens (Recommended)

Instead of putting tokens directly in settings, use environment variables:

### Windows (PowerShell)

```powershell
# Add to your PowerShell profile
[System.Environment]::SetEnvironmentVariable('VERCEL_ACCESS_TOKEN', 'your_token_here', 'User')
[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'your_token_here', 'User')
```

Then update `settings.json`:

```json
{
  "github.copilot.chat.mcp.servers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_ACCESS_TOKEN": "${env:VERCEL_ACCESS_TOKEN}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## ✅ Step 5: Verify Setup

### Reload VS Code

1. Press `Ctrl+Shift+P`
2. Type: `Developer: Reload Window`
3. Press Enter

### Test MCP Servers

Open GitHub Copilot Chat and try:

**For Vercel:**
```
List my Vercel projects
```

**For GitHub:**
```
List my GitHub repositories
```

If the MCP servers are working, Copilot should be able to fetch this information!

---

## 🎯 What You Can Do With MCP Servers

### With Vercel MCP:
- ✅ Deploy projects to Vercel
- ✅ List deployments
- ✅ Get deployment status
- ✅ Set environment variables
- ✅ View deployment logs
- ✅ Manage domains

### With GitHub MCP:
- ✅ Create repositories
- ✅ Create/update issues
- ✅ Create/merge pull requests
- ✅ List branches
- ✅ Get repository information
- ✅ Manage repository settings

---

## 🚀 Once Setup, You Can Ask Copilot:

### For Deployment:
```
Deploy stem-hub to Vercel using the MCP server
```

### For GitHub:
```
Create an issue for the authentication bug using GitHub MCP
```

---

## 🐛 Troubleshooting

### MCP Server Not Found

**Problem**: Error: `Cannot find module '@vercel/mcp-server'`

**Solution**:
```bash
npm install -g @vercel/mcp-server
npm install -g @github/mcp-server
```

### Invalid Token

**Problem**: Authentication errors

**Solution**:
1. Verify token has correct permissions
2. Check token hasn't expired
3. Ensure token is correctly set in settings

### VS Code Not Detecting MCP

**Problem**: Copilot doesn't recognize MCP commands

**Solution**:
1. Reload VS Code window
2. Check `settings.json` syntax (must be valid JSON)
3. Ensure GitHub Copilot extension is up to date

---

## 📚 Documentation Links

- **Vercel MCP**: https://vercel.com/docs/mcp/vercel-mcp
- **GitHub MCP**: https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server
- **VS Code MCP Setup**: https://vercel.com/docs/mcp/vercel-mcp#vs-code-with-copilot

---

## 🎉 Once Setup is Complete

After setting up MCP servers, come back and tell Copilot:

```
"I've set up Vercel and GitHub MCP servers. 
Please deploy stem-hub to Vercel now."
```

And Copilot will be able to:
1. ✅ Create the Vercel project
2. ✅ Link the GitHub repository
3. ✅ Set environment variables
4. ✅ Deploy the application
5. ✅ Monitor deployment status

All automatically! 🚀

---

## ⚠️ Important Notes

### Security
- Never commit tokens to git
- Use environment variables for tokens
- Rotate tokens periodically
- Only give minimum required permissions

### Rate Limits
- Vercel: Check your plan limits
- GitHub: 5,000 requests/hour for authenticated requests

### Costs
- Vercel: Free tier available (Hobby plan)
- GitHub: Free for public repositories

---

## 📝 Quick Reference Card

### My Tokens (Keep Secure!)

```
Vercel Token: _________________________
GitHub Token: _________________________
```

### VS Code Settings Location

- **Windows**: `%APPDATA%\Code\User\settings.json`
- **Mac**: `~/Library/Application Support/Code/User/settings.json`
- **Linux**: `~/.config/Code/User/settings.json`

---

**After setup, just tell Copilot what you want to do with Vercel or GitHub, and it can do it automatically!** 🎉

---

*Created: October 6, 2025*  
*For: STEM Hub Project*
