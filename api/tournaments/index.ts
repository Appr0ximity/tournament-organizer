import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma.js';

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
          matches: {
            include: {
              homePlayer: true,
              awayPlayer: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Get unique players from matches
      const tournamentsWithPlayers = tournaments.map(tournament => {
        const playerIds = new Set<string>();
        tournament.matches.forEach(match => {
          playerIds.add(match.homePlayerId);
          playerIds.add(match.awayPlayerId);
        });

        const players = Array.from(playerIds).map(id => {
          const match = tournament.matches.find(
            m => m.homePlayerId === id || m.awayPlayerId === id
          );
          return match?.homePlayerId === id ? match.homePlayer : match?.awayPlayer;
        }).filter(Boolean);

        return {
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
      });

      return res.status(200).json(tournamentsWithPlayers);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      return res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, players, matches } = req.body;

      console.log('Creating tournament with:', { name, playersCount: players?.length, matchesCount: matches?.length });

      // Create tournament
      const tournament = await prisma.tournament.create({
        data: {
          name,
          started: true,
        },
      });

      // Get or create players (reuse existing players by name)
      const playerRecords = await Promise.all(
        players.map(async (player: any) => {
          // Try to find existing player by name
          let existingPlayer = await prisma.player.findUnique({
            where: { name: player.name },
          });

          // If doesn't exist, create new player
          if (!existingPlayer) {
            existingPlayer = await prisma.player.create({
              data: {
                name: player.name,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
              },
            });
          }

          return existingPlayer;
        })
      );

      // Create player ID mapping (from frontend temp IDs to database IDs)
      const playerIdMap = new Map(
        players.map((p: any, idx: number) => [p.id, playerRecords[idx].id])
      );

      // Create matches with the actual player IDs
      const matchesData = matches.map((match: any) => ({
        tournamentId: tournament.id,
        homePlayerId: playerIdMap.get(match.homePlayerId)!,
        awayPlayerId: playerIdMap.get(match.awayPlayerId)!,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        played: match.played,
        round: match.round,
      }));

      await prisma.match.createMany({
        data: matchesData,
      });

      // Return tournament with players and matches
      const fullTournament = {
        ...tournament,
        players: playerRecords,
        matches: await prisma.match.findMany({
          where: { tournamentId: tournament.id },
        }),
      };

      return res.status(200).json(fullTournament);
    } catch (error) {
      console.error('Error creating tournament:', error);
      return res.status(500).json({ 
        error: 'Failed to create tournament',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

