import { useState } from 'react';
import type { Match, Player } from '../types';

interface MatchListProps {
  matches: Match[];
  players: Player[];
  onUpdateMatch: (matchId: string, homeScore: number, awayScore: number) => void;
}

export default function MatchList({ matches, players, onUpdateMatch }: MatchListProps) {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name || 'Unknown';
  };

  const handleStartEdit = (match: Match) => {
    setEditingMatchId(match.id);
    setHomeScore(match.homeScore ?? 0);
    setAwayScore(match.awayScore ?? 0);
  };

  const handleSaveScore = (matchId: string) => {
    onUpdateMatch(matchId, homeScore, awayScore);
    setEditingMatchId(null);
  };

  const handleCancelEdit = () => {
    setEditingMatchId(null);
  };

  const pendingMatches = matches.filter((m) => m.homeScore === null);
  const completedMatches = matches.filter((m) => m.homeScore !== null);

  const renderMatchCard = (match: Match, isPending: boolean) => {
    const isEditing = editingMatchId === match.id;
    const homeName = getPlayerName(match.homePlayerId);
    const awayName = getPlayerName(match.awayPlayerId);

    return (
      <div
        key={match.id}
        className={`bg-gray-900/60 backdrop-blur-sm p-6 rounded-lg border transition-all hover:scale-[1.02] ${
          isPending
            ? 'border-neon-cyan/30 hover:border-neon-cyan/50 hover:shadow-neon-cyan/20'
            : 'border-gray-800 hover:border-neon-pink/30'
        }`}
      >
        {/* Round Label */}
        <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
          Round {match.round}
        </div>

        {/* Match Content */}
        {isEditing ? (
          <>
            {/* Home Team - Editing */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="font-semibold text-white text-lg">{homeName}</div>
                <div className="text-xs text-neon-cyan uppercase tracking-wide">Home</div>
              </div>
              <input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                className="w-16 px-3 py-2 text-center text-xl font-bold bg-black border border-neon-cyan/40 rounded text-white focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan/50 transition-all"
              />
            </div>

            {/* Away Team - Editing */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="font-semibold text-white text-lg">{awayName}</div>
                <div className="text-xs text-neon-pink uppercase tracking-wide">Away</div>
              </div>
              <input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                className="w-16 px-3 py-2 text-center text-xl font-bold bg-black border border-neon-pink/40 rounded text-white focus:outline-none focus:border-neon-pink focus:shadow-neon-pink/50 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleSaveScore(match.id)}
                className="flex-1 px-4 py-2 bg-neon-cyan/10 text-neon-cyan font-bold rounded border border-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 hover:shadow-neon-cyan uppercase text-sm tracking-wide"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-400 font-bold rounded border border-gray-700 hover:bg-gray-700 hover:text-white transition-all uppercase text-sm tracking-wide"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Home Team - Display */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="font-semibold text-white text-lg">{homeName}</div>
                <div className="text-xs text-neon-cyan uppercase tracking-wide">Home</div>
              </div>
              {isPending ? (
                <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-gray-700">-</div>
              ) : (
                <div className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded border ${
                  (match.homeScore ?? 0) > (match.awayScore ?? 0)
                    ? 'text-neon-cyan border-neon-cyan/50 bg-neon-cyan/10'
                    : (match.homeScore ?? 0) === (match.awayScore ?? 0)
                    ? 'text-gray-400 border-gray-700'
                    : 'text-gray-600 border-gray-800'
                }`}>
                  {match.homeScore}
                </div>
              )}
            </div>

            {/* Away Team - Display */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="font-semibold text-white text-lg">{awayName}</div>
                <div className="text-xs text-neon-pink uppercase tracking-wide">Away</div>
              </div>
              {isPending ? (
                <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-gray-700">-</div>
              ) : (
                <div className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded border ${
                  (match.awayScore ?? 0) > (match.homeScore ?? 0)
                    ? 'text-neon-pink border-neon-pink/50 bg-neon-pink/10'
                    : (match.awayScore ?? 0) === (match.homeScore ?? 0)
                    ? 'text-gray-400 border-gray-700'
                    : 'text-gray-600 border-gray-800'
                }`}>
                  {match.awayScore}
                </div>
              )}
            </div>

            {/* Edit/Result Status */}
            {isPending ? (
              <button
                onClick={() => handleStartEdit(match)}
                style={{ background: 'linear-gradient(to right, #00ffff, #0080ff)' }}
                className="w-full px-4 py-2 text-black font-bold rounded hover:shadow-neon-cyan transition-all duration-300 uppercase text-sm tracking-wider"
              >
                Enter Score
              </button>
            ) : (
              <button
                onClick={() => handleStartEdit(match)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-400 font-medium rounded border border-gray-700 hover:bg-gray-700 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all uppercase text-sm tracking-wide"
              >
                Edit Score
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Upcoming Matches */}
      {pendingMatches.length > 0 && (
        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan/30 shadow-lg">
          <h2 className="text-3xl font-bold text-neon-cyan mb-6 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
            ⚽ Upcoming Matches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingMatches.map((match) => renderMatchCard(match, true))}
          </div>
        </div>
      )}

      {/* Completed Matches */}
      {completedMatches.length > 0 && (
        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-400 mb-6 uppercase tracking-wider">
            📊 Completed Matches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedMatches.map((match) => renderMatchCard(match, false))}
          </div>
        </div>
      )}
    </div>
  );
}
