import type { RankLevel } from './types';

/** XP per correct answer; bonus for daily challenge */
export const XP_PER_CORRECT = 10;
export const DAILY_CHALLENGE_BONUS_XP = 25;

/** Ranking levels: visual progress and gamification */
export const RANK_LEVELS: RankLevel[] = [
  { id: 'rookie', name: 'Rookie', minXP: 0, icon: '🌱', color: '#94a3b8' },
  { id: 'defender', name: 'Defender', minXP: 100, icon: '🛡️', color: '#34d399' },
  { id: 'guardian', name: 'Guardian', minXP: 300, icon: '⚔️', color: '#22d3ee' },
  { id: 'sentinel', name: 'Sentinel', minXP: 600, icon: '🔰', color: '#a78bfa' },
  { id: 'expert', name: 'Cyber Expert', minXP: 1000, icon: '👑', color: '#fbbf24' },
];

export function getRankForXP(xp: number): RankLevel {
  let current = RANK_LEVELS[0];
  for (const rank of RANK_LEVELS) {
    if (xp >= rank.minXP) current = rank;
  }
  return current;
}

export function getNextRank(xp: number): RankLevel | null {
  const current = getRankForXP(xp);
  const idx = RANK_LEVELS.indexOf(current);
  return idx < RANK_LEVELS.length - 1 ? RANK_LEVELS[idx + 1] : null;
}

/** Progress to next level (0–1) */
export function getLevelProgress(xp: number): { progress: number; current: RankLevel; next: RankLevel | null } {
  const current = getRankForXP(xp);
  const next = getNextRank(xp);
  if (!next) return { progress: 1, current, next: null };
  const range = next.minXP - current.minXP;
  const into = xp - current.minXP;
  return { progress: Math.min(1, into / range), current, next };
}

export const CATEGORY_LABELS: Record<string, string> = {
  phishing: 'Phishing & Email',
  passwords: 'Passwords & Auth',
  privacy: 'Privacy & Data',
  'social-engineering': 'Social Engineering',
  network: 'Secure Wi‑Fi & Network',
  urls: 'URLs & Links',
  banking: 'Banking & Fraud',
  malware: 'Malware & Downloads',
};
