import type { GameScenario } from '../types';
import { getState, setView, setCurrentGameScore, setLastResult, recordGameComplete, getDailyChallengeGameId, notify } from '../state';
import { allGames } from '../data/scenarios';

// Consistent timer for every question (requested: ~20–25s)
const QUESTION_TIME_LIMIT_SECONDS = 25;

let timerId: ReturnType<typeof setInterval> | null = null;
let timeLeft = 0;

export function renderGameRunner(root: HTMLElement) {
  const state = getState();
  const gameId = state.gameId;
  if (!gameId) {
    setView('dashboard');
    notify();
    return;
  }

  const game = allGames.find(g => g.id === gameId);
  if (!game) {
    setView('gameSelect');
    notify();
    return;
  }

  const scenarios = [...game.scenarios];
  let index = 0;
  let score = 0;
  let correctCount = 0;
  let hadPerfectTime = false;

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function showScenario() {
    if (index >= scenarios.length) {
      stopTimer();
      recordGameComplete(gameId, score, scenarios.length, hadPerfectTime, correctCount);
      showResult();
      return;
    }

    const scenario = scenarios[index];
    // Force a consistent time limit for all questions
    timeLeft = QUESTION_TIME_LIMIT_SECONDS;
    setLastResult(null);

    root.innerHTML = `
      <div class="game-runner">
        <header class="game-runner-header">
          <button type="button" class="btn btn-back" data-action="quit">← Quit</button>
          <div class="game-title">${escapeHtml(game.name)}</div>
          <div class="score-time">
            <span class="score">Score: ${score}</span>
            <span class="timer" data-timer>${timeLeft}s</span>
          </div>
        </header>

        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(index / scenarios.length) * 100}%"></div>
        </div>

        <div class="scenario">
          <p class="question">${escapeHtml(scenario.question)}</p>
          <div class="options" data-options>
            ${scenario.options.map((opt, i) => `
              <button type="button" class="option-btn" data-index="${i}">${escapeHtml(opt)}</button>
            `).join('')}
          </div>
        </div>

        <div class="feedback hidden" data-feedback>
          <div class="feedback-result" data-feedback-result></div>
          <p class="feedback-explanation" data-feedback-explanation></p>
          <button type="button" class="btn btn-next" data-action="next">Next</button>
        </div>
      </div>
    `;

    const timerEl = root.querySelector('[data-timer]');
    timerId = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        stopTimer();
        handleAnswer(-1); // timeout = wrong
      }
    }, 1000);

    root.querySelector('[data-action="quit"]')?.addEventListener('click', () => {
      stopTimer();
      setView('gameSelect');
      setCurrentGameScore(score);
      notify();
    });

    root.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt((btn as HTMLElement).dataset.index ?? '-1', 10);
        stopTimer();
        if (timeLeft >= 5) hadPerfectTime = true;
        handleAnswer(i);
      });
    });
  }

  function handleAnswer(selectedIndex: number) {
    const scenario = scenarios[index];
    const correct = selectedIndex === scenario.correctIndex;
    if (correct) {
      score += 10;
      correctCount++;
    }

    setLastResult(correct ? 'correct' : 'wrong');
    setCurrentGameScore(score);

    const feedback = root.querySelector('[data-feedback]');
    const resultEl = root.querySelector('[data-feedback-result]');
    const explanationEl = root.querySelector('[data-feedback-explanation]');
    const optionsEl = root.querySelector('[data-options]');
    const nextBtn = root.querySelector('[data-action="next"]');

    if (feedback && resultEl && explanationEl && optionsEl) {
      optionsEl.classList.add('hidden');
      feedback.classList.remove('hidden');
      resultEl.innerHTML = correct ? '✅ Correct! +10' : '❌ Not quite';
      resultEl.className = 'feedback-result ' + (correct ? 'correct' : 'wrong');
      explanationEl.textContent = scenario.explanation;
    }

    if (nextBtn) {
      const goNext = () => {
        index++;
        showScenario();
      };
      nextBtn.replaceWith(nextBtn.cloneNode(true));
      root.querySelector('[data-action="next"]')?.addEventListener('click', goNext);
    }
  }

  function showResult() {
    const isDaily = getDailyChallengeGameId() === gameId;
    root.innerHTML = `
      <div class="game-result">
        <h2>Round complete!</h2>
        <p class="final-score">Your score: <strong>${score}</strong> / ${scenarios.length * 10}</p>
        ${isDaily ? '<p class="daily-bonus">📅 Daily challenge completed! +25 XP bonus</p>' : ''}
        <div class="result-actions">
          <button type="button" class="btn btn-primary" data-action="again">Play again</button>
          <button type="button" class="btn" data-action="select">Other games</button>
        </div>
      </div>
    `;

    root.querySelector('[data-action="again"]')?.addEventListener('click', () => {
      renderGameRunner(root);
    });
    root.querySelector('[data-action="select"]')?.addEventListener('click', () => {
      setView('gameSelect');
      notify();
    });
  }

  showScenario();
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
