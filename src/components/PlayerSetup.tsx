import { useState } from 'react';
import './PlayerSetup.css';

interface PlayerSetupProps {
  onStartTournament: (playerNames: string[]) => void;
}

export default function PlayerSetup({ onStartTournament }: PlayerSetupProps) {
  const [playerName, setPlayerName] = useState('');
  const [playerList, setPlayerList] = useState<string[]>([]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && !playerList.includes(playerName.trim())) {
      setPlayerList([...playerList, playerName.trim()]);
      setPlayerName('');
    }
  };

  const handleRemovePlayer = (name: string) => {
    setPlayerList(playerList.filter((p) => p !== name));
  };

  const handleStartTournament = () => {
    if (playerList.length >= 2) {
      onStartTournament(playerList);
    }
  };

  return (
    <div className="player-setup">
      <h1>🏆 FIFA Tournament Organizer</h1>
      <div className="setup-container">
        <h2>Add Players</h2>
        <form onSubmit={handleAddPlayer} className="add-player-form">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="player-input"
          />
          <button type="submit" className="btn btn-add">
            Add Player
          </button>
        </form>

        {playerList.length > 0 && (
          <div className="player-list">
            <h3>Players ({playerList.length})</h3>
            <ul>
              {playerList.map((name) => (
                <li key={name}>
                  <span>{name}</span>
                  <button
                    onClick={() => handleRemovePlayer(name)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleStartTournament}
          disabled={playerList.length < 2}
          className="btn btn-start"
        >
          Start Tournament
        </button>
        {playerList.length < 2 && (
          <p className="hint">Add at least 2 players to start</p>
        )}
      </div>
    </div>
  );
}

