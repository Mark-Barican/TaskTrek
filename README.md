# TaskTrek - Student Task Management System

A modern task management application built with Next.js, React, and PostgreSQL (Neon).

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database account (free tier available at [neon.tech](https://neon.tech))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

1. Create a free account at [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string from the Neon dashboard
4. Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

Replace the connection strings with your actual Neon database URLs.

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Step 1: Push to GitHub
Ensure your code is pushed to a GitHub repository.

### Step 2: Import to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository

### Step 3: Configure Environment Variables
In your Vercel project settings, add the following environment variables:

- `DATABASE_URL`: Your Neon database connection string
- `DIRECT_URL`: Your Neon database direct connection string (optional, same as DATABASE_URL)

Make sure to add these for **Production**, **Preview**, and **Development** environments.

### Step 4: Deploy
Vercel will automatically build and deploy your application. The `postinstall` script will run `prisma generate` automatically during the build process.

## Features

- ✅ User Authentication (Login/Register/Logout)
- ✅ Task Dashboard with statistics
- ✅ Task Management (Create, Edit, Delete)
- ✅ Progress Tracking
- ✅ Task Status Management (Not Started, In Progress, Completed)
- ✅ Due Date Tracking
- ✅ Modern Dark Theme UI

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Icons**: Heroicons, Lucide React
- **Deployment**: Vercel
