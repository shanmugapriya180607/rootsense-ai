# RootSense AI — Folder Structure

```
rootsense-ai/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
├── .env.example
├── .gitignore
│
├── docs/                              ⟵ Every doc lives here, one file per topic
│   ├── ARCHITECTURE.md
│   ├── FOLDER_STRUCTURE.md            (this file)
│   ├── DATABASE_SCHEMA.md
│   ├── API_ROUTES.md
│   ├── COMPONENT_STRUCTURE.md
│   ├── UI_DESIGN_SYSTEM.md
│   ├── COLOR_PALETTE.md
│   ├── TYPOGRAPHY.md
│   ├── DEPLOYMENT.md
│   ├── FUTURE_IMPROVEMENTS.md
│   └── SETUP.md
│
├── prisma/
│   └── schema.prisma                  ⟵ Optional Postgres schema (docs/DATABASE_SCHEMA.md)
│
└── src/
    ├── app/
    │   ├── layout.tsx                 ⟵ Root layout, ThemeProvider, Sonner toaster
    │   ├── globals.css                ⟵ Tailwind + design tokens + glass/grid utils
    │   ├── page.tsx                   ⟵ Landing page (hero, features, pricing, CTA)
    │   ├── not-found.tsx              ⟵ 404
    │   │
    │   ├── (auth)/                    ⟵ Route group — minimal auth chrome
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   │
    │   ├── (app)/                     ⟵ Route group — sidebar + topbar shell
    │   │   ├── layout.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── incidents/
    │   │   │   ├── page.tsx           (list)
    │   │   │   └── [id]/page.tsx      (details)
    │   │   ├── chat/page.tsx
    │   │   ├── logs/page.tsx
    │   │   ├── analytics/page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── team/page.tsx
    │   │   └── alerts/page.tsx
    │   │
    │   └── api/
    │       ├── chat/route.ts          ⟵ POST — streaming AI chat
    │       ├── analyze/route.ts       ⟵ POST — streaming log RCA
    │       └── metrics/route.ts       ⟵ GET  — mock live metrics
    │
    ├── components/
    │   ├── ui/                        ⟵ shadcn-style design primitives
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── badge.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── textarea.tsx
    │   │   ├── avatar.tsx
    │   │   ├── separator.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── tooltip.tsx
    │   │   ├── tabs.tsx
    │   │   ├── switch.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── dialog.tsx
    │   │   ├── progress.tsx
    │   │   ├── select.tsx
    │   │   └── dropdown-menu.tsx
    │   │
    │   ├── providers/
    │   │   └── theme-provider.tsx
    │   │
    │   ├── app/                       ⟵ App-shell chrome
    │   │   ├── sidebar.tsx
    │   │   ├── topbar.tsx
    │   │   ├── theme-toggle.tsx
    │   │   └── floating-chat.tsx      ⟵ Floating AI widget
    │   │
    │   ├── dashboard/                 ⟵ Dashboard-specific widgets
    │   │   ├── metric-card.tsx
    │   │   ├── live-chart.tsx
    │   │   ├── service-health.tsx
    │   │   ├── incident-feed.tsx
    │   │   ├── ai-insights.tsx
    │   │   └── alert-strip.tsx
    │   │
    │   └── chat/
    │       ├── chat-panel.tsx         ⟵ Streaming chat (used by /chat AND floating widget)
    │       └── markdown.tsx           ⟵ Markdown + syntax highlight renderer
    │
    └── lib/
        ├── utils.ts                   ⟵ cn(), formatters, mulberry32 PRNG
        ├── types.ts                   ⟵ Incident/Log/Metric/Team/Alert/ChatMessage
        ├── mock-data.ts               ⟵ Realistic mock data for the demo
        └── ai.ts                      ⟵ OpenAI client + mock fallback streaming
```

---

## Conventions

- **Route groups** (`(auth)`, `(app)`) keep layouts separate without affecting URLs.
- **Co-located client components** — anything interactive gets `"use client"` at the top; everything else stays server-rendered.
- **`@/` alias** — all imports use the `@/…` alias mapped to `./src/`.
- **Mock data is one file** — flip from mock to a real DB by swapping `src/lib/mock-data.ts` imports for Prisma calls; types stay the same.
- **AI is one file** — `src/lib/ai.ts` is the only place that knows about OpenAI. Add Gemini/Claude here in `streamGemini()` etc.

---

## Renaming or moving a page

Because the App Router maps directories → URLs:

- Move `src/app/(app)/dashboard/` → `src/app/(app)/overview/` and the URL becomes `/overview`.
- The sidebar (`src/components/app/sidebar.tsx`) holds the nav config — update the `href` there.
