# RootSense AI — Color Palette

All colors are CSS variables (HSL) defined in `src/app/globals.css`. Tailwind reads them via `hsl(var(--token))`, so they work in light and dark mode without duplicating utility classes.

---

## Surface (layered stack)

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--background` | `0 0% 100%` (#FFFFFF) | `240 14% 4%` (#0A0A0E) | Page background |
| `--foreground` | `240 10% 6%` (#0E0E14) | `240 6% 96%` (#F4F4F6) | Body text |
| `--card`       | `0 0% 100%` (#FFFFFF) | `240 12% 7%` (#11111A) | Card surface |
| `--card-foreground` | same as `foreground` | same | Text on cards |
| `--popover`    | `0 0% 100%` | `240 14% 6%` (#0E0E16) | Dropdowns, tooltips |
| `--muted`      | `240 5% 96%` | `240 6% 12%` (#1E1E26) | Subtle backgrounds |
| `--muted-foreground` | `240 4% 46%` | `240 5% 62%` (#9A9AAB) | Secondary text |
| `--accent`     | `240 5% 96%` | `240 6% 14%` (#222230) | Hover states |
| `--border`     | `240 6% 90%` | `240 6% 16%` (#262630) | Subtle borders |
| `--input`      | `240 6% 90%` | `240 6% 16%` | Input borders |
| `--ring`       | `262 83% 58%` | `262 83% 68%` | Focus ring |

---

## Brand

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--primary` | `262 83% 58%` (violet-600) | `262 83% 68%` (violet-400) | Primary buttons, links, focus |
| `--primary-foreground` | `0 0% 100%` | `240 10% 6%` | Text on primary |
| `--destructive` | `0 84% 60%` | `0 72% 55%` | Destructive buttons |

---

## Severity (the most-used family)

These map 1:1 to the `Severity` enum in `src/lib/types.ts` and the `Badge` variants.

| Token | Light | Dark | Used for | Badge variant |
| --- | --- | --- | --- | --- |
| `--sev-critical` | `0 84% 60%` (#EF4444) | `0 84% 65%` (#F36464) | P1 incidents, fatal logs, 5xx | `critical` |
| `--sev-high`     | `24 95% 53%` (#F97316) | `24 95% 60%` (#F9933A) | P2 incidents, latency SLO breach | `high` |
| `--sev-medium`   | `38 92% 50%` (#F59E0B) | `38 95% 60%` (#FAB23B) | Warnings, degraded services | `medium` |
| `--sev-low`      | `199 89% 48%` (#0EA5E9) | `199 95% 60%` (#3FB7F0) | Info, low-priority | `low` |
| `--sev-info`     | `217 91% 60%` (#3B82F6) | `217 95% 68%` (#5C9BF6) | AI insights, info alerts | `info` |
| `--sev-ok`       | `142 71% 45%` (#22C55E) | `142 71% 55%` (#46D779) | Healthy services, ack'd alerts | `ok` |

---

## Neon accents

Used for gradients, glows, the AI brand surface, and CTAs. Never for body text.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--neon-violet` | `262 83% 65%` | `262 90% 72%` | Primary gradient stop |
| `--neon-cyan`   | `188 94% 55%` | `188 95% 62%` | Secondary gradient stop, "AI" accent |
| `--neon-pink`   | `322 90% 65%` | `322 95% 70%` | Tertiary gradient stop |
| `--neon-lime`   | `142 71% 55%` | `142 80% 60%` | "Healthy" / positive accents |

### Signature gradients

- **Brand gradient (CTAs & headings):** `from-neon-violet via-primary to-neon-cyan`
- **AI surface:** `from-neon-violet/10 to-neon-cyan/10` (used on AI insight cards)
- **Hero text:** `from-neon-violet via-neon-cyan to-neon-pink` (animated via `animate-gradient-pan`)

---

## Usage guide

| Need to show… | Use |
| --- | --- |
| A P1/critical state | `<Badge variant="critical" />`, text in `text-sev-critical` |
| An "AI" thing | `Sparkles` icon in `text-neon-cyan`, optional violet bloom in the corner |
| The primary call-to-action | `<Button variant="gradient" />` |
| A passive informational card | `<Card>` (default glass), no neon |
| A healthy state | `<Badge variant="ok" />` + an animated `ping` dot in `bg-sev-ok` |

---

## Backgrounds (composed in `<body>`)

```css
background-image:
  radial-gradient(1200px 600px at 80% -20%, hsl(var(--neon-violet) / 0.10), transparent 60%),
  radial-gradient(900px 500px at -10% 10%, hsl(var(--neon-cyan) / 0.08), transparent 60%);
```

A faint violet bloom in the top-right, a fainter cyan bloom in the top-left. Stays fixed during scroll for that "depth" feel.
