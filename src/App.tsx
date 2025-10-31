import { useState, useEffect } from 'react';
import './App.css';
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
        // First check localStorage for tournament ID
        const savedTournamentId = localStorage.getItem('tournamentId');
        
        if (savedTournamentId) {
          // Try to load from API
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

        // Fall back to localStorage if API fails
        const savedTournament = localStorage.getItem('tournament');
        if (savedTournament) {
          setTournament(JSON.parse(savedTournament));
        }
      } catch (error) {
        console.error('Error loading tournament:', error);
        // Fall back to localStorage
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

      // Save to API
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
      // Update match in database
      await api.updateMatch(matchId, {
        homeScore,
        awayScore,
        played: true,
      });

      // Reload tournament to get updated stats
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
        // Still reset locally even if API fails
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
      <div className="app">
        <div className="loading">
          <h2>Loading tournament...</h2>
        </div>
      </div>
    );
  }

  if (!tournament.started) {
    return <PlayerSetup onStartTournament={handleStartTournament} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏆 FIFA Tournament</h1>
        <button onClick={handleResetTournament} className="btn-reset">
          Reset Tournament
        </button>
      </header>

      <div className="app-container">
        <div className="main-content">
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
