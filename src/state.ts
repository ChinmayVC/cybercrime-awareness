import type { View, UserProgress, LeaderboardEntry, Badge, GameCategory } from './types';
import { allGames } from './data/scenarios';
import { getLevelProgress } from './constants';
import { XP_PER_CORRECT, DAILY_CHALLENGE_BONUS_XP } from './constants';

const STORAGE_KEY = 'cyber-awareness-app';
const LEADERBOARD_KEY = 'cyber-awareness-leaderboard';
const AUTH_KEY = 'cyber-awareness-auth';

type AuthState = {
  isLoggedIn: boolean;
  userName: string;
};

const CATEGORIES: GameCategory[] = [
  'phishing', 'passwords', 'privacy', 'social-engineering', 'network', 'urls', 'banking', 'malware',
];

function defaultCategoryStats(): Record<GameCategory, { correct: number; total: number }> {
  const o = {} as Record<GameCategory, { correct: number; total: number }>;
  for (const c of CATEGORIES) o[c] = { correct: 0, total: 0 };
  return o;
}

const defaultProgress: UserProgress = {
  totalScore: 0,
  totalXP: 0,
  gamesPlayed: 0,
  badges: [],
  lastPlayed: 0,
  highScores: {},
  categoryStats: defaultCategoryStats(),
  dailyCompletedAt: null,
};

const defaultBadges: Badge[] = [
  { id: 'first-game', name: 'First Steps', description: 'Complete your first game', icon: '🎮' },
  { id: 'score-100', name: 'Century', description: 'Reach 100 total points', icon: '💯' },
  { id: 'score-500', name: 'Cyber Scout', description: 'Reach 500 total points', icon: '⭐' },
  { id: 'perfect-round', name: 'Perfect Round', description: 'Answer all questions correctly in one game', icon: '🏆' },
  { id: 'speed-demon', name: 'Quick Thinker', description: 'Complete a scenario with 5+ seconds left', icon: '⚡' },
  { id: 'three-games', name: 'Triple Threat', description: 'Play 3 different games', icon: '🎯' },
  { id: 'daily', name: 'Daily Defender', description: 'Complete the daily challenge', icon: '📅' },
  { id: 'level-defender', name: 'Defender', description: 'Reach Defender rank', icon: '🛡️' },
  { id: 'level-guardian', name: 'Guardian', description: 'Reach Guardian rank', icon: '⚔️' },
  { id: 'level-expert', name: 'Cyber Expert', description: 'Reach Cyber Expert rank', icon: '👑' },
  { id: 'all-categories', name: 'All-Rounder', description: 'Play at least one game in every category', icon: '🌟' },
];

export interface AppState {
  view: View;
  gameId: string | null;
  userName: string;
  isLoggedIn: boolean;
  progress: UserProgress;
  leaderboard: LeaderboardEntry[];
  currentGameScore: number;
  lastResult: 'correct' | 'wrong' | null;
}

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { isLoggedIn: false, userName: 'Player' };
    const parsed = JSON.parse(raw);
    return {
      isLoggedIn: Boolean(parsed?.isLoggedIn),
      userName: typeof parsed?.userName === 'string' && parsed.userName.trim() ? parsed.userName : 'Player',
    };
  } catch {
    return { isLoggedIn: false, userName: 'Player' };
  }
}

function saveAuth() {
  try {
    const payload: AuthState = { isLoggedIn: state.isLoggedIn, userName: state.userName };
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  } catch (_) {}
}

const initialAuth = loadAuth();
let state: AppState = {
  view: initialAuth.isLoggedIn ? 'dashboard' : 'login',
  gameId: null,
  userName: initialAuth.userName || 'Player',
  isLoggedIn: initialAuth.isLoggedIn,
  progress: loadProgress(),
  leaderboard: loadLeaderboard(),
  currentGameScore: 0,
  lastResult: null,
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress, badges: defaultBadges.map(b => ({ ...b })), categoryStats: defaultCategoryStats() };
    const parsed = JSON.parse(raw);
    const badges = (parsed.badges?.length ? parsed.badges : defaultBadges.map(b => ({ ...b }))) as Badge[];
    const categoryStats = parsed.categoryStats && typeof parsed.categoryStats === 'object'
      ? { ...defaultCategoryStats(), ...parsed.categoryStats }
      : defaultCategoryStats();
    return {
      ...defaultProgress,
      ...parsed,
      badges,
      categoryStats,
      totalXP: typeof parsed.totalXP === 'number' ? parsed.totalXP : (parsed.totalScore ?? 0),
    };
  } catch {
    return { ...defaultProgress, badges: defaultBadges.map(b => ({ ...b })), categoryStats: defaultCategoryStats() };
  }
}

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  } catch (_) {}
}

function saveLeaderboard() {
  try {
    const sorted = [...state.leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sorted));
  } catch (_) {}
}

/** Date string YYYY-MM-DD for today (local) */
export function getTodayDateString(): string {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/** Daily challenge: one game per day (deterministic from date) */
export function getDailyChallengeGameId(): string {
  const today = getTodayDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash = ((hash << 5) - hash) + today.charCodeAt(i) | 0;
  const index = Math.abs(hash) % allGames.length;
  return allGames[index].id;
}

export function getState(): Readonly<AppState> {
  return state;
}

export function setView(view: View, gameId: string | null = null) {
  state.view = view;
  state.gameId = gameId;
}

export function setUserName(name: string) {
  state.userName = name;
  saveAuth();
}

export function login(userName: string) {
  state.userName = userName.trim() || 'Player';
  state.isLoggedIn = true;
  state.view = 'dashboard';
  state.gameId = null;
  saveAuth();
}

export function logout() {
  state.isLoggedIn = false;
  state.view = 'login';
  state.gameId = null;
  saveAuth();
}

export function setCurrentGameScore(score: number) {
  state.currentGameScore = score;
}

export function setLastResult(result: 'correct' | 'wrong' | null) {
  state.lastResult = result;
}

export function recordGameComplete(
  gameId: string,
  score: number,
  totalQuestions: number,
  hadPerfectTime: boolean,
  correctCount: number,
) {
  const p = state.progress;
  const game = allGames.find(g => g.id === gameId);
  const category = game?.category;

  p.totalScore += score;
  const xpGained = correctCount * XP_PER_CORRECT;
  const isDaily = getDailyChallengeGameId() === gameId;
  const dailyBonus = isDaily && p.dailyCompletedAt !== getTodayDateString() ? DAILY_CHALLENGE_BONUS_XP : 0;
  p.totalXP += xpGained + dailyBonus;
  p.gamesPlayed += 1;
  p.lastPlayed = Date.now();
  p.highScores[gameId] = Math.max(p.highScores[gameId] ?? 0, score);

  if (category && game) {
    const catStats = p.categoryStats[category];
    if (catStats) {
      const scenarioCount = game.scenarios.length;
      catStats.correct += correctCount;
      catStats.total += scenarioCount;
    }
  }

  if (isDaily && p.dailyCompletedAt !== getTodayDateString()) {
    p.dailyCompletedAt = getTodayDateString();
  }

  state.leaderboard.push({
    name: state.userName,
    score: score,
    date: Date.now(),
  });
  saveLeaderboard();

  const { current: rank } = getLevelProgress(p.totalXP);
  const badges = p.badges;
  const earn = (id: string) => {
    const b = badges.find(x => x.id === id);
    if (b && !b.earnedAt) b.earnedAt = Date.now();
  };
  if (p.gamesPlayed >= 1) earn('first-game');
  if (p.totalScore >= 100) earn('score-100');
  if (p.totalScore >= 500) earn('score-500');
  if (totalQuestions > 0 && score >= totalQuestions * 10) earn('perfect-round');
  if (hadPerfectTime) earn('speed-demon');
  const uniqueGames = new Set(Object.keys(p.highScores)).size;
  if (uniqueGames >= 3) earn('three-games');
  if (p.dailyCompletedAt) earn('daily');
  if (rank.id === 'defender') earn('level-defender');
  if (rank.id === 'guardian') earn('level-guardian');
  if (rank.id === 'expert') earn('level-expert');
  const categoriesPlayed = CATEGORIES.filter(c => (p.categoryStats[c]?.total ?? 0) > 0).length;
  if (categoriesPlayed >= CATEGORIES.length) earn('all-categories');

  saveProgress();
}

export function resetProgress() {
  state.progress = {
    ...defaultProgress,
    badges: defaultBadges.map(b => ({ ...b })),
    categoryStats: defaultCategoryStats(),
  };
  saveProgress();
}

type Listener = () => void;
const listeners: Listener[] = [];

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    const i = listeners.indexOf(listener);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function notify() {
  listeners.forEach(fn => fn());
}
