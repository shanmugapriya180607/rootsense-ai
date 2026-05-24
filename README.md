# RootSense AI — AI Incident Root Cause Analyzer

> Find root causes in seconds, not hours. An AI-powered observability platform for modern DevOps and SRE teams.

RootSense AI ingests your logs, metrics, and deploys, then explains *why* something broke — with the fix attached. Built with Next.js 14, OpenAI, Tailwind, shadcn-style components, Framer Motion, and Recharts.

![status](https://img.shields.io/badge/status-demo--ready-green)
![next](https://img.shields.io/badge/next-14-black)
![ai](https://img.shields.io/badge/AI-OpenAI%20%2B%20mock%20fallback-violet)
![license](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Highlights

- 🧠 **AI Root Cause Analysis** — Streaming OpenAI responses with markdown + syntax-highlighted code/SQL/shell.
- 💬 **Conversational Copilot** — Floating chat widget + full chat page with history.
- 📊 **Live Dashboard** — Animated CPU/memory/latency/error-rate charts (Recharts), service health, AI insights, incident feed.
- 🔥 **Incident Timeline + AI Recommendations** — Full RCA page with chronological events and one-click "Apply fix" actions.
- 📜 **Logs Explorer** — Severity-colored, filterable, searchable, with an **AI Summary** button that streams a markdown analysis.
- 📈 **Analytics** — MTTR, frequency, severity distribution, AI predictions.
- 🔔 **Alerts Center** — Severity-grouped, multi-channel, ack/mute UI.
- 👥 **Team Workspace** — Members, on-call, activity stream.
- 🌗 **Dark / Light mode** — Premium dark theme with neon gradients, glassmorphism, grid backgrounds.
- ⚡ **Works offline out of the box** — If `OPENAI_API_KEY` is missing, the AI gracefully falls back to a streaming mock.

---

## 🚀 Quick Start

```bash
git clone <your-repo> rootsense-ai
cd rootsense-ai
npm install
cp .env.example .env.local   # optional — works without it
npm run dev
```

Open <http://localhost:3000>. The demo dashboard is at `/dashboard`. Try the chat at `/chat` or the floating bot in the corner.

---

## 🔑 Environment

See [`.env.example`](./.env.example). Only optional vars:

| Var | Purpose | Required? |
| --- | --- | --- |
| `OPENAI_API_KEY` | Real AI streaming. Without it, the app uses a realistic mock. | No |
| `OPENAI_MODEL`   | Defaults to `gpt-4o-mini`. | No |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | For full auth (UI works without). | No |
| `DATABASE_URL` | If you enable the Prisma layer ([`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md)). | No |

---

## 📁 Documentation

Everything lives in [`docs/`](./docs):

| File | What's in it |
| --- | --- |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System architecture, request flow, runtime model |
| [`docs/FOLDER_STRUCTURE.md`](./docs/FOLDER_STRUCTURE.md) | Full directory tree with annotations |
| [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) | PostgreSQL/Prisma schema + ER diagram |
| [`docs/API_ROUTES.md`](./docs/API_ROUTES.md) | Every endpoint, request/response shapes |
| [`docs/COMPONENT_STRUCTURE.md`](./docs/COMPONENT_STRUCTURE.md) | Component tree + reuse map |
| [`docs/UI_DESIGN_SYSTEM.md`](./docs/UI_DESIGN_SYSTEM.md) | Tokens, motion, components, patterns |
| [`docs/COLOR_PALETTE.md`](./docs/COLOR_PALETTE.md) | Full color tokens (light + dark) |
| [`docs/TYPOGRAPHY.md`](./docs/TYPOGRAPHY.md) | Font scale + usage |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Vercel, Docker, K8s, self-host |
| [`docs/FUTURE_IMPROVEMENTS.md`](./docs/FUTURE_IMPROVEMENTS.md) | Roadmap |
| [`docs/SETUP.md`](./docs/SETUP.md) | Step-by-step setup with troubleshooting |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router, RSC where possible)
- **Language:** TypeScript (strict)
- **UI:** Tailwind CSS + shadcn-style components built on Radix UI
- **Motion:** Framer Motion
- **Charts:** Recharts
- **AI:** OpenAI SDK (`openai` v4) with streaming + a graceful mock fallback
- **Markdown:** `react-markdown` + `react-syntax-highlighter` (Prism)
- **Theming:** `next-themes` (dark/light/system)
- **Icons:** `lucide-react`

---

## 📜 Scripts

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

---

## 🤖 How the AI layer works

1. The chat panel POSTs to `/api/chat` with `{ messages: [{role, content}, …] }`.
2. `src/lib/ai.ts` checks for `OPENAI_API_KEY`. If present, it streams OpenAI chat completions. If missing, it streams a hand-crafted mock that pattern-matches the prompt (payments / database / k8s / generic / summary).
3. The route streams plain text back, which the UI accumulates token-by-token with a blinking cursor.

This means you can demo the entire product without any API key. When you plug one in, it just gets smarter.

---

## 🧪 Try these prompts

In the chat (or floating widget):

- *"Why did the payments service crash?"*
- *"Summarize the last 24h of incidents"*
- *"How do I fix database timeouts?"*
- *"What's the root cause of INC-2041?"*
- *"Show probable reason for pod failure"*

---

## 🪪 License

MIT. See [LICENSE](./LICENSE).
