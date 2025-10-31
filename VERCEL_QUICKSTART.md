# ⚡ Vercel Quick Start - 5 Minutes to Deploy

Deploy your FIFA Tournament Organizer to production in 5 minutes!

## Step 1: Install Vercel CLI (if needed)

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

## Step 3: Deploy!

From your project directory:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → tournament-organizer (or your choice)
- **Directory?** → ./ (just press Enter)
- **Override settings?** → No

## Step 4: Add Database URL

After the initial deployment, add your database:

```bash
vercel env add DATABASE_URL
```

When prompted:
- **Value:** Paste your Neon.tech connection string
- **Environments:** Select all (Production, Preview, Development)

## Step 5: Deploy to Production

```bash
vercel --prod
```

## 🎉 Done!

Your app is live at: `https://your-project.vercel.app`

## Local Development

To test locally with Vercel environment:

```bash
npm run dev
```

Opens at: http://localhost:3000

## Continuous Deployment (Optional)

Push to GitHub and connect to Vercel for automatic deployments:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

2. **Connect in Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select your GitHub repo
   - Add `DATABASE_URL` environment variable
   - Deploy!

Now every push to `main` automatically deploys! 🚀

## Troubleshooting

**Database Connection Error?**
- Make sure `DATABASE_URL` is added via `vercel env add`
- Redeploy with `vercel --prod`

**Build Failed?**
- Check your Neon.tech database is active
- Run `npm run build` locally first to catch errors

## Next Deployment

After making changes:

```bash
git add .
git commit -m "Your changes"
vercel --prod
```

That's it! Your tournament organizer is now live on Vercel! 🏆

