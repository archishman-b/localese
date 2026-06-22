# Bhasha 🇮🇳

**Learn Indian languages — built for professionals who've just moved cities.**

A Duolingo-style language learning app for Hindi, Telugu, Kannada, Bengali, and Marathi. Transliteration-first (Roman script), situational curriculum built around real migration scenarios: autos, food, greetings, numbers.

## Stack
- **Vite + React** — frontend
- **React Router v6** — routing
- **Zustand** — state + localStorage persistence
- **Google Fonts** — Noto Sans per script
- **Vercel** — deployment (free tier)

## Getting started
```bash
npm install
npm run dev       # localhost:5173
npm run build     # production
```

## Deploy to Vercel
1. Push to GitHub
2. vercel.com → New Project → Import repo
3. Framework: Vite → Deploy

`vercel.json` handles SPA routing.

## Adding content
Each language file in `src/data/languages/` follows the same schema:
units → lessons → exercises (type: mcq | wordbank | translate)

## Phase 2 roadmap
- SRS review deck
- Matching pairs exercise
- PWA + daily reminders
- Audio (Google Cloud TTS)
- Script learning module
