# 🔍 Check Your Deployment - Step by Step

## Issue: Still Getting 500 Error

Let's diagnose the exact problem.

### Step 1: Check if DATABASE_URL is Set

**Go to Vercel Dashboard:**
1. https://vercel.com/dashboard
2. Click your **tournament-organizer** project
3. Go to **Settings** → **Environment Variables**

**Question: Do you see `DATABASE_URL` listed?**

- ❌ **NO** → Add it now:
  - Click "Add New"
  - Name: `DATABASE_URL`
  - Value: `postgresql://neondb_owner:npg_DtkhqdZGPl12@ep-falling-sun-aduhtkaz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
  - Environments: Check ALL THREE (Production, Preview, Development)
  - Click Save
  - **Then REDEPLOY** (Deployments → ⋮ → Redeploy)

- ✅ **YES** → Continue to Step 2

### Step 2: Test Database Connection

Visit this URL (replace with your actual Vercel URL):
```
https://tournament-organizer-XXXXX.vercel.app/api/test-db
```

**What do you see?**

#### Option A: Success Response
```json
{
  "success": true,
  "message": "Database connection successful",
  "tournamentCount": 0,
  "env": {
    "hasDatabaseUrl": true,
    "nodeEnv": "production"
  }
}
```
✅ **Database works!** Problem is elsewhere. Go to Step 4.

#### Option B: Error Response
```json
{
  "success": false,
  "error": "Database connection failed",
  "message": "..."
}
```
❌ **Database connection issue.** Read the error message and go to Step 3.

#### Option C: 404 Not Found
❌ **API routes not deployed.** Go to Step 5.

### Step 3: Database Connection Issues

If test-db fails, check:

**A) Is DATABASE_URL set for Production?**
- Vercel → Settings → Environment Variables
- Make sure "Production" is checked
- After changing, REDEPLOY

**B) Is Neon.tech database active?**
- Go to https://console.neon.tech
- Check if your database is running
- Check if it has any connection limits

**C) Is the connection string correct?**
Should include:
- `?sslmode=require`
- `channel_binding=require`
- Uses the `-pooler` endpoint

### Step 4: Check Function Logs for Tournament Creation

If test-db works but tournament creation fails:

1. Go to Vercel Dashboard
2. Click **Deployments** → Latest deployment
3. Click **Functions** tab
4. Find `api/tournaments/index`
5. Check the logs

**Look for:**
- "Creating tournament with:" log
- Any Prisma errors
- Stack traces

**Common errors:**

**"PrismaClient initialization failed"**
→ Prisma didn't generate. Redeploy to trigger postinstall.

**"Table 'Tournament' does not exist"**
→ Database migrations not run. See Step 6.

**"Invalid connection string"**
→ DATABASE_URL format is wrong. Check Step 3C.

### Step 5: API Routes Not Found (404)

If you get 404 on `/api/*` routes:

**Check deployment logs:**
1. Vercel Dashboard → Deployments → Latest
2. Look for build errors
3. Check if `api/` folder is included

**Verify files are committed:**
```bash
git ls-files api/
```
Should show:
- api/health.ts
- api/test-db.ts
- api/lib/prisma.ts
- api/tournaments/index.ts
- etc.

If files are missing:
```bash
git add api/
git commit -m "Add API routes"
git push origin main
```

### Step 6: Run Database Migrations

If tables don't exist:

**Using Vercel CLI:**
```bash
# Pull production DATABASE_URL
npx vercel env pull .env.production

# Run migrations
DATABASE_URL="$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2-)" npx prisma migrate deploy
```

**Or run locally with production DB:**
```bash
# Add your production DATABASE_URL to .env temporarily
npx prisma migrate deploy
```

### Step 7: Full Checklist

- [ ] DATABASE_URL is set in Vercel for Production environment
- [ ] Redeployed after setting environment variable
- [ ] `/api/test-db` returns success
- [ ] Database tables exist (run migrations if needed)
- [ ] Function logs show detailed error messages
- [ ] Build completed successfully (no TypeScript errors)

### Quick Commands to Try:

**Redeploy from CLI:**
```bash
cd /Users/hvs/Typescript/tournament-organizer
npx vercel --prod
```

**Check what's deployed:**
```bash
npx vercel ls
```

**View function logs:**
```bash
npx vercel logs tournament-organizer
```

---

## 🆘 Still Not Working?

Please share:
1. Response from `/api/test-db`
2. Screenshot of Vercel Environment Variables page
3. Function logs from Vercel dashboard
4. Any error messages

I'll help you fix it! 🔧

