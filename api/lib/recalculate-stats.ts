import { prisma } from './prisma.js';

export async function recalculatePlayerStats(tournamentId: string) {
  // Get all matches for this tournament
  const matches = await prisma.match.findMany({
    where: { tournamentId },
  });

  // Get unique player IDs from matches
  const playerIds = new Set<string>();
  matches.forEach(match => {
    playerIds.add(match.homePlayerId);
    playerIds.add(match.awayPlayerId);
  });

  // Get all players involved in this tournament
  const players = await prisma.player.findMany({
    where: {
      id: { in: Array.from(playerIds) },
    },
  });

  // Get ALL played matches for each player (across all tournaments for lifetime stats)
  const allPlayedMatches = await prisma.match.findMany({
    where: {
      played: true,
      OR: [
        { homePlayerId: { in: Array.from(playerIds) } },
        { awayPlayerId: { in: Array.from(playerIds) } },
      ],
    },
  });

  // Recalculate lifetime stats for each player
  for (const player of players) {
    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    // Calculate stats from ALL played matches (lifetime stats)
    allPlayedMatches.forEach((match) => {
      const isHome = match.homePlayerId === player.id;
      const isAway = match.awayPlayerId === player.id;

      if (!isHome && !isAway) return;

      played++;

      const playerGoals = isHome ? match.homeScore! : match.awayScore!;
      const opponentGoals = isHome ? match.awayScore! : match.homeScore!;

      goalsFor += playerGoals;
      goalsAgainst += opponentGoals;

      if (playerGoals > opponentGoals) {
        won++;
      } else if (playerGoals === opponentGoals) {
        drawn++;
      } else {
        lost++;
      }
    });

    const goalDifference = goalsFor - goalsAgainst;
    const points = won * 3 + drawn;

    // Update player's lifetime stats
    await prisma.player.update({
      where: { id: player.id },
      data: {
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
      },
    });
  }
}

