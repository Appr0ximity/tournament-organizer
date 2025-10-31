import { useState } from 'react';

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
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">🏆 FIFA Tournament Organizer</h1>
      <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Add Players</h2>
        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-8">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button type="submit" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300">
            Add Player
          </button>
        </form>

        {playerList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Players ({playerList.length})</h3>
            <ul className="space-y-2">
              {playerList.map((name) => (
                <li key={name} className="flex justify-between items-center px-4 py-3 bg-white rounded-lg shadow-sm">
                  <span className="font-medium text-gray-800">{name}</span>
                  <button
                    onClick={() => handleRemovePlayer(name)}
                    className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm font-bold"
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
          className="w-full py-4 bg-green-500 text-white font-semibold text-lg rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 mt-4"
        >
          Start Tournament
        </button>
        {playerList.length < 2 && (
          <p className="text-center text-gray-500 text-sm mt-2">Add at least 2 players to start</p>
        )}
      </div>
    </div>
  );
}

