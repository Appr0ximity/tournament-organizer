import type { Player, Match, PlayerStats, Tournament } from '../types';

export function createTournamentWithPlayers(playerNames: string[]): Tournament {
  const players = playerNames.map(name => createPlayer(name));
  const matches = generateRoundRobinSchedule(players);
  
  return {
    id: crypto.randomUUID(),
    players,
    matches,
    started: true,
  };
}

export function createPlayer(name: string): Player {
  return {
    id: crypto.randomUUID(),
    name,
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
  };
}

export function generateRoundRobinSchedule(players: Player[]): Match[] {
  const matches: Match[] = [];
  let matchId = 0;
  let round = 1;

  // Home and away: each player plays every other player twice
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players.length; j++) {
      if (i !== j) {
        matches.push({
          id: `match-${matchId++}`,
          homePlayerId: players[i].id,
          awayPlayerId: players[j].id,
          homeScore: null,
          awayScore: null,
          played: false,
          round: round,
        });
      }
    }
  }

  // Shuffle matches to randomize schedule
  return shuffleArray(matches).map((match, index) => ({
    ...match,
    round: Math.floor(index / (players.length / 2 || 1)) + 1,
  }));
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function calculatePlayerStats(
  player: Player,
  matches: Match[]
): PlayerStats {
  const stats: PlayerStats = {
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };

  matches.forEach((match) => {
    if (!match.played) return;

    const isHome = match.homePlayerId === player.id;
    const isAway = match.awayPlayerId === player.id;

    if (!isHome && !isAway) return;

    stats.played++;

    const goalsFor = isHome ? match.homeScore! : match.awayScore!;
    const goalsAgainst = isHome ? match.awayScore! : match.homeScore!;

    stats.goalsFor += goalsFor;
    stats.goalsAgainst += goalsAgainst;

    if (goalsFor > goalsAgainst) {
      stats.won++;
      stats.points += 3;
    } else if (goalsFor === goalsAgainst) {
      stats.drawn++;
      stats.points += 1;
    } else {
      stats.lost++;
    }
  });

  stats.goalDifference = stats.goalsFor - stats.goalsAgainst;

  return stats;
}

export function getSortedStandings(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    // Sort by points first
    if (b.stats.points !== a.stats.points) {
      return b.stats.points - a.stats.points;
    }
    // Then by goal difference
    if (b.stats.goalDifference !== a.stats.goalDifference) {
      return b.stats.goalDifference - a.stats.goalDifference;
    }
    // Then by goals scored
    if (b.stats.goalsFor !== a.stats.goalsFor) {
      return b.stats.goalsFor - a.stats.goalsFor;
    }
    // Finally alphabetically
    return a.name.localeCompare(b.name);
  });
}

