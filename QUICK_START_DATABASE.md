# Quick Start - Database Edition

## 🚀 Your TaskTrek app now uses a real database!

### What Changed?
- ✅ User accounts stored in PostgreSQL (Neon)
- ✅ Tasks persist in database
- ✅ Passwords securely hashed
- ✅ Multi-user support

### 3-Step Vercel Setup

#### Step 1: Get Neon Database (2 minutes)
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string (looks like `postgresql://...`)

#### Step 2: Add to Vercel (1 minute)
1. Go to your Vercel project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: (paste your Neon connection string)
   - **Environments**: All three ✓
3. Save

#### Step 3: Initialize Database (1 minute)
1. Push your code to GitHub (Vercel auto-deploys)
2. Go to Neon dashboard → SQL Editor
3. Run this SQL:

```sql
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Task" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not-started',
    "assignee" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Task_userId_idx" ON "Task"("userId");
```

### ✨ Done!

Visit your Vercel URL and:
1. Register a new account
2. Login
3. Create tasks
4. Everything saves to your database!

### Local Development

Create `.env.local`:
```env
DATABASE_URL="your-neon-connection-string-here"
```

Then run:
```bash
npm install
npx prisma db push
npm run dev
```

### 🎯 What Works Now

- ✅ Register/Login with real database
- ✅ Tasks persist forever
- ✅ Access from any device
- ✅ Secure password storage
- ✅ Multi-user support

### 📚 More Info

- **Detailed Setup**: See `DATABASE_SETUP.md`
- **All Changes**: See `CHANGES_SUMMARY.md`
- **Vercel Guide**: See `VERCEL_SETUP.md`

### 🆘 Quick Troubleshooting

**Build fails?**
- Check DATABASE_URL is in Vercel environment variables

**Can't login?**
- Make sure you ran the SQL commands in Neon

**Tables missing?**
- Go to Neon SQL Editor and run the CREATE TABLE commands above

---

**That's it!** Your TaskTrek is now a full-stack application with database persistence! 🎉

