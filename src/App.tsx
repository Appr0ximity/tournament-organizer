import { useState, useEffect } from 'react';
import type { Tournament, Player } from './types';
import {
  createPlayer,
  generateRoundRobinSchedule,
} from './utils/tournamentGenerator';
import { api } from './utils/api';
import PlayerSetup from './components/PlayerSetup';
import StandingsTable from './components/StandingsTable';
import MatchList from './components/MatchList';
import PlayerProfile from './components/PlayerProfile';

function App() {
  const [tournament, setTournament] = useState<Tournament>({
    players: [],
    matches: [],
    started: false,
  });

  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  // Load tournament from API or localStorage on mount
  useEffect(() => {
    const loadTournament = async () => {
      try {
        const savedTournamentId = localStorage.getItem('tournamentId');
        
        if (savedTournamentId) {
          const dbTournament = await api.getTournament(savedTournamentId);
          if (dbTournament) {
            setTournamentId(dbTournament.id);
            setTournament({
              players: dbTournament.players.map((p: any) => ({
                id: p.id,
                name: p.name,
                stats: {
                  played: p.played,
                  won: p.won,
                  drawn: p.drawn,
                  lost: p.lost,
                  goalsFor: p.goalsFor,
                  goalsAgainst: p.goalsAgainst,
                  goalDifference: p.goalDifference,
                  points: p.points,
                },
              })),
              matches: dbTournament.matches,
              started: dbTournament.started,
            });
            setLoading(false);
            return;
          }
        }

        const savedTournament = localStorage.getItem('tournament');
        if (savedTournament) {
          setTournament(JSON.parse(savedTournament));
        }
      } catch (error) {
        console.error('Error loading tournament:', error);
        const savedTournament = localStorage.getItem('tournament');
        if (savedTournament) {
          setTournament(JSON.parse(savedTournament));
        }
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, []);

  const handleStartTournament = async (playerNames: string[]) => {
    try {
      const players = playerNames.map((name) => createPlayer(name));
      const matches = generateRoundRobinSchedule(players);

      const dbTournament = await api.createTournament({
        name: 'FIFA Tournament',
        players,
        matches,
      });

      setTournamentId(dbTournament.id);
      localStorage.setItem('tournamentId', dbTournament.id);

      setTournament({
        players: dbTournament.players.map((p: any) => ({
          id: p.id,
          name: p.name,
          stats: {
            played: p.played,
            won: p.won,
            drawn: p.drawn,
            lost: p.lost,
            goalsFor: p.goalsFor,
            goalsAgainst: p.goalsAgainst,
            goalDifference: p.goalDifference,
            points: p.points,
          },
        })),
        matches: dbTournament.matches,
        started: true,
      });
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament. Please try again.');
    }
  };

  const handleUpdateScore = async (matchId: string, homeScore: number, awayScore: number) => {
    try {
      await api.updateMatch(matchId, {
        homeScore,
        awayScore,
        played: true,
      });

      if (tournamentId) {
        const dbTournament = await api.getTournament(tournamentId);
        setTournament({
          players: dbTournament.players.map((p: any) => ({
            id: p.id,
            name: p.name,
            stats: {
              played: p.played,
              won: p.won,
              drawn: p.drawn,
              lost: p.lost,
              goalsFor: p.goalsFor,
              goalsAgainst: p.goalsAgainst,
              goalDifference: p.goalDifference,
              points: p.points,
            },
          })),
          matches: dbTournament.matches,
          started: dbTournament.started,
        });
      }
    } catch (error) {
      console.error('Error updating match:', error);
      alert('Failed to update match score. Please try again.');
    }
  };

  const handleResetTournament = async () => {
    if (window.confirm('Are you sure you want to reset the tournament? All data will be lost.')) {
      try {
        if (tournamentId) {
          await api.deleteTournament(tournamentId);
        }
        localStorage.removeItem('tournamentId');
        localStorage.removeItem('tournament');
        setTournament({
          players: [],
          matches: [],
          started: false,
        });
        setTournamentId(null);
        setSelectedPlayer(null);
      } catch (error) {
        console.error('Error deleting tournament:', error);
        localStorage.removeItem('tournamentId');
        localStorage.removeItem('tournament');
        setTournament({
          players: [],
          matches: [],
          started: false,
        });
        setTournamentId(null);
        setSelectedPlayer(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
        <h2 className="text-2xl text-white animate-pulse">Loading tournament...</h2>
      </div>
    );
  }

  if (!tournament.started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 py-8">
        <PlayerSetup onStartTournament={handleStartTournament} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 pb-8">
      <header className="bg-white/95 shadow-lg py-6 px-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">🏆 FIFA Tournament</h1>
          <button
            onClick={handleResetTournament}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Reset Tournament
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <StandingsTable
          players={tournament.players}
          onSelectPlayer={setSelectedPlayer}
        />

        <MatchList
          matches={tournament.matches}
          players={tournament.players}
          onUpdateScore={handleUpdateScore}
        />
      </div>

      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer}
          matches={tournament.matches}
          allPlayers={tournament.players}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}

export default App;
