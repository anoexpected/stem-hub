# STEM Hub - Database Setup Guide

## Prerequisites
- Supabase account (sign up at https://supabase.com)
- Supabase project created

## Step 1: Create Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: STEM Hub
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to your users (e.g., eu-west-1 for Europe)
4. Click "Create new project"
5. Wait for project to be provisioned (~2 minutes)

## Step 2: Get Your Credentials
1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon/public key** (starts with eyJ...)
   - Go to **Settings** > **Database** and copy:
     - **Service Role Key** (⚠️ Keep this secret!)

## Step 3: Configure Environment Variables
1. In your STEM Hub project, copy `.env.local.example` to `.env.local`:
   ```powershell
   Copy-Item .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   OPENAI_API_KEY=your_openai_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 4: Run Database Schema
1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see a success message

## Step 5: Verify Database Setup
Check that the following tables were created:
- exam_boards
- subjects
- topics
- users
- questions
- user_progress
- practice_sessions

You should also see sample data in:
- exam_boards (8 exam boards)
- subjects (4 subjects for AQA)
- topics (6 topics for Mathematics)

## Step 6: Set Up Authentication
1. In Supabase dashboard, go to **Authentication** > **Settings**
2. Configure:
   - **Site URL**: http://localhost:3000
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`
3. Enable Email authentication:
   - Go to **Authentication** > **Providers**
   - Ensure **Email** is enabled
   - Configure email templates if desired

## Step 7: Get OpenAI API Key
1. Go to https://platform.openai.com
2. Sign up or log in
3. Go to **API Keys** section
4. Create a new API key
5. Copy the key and add it to your `.env.local`

## Troubleshooting

### Issue: "relation does not exist"
- Make sure you ran the entire schema.sql file
- Check that all tables were created in the SQL Editor

### Issue: "row-level security policy violation"
- RLS policies are enabled by default
- For development, you can temporarily disable RLS in Supabase dashboard
- In production, ensure users are authenticated before accessing protected data

### Issue: Can't connect to Supabase
- Verify your `.env.local` file has correct credentials
- Check that NEXT_PUBLIC_SUPABASE_URL has https:// prefix
- Restart your development server after changing environment variables

### Issue: OpenAI API not working
- Verify API key is correct
- Check you have credits in your OpenAI account
- Ensure API key has correct permissions

## Next Steps
Once your database is set up:
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Visit http://localhost:3000
4. Sign up for an account
5. Start practicing!

## Adding More Content
To add more exam boards, subjects, or topics:
1. Go to Supabase dashboard
2. Navigate to **Table Editor**
3. Select the table you want to edit
4. Click **Insert row** to add new data
5. Or write SQL INSERT statements in the SQL Editor

Example:
```sql
-- Add a new subject
INSERT INTO subjects (exam_board_id, name, code, level, description)
VALUES (
  (SELECT id FROM exam_boards WHERE code = 'CAMBRIDGE'),
  'Computer Science',
  'CS_IGCSE',
  'IGCSE',
  'IGCSE Computer Science'
);
```

---

For more help, visit the [Supabase Documentation](https://supabase.com/docs)
