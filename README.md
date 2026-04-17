# Sudoku (Client-Side Vue)

A Vue 3 + TypeScript Sudoku app that runs fully in the browser.

## What This Version Does

- Runs entirely client-side (no backend, no database, no server APIs)
- Generates Sudoku puzzles in-browser with unique-solution checks
- Stores game history, personal stats, and leaderboard locally in `localStorage`
- Works as a static SPA deployable on Cloudflare Pages

## Stack

- Vue 3
- TypeScript
- Pinia
- Vue Router
- Vite

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Production Build

```bash
npm run build
```

Output is generated in `dist/`.

## Deploy To Cloudflare Pages

Use these settings in Cloudflare Pages:

- Framework preset: `Vue`
- Build command: `npm run build`
- Build output directory: `dist`

SPA routing fallback is configured via [`public/_redirects`](public/_redirects).

## Notes About Persistence

All app data is stored in browser `localStorage`.

- Data is browser-specific
- Clearing browser storage resets stats and leaderboard
- No server-side security guarantees (this is intentionally client-only)
