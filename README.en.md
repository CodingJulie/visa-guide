<div align="center">

# VisaGuide

[Russian](README.md) · **English**

**PWA for step-by-step US visa guidance — questionnaire, recommendations, guides & checklists**

[![CI](https://github.com/CodingJulie/visa-guide/actions/workflows/ci.yml/badge.svg)](https://github.com/CodingJulie/visa-guide/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

[Website](https://visa-guide-liard.vercel.app/) · [Quick start](#-quick-start) · [API](#-api) · [PWA](#-pwa)

</div>

---

## 📖 About

**VisaGuide** is an educational PWA for self-guided US visa preparation. Users complete a questionnaire, receive deterministic visa recommendations, follow step-by-step guides, and track documents in a checklist with PDF export.

> **Not legal advice** — consult a licensed immigration attorney for your case.

### Key features

| Category | What it does |
|----------|--------------|
| **Questionnaire** | Citizenship, goals, employment, health, finances, visa history |
| **Eligibility engine** | Rule-based recommendations (B-1/B-2, F-1, H-1B + Phase 2) |
| **Guides** | Step-by-step instructions with progress and conditional steps |
| **Checklist** | Document status tracking + PDF export |
| **Case archive** | Anonymized stories at `/archive` |
| **Admin CMS** | Visa types, steps, rules, documents, legal updates |
| **PWA** | Installable app, Service Worker, offline page |
| **i18n** | Russian and English (i18next, no URL prefixes) |
| **Auth** | Sign up, sign in, password reset via Supabase Auth |

---

## 🛠 Tech Stack

| Technology | Role |
|------------|------|
| [Next.js 15](https://nextjs.org/) | App Router, middleware, PWA |
| [React 19](https://react.dev/) | UI, hooks |
| [TypeScript](https://www.typescriptlang.org/) | Strict typing |
| [Supabase](https://supabase.com/) | Auth, PostgreSQL, RLS |
| [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Styles and UI primitives |
| [i18next](https://www.i18next.com/) | en/ru localization |
| [Google Gemini](https://ai.google.dev/) | AI explanations (`/api/explain`, `/api/recommend`) |
| [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) | Unit/integration tests |

### i18n & PWA

| Technology | Role |
|------------|------|
| Service Worker (`public/sw.js`) | Caching, offline fallback |
| Web App Manifest (`app/manifest.json`) | Install as PWA |
| `components/ui/InstallButton.tsx` | “Install app” button |
| `public/offline.html` | Offline page with retry |

---

## 📁 Project structure

```
visa-guide/
├── app/                          # Next.js App Router
│   ├── api/explain/ · recommend/ # Gemini API routes
│   ├── auth/callback/            # Supabase auth callback
│   ├── dashboard/                # User dashboard
│   ├── questionnaire/            # Questionnaire wizard
│   ├── results/ · checklist/     # Results and checklist
│   ├── guide/ · archive/         # Guides and case archive
│   ├── admin/                    # CMS (editor/admin)
│   ├── login/ · register/        # Auth pages
│   ├── layout.tsx                # Root layout + SEO / PWA meta
│   ├── manifest.json             # PWA manifest
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn primitives, AppShell, InstallButton
│   ├── questionnaire/            # QuestionnaireWizard
│   ├── guide/ · checklist/       # StepCard, DocumentChecklist
│   ├── results/ · archive/       # EligibilityResult, StoryCard
│   ├── admin/                    # AdminNav
│   ├── workers/                  # ServiceWorkerRegister
│   └── providers/                # I18nProvider
│
├── hooks/                        # useCaseProgress, useStories, useLegalUpdates
├── lib/                          # supabase, eligibility-engine, utils, i18n
├── public/
│   ├── locales/en|ru/common.json
│   ├── sw.js                     # Service Worker
│   └── offline.html
├── supabase/migrations/          # YYYYMMDD_description.sql
├── middleware.ts                 # Auth guard, admin role, locale redirect
├── middleware.test.ts            # Middleware tests
└── .cursor/rules/                # AI assistant conventions
```

---

## 📱 PWA

The Service Worker is registered on the client (`components/workers/ServiceWorkerRegister.tsx`).

| File | Purpose |
|------|---------|
| `app/manifest.json` | Icons, theme color, standalone display |
| `public/sw.js` | Precache offline/manifest/locales; cache-first for `/dashboard` |
| `public/offline.html` | Fallback when offline |
| `components/ui/InstallButton.tsx` | Install prompt button (beforeinstallprompt) |

Caching strategy (same pattern as EcoTrackr):

- **Cache-first** — `/dashboard`, `/_next/static/`
- **Network-first** — other routes with offline fallback

---

## 🧪 Testing

```bash
npm run test                    # watch mode
npm run test -- page.test.tsx   # single file
npm run test:ci                 # coverage (CI)
npm run test:coverage           # coverage report
```

Co-located tests: `*.test.ts(x)` next to source files.

| Area | Examples |
|------|----------|
| Auth pages | `app/login/page.test.tsx`, `app/register/page.test.tsx` |
| Dashboard | `app/dashboard/page.test.tsx` |
| Middleware | `middleware.test.ts` |
| UI | `components/ui/InstallButton.test.tsx` |
| Lib | `lib/utils.test.ts`, `lib/eligibility-engine.test.ts` |

Before PR: `npm run lint && npm run type-check && npm run test:ci`

---

## 📚 Documentation

### Environment variables

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server) |
| `NEXT_PUBLIC_SITE_URL` | ✅ prod | `https://visa-guide-liard.vercel.app` |
| `GEMINI_API_KEY` | — | Google Gemini for AI routes |

### Supabase migrations

1. `supabase/migrations/20250705_initial_schema.sql`
2. `supabase/migrations/20250706_case_stories.sql`
3. `supabase/migrations/20250707_fix_handle_new_user.sql`
4. `supabase/seed.sql`
5. `supabase/seed_stories.sql`

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

### Scripts

```bash
npm run dev          # Dev server → http://localhost:3000
npm run build        # Production build
npm run start        # Run production
npm run test         # Vitest (watch)
npm run test:ci      # Vitest + coverage (CI)
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

---

## 🔌 API

### `POST /api/explain`

AI explanation for a step or rule (Gemini + fallback without API key).

### `POST /api/recommend`

Additional recommendations based on questionnaire results.

> `GEMINI_API_KEY` is server-only — never in `NEXT_PUBLIC_*`.

---

## 🚀 Quick start

### Requirements

- Node.js 20+
- npm
- Supabase project with migrations applied

### Install

```bash
git clone https://github.com/CodingJulie/visa-guide.git
cd visa-guide
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_* in .env.local

npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🤝 Contributing

1. Fork the repository
2. `git checkout -b feature/amazing-feature`
3. `git commit -m 'feat: add amazing feature'`
4. `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<div align="center">

**Made for people navigating US visa processes**

[⬆ Back to top](#visaguide)

</div>
