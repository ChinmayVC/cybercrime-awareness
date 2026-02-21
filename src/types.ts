export type View = 'login' | 'dashboard' | 'gameSelect' | 'game' | 'insights';

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Categories for grouping mini-games (hackathon-friendly: easy to add more) */
export type GameCategory =
  | 'phishing'
  | 'passwords'
  | 'privacy'
  | 'social-engineering'
  | 'network'
  | 'urls'
  | 'banking'
  | 'malware';

export interface GameScenario {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  timeLimit?: number;
}

export interface GameDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: GameCategory;
  scenarios: GameScenario[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: number;
}

/** Per-category stats for performance insights */
export interface CategoryStats {
  correct: number;
  total: number;
}

export interface UserProgress {
  totalScore: number;
  totalXP: number;
  gamesPlayed: number;
  badges: Badge[];
  lastPlayed: number;
  highScores: Record<string, number>;
  /** For personalized insights: correct/total per category */
  categoryStats: Record<GameCategory, CategoryStats>;
  /** Date string (YYYY-MM-DD) when user last completed daily challenge */
  dailyCompletedAt: string | null;
}

export interface RankLevel {
  id: string;
  name: string;
  minXP: number;
  icon: string;
  color: string;
}
