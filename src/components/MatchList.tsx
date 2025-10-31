import { useState } from 'react';
import type { Match, Player } from '../types';

interface MatchListProps {
  matches: Match[];
  players: Player[];
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number) => void;
}

export default function MatchList({ matches, players, onUpdateScore }: MatchListProps) {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [showAll, setShowAll] = useState(false);

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name || 'Unknown';
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match.id);
    setHomeScore(match.homeScore !== null ? match.homeScore.toString() : '');
    setAwayScore(match.awayScore !== null ? match.awayScore.toString() : '');
  };

  const handleSaveScore = (matchId: string) => {
    const home = parseInt(homeScore, 10);
    const away = parseInt(awayScore, 10);

    if (!isNaN(home) && !isNaN(away) && home >= 0 && away >= 0) {
      onUpdateScore(matchId, home, away);
      setEditingMatch(null);
      setHomeScore('');
      setAwayScore('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
    setHomeScore('');
    setAwayScore('');
  };

  const upcomingMatches = matches.filter((m) => !m.played);
  const playedMatches = matches.filter((m) => m.played);
  const displayMatches = showAll ? matches : upcomingMatches.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">⚽ Matches</h2>
        <div className="flex gap-6 text-sm">
          <span className="text-gray-600"><strong className="text-gray-800 text-lg">{playedMatches.length}</strong> Played</span>
          <span className="text-gray-600"><strong className="text-gray-800 text-lg">{upcomingMatches.length}</strong> Remaining</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${!showAll ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500'}`}
          onClick={() => setShowAll(false)}
        >
          Upcoming ({upcomingMatches.length})
        </button>
        <button
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${showAll ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500'}`}
          onClick={() => setShowAll(true)}
        >
          All Matches ({matches.length})
        </button>
      </div>

      <div className="space-y-4">
        {displayMatches.length === 0 ? (
          <p className="text-center text-gray-500 italic py-8">
            {showAll ? 'No matches yet' : 'All matches completed!'}
          </p>
        ) : (
          displayMatches.map((match) => (
            <div
              key={match.id}
              className={`border-2 rounded-lg p-6 transition-all hover:shadow-md ${
                match.played ? 'bg-gray-50 border-gray-300 border-l-4' : 'bg-white border-blue-400 border-l-4'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 flex flex-col items-start gap-1">
                  <span className="font-semibold text-gray-800 text-lg">{getPlayerName(match.homePlayerId)}</span>
                  <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded">HOME</span>
                </div>

                <div className="flex-shrink-0 mx-8">
                  {editingMatch === match.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="w-16 px-2 py-2 border-2 border-blue-500 rounded-lg text-center text-xl font-bold focus:outline-none focus:border-blue-600"
                        placeholder="0"
                      />
                      <span className="text-gray-500 font-bold">-</span>
                      <input
                        type="number"
                        min="0"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        className="w-16 px-2 py-2 border-2 border-blue-500 rounded-lg text-center text-xl font-bold focus:outline-none focus:border-blue-600"
                        placeholder="0"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      {match.played ? (
                        <>
                          <span className="text-3xl font-bold text-gray-800">{match.homeScore}</span>
                          <span className="text-gray-400 font-bold">-</span>
                          <span className="text-3xl font-bold text-gray-800">{match.awayScore}</span>
                        </>
                      ) : (
                        <span className="text-gray-500 font-semibold">vs</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-end gap-1">
                  <span className="font-semibold text-gray-800 text-lg">{getPlayerName(match.awayPlayerId)}</span>
                  <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded">AWAY</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                {editingMatch === match.id ? (
                  <>
                    <button
                      onClick={() => handleSaveScore(match.id)}
                      className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditMatch(match)}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {match.played ? 'Edit Score' : 'Enter Score'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
