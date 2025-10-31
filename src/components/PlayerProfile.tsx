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
    (m) => (m.homePlayerId === player.id || m.awayPlayerId === player.id) && m.homeScore !== null
  );

  const getMatchResult = (match: Match) => {
    const isHome = match.homePlayerId === player.id;
    const playerScore = isHome ? match.homeScore! : match.awayScore!;
    const opponentScore = isHome ? match.awayScore! : match.homeScore!;

    if (playerScore > opponentScore) return { result: 'W', class: 'neon-cyan' };
    if (playerScore < opponentScore) return { result: 'L', class: 'red' };
    return { result: 'D', class: 'gray' };
  };

  const recentMatches = [...playerMatches].reverse().slice(0, 5);
  const formGuide = recentMatches.map((m) => getMatchResult(m));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black max-w-2xl w-full rounded-xl border-2 border-neon-purple/50 shadow-neon-purple/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 backdrop-blur-md px-6 py-4 border-b border-neon-purple/30 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            {player.name}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-red-500/20 text-red-400 rounded-lg border border-red-500/40 hover:bg-red-500 hover:text-white transition-all text-xl font-bold hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          >
            ✕
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Played', value: player.stats.played, color: 'neon-cyan' },
              { label: 'Won', value: player.stats.won, color: 'neon-cyan' },
              { label: 'Drawn', value: player.stats.drawn, color: 'gray-400' },
              { label: 'Lost', value: player.stats.lost, color: 'red-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-gray-800 hover:border-neon-cyan/30 transition-all">
                <div className={`text-3xl font-bold text-${stat.color} mb-1 drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Goals Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-neon-cyan/30 hover:border-neon-cyan/50 transition-all">
              <div className="text-3xl font-bold text-neon-cyan mb-1 drop-shadow-[0_0_5px_rgba(0,255,255,0.4)]">
                {player.stats.goalsFor}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Goals For</div>
            </div>
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all">
              <div className="text-3xl font-bold text-red-400 mb-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.3)]">
                {player.stats.goalsAgainst}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Goals Against</div>
            </div>
            <div className={`bg-black/60 backdrop-blur-sm p-4 rounded-lg border transition-all ${
              player.stats.goalDifference >= 0 
                ? 'border-neon-purple/30 hover:border-neon-purple/50' 
                : 'border-gray-800'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${
                player.stats.goalDifference >= 0 
                  ? 'text-neon-purple drop-shadow-[0_0_5px_rgba(128,0,255,0.4)]' 
                  : 'text-gray-600'
              }`}>
                {player.stats.goalDifference > 0 ? '+' : ''}{player.stats.goalDifference}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Goal Diff</div>
            </div>
          </div>

          {/* Points */}
          <div className="bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 backdrop-blur-sm p-6 rounded-lg border border-neon-purple/50 shadow-neon-purple/20">
            <div className="text-5xl font-bold text-neon-pink mb-2 text-center drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]">
              {player.stats.points}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest text-center">Total Points</div>
          </div>

          {/* Form Guide */}
          {formGuide.length > 0 && (
            <div className="bg-black/60 backdrop-blur-sm p-5 rounded-lg border border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Recent Form</h3>
              <div className="flex gap-2">
                {formGuide.map((form, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center rounded font-bold text-lg transition-all ${
                      form.class === 'neon-cyan'
                        ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-neon-cyan/20'
                        : form.class === 'red'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}
                  >
                    {form.result}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-600">Most recent match on the right</div>
            </div>
          )}

          {/* Match History */}
          {playerMatches.length > 0 && (
            <div className="bg-black/60 backdrop-blur-sm p-5 rounded-lg border border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Match History</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...playerMatches].reverse().map((match) => {
                  const isHome = match.homePlayerId === player.id;
                  const opponent = getPlayerName(
                    isHome ? match.awayPlayerId : match.homePlayerId
                  );
                  const playerScore = isHome ? match.homeScore! : match.awayScore!;
                  const opponentScore = isHome ? match.awayScore! : match.homeScore!;
                  const result = getMatchResult(match);

                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between px-4 py-3 bg-gray-900/60 rounded border border-gray-800 hover:border-neon-cyan/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm ${
                            result.class === 'neon-cyan'
                              ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                              : result.class === 'red'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                              : 'bg-gray-800 text-gray-500 border border-gray-700'
                          }`}
                        >
                          {result.result}
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-neon-cyan transition-colors">
                            vs {opponent}
                          </div>
                          <div className="text-xs text-gray-600">
                            Round {match.round} · {isHome ? 'Home' : 'Away'}
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        <span className={result.class === 'neon-cyan' ? 'text-neon-cyan' : result.class === 'red' ? 'text-gray-600' : 'text-gray-400'}>
                          {playerScore}
                        </span>
                        <span className="text-gray-700 mx-1">-</span>
                        <span className={result.class === 'red' ? 'text-red-400' : result.class === 'neon-cyan' ? 'text-gray-600' : 'text-gray-400'}>
                          {opponentScore}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
