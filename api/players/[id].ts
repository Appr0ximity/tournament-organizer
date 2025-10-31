import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid player ID' });
  }

  if (req.method === 'PATCH') {
    try {
      const { stats } = req.body;

      const player = await prisma.player.update({
        where: { id },
        data: {
          played: stats.played,
          won: stats.won,
          drawn: stats.drawn,
          lost: stats.lost,
          goalsFor: stats.goalsFor,
          goalsAgainst: stats.goalsAgainst,
          goalDifference: stats.goalDifference,
          points: stats.points,
        },
      });

      return res.status(200).json(player);
    } catch (error) {
      console.error('Error updating player:', error);
      return res.status(500).json({ error: 'Failed to update player' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

