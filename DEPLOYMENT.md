# 🚀 Deployment Guide - Vercel

This guide will help you deploy your FIFA Tournament Organizer to Vercel with PostgreSQL database support.

## Prerequisites

- [Vercel Account](https://vercel.com) (free tier works great!)
- [Neon.tech Account](https://neon.tech) (PostgreSQL database - already set up)
- [Vercel CLI](https://vercel.com/docs/cli) (installed via npm)

## Quick Deployment Steps

### Step 1: Install Vercel CLI (if not already done)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Link Your Project

From your project directory:

```bash
vercel link
```

Choose to create a new project or link to an existing one.

### Step 4: Add Environment Variables

You need to add your database URL to Vercel. You can do this via:

**Option A: Vercel CLI**
```bash
vercel env add DATABASE_URL
```
Then paste your Neon.tech connection string when prompted.

**Option B: Vercel Dashboard**
1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to Settings → Environment Variables
3. Add:
   - Name: `DATABASE_URL`
   - Value: Your Neon.tech PostgreSQL connection string
   - Environments: Production, Preview, Development (select all)

### Step 5: Deploy to Production

```bash
npm run deploy
```

Or simply:
```bash
vercel --prod
```

That's it! 🎉 Your app will be live at: `https://your-project.vercel.app`

## Local Development with Vercel

To test the Vercel serverless functions locally:

```bash
npm run dev
```

This runs `vercel dev` which:
- Starts the Vite frontend
- Runs API routes as serverless functions
- Simulates the Vercel environment locally
- Available at: http://localhost:3000

## Project Structure

```
tournament-organizer/
├── api/                          # Vercel Serverless Functions
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── recalculate-stats.ts # Stats calculation helper
│   ├── health.ts                # GET /api/health
│   ├── tournaments/
│   │   ├── index.ts             # GET/POST /api/tournaments
│   │   └── [id].ts              # GET/DELETE /api/tournaments/:id
│   ├── matches/
│   │   └── [id].ts              # PATCH /api/matches/:id
│   └── players/
│       └── [id].ts              # PATCH /api/players/:id
├── src/                         # React Frontend
├── prisma/
│   └── schema.prisma            # Database schema
└── vercel.json                  # Vercel configuration
```

## API Routes

All API routes are automatically deployed as serverless functions:

- `GET /api/health` - Health check
- `GET /api/tournaments` - Get all tournaments
- `POST /api/tournaments` - Create tournament
- `GET /api/tournaments/:id` - Get specific tournament
- `DELETE /api/tournaments/:id` - Delete tournament
- `PATCH /api/matches/:id` - Update match score
- `PATCH /api/players/:id` - Update player stats

## Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection string from Neon.tech

### Optional

- `NODE_ENV` - Automatically set by Vercel (production/preview/development)

## Database Migrations

Prisma migrations are run automatically during the build process via the build script:

```json
"build": "prisma generate && tsc -b && vite build"
```

If you need to run migrations manually in production:

```bash
# Using Vercel CLI with environment variable
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

## Continuous Deployment

Once linked to Vercel:

1. **Push to GitHub** (or GitLab/Bitbucket)
2. **Connect repository** in Vercel dashboard
3. **Automatic deployments** on every push to main branch
4. **Preview deployments** for pull requests

### GitHub Integration Setup

1. Push your code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. In Vercel Dashboard:
   - Import Project
   - Select your GitHub repository
   - Add environment variables
   - Deploy!

## Vercel Configuration

The `vercel.json` file configures:

```json
{
  "buildCommand": "prisma generate && npm run build",
  "framework": "vite",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

## Domain Configuration

### Custom Domain (Optional)

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Monitoring & Logs

### View Logs

**Via Dashboard:**
- Go to your project on Vercel
- Navigate to Deployments → Select deployment → Logs

**Via CLI:**
```bash
vercel logs
```

### Performance Monitoring

Vercel automatically provides:
- Edge network distribution
- Serverless function analytics
- Build time analytics
- Real-time error tracking

## Troubleshooting

### Build Fails

**Issue:** Prisma generate fails
```bash
# Solution: Ensure DATABASE_URL is set in environment variables
# Check: Settings → Environment Variables
```

**Issue:** TypeScript errors
```bash
# Solution: Check tsconfig.json and fix type errors locally first
npm run build  # Test build locally
```

### API Routes Not Working

**Issue:** 404 on /api/* routes
- Ensure `api/` directory structure is correct
- Check file names match route patterns
- Verify function exports: `export default async function handler(...)`

**Issue:** Database connection fails
- Verify `DATABASE_URL` in environment variables
- Check Neon.tech database is active
- Ensure connection string has `?sslmode=require`

### CORS Errors

The API routes include CORS headers. If you still see CORS errors:

```typescript
// Already included in each API route:
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', '...');
```

## Scaling & Performance

### Automatic Scaling

Vercel handles:
- ✅ Automatic serverless function scaling
- ✅ Global CDN for static assets
- ✅ Edge caching
- ✅ Zero-downtime deployments

### Database Connection Pooling

Your Neon.tech connection string includes connection pooling:
```
@ep-...-pooler.c-2.us-east-1.aws.neon.tech
```

This prevents serverless function connection limit issues.

### Function Limits (Free Tier)

- **Execution Time:** 10 seconds per function
- **Memory:** 1024 MB
- **Bandwidth:** 100 GB/month
- **Deployments:** Unlimited

For higher limits, upgrade to Pro tier.

## Security Best Practices

✅ Environment variables are encrypted by Vercel  
✅ SSL/TLS certificates automatically managed  
✅ Database connections use SSL (`sslmode=require`)  
✅ `.env` file excluded via `.gitignore`  
✅ API routes use HTTPS only in production  

## Cost

### Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth
- Automatic SSL
- Global CDN
- Serverless functions
- Preview deployments
- Perfect for personal projects!

### Database (Neon.tech Free Tier):
- 3 GB storage
- 1 project
- Always available
- Automatic backups

## Post-Deployment Checklist

- [ ] Verify deployment URL works
- [ ] Test creating a tournament
- [ ] Test entering match scores
- [ ] Check player profiles load
- [ ] Verify cross-browser persistence
- [ ] Test on mobile device
- [ ] Check Vercel analytics
- [ ] Set up custom domain (optional)
- [ ] Configure GitHub auto-deployments
- [ ] Share your tournament app! 🎉

## Useful Commands

```bash
# Deploy to production
npm run deploy

# Local development with Vercel
npm run dev

# View deployment logs
vercel logs

# List all deployments
vercel list

# Open project in dashboard
vercel

# Pull environment variables locally
vercel env pull

# Add environment variable
vercel env add DATABASE_URL
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Neon.tech Docs](https://neon.tech/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## Next Steps

After deployment, consider:
- Adding user authentication (Auth.js, Clerk, or Supabase Auth)
- Implementing tournament invitations
- Adding real-time updates with Pusher or WebSockets
- Creating a tournament history view
- Adding export to PDF functionality

---

**Your FIFA Tournament Organizer is now deployed to Vercel! 🏆⚽**

Share your deployment URL and start organizing tournaments!

