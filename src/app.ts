import { getState, subscribe } from './state';
import { renderDashboard } from './views/dashboard';
import { renderGameSelect } from './views/gameSelect';
import { renderGameRunner } from './views/gameRunner';
import { renderInsights } from './views/insights';
import { renderLogin } from './views/login';

const root = document.getElementById('app')!;

function render() {
  const state = getState();
  root.innerHTML = '';

  if (!state.isLoggedIn) {
    renderLogin(root);
    return;
  }

  switch (state.view) {
    case 'login':
      renderLogin(root);
      break;
    case 'dashboard':
      renderDashboard(root);
      break;
    case 'gameSelect':
      renderGameSelect(root);
      break;
    case 'game':
      renderGameRunner(root);
      break;
    case 'insights':
      renderInsights(root);
      break;
    default:
      renderDashboard(root);
  }
}

render();
subscribe(render);
