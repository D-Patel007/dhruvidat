# DAT Study Tracker

A study tracker app for DAT prep: daily study time, focus timer with subject tracking, schedule (work/sleep), and wellness reminders with quiet hours.

## Features

- **Onboarding** – Quote and get started
- **Dashboard** – Today’s sessions, total study time, daily target, streak
- **Timer** – Study (default 45 min) and break (default 15 min), subject picker (General Chem, Organic Chem, Biology, Perceptual Ability, Reading Comprehension, Quantitative Reasoning)
- **Schedule** – Week view; work hours and sleep from Reminders (Google Calendar optional later)
- **Reminders** – Stay strong, breathe, relax, drink water at a set interval; quiet hours for work and sleep; timer defaults and daily target

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (purple & gold theme)
- React Router, Framer Motion
- localStorage for sessions and settings
- PWA-ready (manifest + theme-color)

## Run

```bash
npm install
npm run dev
```

Build: `npm run build`. Preview: `npm run preview`.

## Deploy

Build and deploy the `dist` folder to Vercel or Netlify. Set `VITE_*` env vars if you add Google OAuth later.

## Google Calendar (optional)

See `src/services/calendar.ts`. Add a Google Cloud project, OAuth consent, and Calendar API; use scope `calendar.events.readonly` and wire the fetch into the Schedule page.
