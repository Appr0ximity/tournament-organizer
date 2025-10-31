import type { Player, Match } from '../types';

// In production (Vercel), API routes are at /api
// In development, they're at http://localhost:3001/api (if using Express) or can use Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Tournament endpoints
  async getTournaments(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/tournaments`);
    if (!response.ok) throw new Error('Failed to fetch tournaments');
    return response.json();
  },

  async getTournament(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`);
    if (!response.ok) throw new Error('Failed to fetch tournament');
    return response.json();
  },

  async createTournament(data: {
    name: string;
    players: Player[];
    matches: Match[];
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tournaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create tournament');
    return response.json();
  },

  async deleteTournament(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete tournament');
  },

  // Match endpoints
  async updateMatch(
    id: string,
    data: { homeScore: number; awayScore: number; played: boolean }
  ): Promise<Match> {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update match');
    return response.json();
  },

  // Player endpoints
  async updatePlayer(id: string, stats: any): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats }),
    });
    if (!response.ok) throw new Error('Failed to update player');
    return response.json();
  },
};

