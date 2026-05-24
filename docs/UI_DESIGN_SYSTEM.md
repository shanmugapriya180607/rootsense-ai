# RootSense AI — UI Design System

A premium, futuristic SaaS aesthetic — heavy on glassmorphism, neon gradients, animated metrics, and the muted-on-dark color theory used by Linear, Vercel, and Raycast.

---

## Design principles

1. **The dark theme is the headline.** Light theme is a polite alternative.
2. **Surfaces float.** Cards use `bg-card/70 backdrop-blur-xl` with subtle borders and offset shadows.
3. **Glow, don't shout.** Use neon gradients for accents and CTAs, not body content.
4. **Type tells the story, color confirms it.** Severity badges and status dots are color-coded — but the text always says it too (accessibility).
5. **Motion is information.** Active sidebar item slides, values tween on change, charts breathe. Never decorative-only.

---

## Tokens (CSS variables)

All tokens live in `src/app/globals.css` under `:root` and `.dark`. Tailwind reads them via `hsl(var(--token))`. See [`COLOR_PALETTE.md`](./COLOR_PALETTE.md) for the full list.

| Family | Examples | Purpose |
| --- | --- | --- |
| Surface | `background`, `card`, `popover`, `muted` | Layered card stack |
| Brand | `primary` | Primary CTA |
| Severity | `sev-critical`, `sev-high`, `sev-medium`, `sev-low`, `sev-info`, `sev-ok` | Status across alerts/incidents/services |
| Neon | `neon-violet`, `neon-cyan`, `neon-pink`, `neon-lime` | Gradients & glows |
| Structural | `border`, `input`, `ring`, `radius` | Shape & focus |

---

## Component primitives (`src/components/ui/`)

| Primitive | Variants | Notes |
| --- | --- | --- |
| **Button** | `default · gradient · destructive · outline · secondary · ghost · link · glass` × `sm · default · lg · xl · icon` | `gradient` is the hero CTA. Has built-in shadow + hover glow. |
| **Card** | — | Glass + faint inset top highlight. |
| **Badge** | `default · secondary · outline · critical · high · medium · low · info · ok · ghost` | Severity badges are the visual language for status. |
| **Input / Textarea** | — | Semi-transparent bg so they feel layered on glass cards. |
| **Tabs** | — | Pill style with subtle bg shift on active. |
| **Tooltip / DropdownMenu / Dialog / Select** | — | All Radix-based, all glass. |
| **Progress** | — | Indicator fill uses the violet→cyan gradient. |
| **Switch** | — | Compact, matches the rest of the toolbar. |
| **Avatar** | — | Gradient fallback (violet→pink) when no image. |

---

## Reusable utility classes (defined in `globals.css`)

| Class | Effect |
| --- | --- |
| `.glass` | `bg-card/60 backdrop-blur-xl border border-white/5 shadow-…` |
| `.glass-soft` | Lighter variant |
| `.gradient-text` | Violet → cyan → pink text gradient with animated background-position |
| `.gradient-border` | Card with a violet→cyan gradient border |
| `.glow-violet` | Outer violet glow ring + bloom |
| `.grid-bg` | 32px grid with radial mask — used in landing & auth backgrounds |
| `.scrollbar-thin` | Slim, themed scrollbar |
| `.shimmer` | Used by `<Skeleton />` for loading shimmer |

---

## Motion primitives

| Animation | Where | Definition |
| --- | --- | --- |
| `fade-in` | Page sections | 0.3s ease-out |
| `pulse-glow` | Floating chat button | 2.4s violet pulse |
| `shimmer` | Skeletons | 2s linear infinite, left→right wipe |
| `gradient-pan` | Hero title, CTA section | 6s ease infinite, scrolls bg-position |
| `marquee` | Marquee marketing logos | 30s linear infinite |
| `blink` | Typing cursor in chat | 1s step-end infinite |

Framer Motion is reserved for stateful animations (mount/exit, layoutId, value tweens). CSS animations handle ambient motion.

---

## Patterns

### "Hero card" (used for the chat answer)
```
Card                       glass + relative + overflow-hidden
 └── absolute blur-3xl     violet+cyan radial bloom (top-right)
 └── relative content
```

### "Severity row"
```
Badge[severity]   font-mono service name   p95 / rps / status
```

### "AI-flagged section"
A `<Card>` with a `Sparkles` icon in the header, an `info` Badge marker, and a soft violet bloom on top-right. Used for AI insights, AI recommendations, and AI log summaries.

### "Live tile"
```
Card
 ├── header (icon + title + severity badge of current value)
 └── LiveChart (60 points, ticks every 3.5s)
```

---

## Spacing & sizing

- **Container**: max 1440px, centered, 2rem horizontal padding (overridden to 1600px on app pages).
- **Radius**: `--radius: 0.85rem` (used for Cards). Inputs/buttons compute from this.
- **Gutters**: 4 → `gap-4` (16px) for grids, `gap-6` (24px) between major sections.
- **Card padding**: `p-5` for content, `px-5 py-4` for headers.

---

## Accessibility

- All interactive primitives are built on Radix → keyboard, focus, screen reader behavior for free.
- Severity is conveyed by **color + text label** (never color alone).
- Theme respects `prefers-color-scheme` via `next-themes` + `enableSystem`.
- Focus rings are visible (`focus-visible:ring-2 ring-ring`) and use brand color.
