# RootSense AI — Setup Guide

A step-by-step walkthrough for getting RootSense AI running locally and pointing it at a real OpenAI key.

---

## Prerequisites

- **Node.js 18.17+** (Next.js 14 requires it). Recommended: Node 20 LTS or 22.
- **npm 9+**, **pnpm**, or **yarn** — any will work. We use `npm` in examples.
- *(Optional)* **PostgreSQL 14+** if you turn on the Prisma layer.
- *(Optional)* An **OpenAI API key** from <https://platform.openai.com/api-keys>.

---

## 1. Clone & install

```bash
git clone <your-repo> rootsense-ai
cd rootsense-ai
npm install
```

Install takes ~1 minute on a warm cache.

---

## 2. Configure environment (optional)

Everything works without env vars — the AI just uses a built-in mock that streams realistic markdown. To use the real AI:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```bash
OPENAI_API_KEY=sk-...           # your key
OPENAI_MODEL=gpt-4o-mini        # or gpt-4o / gpt-4-turbo
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://localhost:3000
```

> **Tip** — On Windows PowerShell, generate the secret with:
> `-join ((1..32) | ForEach-Object { '{0:X}' -f (Get-Random -Max 16) })`

---

## 3. Start the dev server

```bash
npm run dev
```

Open <http://localhost:3000>. You'll land on the marketing page. Useful paths:

| Path | What you'll see |
| --- | --- |
| `/` | Landing page (hero, features, pricing) |
| `/login` | Login form (any creds → routed to dashboard) |
| `/dashboard` | The main reliability overview |
| `/incidents` | List of mock incidents |
| `/incidents/INC-2041` | An incident detail page with timeline + AI recs |
| `/chat` | Full-page AI assistant |
| `/logs` | Logs Explorer with filters + AI summary button |
| `/analytics` | MTTR, frequency, severity distribution, predictions |
| `/team` | Team workspace |
| `/alerts` | Alerts center |
| `/settings` | Workspace settings |

The floating purple bot button (bottom-right) opens the AI assistant on any page.

---

## 4. Try the AI

In `/chat` (or the floating widget), try:

- *"Why did the payments service crash?"*
- *"Summarize the last 24h of incidents"*
- *"How do I fix database timeouts?"*

If `OPENAI_API_KEY` is set, you'll get real OpenAI streaming. If not, you'll get a hand-crafted mock streamed at ~50 tokens/sec — perfect for demos.

---

## 5. Build for production

```bash
npm run build
npm run start
```

`npm run start` serves the optimized build on port 3000.

---

## 6. (Optional) Turn on the database

The mock layer is great for demos. For real persistence:

```bash
npm i prisma -D
npm i @prisma/client
mkdir -p prisma
# Copy the schema from docs/DATABASE_SCHEMA.md into prisma/schema.prisma
npx prisma migrate dev --name init
```

Then in `src/lib/db.ts` (you create this):

```ts
import { PrismaClient } from "@prisma/client";
export const db = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = db;
```

And start swapping `mock-data` imports in pages for `db.incident.findMany(...)` etc.

---

## Common errors

### `Module not found: Can't resolve '@/components/ui/button'`
You're running from a stale install. Try `rm -rf .next node_modules && npm install`.

### `Error: NEXTAUTH_SECRET is not set`
Only a problem if you've wired NextAuth. For the demo, set a placeholder value or comment out the auth handlers.

### `OpenAI 401`
Your key is invalid. Double-check `.env.local` (note: `.env` is **not** read by Next.js in dev — must be `.env.local`).

### `Hydration failed because the initial UI does not match`
Most often caused by introducing `Math.random()` into the initial render. Use the `mulberry32` seeded PRNG in `src/lib/utils.ts` for any "random-looking" SSR content.

### Tailwind classes not applying
Verify your file path is in `tailwind.config.ts` → `content` glob. By default, anything under `src/app`, `src/components`, `src/lib` is included.

---

## Editor setup

Recommended VS Code extensions:

- **Tailwind CSS IntelliSense** (Brad Cornes)
- **ESLint** (Microsoft)
- **Prettier** (optional — repo doesn't enforce, but pairs well)
- **GitLens** for blame/history

---

## Need help?

- Architecture deep-dive → [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- Folder layout → [`FOLDER_STRUCTURE.md`](./FOLDER_STRUCTURE.md)
- API contracts → [`API_ROUTES.md`](./API_ROUTES.md)
- Database → [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md)
- Going live → [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- What's next → [`FUTURE_IMPROVEMENTS.md`](./FUTURE_IMPROVEMENTS.md)
