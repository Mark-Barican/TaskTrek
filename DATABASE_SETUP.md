# Database Setup Guide

## Overview

TaskTrek now uses PostgreSQL (Neon) to store:
- User accounts (email, password, role)
- Tasks (title, description, due date, status, assignee)

## Quick Setup for Vercel Deployment

### 1. Create Neon Database

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Click "Create Project"
4. Name it "tasktrek-db" (or any name you prefer)
5. Select a region close to your Vercel deployment (e.g., US East)
6. Click "Create Project"

### 2. Get Connection String

After creating your project:

1. Click on your project name
2. Go to the "Connection Details" section
3. Copy the connection string (it looks like this):
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 3. Add to Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: (paste your Neon connection string)
   - **Environment**: Check all three (Production, Preview, Development)
4. Click "Save"

### 4. Deploy

1. Push your latest code to GitHub
2. Vercel will automatically redeploy
3. The build will succeed!

### 5. Initialize Database Schema

After deployment succeeds, you need to create the database tables. You have two options:

#### Option A: Using Neon SQL Editor (Recommended)

1. Go to your Neon dashboard
2. Click "SQL Editor"
3. Run this SQL command:

```sql
-- Create Users table
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Tasks table
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

-- Create index for better performance
CREATE INDEX "Task_userId_idx" ON "Task"("userId");
```

#### Option B: Using Prisma Migrate (Local)

If you have the project running locally with the DATABASE_URL in your `.env.local`:

```bash
npx prisma db push
```

This will automatically create all tables based on your Prisma schema.

## Local Development Setup

### 1. Create `.env.local` file

In your project root, create a `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

Replace with your actual Neon connection string.

### 2. Initialize Prisma

```bash
npm install
npx prisma generate
npx prisma db push
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema

### User Table
- `id`: Unique identifier (auto-increment)
- `email`: User's email (unique)
- `password`: Hashed password (using bcrypt)
- `role`: Either "student" or "admin"
- `createdAt`: Account creation timestamp

### Task Table
- `id`: Unique identifier (auto-increment)
- `title`: Task title
- `description`: Task description (optional)
- `dueDate`: Due date for the task
- `status`: Task status ("not-started", "in-progress", "completed")
- `assignee`: Person assigned to the task (optional)
- `userId`: Foreign key to User table
- `createdAt`: Task creation timestamp
- `updatedAt`: Last update timestamp

## Features

### Security
- ✅ Passwords are hashed using bcryptjs (10 rounds)
- ✅ User authentication via API routes
- ✅ Tasks are user-specific (users can only access their own tasks)

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Tasks
- `GET /api/tasks?userId={id}` - Get all tasks for a user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks` - Update a task
- `DELETE /api/tasks?id={id}&userId={userId}` - Delete a task

## Troubleshooting

### Build fails with "Missing DATABASE_URL"
- Make sure you added `DATABASE_URL` in Vercel environment variables
- Ensure the environment variable is set for all environments (Production, Preview, Development)

### Can't connect to database
- Verify your Neon project is active (not paused)
- Check that your connection string includes `?sslmode=require`
- Ensure your connection string is correct (no typos)

### Tables don't exist
- Run the SQL commands in Neon SQL Editor
- Or run `npx prisma db push` locally with your DATABASE_URL

### Login/Register not working
- Check Vercel deployment logs for errors
- Ensure database tables are created
- Verify DATABASE_URL is set correctly

## Testing the Application

### 1. Register a new user
1. Go to `/register`
2. Enter email, password, and select role (student/admin)
3. Click "Register"

### 2. Login
1. Go to `/login`
2. Enter your credentials
3. Click "Login"

### 3. Create tasks
1. After login, you'll be on the dashboard
2. Go to "Task Management"
3. Click "+ Add Task"
4. Fill in task details
5. Click "Create Task"

### 4. Manage tasks
- Update task status (Not Started → In Progress → Completed)
- Edit task details
- Delete tasks
- View dashboard statistics

## Data Persistence

All data is now stored in PostgreSQL (Neon):
- ✅ User accounts persist across sessions
- ✅ Tasks are saved to the database
- ✅ Changes are immediately synced
- ✅ Data is accessible from any device

No more localStorage! Everything is properly stored in a production-ready database.

## Next Steps

After setup is complete:
1. Test user registration and login
2. Create some tasks
3. Test all CRUD operations
4. Verify data persists after logout/login
5. Share your deployed app!

## Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Check Neon database logs
3. Verify all environment variables are set
4. Ensure database schema is created


