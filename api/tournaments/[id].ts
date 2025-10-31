import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';

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
          players: true,
          matches: true,
        },
      });

      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      return res.status(200).json(tournament);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      return res.status(500).json({ error: 'Failed to fetch tournament' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.tournament.delete({
        where: { id },
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting tournament:', error);
      return res.status(500).json({ error: 'Failed to delete tournament' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

