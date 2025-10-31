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
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-5xl font-bold text-center mb-12 text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
        🏆 FIFA TOURNAMENT
      </h1>
      <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/30 shadow-neon-cyan/20">
        <h2 className="text-2xl font-bold mb-6 text-white uppercase tracking-wider">Add Players</h2>
        <form onSubmit={handleAddPlayer} className="flex gap-3 mb-8">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 px-4 py-3 bg-gray-900 border border-neon-cyan/40 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan/50 transition-all"
          />
          <button 
            type="submit" 
            className="px-8 py-3 bg-neon-cyan/10 text-neon-cyan font-bold rounded border border-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 hover:shadow-neon-cyan uppercase tracking-wide"
          >
            Add
          </button>
        </form>

        {playerList.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-300 uppercase tracking-wider">
              Players · {playerList.length}
            </h3>
            <ul className="space-y-2">
              {playerList.map((name) => (
                <li 
                  key={name} 
                  className="flex justify-between items-center px-5 py-3 bg-gray-900/80 rounded border border-gray-800 hover:border-neon-pink/40 transition-all group"
                >
                  <span className="font-medium text-white group-hover:text-neon-pink transition-colors">{name}</span>
                  <button
                    onClick={() => handleRemovePlayer(name)}
                    className="w-8 h-8 flex items-center justify-center bg-red-500/20 text-red-400 rounded border border-red-500/40 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
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
          className={`w-full py-4 font-bold text-lg rounded transition-all duration-300 uppercase tracking-wider ${
            playerList.length >= 2
              ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-black hover:shadow-neon-cyan cursor-pointer'
              : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Start Tournament
        </button>
        {playerList.length < 2 && (
          <p className="text-center text-gray-500 text-sm mt-3">Minimum 2 players required</p>
        )}
      </div>
    </div>
  );
}
