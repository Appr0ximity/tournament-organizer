import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma.js';
import { recalculatePlayerStats } from '../lib/recalculate-stats.js';

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
    return res.status(400).json({ error: 'Invalid match ID' });
  }

  if (req.method === 'PATCH') {
    try {
      const { homeScore, awayScore, played } = req.body;

      const match = await prisma.match.update({
        where: { id },
        data: {
          homeScore,
          awayScore,
          played,
        },
      });

      // Recalculate player stats for this match
      if (played) {
        await recalculatePlayerStats(match.tournamentId);
      }

      return res.status(200).json(match);
    } catch (error) {
      console.error('Error updating match:', error);
      return res.status(500).json({ error: 'Failed to update match' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

