import { getState, setView, getDailyChallengeGameId, notify } from '../state';
import { allGames } from '../data/scenarios';
import { CATEGORY_LABELS } from '../constants';
import type { GameCategory } from '../types';

export function renderGameSelect(root: HTMLElement) {
  const state = getState();
  const { progress } = state;
  const dailyGameId = getDailyChallengeGameId();

  const byCategory = new Map<GameCategory, typeof allGames>();
  for (const g of allGames) {
    const list = byCategory.get(g.category) ?? [];
    list.push(g);
    byCategory.set(g.category, list);
  }
  const categoryOrder: GameCategory[] = [
    'phishing', 'passwords', 'urls', 'privacy', 'social-engineering', 'network', 'banking', 'malware',
  ];

  const categoryBlocks = categoryOrder
    .filter(c => (byCategory.get(c)?.length ?? 0) > 0)
    .map(cat => {
      const games = byCategory.get(cat)!;
      const label = CATEGORY_LABELS[cat] ?? cat;
      const cards = games.map(g => {
        const high = progress.highScores[g.id] ?? 0;
        const isDaily = g.id === dailyGameId;
        return `
          <button type="button" class="game-card ${isDaily ? 'daily' : ''}" data-game-id="${g.id}">
            ${isDaily ? '<span class="game-daily-badge">📅 Daily</span>' : ''}
            <span class="game-icon">${g.icon}</span>
            <h3>${escapeHtml(g.name)}</h3>
            <p>${escapeHtml(g.description)}</p>
            ${high ? `<span class="high-score">Best: ${high}</span>` : ''}
          </button>
        `;
      }).join('');
      return `
        <div class="game-category" data-category="${cat}">
          <h3 class="category-title">${escapeHtml(label)}</h3>
          <div class="games-grid">${cards}</div>
        </div>
      `;
    }).join('');

  root.innerHTML = `
    <div class="game-select">
      <header class="game-select-header">
        <button type="button" class="btn btn-back" data-action="back">← Back</button>
        <h1>Choose a Game</h1>
        <p>10 mini-games by category. Play the Daily Challenge for bonus XP.</p>
      </header>

      <div class="categories-container">
        ${categoryBlocks}
      </div>
    </div>
  `;

  root.querySelector('[data-action="back"]')?.addEventListener('click', () => {
    setView('dashboard');
    notify();
  });

  root.querySelectorAll('.game-card').forEach(el => {
    el.addEventListener('click', () => {
      const id = (el as HTMLElement).dataset.gameId;
      if (id) {
        setView('game', id);
        notify();
      }
    });
  });
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
