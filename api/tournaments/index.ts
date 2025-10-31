import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const tournaments = await prisma.tournament.findMany({
        include: {
          players: true,
          matches: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).json(tournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      return res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, players, matches } = req.body;

      const tournament = await prisma.tournament.create({
        data: {
          name,
          started: true,
          players: {
            create: players.map((player: any) => ({
              name: player.name,
              played: player.stats.played,
              won: player.stats.won,
              drawn: player.stats.drawn,
              lost: player.stats.lost,
              goalsFor: player.stats.goalsFor,
              goalsAgainst: player.stats.goalsAgainst,
              goalDifference: player.stats.goalDifference,
              points: player.stats.points,
            })),
          },
        },
        include: {
          players: true,
        },
      });

      // Create matches with the actual player IDs
      const playerIdMap = new Map(
        players.map((p: any, idx: number) => [p.id, tournament.players[idx].id])
      );

      const matchesData = matches.map((match: any) => ({
        tournamentId: tournament.id,
        homePlayerId: playerIdMap.get(match.homePlayerId),
        awayPlayerId: playerIdMap.get(match.awayPlayerId),
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        played: match.played,
        round: match.round,
      }));

      await prisma.match.createMany({
        data: matchesData,
      });

      const fullTournament = await prisma.tournament.findUnique({
        where: { id: tournament.id },
        include: {
          players: true,
          matches: true,
        },
      });

      return res.status(200).json(fullTournament);
    } catch (error) {
      console.error('Error creating tournament:', error);
      return res.status(500).json({ error: 'Failed to create tournament' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

