import type { Player, Match } from '../types';
import './PlayerProfile.css';

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
    <div className="player-profile-overlay" onClick={onClose}>
      <div className="player-profile" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="profile-header">
          <div className="player-avatar">{player.name.charAt(0).toUpperCase()}</div>
          <h2>{player.name}</h2>
        </div>

        <div className="profile-stats">
          <h3>Season Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{player.stats.played}</div>
              <div className="stat-label">Matches Played</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{player.stats.points}</div>
              <div className="stat-label">Points</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{winPercentage}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{player.stats.goalsFor}</div>
              <div className="stat-label">Goals Scored</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{player.stats.goalsAgainst}</div>
              <div className="stat-label">Goals Conceded</div>
            </div>
            <div className="stat-card">
              <div className={`stat-value ${player.stats.goalDifference >= 0 ? 'positive' : 'negative'}`}>
                {player.stats.goalDifference > 0 ? '+' : ''}{player.stats.goalDifference}
              </div>
              <div className="stat-label">Goal Difference</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{avgGoalsScored}</div>
              <div className="stat-label">Avg Goals/Match</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{avgGoalsConceded}</div>
              <div className="stat-label">Avg Conceded/Match</div>
            </div>
          </div>

          <div className="form-guide">
            <h4>Form Guide (W-D-L)</h4>
            <div className="form-stats">
              <span className="form-item win">{player.stats.won} W</span>
              <span className="form-item draw">{player.stats.drawn} D</span>
              <span className="form-item loss">{player.stats.lost} L</span>
            </div>
          </div>
        </div>

        <div className="match-history">
          <h3>Recent Results</h3>
          {playedMatches.length > 0 ? (
            <div className="history-list">
              {playedMatches.slice(-5).reverse().map((match) => {
                const isHome = match.homePlayerId === player.id;
                const playerScore = isHome ? match.homeScore! : match.awayScore!;
                const opponentScore = isHome ? match.awayScore! : match.homeScore!;
                const opponentId = isHome ? match.awayPlayerId : match.homePlayerId;
                const result = playerScore > opponentScore ? 'W' : playerScore < opponentScore ? 'L' : 'D';

                return (
                  <div key={match.id} className={`history-item result-${result}`}>
                    <div className="result-badge">{result}</div>
                    <div className="match-info">
                      <span className="opponent">vs {getPlayerName(opponentId)}</span>
                      <span className="location">{isHome ? '(H)' : '(A)'}</span>
                    </div>
                    <div className="match-result">
                      {playerScore} - {opponentScore}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No matches played yet</p>
          )}
        </div>

        {upcomingMatches.length > 0 && (
          <div className="upcoming-fixtures">
            <h3>Next Fixtures</h3>
            <div className="fixtures-list">
              {upcomingMatches.slice(0, 3).map((match) => {
                const isHome = match.homePlayerId === player.id;
                const opponentId = isHome ? match.awayPlayerId : match.homePlayerId;
                return (
                  <div key={match.id} className="fixture-item">
                    <span className="opponent">vs {getPlayerName(opponentId)}</span>
                    <span className="location">{isHome ? '(H)' : '(A)'}</span>
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

