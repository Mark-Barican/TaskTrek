# Vercel Deployment Setup Guide

## Quick Fix for Current Deployment Issue

Your build is completing successfully, but you need to configure the database connection for Vercel to work properly.

## Step-by-Step Instructions

### 1. Set Up Neon Database

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Click "Create Project"
4. Choose a name (e.g., "tasktrek-db")
5. Select a region (preferably close to your Vercel deployment region)
6. Click "Create Project"

### 2. Get Your Database Connection Strings

After creating your project in Neon:

1. Go to your Neon project dashboard
2. Click on "Connection Details" or "Connection String"
3. You'll see a connection string like:
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Copy this connection string

### 3. Configure Vercel Environment Variables

1. Go to [https://vercel.com](https://vercel.com)
2. Navigate to your TaskTrek project
3. Click on "Settings"
4. Click on "Environment Variables" in the left sidebar
5. Add the following variables:

   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: (paste your Neon connection string)
   - Environment: Check all three (Production, Preview, Development)

   **Variable 2:**
   - Key: `DIRECT_URL`
   - Value: (paste the same Neon connection string)
   - Environment: Check all three (Production, Preview, Development)

6. Click "Save"

### 4. Redeploy Your Application

After adding the environment variables:

1. Go to the "Deployments" tab
2. Click on the three dots (...) on your latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache"
5. Click "Redeploy"

OR simply push a new commit to your GitHub repository, and Vercel will automatically redeploy.

### 5. Initialize Database Schema

After deployment is successful:

1. Go to your Neon dashboard
2. Click on "SQL Editor" or "Query"
3. Run the following command to create the database tables:

```sql
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Alternatively, you can run this from your local terminal (make sure you have the DATABASE_URL in your local `.env.local` file):

```bash
npx prisma db push
```

## Verification

1. Visit your deployed Vercel URL
2. Try to register a new user
3. Try to log in
4. The application should now work properly with the database!

## Common Issues

### Build Fails
- Make sure `postinstall` script is in `package.json`
- Check that `@prisma/client` and `prisma` are installed

### Can't Connect to Database
- Verify DATABASE_URL is correctly set in Vercel
- Ensure connection string includes `?sslmode=require`
- Check that Neon project is active (not paused)

### "PrismaClient is unable to run in this browser environment"
- Make sure you're not importing Prisma in client components
- Database operations should be in API routes or server components

## Local Development

For local development, create a `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

Then run:

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Next Steps

After successful deployment:

1. Test user registration and login
2. Create some tasks
3. Test all features (dashboard, task management, progress tracking)
4. Customize the application as needed

## Support

If you encounter any issues:
- Check Vercel deployment logs
- Check Neon database logs
- Verify all environment variables are set correctly
- Ensure your database schema is initialized


