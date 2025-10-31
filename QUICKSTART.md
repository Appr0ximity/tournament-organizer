# Quick Start Guide

## 🚀 Getting Your Tournament Organizer Running

### Step 1: Verify Everything is Set Up

Your application is already configured with:
- ✅ Neon.tech PostgreSQL database connected
- ✅ Prisma ORM configured
- ✅ Database tables created
- ✅ Express backend ready
- ✅ React frontend ready

### Step 2: Start the Application

Both frontend and backend are starting now with:
```bash
npm run dev:all
```

### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

### Step 4: Create Your First Tournament

1. Open http://localhost:5173 in your browser
2. Add player names (minimum 2 players)
3. Click "Start Tournament"
4. Your tournament is automatically saved to the Neon.tech database!

### Step 5: Enter Match Scores

1. Scroll to the "Matches" section
2. Click "Enter Score" on any match
3. Input the scores
4. Click "Save"
5. Watch the league table update automatically!

## 🌐 Cross-Browser Access

Your tournament data is now stored in the cloud! You can:
- Close the browser and come back later
- Access from Chrome, Firefox, Safari, or Edge
- View from different devices (desktop, tablet, mobile)
- Share the tournament ID to access from anywhere

## 🔧 Useful Commands

### View Your Database
```bash
npx prisma studio
```
Opens a GUI at http://localhost:5555 to browse your database

### Check Backend Status
```bash
curl http://localhost:3001/api/health
```
Should return: `{"status":"ok"}`

### Run Only Frontend
```bash
npm run dev
```

### Run Only Backend
```bash
npm run server
```

## 📊 Database Information

Your data is stored in:
- **Provider**: Neon.tech (PostgreSQL)
- **Tables**: Tournament, Player, Match
- **Location**: US East (N. Virginia)
- **Connection**: Pooled connection for better performance

## 🔄 What Happens When You Update Scores?

1. Frontend sends score update to Express API
2. API updates the Match in PostgreSQL
3. API automatically recalculates all player stats
4. Frontend fetches updated tournament data
5. League table refreshes with new standings
6. Data is instantly available on all devices!

## 🎮 Features You Can Use Now

✅ Add unlimited players  
✅ Round-robin tournament (home & away)  
✅ Enter and edit match scores  
✅ Real-time league standings  
✅ Detailed player profiles  
✅ Match history and fixtures  
✅ Statistics tracking  
✅ Cross-device synchronization  
✅ Reset and start new tournaments  

## 🆘 Troubleshooting

### If the app doesn't load:
1. Check if both servers are running (you should see output from both)
2. Verify ports 5173 and 3001 are not blocked
3. Check the browser console for errors (F12)

### If database connection fails:
1. Check your Neon.tech dashboard - is the database active?
2. Verify `.env` file has the correct `DATABASE_URL`
3. Run `npx prisma migrate dev` again if needed

### If you see CORS errors:
1. Make sure backend is running on port 3001
2. Check `VITE_API_URL` in `.env` matches your backend URL

## 📱 Next Steps

1. Test creating a tournament with 3-4 players
2. Enter some match scores
3. View player profiles
4. Try accessing from another browser
5. Check your Neon.tech dashboard to see the data!

## 🎉 Enjoy Your Tournament!

Your FIFA tournament organizer is now ready with cloud persistence. All data is automatically saved and synced across browsers and devices!

