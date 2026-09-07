# Applyce_Frontend

The React + TypeScript single-page application (SPA) for **Applyce** — the AI-powered career
intelligence platform. This repo builds the client served at **https://applyce.tech** and talks
to the Flask backend API at **https://skillfit.onrender.com** (see the `Applyce` repo).

> This README mirrors the backend README from the [Applyce](https://github.com/Samrudh9/Applyce)
> repository. Read both for the full system picture.

---

## Overview

```
Browser (this SPA)  ──JWT Bearer Auth──►  Flask API (skillfit.onrender.com)
applyce.tech                               ├── Supabase PostgreSQL
                                           ├── scikit-learn ML models
                                           └── OpenAI + job providers
```

- Framework: **React 18 + TypeScript + Vite**
- Styling: **Tailwind CSS**
- Routing: **react-router-dom v6**
- Charts: **recharts** · Motion: **framer-motion** · Icons: **lucide-react**
- Hosting: **Vercel**

---

## Quick Start

```bash
git clone git@github.com:Samrudh9/Applyce_Frontend.git
cd Applyce_Frontend
npm install
npm run dev        # http://localhost:5173
```

During local dev, the Vite dev server proxies `/api/*`, `/feedback`, `/health`, `/quizzes`,
`/tracker` to the backend. Set `VITE_API_URL` to override the target:

```bash
# .env.local
VITE_API_URL=http://localhost:5000        # local backend
# VITE_API_URL=https://skillfit.onrender.com   # production backend
```

Without `VITE_API_URL`, production builds default `BASE` to
`https://skillfit.onrender.com` and locals use the Vite proxy.

---

## Build

```bash
npm run build    # tsc -b && vite build
npm run preview
```

---

## Project structure

```
src/
├── main.tsx                # React entry
├── App.tsx                 # Router + layout
├── index.css               # Tailwind base
├── context/
│   ├── AuthContext.tsx     # OAuth flow, JWT storage, /api/auth/me validation
│   └── ThemeContext.tsx    # light/dark theme
├── lib/
│   └── api.ts              # Typed fetch wrapper; injects Bearer token; 401 redirect
├── types/
│   └── api.ts              # Request/response types for every API
├── pages/                  # One file per route
│   ├── LoginPage.tsx       # OAuth-only login + /auth/callback handler
│   ├── LandingPage.tsx
│   ├── UploadPage.tsx      # Resume upload → /api/analyze-resume
│   ├── ResultPage.tsx      # Analysis + ATS report
│   ├── DashboardPage.tsx
│   ├── JobsPage.tsx
│   ├── RoadmapPage.tsx
│   ├── ScorecardPage.tsx
│   ├── AtsReportPage.tsx
│   ├── ResumeBuilderPage.tsx
│   ├── CoverLetterPage.tsx
│   ├── InterviewPrepPage.tsx
│   ├── SkillQuizzesPage.tsx
│   ├── ApplicationTrackerPage.tsx
│   ├── ApplyAgentPage.tsx
│   └── ... (About, Pricing)
└── components/             # Shared UI components
```

---

## Authentication (OAuth)

There is **no password sign-up on the production flow** — login is OAuth-only
(GitHub, Google, LinkedIn).

1. `LoginPage` calls `AuthContext.login()` → `startOAuth(provider)`.
2. `startOAuth` fetches `GET /api/auth/{provider}?redirect_uri={origin}/auth/callback`, then
   navigates to the provider's authorization URL.
3. User approves; provider redirects to `applyce.tech/auth/callback?code=...`.
4. `AuthCallbackPage` POSTs `{ code, redirect_uri }` to `POST /api/auth/{provider}/callback`.
5. Backend returns a JWT; the app stores it in `localStorage` (`applyce_token`) and redirects
   to `/dashboard`.

Token handling lives in `src/lib/api.ts`:
- Every request attaches `Authorization: Bearer <token>` except on `/auth/*` and `/login`.
- A **401 response** clears the token and redirects to `/login`.
- `AuthProvider` validates the stored token against `/api/auth/me` on mount.

Register the following redirect URIs at each OAuth provider:
- `https://applyce.tech/auth/callback`
- `https://www.applyce.tech/auth/callback`

---

## Environment variables (Vercel)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend origin | `https://skillfit.onrender.com` |

`VITE_*` variables are baked into the bundle at build time — set them as Vercel
environment variables and redeploy when they change.

---

## Deployment (Vercel)

1. Import the repo in Vercel (framework preset: **Vite**).
2. Add `VITE_API_URL=https://skillfit.onrender.com`.
3. Push to `main` → auto-deploys.

---

## Useful commands

```bash
npm run dev          # dev server with proxy
npm run build        # type-check + production build
npm run preview      # preview the production build locally
```

---

**Last updated:** September 2026
