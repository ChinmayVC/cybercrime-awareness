# Cyber Awareness Platform — Design & Implementation Guide

This document describes the **UI flow**, **game logic structure**, and **scalable implementation ideas** for the gamified cybersecurity awareness platform. Suitable for hackathon demos and future extension.

---

## 1. UI Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DASHBOARD (Home)                          │
│  • Rank badge + level progress bar (XP → next rank)               │
│  • Daily Challenge card (one game/day, +25 XP bonus)                │
│  • Stats: Total score, Games played, Badges count                  │
│  • Badges grid (earned vs locked)                                 │
│  • Leaderboard (top 5)                                             │
│  • [Play Games]  [My Performance]                                  │
└─────────────────────────────────────────────────────────────────┘
         │                              │
         │ Play Games                    │ My Performance
         ▼                              ▼
┌──────────────────────┐    ┌─────────────────────────────────────┐
│   GAME SELECT        │    │   INSIGHTS (Performance)              │
│   By category:       │    │   • Strongest / Weakest category       │
│   • Phishing & Email │    │   • Per-category accuracy bars         │
│   • Passwords & Auth │    │   • Tip: replay weaker categories      │
│   • URLs & Links     │    │   • [Play Games]                       │
│   • Privacy & Data   │    └─────────────────────────────────────┘
│   • Social Eng.      │
│   • Network / Wi‑Fi  │
│   • Banking & Fraud  │
│   • Malware          │
│   (Daily badge on    │
│    today’s game)     │
└──────────────────────┘
         │
         │ Tap a game
         ▼
┌─────────────────────────────────────────────────────────────────┐
│   GAME RUNNER (single game)                                       │
│   • Header: Quit | Game name | Score | Timer                       │
│   • Progress bar (question N of M)                                  │
│   • Scenario: question + multiple-choice options                   │
│   • On answer: instant feedback (✅/❌) + explanation              │
│   • [Next] → next scenario or end                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         │ All scenarios done
         ▼
┌─────────────────────────────────────────────────────────────────┐
│   RESULT                                                          │
│   • "Round complete!"  Score X / Y                                │
│   • Optional: "Daily challenge completed! +25 XP bonus"           │
│   • [Play again]  [Other games]                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Navigation summary:** Dashboard ↔ Game Select ↔ Game (by id) ↔ Result (inline). Insights is a separate view from Dashboard.

---

## 2. Game Logic Structure

### 2.1 Data Model (scalable)

- **GameDef** (per mini-game):
  - `id`, `name`, `description`, `icon`, `category`
  - `scenarios[]`: each has `id`, `question`, `options[]`, `correctIndex`, `explanation`, `difficulty`, `timeLimit`
- **Categories** are an enum/union so games can be grouped and insights can be computed per category.
- **Scenarios** are static; adding a new game = add a new `GameDef` and push to `allGames`.

### 2.2 Scoring Logic

- **Per scenario:** correct answer = +10 points; wrong or timeout = 0.
- **Per game:** total score = sum of scenario scores (max = 10 × number of scenarios).
- **XP:** +10 XP per correct answer; daily challenge completion grants +25 XP once per day.
- **Leaderboard:** each game completion posts (userName, score, date); top 10 by score shown.

### 2.3 Difficulty Progression

- Each scenario has a `difficulty` field (`easy` | `medium` | `hard`).
- Currently used for display/filtering; can be extended to:
  - Filter scenarios by difficulty (e.g. “Easy mode” = only easy).
  - Weight XP or points by difficulty.
  - Unlock harder scenarios after completing easier ones.

### 2.4 Daily Challenge

- **Deterministic per day:** `dailyGameId = hash(todayDate) % allGames.length` so every user sees the same game for that day.
- **Bonus:** first completion of that game today grants +25 XP and marks “Daily challenge completed”.
- **Storage:** `dailyCompletedAt: YYYY-MM-DD` in user progress.

### 2.5 Badges & Ranks

- **Ranks (level progression):** Rookie (0+) → Defender (100+) → Guardian (300+) → Sentinel (600+) → Cyber Expert (1000+ XP).
- **Badges:** earned when conditions are met (first game, 100/500 score, perfect round, quick thinker, 3 games, daily, rank milestones, all categories played).
- **Visual:** level bar = progress to next rank; rank badge shows current rank.

### 2.6 Performance Insights

- **Per-category stats:** `categoryStats[category] = { correct, total }` updated on each game completion.
- **Strongest / weakest:** sort categories by accuracy (correct/total), show top and bottom.
- **UI:** bar chart per category + short tip to replay weaker categories.

---

## 3. Implementation Structure (codebase)

```
src/
├── main.ts              # Entry; imports app + style
├── app.ts               # View router: dashboard | gameSelect | game | insights
├── types.ts             # View, Difficulty, GameCategory, GameDef, UserProgress, etc.
├── constants.ts         # RANK_LEVELS, XP_PER_CORRECT, getRankForXP, getLevelProgress, CATEGORY_LABELS
├── state.ts             # App state, localStorage, recordGameComplete, getDailyChallengeGameId
├── data/
│   └── scenarios.ts     # 10 GameDefs (phishing, password, url, otp, social, privacy, social-engineering, wifi, banking, malware)
└── views/
    ├── dashboard.ts     # Level bar, daily challenge, stats, badges, leaderboard
    ├── gameSelect.ts    # Games grouped by category; daily badge
    ├── gameRunner.ts    # One game: scenarios, timer, options, feedback, result
    └── insights.ts      # Strongest/weakest category, per-category bars
```

- **State is global** (single `state` object + `subscribe`/`notify`). No backend; all progress in `localStorage`.
- **Game runner** is self-contained: it holds `index`, `score`, `correctCount`, `hadPerfectTime` in closure and only calls `recordGameComplete` at the end.

---

## 4. Scalable Ideas for Hackathon / Future

1. **More games:** Add a new file under `data/` (e.g. `2fa-scenarios.ts`), define `GameDef` with `category`, push to `allGames`. No change to game runner.
2. **Difficulty filter:** In game select or game runner, filter `game.scenarios` by `difficulty` before starting. Optional “Hard mode” that only shows medium/hard.
3. **Backend & auth:** Replace `localStorage` with API calls; add auth; sync progress and leaderboard globally. Keep same `UserProgress` and `recordGameComplete` interface.
4. **Analytics:** In `recordGameComplete`, send events (gameId, score, category, time) to an analytics endpoint for engagement and difficulty tuning.
5. **Accessibility:** Ensure timer and feedback are announced (aria-live); support keyboard navigation for options; keep contrast and focus states (already partial in CSS).
6. **i18n:** Move all strings (questions, options, explanations, category labels) into JSON or keyed objects by locale; render from current locale.
7. **Streaks:** Add `lastPlayedDate` and `consecutiveDays` to progress; show “3-day streak” on dashboard and award a badge for 7-day streak.
8. **Custom scenarios:** Allow admins (or later, community) to submit scenarios; store in DB and load into a “Community” category with moderation.

---

## 5. Mini-Games Summary (10 total)

| # | Game               | Category           | Focus                          |
|---|--------------------|--------------------|--------------------------------|
| 1 | Phishing Detection | Phishing & Email   | Fake emails, urgency, links    |
| 2 | Password Strength  | Passwords & Auth   | Strong passwords, reuse, manager |
| 3 | URL Safety         | URLs & Links       | Suspicious domains, short links |
| 4 | Fake OTP & SMS     | Phishing & Email   | Verification scams, OTP sharing |
| 5 | Social Media Scams | Social Engineering | DMs, investment, impersonation  |
| 6 | Privacy & Data     | Privacy & Data     | Quizzes, app permissions, cold calls |
| 7 | Social Engineering | Social Engineering | IRS, delivery, one-time codes   |
| 8 | Secure Wi‑Fi      | Network            | Public Wi‑Fi, hotspots, router |
| 9 | Banking & Fraud    | Banking & Fraud    | Refund scams, overpayment, “safe account” |
| 10| Malware & Downloads| Malware            | Fake scans, untrusted downloads, extensions |

Each game: **real-world scenario → multiple-choice → instant feedback with explanation → scoring → difficulty tags → leaderboard integration** (score submitted on completion).
