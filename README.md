<div align="center">

# VisaGuide

**Русский** · [English](README.en.md)

**PWA для пошагового сопровождения по визам США — анкета, рекомендации, гайды и чеклисты**

[![CI](https://github.com/CodingJulie/visa-guide/actions/workflows/ci.yml/badge.svg)](https://github.com/CodingJulie/visa-guide/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

[Сайт](https://visa-guide-liard.vercel.app/) · [Быстрый старт](#-быстрый-старт) · [API](#-api) · [PWA](#-pwa)

</div>

---

## 📖 О проекте

**VisaGuide** — образовательная PWA для самостоятельной подготовки к визе в США. Пользователь проходит анкету, получает детерминированные рекомендации по типу визы, следует пошаговым инструкциям и отслеживает документы в чеклисте с экспортом PDF.

> **Не юридическая консультация** — по вашему кейсу обращайтесь к лицензированному иммиграционному адвокату.

### Ключевые возможности

| Категория | Что умеет |
|-----------|-----------|
| **Анкета** | Гражданство, цели, работа, здоровье, финансы, визовая история |
| **Движок рекомендаций** | Rule-based eligibility (B-1/B-2, F-1, H-1B + Phase 2) |
| **Гайды** | Пошаговые инструкции с прогрессом и условными шагами |
| **Чеклист** | Статусы документов + PDF-экспорт |
| **Архив кейсов** | Анонимизированные истории на `/archive` |
| **Админ CMS** | Типы виз, шаги, правила, документы, legal updates |
| **PWA** | Установка на устройство, Service Worker, offline-страница |
| **i18n** | Русский и английский (i18next, без префиксов в URL) |
| **Auth** | Регистрация, вход, сброс пароля через Supabase Auth |

---

## 🛠 Tech Stack

| Технология | Роль |
|------------|------|
| [Next.js 15](https://nextjs.org/) | App Router, middleware, PWA |
| [React 19](https://react.dev/) | UI, hooks |
| [TypeScript](https://www.typescriptlang.org/) | Strict typing |
| [Supabase](https://supabase.com/) | Auth, PostgreSQL, RLS |
| [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Стили и UI-примитивы |
| [i18next](https://www.i18next.com/) | en/ru локализация |
| [Google Gemini](https://ai.google.dev/) | AI-объяснения (`/api/explain`, `/api/recommend`) |
| [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) | Unit/integration тесты |

### i18n & PWA

| Технология | Роль |
|------------|------|
| Service Worker (`public/sw.js`) | Кэширование, offline fallback |
| Web App Manifest (`app/manifest.json`) | Установка как PWA |
| `components/ui/InstallButton.tsx` | Кнопка «Установить приложение» |
| `public/offline.html` | Offline-страница с retry |

---

## 📁 Структура проекта

```
visa-guide/
├── app/                          # Next.js App Router
│   ├── api/explain/ · recommend/ # Gemini API routes
│   ├── auth/callback/            # Supabase auth callback
│   ├── dashboard/                # Личный кабинет
│   ├── questionnaire/            # Анкета
│   ├── results/ · checklist/     # Результаты и чеклист
│   ├── guide/ · archive/         # Гайды и архив кейсов
│   ├── admin/                    # CMS (editor/admin)
│   ├── login/ · register/        # Auth-страницы
│   ├── layout.tsx                # Root layout + SEO / PWA meta
│   ├── manifest.json             # PWA manifest
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn-примитивы, AppShell, InstallButton
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
├── middleware.test.ts            # Тесты middleware
└── .cursor/rules/                # Конвенции для AI-ассистентов
```

---

## 📱 PWA

Service Worker регистрируется на клиенте (`components/workers/ServiceWorkerRegister.tsx`).

| Файл | Назначение |
|------|------------|
| `app/manifest.json` | Иконки, theme color, standalone display |
| `public/sw.js` | Precache offline/manifest/locales; cache-first для `/dashboard` |
| `public/offline.html` | Fallback при отсутствии сети |
| `components/ui/InstallButton.tsx` | Кнопка установки (beforeinstallprompt) |

Стратегия кэширования (как в EcoTrackr):

- **Cache-first** — `/dashboard`, `/_next/static/`
- **Network-first** — остальные маршруты с fallback на offline

---

## 🧪 Тестирование

```bash
npm run test                    # watch mode
npm run test -- page.test.tsx   # один файл
npm run test:ci                 # coverage (CI)
npm run test:coverage           # отчёт покрытия
```

Co-located тесты: `*.test.ts(x)` рядом с исходниками.

| Область | Примеры |
|---------|---------|
| Auth-страницы | `app/login/page.test.tsx`, `app/register/page.test.tsx` |
| Dashboard | `app/dashboard/page.test.tsx` |
| Middleware | `middleware.test.ts` |
| UI | `components/ui/InstallButton.test.tsx` |
| Lib | `lib/utils.test.ts`, `lib/eligibility-engine.test.ts` |

Перед PR: `npm run lint && npm run type-check && npm run test:ci`

---

## 📚 Документация

### Переменные окружения

```bash
cp .env.example .env.local
```

| Переменная | Обязательна | Описание |
|------------|:-----------:|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL Supabase-проекта |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (сервер) |
| `NEXT_PUBLIC_SITE_URL` | ✅ prod | `https://visa-guide-liard.vercel.app` |
| `GEMINI_API_KEY` | — | Google Gemini для AI routes |

### Supabase-миграции

1. `supabase/migrations/20250705_initial_schema.sql`
2. `supabase/migrations/20250706_case_stories.sql`
3. `supabase/migrations/20250707_fix_handle_new_user.sql`
4. `supabase/seed.sql`
5. `supabase/seed_stories.sql`

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

### Команды

```bash
npm run dev          # Dev-сервер → http://localhost:3000
npm run build        # Production build
npm run start        # Запуск production
npm run test         # Vitest (watch)
npm run test:ci      # Vitest + coverage (CI)
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

---

## 🔌 API

### `POST /api/explain`

AI-объяснение шага или правила (Gemini + fallback без ключа).

### `POST /api/recommend`

Дополнительные рекомендации по результатам анкеты.

> `GEMINI_API_KEY` — только на сервере, никогда в `NEXT_PUBLIC_*`.

---

## 🚀 Быстрый старт

### Требования

- Node.js 20+
- npm
- Supabase-проект с миграциями

### Установка

```bash
git clone https://github.com/CodingJulie/visa-guide.git
cd visa-guide
cp .env.example .env.local
# Заполните NEXT_PUBLIC_SUPABASE_* в .env.local

npm install --legacy-peer-deps
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

---

## 🤝 Contributing

1. Fork репозитория
2. `git checkout -b feature/amazing-feature`
3. `git commit -m 'feat: add amazing feature'`
4. `git push origin feature/amazing-feature`
5. Pull Request

---

<div align="center">

**Сделано для людей, которые проходят путь к визе в США**

[⬆ Наверх](#visaguide)

</div>
