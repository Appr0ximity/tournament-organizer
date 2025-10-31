import { useState, useEffect } from 'react';
import type { Tournament, Player } from './types';
import PlayerSetup from './components/PlayerSetup';
import StandingsTable from './components/StandingsTable';
import MatchList from './components/MatchList';
import PlayerProfile from './components/PlayerProfile';
import { createTournamentWithPlayers } from './utils/tournamentGenerator';
import {
  getTournaments,
  getTournament,
  createTournament,
  updateMatch,
  deleteTournament,
} from './utils/api';

function App() {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing tournament on mount
  useEffect(() => {
    loadTournament();
  }, []);

  const loadTournament = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the list of tournaments
      const tournaments = await getTournaments();
      
      if (tournaments.length > 0) {
        // Load the most recent tournament
        const latestTournament = tournaments[0];
        const fullTournament = await getTournament(latestTournament.id);
        setTournament(fullTournament);
      }
    } catch (err) {
      console.error('Error loading tournament:', err);
      setError('Failed to load tournament. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTournament = async (playerNames: string[]) => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate tournament data locally first
      const newTournament = createTournamentWithPlayers(playerNames);

      // Create tournament via API
      const createdTournament = await createTournament(
        newTournament.players,
        newTournament.matches
      );

      setTournament(createdTournament);
    } catch (err) {
      console.error('Error creating tournament:', err);
      setError('Failed to create tournament. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMatch = async (matchId: string, homeScore: number, awayScore: number) => {
    if (!tournament) return;

    try {
      setError(null);

      // Update match via API
      const updatedMatch = await updateMatch(matchId, homeScore, awayScore);

      // Reload the entire tournament to get updated player stats
      const updatedTournament = await getTournament(tournament.id);
      setTournament(updatedTournament);

      console.log('Match updated:', updatedMatch);
    } catch (err) {
      console.error('Error updating match:', err);
      setError('Failed to update match. Please try again.');
    }
  };

  const handleResetTournament = async () => {
    if (!tournament) return;

    const confirmed = window.confirm(
      'Are you sure you want to reset the tournament? This will delete the current tournament but preserve player lifetime stats.'
    );

    if (confirmed) {
      try {
        setError(null);

        // Delete tournament via API
        await deleteTournament(tournament.id);
        setTournament(null);
        setSelectedPlayer(null);
      } catch (err) {
        console.error('Error resetting tournament:', err);
        setError('Failed to reset tournament. Please try again.');
      }
    }
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleCloseProfile = () => {
    setSelectedPlayer(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4 shadow-neon-cyan"></div>
          <p className="text-neon-cyan text-xl font-bold uppercase tracking-wider animate-pulse">Loading Tournament...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 rounded-lg p-8 max-w-md w-full shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <div className="text-red-400 text-6xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4 text-center uppercase tracking-wider">Error</h2>
          <p className="text-gray-300 mb-6 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-red-500/20 text-red-400 font-bold rounded border border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 uppercase tracking-wide"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8">
        <PlayerSetup onStartTournament={handleStartTournament} />
      </div>
    );
  }

  const allCompleted = tournament.matches.every((m) => m.homeScore !== null);
  const progress = tournament.matches.filter((m) => m.homeScore !== null).length;
  const total = tournament.matches.length;
  const progressPercent = (progress / total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            🏆 FIFA TOURNAMENT
          </h1>
          
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2 uppercase tracking-wider">
              <span>Progress</span>
              <span>{progress} / {total} matches</span>
            </div>
            <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500 ease-out shadow-neon-cyan"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleResetTournament}
              className="px-6 py-3 bg-red-500/20 text-red-400 font-bold rounded border border-red-500/50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] uppercase tracking-wide"
            >
              🔄 Reset Tournament
            </button>
            {allCompleted && (
              <div 
                style={{ background: 'linear-gradient(to right, #00ffff, #8000ff)' }}
                className="px-6 py-3 text-black font-bold rounded shadow-neon-cyan uppercase tracking-wider animate-pulse"
              >
                🎉 Tournament Complete!
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Standings */}
          <div className="lg:col-span-1">
            <StandingsTable players={tournament.players} onSelectPlayer={handleSelectPlayer} />
          </div>

          {/* Right Column - Matches */}
          <div className="lg:col-span-2">
            <MatchList
              matches={tournament.matches}
              players={tournament.players}
              onUpdateMatch={handleUpdateMatch}
            />
          </div>
        </div>

        {/* Player Profile Modal */}
        {selectedPlayer && (
          <PlayerProfile
            player={selectedPlayer}
            matches={tournament.matches}
            allPlayers={tournament.players}
            onClose={handleCloseProfile}
          />
        )}
      </div>
    </div>
  );
}

export default App;
