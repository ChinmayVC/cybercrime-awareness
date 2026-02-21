# 🛡️ Cyber Awareness App

A **gamified cybersecurity awareness** web app with short, interactive mini-games to help users recognize real-world cyber threats.

## Features

- **Mini-games** on: Phishing detection, Password strength, URL safety, Fake OTP/SMS, Social media scams
- **Scenario-based, time-bound** questions with instant feedback and explanations
- **Scoring** (10 points per correct answer) and **leaderboard** (top 10)
- **Badges** for milestones: First game, 100/500 points, Perfect round, Quick thinker, Triple threat
- **Progress tracking**: total score, games played, high score per game
- **Difficulty levels** (easy/medium/hard) on scenarios

## How to run

1. Install dependencies (if not already done):
   ```bash
   cd cyber-awareness-app
   npm install
   ```

2. Start the dev server (runs over **HTTPS**):
   ```bash
   npm run dev
   ```

3. Open the URL shown in the terminal (e.g. **https://localhost:5173**) in your browser. If you see a certificate warning, choose **Advanced** → **Proceed to localhost**.

   **If HTTPS doesn’t work** on your machine (e.g. certificate or port issues), run over HTTP instead:
   ```bash
   npm run dev:http
   ```
   Then open **http://localhost:5173**.

## Build for production

```bash
npm run build
```

Output will be in `dist/`. Serve that folder with any static file server.

## Tech

- **Vite** + **TypeScript**
- No backend: progress and leaderboard are stored in the browser (localStorage).
