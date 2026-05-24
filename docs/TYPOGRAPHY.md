# RootSense AI — Typography

A two-axis system: a humanist UI font for body and a tighter geometric for display. Both fall back to the system stack so the app stays fast.

---

## Font families

| Family | CSS var | Where it's used |
| --- | --- | --- |
| `sans`    | `var(--font-sans)` → system UI | Default body, paragraphs, labels |
| `mono`    | `var(--font-mono)` → `ui-monospace` | Service names (`payments`), incident IDs (`INC-2041`), code, log lines, hosts |
| `display` | `var(--font-display)` → system UI | Hero, page titles, big metrics — tighter tracking |

The CSS vars are wired up in `tailwind.config.ts`. To swap in custom fonts (recommended: **Geist Sans** for `sans`/`display`, **Geist Mono** for `mono`), add to the root layout:

```ts
// src/app/layout.tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

<body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
```

And add to `globals.css`:

```css
:root {
  --font-sans: var(--font-geist-sans, system-ui);
  --font-mono: var(--font-geist-mono, ui-monospace);
  --font-display: var(--font-geist-sans, system-ui);
}
```

---

## Scale

Tailwind's default scale, but with intentional usage:

| Class | px (default) | Use for |
| --- | --- | --- |
| `text-xs` | 12 | Captions, badges, table headers, tooltips |
| `text-sm` | 14 | Body, list items, descriptions, button text |
| `text-base` | 16 | Long-form body (rare in dashboards) |
| `text-lg` | 18 | Card titles |
| `text-xl` | 20 | Section headings |
| `text-2xl` | 24 | Page titles (`<h1>` on `/dashboard`) |
| `text-3xl` | 30 | Marketing section headers |
| `text-4xl` | 36 | Marketing H2 |
| `text-5xl` | 48 | Hero subhead |
| `text-7xl` | 72 | Hero headline |

The hero uses `lg:text-7xl font-display font-semibold tracking-tighter leading-[1.05]`.

---

## Weight & tracking

- **Body:** `font-normal` (400). Increase to `font-medium` (500) only for emphasis.
- **Numbers / display:** `font-display font-semibold` (600). Pair with `tracking-tight` or `tracking-tighter` on the hero.
- **Uppercase labels:** `text-xs uppercase tracking-wider text-muted-foreground`. Heavily used for KPI captions and section preambles.

---

## Text colors

| Token | Usage |
| --- | --- |
| `text-foreground` | Primary body text |
| `text-foreground/90` | Body in markdown/chat (slightly softer) |
| `text-muted-foreground` | Secondary text, captions, metadata |
| `text-primary` | Links, active nav, AI accents |
| `text-sev-*` | Severity labels (always paired with the literal severity word for accessibility) |
| `gradient-text` utility | Hero accents only — never body |

---

## Numbers

- All large numbers (KPIs, stat cards) use `font-display font-semibold` with `tracking-tight`.
- Live-changing values are wrapped in a Framer Motion `<motion.p>` keyed on the value so they cross-fade.
- **Currencies & percentages** are formatted with `Intl.NumberFormat` (helpers in `src/lib/utils.ts`).
- **Code-like values** (service names, IDs, hosts) use `font-mono` to visually mark them as identifiers.

---

## Featuresets you should enable on the body font

The root layout sets:

```css
html {
  -webkit-tap-highlight-color: transparent;
  text-rendering: optimizeLegibility;
  font-feature-settings: "cv11", "ss01", "ss03"; /* Geist/Inter alternates */
}
```

If you swap in Geist, these features unlock the cleaner `1`/`I`, alternative `a`, and other dashboard-friendly glyphs.

---

## Markdown (chat & AI summary)

The `<Markdown />` component (`src/components/chat/markdown.tsx`) applies its own scale:

| Element | Class |
| --- | --- |
| `p` | `text-sm leading-relaxed text-foreground/90` |
| `strong` | `font-semibold text-foreground` |
| `h1` | `text-base font-semibold` (we don't allow big AI headings inside chat) |
| `h2` | `text-sm font-semibold` |
| `code` (inline) | `text-[0.85em] font-mono bg-muted/60 px-1.5 rounded` |
| `code` (block) | Prism `oneDark`, 12.5px, 1.55 line-height |
| `blockquote` | Left violet rule, italic, muted |
