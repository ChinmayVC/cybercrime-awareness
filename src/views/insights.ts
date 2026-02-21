import { getState, setView, notify } from '../state';
import { CATEGORY_LABELS } from '../constants';
import type { GameCategory } from '../types';

const CATEGORY_ORDER: GameCategory[] = [
  'phishing', 'passwords', 'urls', 'privacy', 'social-engineering', 'network', 'banking', 'malware',
];

export function renderInsights(root: HTMLElement) {
  const state = getState();
  const { progress } = state;

  const stats = CATEGORY_ORDER.map(cat => {
    const s = progress.categoryStats[cat];
    const total = s?.total ?? 0;
    const correct = s?.correct ?? 0;
    const pct = total > 0 ? Math.round((correct / total) * 100) : null;
    const label = CATEGORY_LABELS[cat] ?? cat;
    return { cat, label, total, correct, pct };
  }).filter(x => x.total > 0);

  const byPct = [...stats].sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));
  const strongest = byPct[0];
  const weakest = byPct.length > 1 ? byPct[byPct.length - 1] : null;

  root.innerHTML = `
    <div class="insights">
      <header class="insights-header">
        <button type="button" class="btn btn-back" data-action="back">← Back</button>
        <h1>📊 Performance Insights</h1>
        <p>Personalized view of your cybersecurity awareness by category.</p>
      </header>

      ${stats.length === 0
        ? '<p class="insights-empty">Play some games to see your insights here.</p>'
        : `
      <section class="insights-summary">
        <h2>At a glance</h2>
        <div class="summary-cards">
          ${strongest ? `
            <div class="summary-card strength">
              <span class="summary-label">Strongest</span>
              <span class="summary-value">${escapeHtml(strongest.label)}</span>
              <span class="summary-pct">${strongest.pct}% correct</span>
            </div>
          ` : ''}
          ${weakest && weakest !== strongest ? `
            <div class="summary-card weakness">
              <span class="summary-label">Practice more</span>
              <span class="summary-value">${escapeHtml(weakest.label)}</span>
              <span class="summary-pct">${weakest.pct}% correct</span>
            </div>
          ` : ''}
        </div>
      </section>

      <section class="insights-breakdown">
        <h2>By category</h2>
        <ul class="insights-list">
          ${stats.map(({ label, total, correct, pct }) => `
            <li class="insight-row">
              <div class="insight-info">
                <span class="insight-label">${escapeHtml(label)}</span>
                <span class="insight-detail">${correct}/${total} correct (${pct}%)</span>
              </div>
              <div class="insight-bar-wrap">
                <div class="insight-bar" style="width: ${pct}%"></div>
              </div>
            </li>
          `).join('')}
        </ul>
      </section>

      <section class="insights-tips">
        <h2>💡 Tip</h2>
        <p>Replay games in your weaker categories to improve. Daily challenges rotate through all topics.</p>
      </section>
      `}

      <div class="insights-actions">
        <button type="button" class="btn btn-primary" data-action="play">Play Games</button>
      </div>
    </div>
  `;

  root.querySelector('[data-action="back"]')?.addEventListener('click', () => {
    setView('dashboard');
    notify();
  });

  root.querySelector('[data-action="play"]')?.addEventListener('click', () => {
    setView('gameSelect');
    notify();
  });
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
