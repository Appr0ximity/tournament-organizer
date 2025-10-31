import type { Player } from '../types';
import { getSortedStandings } from '../utils/tournamentGenerator';
import './StandingsTable.css';

interface StandingsTableProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export default function StandingsTable({ players, onSelectPlayer }: StandingsTableProps) {
  const sortedPlayers = getSortedStandings(players);

  return (
    <div className="standings-table">
      <h2>🏆 League Table</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr 
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="player-row"
              >
                <td className="position">{index + 1}</td>
                <td className="player-name">{player.name}</td>
                <td>{player.stats.played}</td>
                <td>{player.stats.won}</td>
                <td>{player.stats.drawn}</td>
                <td>{player.stats.lost}</td>
                <td>{player.stats.goalsFor}</td>
                <td>{player.stats.goalsAgainst}</td>
                <td className={player.stats.goalDifference >= 0 ? 'positive' : 'negative'}>
                  {player.stats.goalDifference > 0 ? '+' : ''}{player.stats.goalDifference}
                </td>
                <td className="points">{player.stats.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-legend">
        <p><strong>P</strong> = Played | <strong>W</strong> = Won | <strong>D</strong> = Draw | <strong>L</strong> = Lost</p>
        <p><strong>GF</strong> = Goals For | <strong>GA</strong> = Goals Against | <strong>GD</strong> = Goal Difference | <strong>Pts</strong> = Points</p>
      </div>
    </div>
  );
}

