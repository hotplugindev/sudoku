# Sudoku (Client-Side Vue)

A Vue 3 + TypeScript Sudoku app that runs fully in the browser.

## What This Version Does

- Runs entirely client-side (no backend, no database, no server APIs)
- Generates Sudoku puzzles in-browser with unique-solution checks
- Uses a full Material Design 3 visual system
- Supports both light and dark themes (switch in the top bar)
- Stores game history, personal stats, and leaderboard locally in `localStorage`
- Works as a static SPA deployable on Cloudflare Pages
- Can be installed as a web app (PWA) on desktop and mobile home screens

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

## PWA Notes

PWA files are included:

- Manifest: [`public/manifest.webmanifest`](public/manifest.webmanifest)
- Service worker: [`public/sw.js`](public/sw.js)
- Icons: `public/icons/`

For install prompts in browsers, deployment must be HTTPS (Cloudflare Pages already is).

## Notes About Persistence

All app data is stored in browser `localStorage`.

- Data is browser-specific
- Clearing browser storage resets stats and leaderboard
- No server-side security guarantees (this is intentionally client-only)
