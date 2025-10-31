import { useState } from 'react';
import type { Match, Player } from '../types';
import './MatchList.css';

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
    <div className="match-list">
      <div className="match-list-header">
        <h2>⚽ Matches</h2>
        <div className="match-stats">
          <span className="stat">
            <strong>{playedMatches.length}</strong> Played
          </span>
          <span className="stat">
            <strong>{upcomingMatches.length}</strong> Remaining
          </span>
        </div>
      </div>

      <div className="match-filter">
        <button
          className={`filter-btn ${!showAll ? 'active' : ''}`}
          onClick={() => setShowAll(false)}
        >
          Upcoming ({upcomingMatches.length})
        </button>
        <button
          className={`filter-btn ${showAll ? 'active' : ''}`}
          onClick={() => setShowAll(true)}
        >
          All Matches ({matches.length})
        </button>
      </div>

      <div className="matches">
        {displayMatches.length === 0 ? (
          <p className="no-matches">
            {showAll ? 'No matches yet' : 'All matches completed!'}
          </p>
        ) : (
          displayMatches.map((match) => (
            <div
              key={match.id}
              className={`match-card ${match.played ? 'played' : 'upcoming'}`}
            >
              <div className="match-teams">
                <div className="team home">
                  <span className="team-name">{getPlayerName(match.homePlayerId)}</span>
                  <span className="home-badge">HOME</span>
                </div>

                <div className="match-score">
                  {editingMatch === match.id ? (
                    <div className="score-input">
                      <input
                        type="number"
                        min="0"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="score-field"
                        placeholder="0"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min="0"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        className="score-field"
                        placeholder="0"
                      />
                    </div>
                  ) : (
                    <div className="score-display">
                      {match.played ? (
                        <>
                          <span className="score">{match.homeScore}</span>
                          <span className="separator">-</span>
                          <span className="score">{match.awayScore}</span>
                        </>
                      ) : (
                        <span className="vs">vs</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="team away">
                  <span className="away-badge">AWAY</span>
                  <span className="team-name">{getPlayerName(match.awayPlayerId)}</span>
                </div>
              </div>

              <div className="match-actions">
                {editingMatch === match.id ? (
                  <>
                    <button
                      onClick={() => handleSaveScore(match.id)}
                      className="btn btn-save"
                    >
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="btn btn-cancel">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditMatch(match)}
                    className="btn btn-edit"
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

