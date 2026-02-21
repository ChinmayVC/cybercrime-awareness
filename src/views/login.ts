import { getState, login, notify } from '../state';

export function renderLogin(root: HTMLElement) {
  const state = getState();

  root.innerHTML = `
    <div class="login">
      <div class="login-card">
        <div class="login-header">
          <h1>🛡️ Cyber Awareness</h1>
          <p>Sign in to start playing and track your progress.</p>
        </div>

        <form class="login-form" data-login-form>
          <label class="login-label" for="login-name">Name</label>
          <input
            id="login-name"
            class="login-input"
            type="text"
            value="${escapeHtml(state.userName || '')}"
            maxlength="20"
            placeholder="Enter your name"
            autocomplete="name"
            required
          />

          <label class="login-label" for="login-pass">Password</label>
          <input
            id="login-pass"
            class="login-input"
            type="password"
            placeholder="(demo) any password"
            autocomplete="current-password"
          />

          <button type="submit" class="btn btn-primary login-submit">Login</button>
          <button type="button" class="btn btn-secondary login-guest" data-action="guest">Continue as Guest</button>

          <p class="login-note">
            This app is client-only (no backend). Your progress is saved in this browser.
          </p>
        </form>
      </div>
    </div>
  `;

  const nameEl = root.querySelector('#login-name') as HTMLInputElement | null;
  const form = root.querySelector('[data-login-form]') as HTMLFormElement | null;
  const guestBtn = root.querySelector('[data-action="guest"]') as HTMLButtonElement | null;

  const doLogin = (name: string) => {
    const cleaned = name.trim().slice(0, 20);
    login(cleaned || 'Guest');
    notify();
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    doLogin(nameEl?.value ?? '');
  });

  guestBtn?.addEventListener('click', () => doLogin('Guest'));
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

