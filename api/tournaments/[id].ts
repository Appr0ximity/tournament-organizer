import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid tournament ID' });
  }

  if (req.method === 'GET') {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id },
        include: {
          matches: {
            include: {
              homePlayer: true,
              awayPlayer: true,
            },
          },
        },
      });

      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      // Get unique players from matches
      const playerIds = new Set<string>();
      tournament.matches.forEach(match => {
        playerIds.add(match.homePlayerId);
        playerIds.add(match.awayPlayerId);
      });

      const players = Array.from(playerIds).map(playerId => {
        const match = tournament.matches.find(
          m => m.homePlayerId === playerId || m.awayPlayerId === playerId
        );
        return match?.homePlayerId === playerId ? match.homePlayer : match?.awayPlayer;
      }).filter(Boolean);

      const response = {
        ...tournament,
        players,
        matches: tournament.matches.map(m => ({
          id: m.id,
          tournamentId: m.tournamentId,
          homePlayerId: m.homePlayerId,
          awayPlayerId: m.awayPlayerId,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          played: m.played,
          round: m.round,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        })),
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      return res.status(500).json({ error: 'Failed to fetch tournament' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Only delete tournament and matches - players are preserved
      await prisma.tournament.delete({
        where: { id },
      });
      return res.status(200).json({ success: true, message: 'Tournament deleted, player stats preserved' });
    } catch (error) {
      console.error('Error deleting tournament:', error);
      return res.status(500).json({ error: 'Failed to delete tournament' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

