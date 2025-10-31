# 🔧 Vercel Deployment Troubleshooting

## Current Issue: 500 Error on `/api/tournaments`

### What I've Fixed:

1. ✅ **Added `postinstall` script** to ensure Prisma generates on deployment
2. ✅ **Added better error logging** to see exact error messages
3. ✅ **Created test endpoint** at `/api/test-db` to verify database connection
4. ✅ **Added function timeout configuration** in vercel.json

### Steps to Debug:

#### Step 1: Test Database Connection

After deploying, visit:
```
https://your-app.vercel.app/api/test-db
```

This will tell you if:
- DATABASE_URL is set correctly
- Prisma can connect to Neon.tech
- Basic queries work

#### Step 2: Check Vercel Logs

1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Deployments** → Click latest deployment
4. Click **Functions** tab
5. Find `/api/tournaments` and check logs

Look for:
- `Error creating tournament:` messages
- Database connection errors
- Prisma errors

#### Step 3: Verify Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

**Required:**
- ✅ `DATABASE_URL` must be set for **all environments** (Production, Preview, Development)

The value should be:
```
postgresql://neondb_owner:npg_DtkhqdZGPl12@ep-falling-sun-aduhtkaz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Important:** After adding/changing environment variables, you MUST redeploy!

#### Step 4: Redeploy

After adding DATABASE_URL:
1. Go to **Deployments** tab
2. Click **⋮** (three dots) on latest deployment
3. Click **Redeploy**

OR push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Common Issues & Solutions:

#### Issue: "PrismaClient is unable to run in this browser environment"
**Solution:** Prisma is trying to run in the browser. Make sure:
- API routes are in `api/` directory (not `src/`)
- Not importing Prisma in frontend code

#### Issue: "Can't reach database server"
**Solution:** 
- Verify DATABASE_URL in Vercel environment variables
- Check Neon.tech database is active
- Ensure connection string has `?sslmode=require`

#### Issue: "Prisma Client not generated"
**Solution:**
- Added `postinstall: "prisma generate"` to package.json
- Vercel will now auto-generate Prisma client
- Redeploy after this change

#### Issue: "Function execution timeout"
**Solution:**
- Added `maxDuration: 10` in vercel.json
- Neon.tech pooled connection should be fast
- Check if you're on Vercel free tier (10s limit)

### What Should Work After Fixes:

1. ✅ `postinstall` script runs during deployment
2. ✅ Prisma Client generates automatically
3. ✅ Database connection uses SSL
4. ✅ Better error messages in logs
5. ✅ Test endpoint to verify setup

### Next Steps:

1. **Commit and push these changes:**
```bash
git add .
git commit -m "Fix Prisma generation and add better error handling"
git push origin main
```

2. **Verify DATABASE_URL is set in Vercel:**
   - Dashboard → Settings → Environment Variables
   - Must be set for Production, Preview, and Development

3. **Test the deployment:**
   - Visit: `https://your-app.vercel.app/api/test-db`
   - Should see: `{ "success": true, "message": "Database connection successful" }`

4. **Try creating a tournament:**
   - If it fails, check Vercel function logs for detailed error

5. **If still failing, check:**
   - Vercel function logs (detailed error messages now included)
   - `/api/test-db` response
   - Neon.tech dashboard (is database active?)

### Support Resources:

- [Vercel Functions Docs](https://vercel.com/docs/functions)
- [Prisma Vercel Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Neon.tech Docs](https://neon.tech/docs)

---

**Remember:** After ANY environment variable changes in Vercel, you MUST redeploy!

