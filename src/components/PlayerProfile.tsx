import type { Player, Match } from '../types';

interface PlayerProfileProps {
  player: Player;
  matches: Match[];
  allPlayers: Player[];
  onClose: () => void;
}

export default function PlayerProfile({ player, matches, allPlayers, onClose }: PlayerProfileProps) {
  const getPlayerName = (playerId: string) => {
    return allPlayers.find((p) => p.id === playerId)?.name || 'Unknown';
  };

  const playerMatches = matches.filter(
    (m) => m.homePlayerId === player.id || m.awayPlayerId === player.id
  );

  const playedMatches = playerMatches.filter((m) => m.played);
  const upcomingMatches = playerMatches.filter((m) => !m.played);

  const winPercentage = player.stats.played > 0
    ? ((player.stats.won / player.stats.played) * 100).toFixed(1)
    : '0.0';

  const avgGoalsScored = player.stats.played > 0
    ? (player.stats.goalsFor / player.stats.played).toFixed(2)
    : '0.00';

  const avgGoalsConceded = player.stats.played > 0
    ? (player.stats.goalsAgainst / player.stats.played).toFixed(2)
    : '0.00';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xl font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white flex items-center justify-center text-5xl font-bold mx-auto mb-4 shadow-lg">
            {player.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{player.name}</h2>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">Season Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-2">{player.stats.played}</div>
              <div className="text-sm text-gray-600 font-semibold">Matches Played</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-2">{player.stats.points}</div>
              <div className="text-sm text-gray-600 font-semibold">Points</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-2">{winPercentage}%</div>
              <div className="text-sm text-gray-600 font-semibold">Win Rate</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-2">{player.stats.goalsFor}</div>
              <div className="text-sm text-gray-600 font-semibold">Goals Scored</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-2">{player.stats.goalsAgainst}</div>
              <div className="text-sm text-gray-600 font-semibold">Goals Conceded</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
              <div className={`text-3xl font-bold mb-2 ${player.stats.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {player.stats.goalDifference > 0 ? '+' : ''}{player.stats.goalDifference}
              </div>
              <div className="text-sm text-gray-600 font-semibold">Goal Difference</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-2">{avgGoalsScored}</div>
              <div className="text-sm text-gray-600 font-semibold">Avg Goals/Match</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-2">{avgGoalsConceded}</div>
              <div className="text-sm text-gray-600 font-semibold">Avg Conceded/Match</div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mt-4">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Form Guide (W-D-L)</h4>
            <div className="flex gap-4 justify-center">
              <span className="px-6 py-3 bg-green-500 text-white font-bold text-lg rounded-lg">{player.stats.won} W</span>
              <span className="px-6 py-3 bg-yellow-500 text-white font-bold text-lg rounded-lg">{player.stats.drawn} D</span>
              <span className="px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-lg">{player.stats.lost} L</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">Recent Results</h3>
          {playedMatches.length > 0 ? (
            <div className="space-y-3">
              {playedMatches.slice(-5).reverse().map((match) => {
                const isHome = match.homePlayerId === player.id;
                const playerScore = isHome ? match.homeScore! : match.awayScore!;
                const opponentScore = isHome ? match.awayScore! : match.homeScore!;
                const opponentId = isHome ? match.awayPlayerId : match.homePlayerId;
                const result = playerScore > opponentScore ? 'W' : playerScore < opponentScore ? 'L' : 'D';
                const resultColor = result === 'W' ? 'bg-green-500' : result === 'L' ? 'bg-red-500' : 'bg-yellow-500';

                return (
                  <div key={match.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 flex items-center justify-center ${resultColor} text-white font-bold text-xl rounded-full`}>
                      {result}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">vs {getPlayerName(opponentId)}</span>
                      <span className="ml-2 text-sm text-gray-600">{isHome ? '(H)' : '(A)'}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {playerScore} - {opponentScore}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic py-8">No matches played yet</p>
          )}
        </div>

        {upcomingMatches.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">Next Fixtures</h3>
            <div className="space-y-3">
              {upcomingMatches.slice(0, 3).map((match) => {
                const isHome = match.homePlayerId === player.id;
                const opponentId = isHome ? match.awayPlayerId : match.homePlayerId;
                return (
                  <div key={match.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <span className="font-semibold text-gray-800">vs {getPlayerName(opponentId)}</span>
                    <span className="text-sm text-gray-600">{isHome ? '(H)' : '(A)'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
