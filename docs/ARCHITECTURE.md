# RootSense AI — Architecture

A single-deployment Next.js 14 app. All routes (UI + API) live in the same project.
The architecture is deliberately simple: one Node process, one container, one deploy.
Heavy lifting (AI, charts, animations) happens in the browser or in serverless functions.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Browser (React)                                │
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────────┐   │
│   │  Sidebar    │   │   Topbar    │   │  Page (RSC) │   │ FloatingChat │   │
│   └─────────────┘   └─────────────┘   └──────┬──────┘   └──────┬───────┘   │
│                                              │                  │           │
│                  ┌───────────────────────────┴──────────────────┴────┐      │
│                  │           shadcn-style UI primitives              │      │
│                  │     Button · Card · Dialog · Select · …           │      │
│                  └───────────────────────────────────────────────────┘      │
│                                       │                                     │
│                  ┌───────────────────┐│┌────────────────────┐               │
│                  │ Recharts (live)   │││ Framer Motion       │              │
│                  └───────────────────┘ └────────────────────┘               │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ fetch / SSE-style streaming
┌───────────────────────────────────▼─────────────────────────────────────────┐
│                       Next.js Server (Node.js runtime)                      │
│                                                                             │
│   App Router                                                                │
│   ├── /                       Landing (SSG-friendly)                        │
│   ├── /(auth)/login,signup    Auth UI                                       │
│   ├── /(app)/dashboard        Dashboard (server + client islands)           │
│   ├── /(app)/incidents/[id]   Incident details (RSC + generateStaticParams) │
│   ├── /(app)/chat             Full AI assistant                             │
│   ├── /(app)/logs             Logs explorer                                 │
│   ├── /(app)/analytics        Analytics                                     │
│   └── /(app)/team, settings, alerts                                         │
│                                                                             │
│   API Routes (Node runtime)                                                 │
│   ├── POST /api/chat          Streaming chat (mock OR OpenAI)               │
│   ├── POST /api/analyze       Streaming log RCA                             │
│   └── GET  /api/metrics       Mock live metrics (replace w/ Prometheus)     │
└────────────────┬────────────────────────────────────────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
┌───────▼────────┐  ┌──────▼────────┐
│   OpenAI API   │  │  Mock engine  │
│  (when set)    │  │ (always-on)   │
└────────────────┘  └───────────────┘
```

---

## Request Flow — AI Chat (streaming)

1. **Client** (`ChatPanel`) builds a list of `{role, content}` messages and POSTs to `/api/chat`.
2. **Route handler** (`src/app/api/chat/route.ts`) calls `chatStream(messages)` from `src/lib/ai.ts`.
3. **`chatStream`** branches:
   - If `OPENAI_API_KEY` is set → uses the OpenAI SDK with `stream: true` and pipes deltas into a `ReadableStream<Uint8Array>`.
   - Otherwise → returns a hand-crafted markdown reply via `streamMock`, releasing 1 token every ~20ms.
4. **Response** is `text/plain; charset=utf-8` (no `data:` framing — keeps the client tiny).
5. **Client reader loop** decodes chunks, accumulates into the assistant message, and re-renders. A blinking cursor indicates pending.

This same pattern powers `/api/analyze` (log RCA).

---

## Runtime model

| Concern | Choice | Why |
| --- | --- | --- |
| Routing | Next.js App Router | RSC for mostly-static pages, client components for interactive widgets |
| Server runtime | Node.js (not Edge) | OpenAI SDK + stream parsing is more ergonomic on Node |
| State | URL + React state | No global store needed for this surface area |
| Theming | `next-themes` + CSS vars | One class on `<html>` switches the entire palette |
| Streaming | `ReadableStream` of `Uint8Array` | Works everywhere, no SSE/EventSource needed |
| Charts | Recharts + tiny seeded PRNG | Deterministic SSR/CSR + live updates client-side |

---

## Boundaries

| Layer | Knows about… | Knows nothing about… |
| --- | --- | --- |
| `src/components/ui/*` | Tokens, Radix primitives | Domain concepts (incidents, logs, AI) |
| `src/components/app/*` | App-level chrome (sidebar/topbar) | Specific pages |
| `src/components/dashboard/*` | Domain types from `lib/types` | Auth, routing, API specifics |
| `src/components/chat/*` | The chat protocol (`/api/chat`) | UI primitives' internals |
| `src/lib/ai.ts` | OpenAI SDK, mock bank | UI, routes |
| `src/app/api/*` | `src/lib/ai.ts`, request validation | UI components |

If you want to add a new AI provider (Gemini, Claude, local Ollama), the only file that changes is `src/lib/ai.ts`.

---

## Data model

Today: mock data in `src/lib/mock-data.ts` + types in `src/lib/types.ts`.
Tomorrow: drop in Prisma using the schema in [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) and replace the imports — the component contracts stay identical.

---

## Failure modes

- **OpenAI returns an error mid-stream** → the route appends `\n\n_⚠️ stream error_` so the user sees graceful degradation.
- **OpenAI key missing** → mock engine fires, no error.
- **Client aborts** → `AbortController` is wired into the fetch; the streaming loop exits cleanly.
- **Hydration mismatch on charts** → charts use a seeded PRNG so initial render is deterministic; live-tick happens only after mount.
