import { getState, setView, setUserName, logout, getDailyChallengeGameId, getTodayDateString, notify } from '../state';
import { getLevelProgress } from '../constants';
import { allGames } from '../data/scenarios';

export function renderDashboard(root: HTMLElement) {
  const state = getState();
  const { progress, leaderboard, userName } = state;

  const topScores = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 5);
  const { progress: levelProgress, current: rank, next: nextRank } = getLevelProgress(progress.totalXP);
  const dailyGameId = getDailyChallengeGameId();
  const dailyGame = allGames.find(g => g.id === dailyGameId);
  const dailyDone = progress.dailyCompletedAt === getTodayDateString();

  root.innerHTML = `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>🛡️ Cyber Awareness</h1>
        <p class="tagline">Learn security through play</p>
        <div class="dashboard-topbar">
          <div class="player-name-wrap">
            <label for="player-name">Your name</label>
            <input id="player-name" type="text" value="${escapeHtml(userName)}" maxlength="20" placeholder="Player" />
          </div>
          <button type="button" class="btn btn-back" data-action="logout">Logout</button>
        </div>
      </header>

      <section class="level-section">
        <div class="rank-badge" style="--rank-color: ${rank.color}">
          <span class="rank-icon">${rank.icon}</span>
          <span class="rank-name">${escapeHtml(rank.name)}</span>
        </div>
        <div class="level-bar-wrap">
          <div class="level-bar" role="progressbar" aria-valuenow="${Math.round(levelProgress * 100)}" aria-valuemin="0" aria-valuemax="100">
            <div class="level-fill" style="width: ${levelProgress * 100}%; background: ${rank.color}"></div>
          </div>
          <div class="level-labels">
            <span>${progress.totalXP} XP</span>
            ${nextRank ? `<span>${nextRank.minXP} XP → ${escapeHtml(nextRank.name)}</span>` : '<span>Max rank!</span>'}
          </div>
        </div>
      </section>

      <section class="daily-section">
        <h2>📅 Daily Challenge</h2>
        ${dailyGame ? `
          <div class="daily-card ${dailyDone ? 'completed' : ''}">
            <div class="daily-game">
              <span class="daily-icon">${dailyGame.icon}</span>
              <div>
                <strong>${escapeHtml(dailyGame.name)}</strong>
                <p>${escapeHtml(dailyGame.description)}</p>
              </div>
            </div>
            ${dailyDone
              ? '<span class="daily-done">✓ Done today</span>'
              : `<button type="button" class="btn btn-primary btn-daily" data-action="daily-play" data-game-id="${dailyGame.id}">Play for +25 XP bonus</button>`}
          </div>
        ` : ''}
      </section>

      <section class="stats">
        <div class="stat-card">
          <span class="stat-value">${progress.totalScore}</span>
          <span class="stat-label">Total Score</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${progress.gamesPlayed}</span>
          <span class="stat-label">Games Played</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${progress.badges.filter(b => b.earnedAt).length}</span>
          <span class="stat-label">Badges</span>
        </div>
      </section>

      <section class="badges-section">
        <h2>Badges</h2>
        <div class="badges-grid">
          ${progress.badges.map(b => `
            <div class="badge ${b.earnedAt ? 'earned' : 'locked'}" title="${escapeHtml(b.description)}">
              <span class="badge-icon">${b.icon}</span>
              <span class="badge-name">${escapeHtml(b.name)}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="leaderboard-section">
        <h2>Leaderboard</h2>
        <ul class="leaderboard-list">
          ${topScores.length ? topScores.map((e, i) => `
            <li><span class="rank">#${i + 1}</span> ${escapeHtml(e.name)} — ${e.score} pts</li>
          `).join('') : '<li class="empty">Play games to appear here!</li>'}
        </ul>
      </section>

      <div class="dashboard-actions">
        <button type="button" class="btn btn-primary" data-action="play">Play Games</button>
        <button type="button" class="btn btn-secondary" data-action="insights">My Performance</button>
      </div>
    </div>
  `;

  const nameInput = root.querySelector('#player-name') as HTMLInputElement;
  if (nameInput) {
    nameInput.addEventListener('change', () => {
      setUserName(nameInput.value.trim() || 'Player');
      notify();
    });
  }

  root.querySelector('[data-action="play"]')?.addEventListener('click', () => {
    setView('gameSelect');
    notify();
  });

  root.querySelector('[data-action="insights"]')?.addEventListener('click', () => {
    setView('insights');
    notify();
  });

  root.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    logout();
    notify();
  });

  const dailyBtn = root.querySelector('[data-action="daily-play"]');
  if (dailyBtn) {
    const gameId = (dailyBtn as HTMLElement).dataset.gameId;
    dailyBtn.addEventListener('click', () => {
      if (gameId) {
        setView('game', gameId);
        notify();
      }
    });
  }
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
