import { prisma } from './prisma';

export async function recalculatePlayerStats(tournamentId: string) {
  const players = await prisma.player.findMany({
    where: { tournamentId },
  });

  const matches = await prisma.match.findMany({
    where: { tournamentId, played: true },
  });

  for (const player of players) {
    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    matches.forEach((match) => {
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

