import type { Player } from '../types';
import { getSortedStandings } from '../utils/tournamentGenerator';

interface StandingsTableProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export default function StandingsTable({ players, onSelectPlayer }: StandingsTableProps) {
  const sortedPlayers = getSortedStandings(players);

  return (
    <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-neon-purple/30 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-neon-purple mb-6 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(128,0,255,0.6)]">
        🏆 Standings
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neon-purple/30">
              <th className="px-3 py-3 text-left text-sm font-bold text-neon-cyan uppercase tracking-wide">#</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-neon-cyan uppercase tracking-wide">Player</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-neon-cyan uppercase">P</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-neon-cyan uppercase">W</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-neon-cyan uppercase">D</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-neon-cyan uppercase">L</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-neon-cyan uppercase">GF</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-neon-cyan uppercase">GA</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-neon-cyan uppercase">GD</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-neon-cyan uppercase">Pts</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr 
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer transition-all hover:border-neon-pink/30 group"
              >
                <td className="px-3 py-4 text-center font-bold text-gray-500 group-hover:text-neon-pink transition-colors">{index + 1}</td>
                <td className="px-4 py-4 font-semibold text-white group-hover:text-neon-pink transition-colors">{player.name}</td>
                <td className="px-2 py-4 text-center text-gray-400 group-hover:text-white transition-colors">{player.stats.played}</td>
                <td className="px-2 py-4 text-center text-gray-400 group-hover:text-white transition-colors">{player.stats.won}</td>
                <td className="px-2 py-4 text-center text-gray-400 group-hover:text-white transition-colors">{player.stats.drawn}</td>
                <td className="px-2 py-4 text-center text-gray-400 group-hover:text-white transition-colors">{player.stats.lost}</td>
                <td className="px-2 py-4 text-center text-gray-400 group-hover:text-white transition-colors">{player.stats.goalsFor}</td>
                <td className="px-2 py-4 text-center text-gray-400 group-hover:text-white transition-colors">{player.stats.goalsAgainst}</td>
                <td className={`px-2 py-4 text-center font-medium transition-colors ${player.stats.goalDifference >= 0 ? 'text-neon-cyan group-hover:text-neon-cyan' : 'text-red-400 group-hover:text-red-300'}`}>
                  {player.stats.goalDifference > 0 ? '+' : ''}{player.stats.goalDifference}
                </td>
                <td className="px-2 py-4 text-center font-bold text-neon-purple text-lg group-hover:text-neon-pink transition-colors">{player.stats.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-800 text-gray-500 text-xs space-y-1">
        <p><span className="text-neon-cyan font-bold">P</span> Played · <span className="text-neon-cyan font-bold">W</span> Won · <span className="text-neon-cyan font-bold">D</span> Draw · <span className="text-neon-cyan font-bold">L</span> Lost</p>
        <p><span className="text-neon-cyan font-bold">GF</span> Goals For · <span className="text-neon-cyan font-bold">GA</span> Goals Against · <span className="text-neon-cyan font-bold">GD</span> Goal Diff · <span className="text-neon-cyan font-bold">Pts</span> Points</p>
      </div>
    </div>
  );
}
