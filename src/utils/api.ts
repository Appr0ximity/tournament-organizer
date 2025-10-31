import type { Player, Match, Tournament } from '../types';

// In production (Vercel), API routes are at /api
// In development, they're at http://localhost:3001/api (if using Express) or can use Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Tournament endpoints
export async function getTournaments(): Promise<Tournament[]> {
  const response = await fetch(`${API_BASE_URL}/tournaments`);
  if (!response.ok) throw new Error('Failed to fetch tournaments');
  return response.json();
}

export async function getTournament(id: string): Promise<Tournament> {
  const response = await fetch(`${API_BASE_URL}/tournaments/${id}`);
  if (!response.ok) throw new Error('Failed to fetch tournament');
  return response.json();
}

export async function createTournament(
  players: Player[],
  matches: Match[]
): Promise<Tournament> {
  const response = await fetch(`${API_BASE_URL}/tournaments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'FIFA Tournament',
      players,
      matches,
    }),
  });
  if (!response.ok) throw new Error('Failed to create tournament');
  return response.json();
}

export async function deleteTournament(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete tournament');
}

// Match endpoints
export async function updateMatch(
  id: string,
  homeScore: number,
  awayScore: number
): Promise<Match> {
  const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      homeScore,
      awayScore,
      played: true,
    }),
  });
  if (!response.ok) throw new Error('Failed to update match');
  return response.json();
}

// Player endpoints
export async function updatePlayer(id: string, stats: any): Promise<Player> {
  const response = await fetch(`${API_BASE_URL}/players/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stats }),
  });
  if (!response.ok) throw new Error('Failed to update player');
  return response.json();
}

