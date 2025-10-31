# 🏆 FIFA Tournament Organizer

A full-stack web application for organizing and managing FIFA tournaments with automatic scheduling, statistics tracking, player profiles, and persistent cloud storage.

## Features

### 🎮 Tournament Setup
- **Easy Player Management**: Add players by entering their names one by one
- **Automatic Scheduling**: Generates a complete round-robin tournament with home and away games
- **Randomized Fixtures**: Matches are randomized for variety while maintaining fairness

### 📊 League Table
- **Real-time Standings**: Automatic calculation of league positions based on match results
- **Comprehensive Stats**: Tracks Played, Won, Drawn, Lost, Goals For, Goals Against, Goal Difference, and Points
- **Smart Sorting**: Teams ranked by Points → Goal Difference → Goals Scored → Alphabetically
- **Interactive**: Click on any player to view their detailed profile

### ⚽ Match Management
- **Match List View**: View all matches with filters for upcoming and all matches
- **Score Entry**: Easy-to-use interface for entering match scores
- **Match Tracking**: Shows match count (played vs remaining)
- **Edit Capability**: Update scores even after matches are completed
- **Home/Away Indicators**: Clear labeling of home and away players

### 👤 Player Profiles
- **Detailed Statistics**: 
  - Matches Played
  - Total Points
  - Win Rate Percentage
  - Goals Scored & Conceded
  - Goal Difference
  - Average Goals Per Match
  - Average Goals Conceded Per Match
- **Form Guide**: Visual representation of Wins, Draws, and Losses
- **Match History**: Recent results with scores and locations (Home/Away)
- **Upcoming Fixtures**: Next scheduled matches for the player
- **Beautiful UI**: Gradient avatar and organized stat cards

### 💾 Data Persistence
- **Cloud Storage**: Tournament data stored in PostgreSQL database (Neon.tech)
- **Cross-Browser Access**: Access your tournament from any browser or device
- **Auto-sync**: Data automatically syncs with the cloud after each update
- **Fallback**: LocalStorage backup if API is unavailable

### 📱 Responsive Design
- **Mobile Friendly**: Works seamlessly on all device sizes
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Intuitive Navigation**: Easy to use for all age groups

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **CSS3** for styling with modern features

### Backend
- **Vercel Serverless Functions** - Scalable API endpoints
- **Prisma** - Type-safe ORM for database operations
- **PostgreSQL** - Cloud database hosted on Neon.tech
- **TypeScript** - Full type safety across the stack

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Neon.tech account (or any PostgreSQL database)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd tournament-organizer
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL="your-postgresql-connection-string"
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Generate Prisma Client**
```bash
npx prisma generate
```

### Running the Application

#### Development Mode
```bash
npm run dev
```
This starts the Vercel development environment at `http://localhost:3000` with:
- Frontend (Vite/React)
- API routes (serverless functions)
- Hot module reloading

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Endpoints

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get specific tournament
- `POST /api/tournaments` - Create new tournament
- `DELETE /api/tournaments/:id` - Delete tournament

### Matches
- `PATCH /api/matches/:id` - Update match score

### Players
- `PATCH /api/players/:id` - Update player stats

## Database Schema

### Tournament
- `id` - Unique identifier
- `name` - Tournament name
- `started` - Tournament status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Player
- `id` - Unique identifier
- `name` - Player name
- `tournamentId` - Related tournament
- Stats: `played`, `won`, `drawn`, `lost`, `goalsFor`, `goalsAgainst`, `goalDifference`, `points`

### Match
- `id` - Unique identifier
- `tournamentId` - Related tournament
- `homePlayerId` - Home player
- `awayPlayerId` - Away player
- `homeScore` - Home player score
- `awayScore` - Away player score
- `played` - Match status
- `round` - Round number

## How to Use

### Starting a Tournament

1. **Add Players**:
   - Enter player names in the input field
   - Click "Add Player" for each participant
   - Add at least 2 players (no maximum limit)
   - Remove players by clicking the ✕ button

2. **Start Tournament**:
   - Once you have 2+ players, click "Start Tournament"
   - The app automatically generates all matches in a randomized schedule
   - Tournament is saved to the cloud database
   - Each player plays every other player twice (home and away)

### Managing Matches

1. **View Matches**:
   - Toggle between "Upcoming" and "All Matches" views
   - Upcoming shows next 5 unplayed matches
   - All Matches shows the complete fixture list

2. **Enter Scores**:
   - Click "Enter Score" on any match
   - Input home and away scores
   - Click "Save" to record the result
   - Data automatically syncs to the database
   - Standings update automatically

3. **Edit Results**:
   - Click "Edit Score" on completed matches
   - Update scores and save
   - Statistics recalculate instantly across all browsers

### Viewing Statistics

1. **League Table**:
   - Always visible at the top of the tournament view
   - Shows real-time standings
   - Click any player row to see their detailed profile

2. **Player Profile**:
   - Comprehensive season statistics
   - Recent match results with W/D/L indicators
   - Next upcoming fixtures
   - Click the ✕ or outside the modal to close

### Reset Tournament

- Click "Reset Tournament" in the header
- Confirm the action
- Tournament is deleted from the database
- Start fresh with new players

## Scoring System

- **Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

## Project Structure

```
tournament-organizer/
├── api/                      # Vercel Serverless Functions
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client
│   │   └── recalculate-stats.ts # Stats helper
│   ├── health.ts                # Health check endpoint
│   ├── tournaments/
│   │   ├── index.ts             # Tournament CRUD
│   │   └── [id].ts              # Single tournament
│   ├── matches/
│   │   └── [id].ts              # Match updates
│   └── players/
│       └── [id].ts              # Player updates
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── src/
│   ├── components/           # React components
│   │   ├── PlayerSetup.tsx       # Player input and setup
│   │   ├── StandingsTable.tsx    # League table
│   │   ├── MatchList.tsx         # Match list and scores
│   │   └── PlayerProfile.tsx     # Player statistics
│   ├── utils/
│   │   ├── tournamentGenerator.ts # Tournament logic
│   │   └── api.ts                # API client
│   ├── types.ts              # TypeScript types
│   ├── App.tsx               # Main app component
│   └── App.css               # Global styles
├── .env                      # Environment variables
├── vercel.json               # Vercel configuration
├── prisma.config.ts          # Prisma configuration
└── package.json              # Dependencies and scripts
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (from Neon.tech)

## Database Setup with Neon.tech

1. Create a free account at [Neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string
4. Add it to your `.env` file as `DATABASE_URL`
5. Run `npx prisma migrate dev` to create tables

## Development Tips

- Use `npm run dev` to run Vercel development environment
- App runs on port 3000 (Vercel's default)
- Prisma Studio: Run `npx prisma studio` to view database in browser
- Check API health: Visit `http://localhost:3000/api/health`

## Deployment

### Quick Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Add database URL (first time only)
vercel env add DATABASE_URL
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

See [VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md) for a 5-minute quick start guide.

## Future Enhancements

- User authentication and authorization
- Multiple tournaments per user
- Export tournament data to PDF/CSV
- Support for knockout stages
- Player performance charts and graphs
- Match scheduling by date/time
- Top scorer and best defense awards
- Head-to-head records
- Tournament history and archives
- Real-time updates using WebSockets
- Mobile app (React Native)

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env`
- Check Neon.tech dashboard for database status
- Ensure SSL mode is enabled in connection string

### API Not Responding
- Check if backend is running: `npm run server`
- Verify port 3001 is not in use
- Check console for error messages

### Frontend Not Connecting to API
- Verify `VITE_API_URL` in `.env`
- Restart Vite dev server after changing `.env`
- Check browser console for CORS errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Created with ⚽ for FIFA tournament enthusiasts

---

**Note**: This application requires an active internet connection to sync data with the cloud database. A local fallback to localStorage is available if the API is unavailable.
