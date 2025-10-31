export interface Player {
  id: string;
  name: string;
  stats: PlayerStats;
}

export interface PlayerStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Match {
  id: string;
  homePlayerId: string;
  awayPlayerId: string;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
  round: number;
}

export interface Tournament {
  players: Player[];
  matches: Match[];
  started: boolean;
}

