# RootSense AI — Component Structure

The component tree is intentionally shallow. Three buckets:

1. **`ui/`** — Pure design primitives. No domain logic.
2. **`app/`** — App-wide chrome (sidebar, topbar, theme toggle, floating chat).
3. **`dashboard/` and `chat/`** — Domain-specific composites built from the above.

```
src/components/
├── ui/                                  ← Design primitives (shadcn-style)
│   ├── button.tsx           (5 variants × 5 sizes via CVA)
│   ├── card.tsx             (Card / Header / Title / Description / Content / Footer)
│   ├── badge.tsx            (8 variants: default, severity colors, ghost)
│   ├── input.tsx            (single-line input)
│   ├── label.tsx            (Radix Label)
│   ├── textarea.tsx
│   ├── avatar.tsx           (Radix Avatar with gradient fallback)
│   ├── separator.tsx
│   ├── skeleton.tsx         (shimmer animation)
│   ├── tooltip.tsx          (Radix Tooltip)
│   ├── tabs.tsx             (Radix Tabs)
│   ├── switch.tsx           (Radix Switch)
│   ├── scroll-area.tsx      (Radix ScrollArea)
│   ├── dialog.tsx           (Radix Dialog with glass styling)
│   ├── progress.tsx         (Radix Progress with neon gradient)
│   ├── dropdown-menu.tsx    (Radix DropdownMenu)
│   └── select.tsx           (Radix Select)
│
├── providers/
│   └── theme-provider.tsx   (next-themes wrapper)
│
├── app/
│   ├── sidebar.tsx          → uses: Badge, Lucide icons, framer-motion (layoutId animation)
│   ├── topbar.tsx           → uses: Input, Avatar, Button, Badge, DropdownMenu, ThemeToggle
│   ├── theme-toggle.tsx     → uses: Button, next-themes
│   └── floating-chat.tsx    → uses: Button, ChatPanel, framer-motion (AnimatePresence)
│
├── dashboard/
│   ├── metric-card.tsx      → uses: Card; framer-motion (animated values)
│   ├── live-chart.tsx       → uses: Recharts (Area + Line); seeded PRNG; setInterval ticks
│   ├── service-health.tsx   → uses: Card, Badge; mock-data.services
│   ├── incident-feed.tsx    → uses: Card, Badge; mock-data.incidents
│   ├── ai-insights.tsx      → uses: Card, Badge; static "AI" insights cards
│   └── alert-strip.tsx      → uses: Card, Badge; mock-data.alerts
│
└── chat/
    ├── chat-panel.tsx       → uses: Button, Textarea, Avatar, Markdown; /api/chat streaming
    └── markdown.tsx         → uses: react-markdown + remark-gfm + react-syntax-highlighter
```

---

## Composition map: pages → components

| Page | Top-level composites used |
| --- | --- |
| `/` | Inline marketing sections (Hero, Features, Pricing, …) — self-contained |
| `/login`, `/signup` | `Input`, `Label`, `Button`, `Separator` |
| `/dashboard` | `MetricCard ×4`, `LiveChart ×5`, `ServiceHealth`, `IncidentFeed`, `AIInsights`, `AlertStrip` |
| `/incidents` | `Card`, `Badge`, `Tabs`, `Input` |
| `/incidents/[id]` | `Card`, `Badge`, `Progress`, `LiveChart ×2`, custom Timeline list |
| `/chat` | `Card`, `Button`, `ChatPanel` |
| `/logs` | `Card`, `Input`, `Select`, `Button`, `Markdown` (for AI summary) |
| `/analytics` | `MetricCard`, `LiveChart`, custom bar lists |
| `/settings` | `Card`, `Input`, `Label`, `Switch`, `Separator`, `Button` |
| `/team` | `Card`, `Badge`, `Button` |
| `/alerts` | `Card`, `Badge`, `Tabs`, `Button` |

---

## Reused everywhere

- **`Card`** — every panel uses it. Has glass styling baked in.
- **`Badge`** with severity variants — the visual language for status/severity is centralized here.
- **`LiveChart`** — both `/dashboard` and `/incidents/[id]` reuse it. Same component, different props.
- **`ChatPanel`** — `/chat` page AND the `FloatingChat` widget mount the same component. One `compact` prop tweaks padding.
- **`Markdown`** — used both inside chat messages AND on the `/logs` page for AI summaries.

---

## Adding a new widget

1. Decide its scope:
   - **Pure visual?** → `src/components/ui/`
   - **App chrome?** → `src/components/app/`
   - **Domain-aware?** → `src/components/dashboard/` or a new feature folder
2. If it uses any of: `useState`, `useEffect`, event handlers, framer-motion → first line is `"use client"`.
3. Import primitives via `@/components/ui/*`. Never inline raw HTML buttons/cards — they'd miss the design system.
4. If it shows live data, follow the `LiveChart` pattern: deterministic SSR initial state (seeded PRNG), then `setInterval` mutations after mount.

---

## Animation conventions

- **Mount fades:** `framer-motion` `<motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} />`. Used in feeds.
- **Active nav indicator:** `<motion.span layoutId="sidebar-active" />` for smooth rail movement.
- **Sheet/popovers:** rely on Radix's built-in `data-[state=open]:animate-in` Tailwind utilities.
- **Live values:** `<motion.p key={value} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} />` triggers re-mount on change → smooth tween.
