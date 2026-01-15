
export interface Player {
  id: string;
  name: string;
  number: string;
  team: string;
  photoUrl?: string;
  season: string;
  schedule?: ScheduledGame[];
}

export interface GameStats {
  id: string;
  gameId: string;
  playerId: string;
  date: string;
  opponent: string;
  
  // Shooting
  ftm: number;
  fta: number;
  two_pm: number;
  two_pa: number;
  three_pm: number;
  three_pa: number;
  
  // Other stats
  off_reb: number;
  def_reb: number;
  ast: number;
  stl: number;
  blk: number;
  deflections: number;
  to: number;
  pf: number;
}

export interface ScheduledGame {
  id: string;
  date: string;
  opponent: string;
  time?: string;
}

export type AppView = 'dashboard' | 'setup' | 'edit-player' | 'tracking' | 'history' | 'cards' | 'schedule';
