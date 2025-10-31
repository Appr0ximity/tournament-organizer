import type { Player } from '../types';
import { getSortedStandings } from '../utils/tournamentGenerator';

interface StandingsTableProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export default function StandingsTable({ players, onSelectPlayer }: StandingsTableProps) {
  const sortedPlayers = getSortedStandings(players);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 League Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-3 py-3 text-center text-sm font-semibold">Pos</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Player</th>
              <th className="px-2 py-3 text-center text-sm font-semibold">P</th>
              <th className="px-2 py-3 text-center text-sm font-semibold">W</th>
              <th className="px-2 py-3 text-center text-sm font-semibold">D</th>
              <th className="px-2 py-3 text-center text-sm font-semibold">L</th>
              <th className="px-2 py-3 text-center text-sm font-semibold">GF</th>
              <th className="px-2 py-3 text-center text-sm font-semibold">GA</th>
              <th className="px-2 py-3 text-center text-sm font-semibold">GD</th>
              <th className="px-2 py-3 text-center text-sm font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr 
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-3 py-3 text-center font-bold text-gray-600">{index + 1}</td>
                <td className="px-4 py-3 text-left font-semibold text-gray-800">{player.name}</td>
                <td className="px-2 py-3 text-center">{player.stats.played}</td>
                <td className="px-2 py-3 text-center">{player.stats.won}</td>
                <td className="px-2 py-3 text-center">{player.stats.drawn}</td>
                <td className="px-2 py-3 text-center">{player.stats.lost}</td>
                <td className="px-2 py-3 text-center">{player.stats.goalsFor}</td>
                <td className="px-2 py-3 text-center">{player.stats.goalsAgainst}</td>
                <td className={`px-2 py-3 text-center font-medium ${player.stats.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {player.stats.goalDifference > 0 ? '+' : ''}{player.stats.goalDifference}
                </td>
                <td className="px-2 py-3 text-center font-bold text-green-600 text-lg">{player.stats.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 text-gray-600 text-xs space-y-1">
        <p><strong>P</strong> = Played | <strong>W</strong> = Won | <strong>D</strong> = Draw | <strong>L</strong> = Lost</p>
        <p><strong>GF</strong> = Goals For | <strong>GA</strong> = Goals Against | <strong>GD</strong> = Goal Difference | <strong>Pts</strong> = Points</p>
      </div>
    </div>
  );
}
