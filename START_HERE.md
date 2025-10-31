# 🚀 START HERE - Important!

## ⚠️ CRITICAL: Access the Correct URL

After running `npm run vercel:dev`, you MUST access:

```
http://localhost:3000
```

### ❌ DO NOT USE:
- ~~http://localhost:5173~~ (Vite only - no API routes)
- ~~http://localhost:3001~~ (Wrong port)

### ✅ USE THIS:
- **http://localhost:3000** (Vercel dev server with API routes)

## How It Works

```
Port 3000 (Vercel Dev)  ← YOU ACCESS THIS
    ├─ /api/* routes → Serverless Functions
    └─ /* routes → Vite on port 5173 (internal)
```

## Quick Start

1. **Start the server:**
```bash
npm run vercel:dev
```

2. **Wait for this message:**
```
Ready! Available at http://localhost:3000
```

3. **Open your browser:**
```
http://localhost:3000
```

4. **Create your tournament!** 🏆⚽

## Troubleshooting

### "Failed to create tournament" or 404 errors?
→ You're probably on the wrong URL. Use **http://localhost:3000**

### Port 3000 already in use?
→ Stop other servers: `pkill -f "vercel dev" && pkill -f vite`
→ Then restart: `npm run vercel:dev`

### API routes not working?
→ Make sure you're on port **3000**, not 5173 or 3001

---

**Remember: Always use http://localhost:3000 for development!**

