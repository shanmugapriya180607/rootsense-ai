# RootSense AI — Future Improvements

A pragmatic roadmap. Each item is sized so a single engineer can pick it up and ship in 1–5 days.

---

## P0 — Production hardening (next sprint)

- [ ] **Persist incidents/logs in Postgres.** Adopt the schema in [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md). Swap `src/lib/mock-data.ts` imports for Prisma calls page-by-page.
- [ ] **Wire NextAuth.js with credentials + GitHub + Google.** Today the auth pages are UI-only.
- [ ] **Rate limit `/api/chat` and `/api/analyze`.** `@upstash/ratelimit` snippet is in `API_ROUTES.md`.
- [ ] **Tenant isolation.** Every Prisma query scoped by `workspaceId` from the session.
- [ ] **Audit log table** for sensitive actions (apply fix, rollback, invite member).
- [ ] **Server-side error reporting** (Sentry).
- [ ] **Add CSP + security headers** in `next.config.mjs` (or via middleware).
- [ ] **E2E tests** with Playwright on the golden paths (login → dashboard → ask AI).

---

## P1 — AI depth

- [ ] **Tool/function calling.** Let the model fetch live data: `getIncident(id)`, `searchLogs({service, level})`, `applyRecommendation(id)`. Today the AI sees only the chat history.
- [ ] **Retrieval-augmented RCA.** Embed runbooks + historical incidents → top-k chunks injected into the prompt for *grounded* answers.
- [ ] **Multi-provider switch in UI.** Settings → AI → choose OpenAI / Gemini / Anthropic / Ollama. Today only OpenAI + mock are wired.
- [ ] **Streaming **structured** outputs.** Use JSON-mode / response schemas to surface severity + confidence as typed fields, not parsed from markdown.
- [ ] **Auto post-mortem.** On `status → resolved`, generate a Notion/Confluence-ready post-mortem doc.
- [ ] **Anomaly detection** (real). Today we hard-code "AI Insights". Plug in a simple seasonal model (Prophet / ARIMA) or a vector outlier detector on the metric series.

---

## P2 — Observability integrations

- [ ] **Log collectors:** Vector, Fluent Bit, OTEL Collector → `POST /api/logs/ingest`.
- [ ] **Prometheus:** `/api/metrics` proxies to a configured Prometheus URL with PromQL templates per service.
- [ ] **Kubernetes events:** stream from `kubectl get events --watch` (or the K8s informer API) into the incident timeline.
- [ ] **Deploy events:** GitHub/GitLab/Argo CD webhooks → automatic deploy markers on charts.
- [ ] **Slack bot:** bidirectional — chat with RootSense in Slack, ack incidents from there.
- [ ] **PagerDuty:** create/ack/resolve incidents both ways.

---

## P3 — Collaboration

- [ ] **Comments + @mentions** on incidents.
- [ ] **Real-time presence** (Liveblocks or Yjs) — see who's looking at an incident.
- [ ] **Roles & permissions** (RBAC) beyond the demo enum.
- [ ] **Status pages** auto-generated from incident state.

---

## P4 — Performance & scale

- [ ] **TimescaleDB hypertable** for `LogEntry`.
- [ ] **Search backend:** OpenSearch / Meilisearch for full-text log search.
- [ ] **Worker queue:** BullMQ / Inngest for long-running AI summaries (so they don't block the request).
- [ ] **Edge-cache the landing page** with `revalidate`.
- [ ] **Code-split heavy charts** with `next/dynamic`.

---

## P5 — Polish

- [ ] **Voice input** in chat (Web Speech API; UI hint already present).
- [ ] **Command palette** (`Cmd+K`) — search incidents, open pages, run actions.
- [ ] **Customizable dashboards** (drag-and-drop tiles via dnd-kit).
- [ ] **Per-user dashboard layouts** persisted to the DB.
- [ ] **Reduced-motion mode** (toggle exists in Settings, hook it up to disable Framer Motion).
- [ ] **High-contrast theme** for bright environments.
- [ ] **i18n** — pull strings into `src/lib/i18n/`.

---

## P6 — Business surface

- [ ] **Billing** (Stripe). Map `Plan` enum to Stripe products.
- [ ] **Usage metering** (logs/GB, AI tokens).
- [ ] **Marketing site polish:** real testimonials, customer logos, blog (`/blog`), changelog (`/changelog`).
- [ ] **Docs site** powered by Fumadocs or Mintlify.

---

## Bug magnets to address proactively

- **Long log lines** in the Logs Explorer wrap awkwardly — add an "expand row" affordance.
- **Hydration warnings** if anyone re-introduces non-seeded randomness in mock data — keep `mulberry32`.
- **Recharts in dark mode** — make sure all custom tooltips use `bg-popover/95` not bare `bg-white`.
- **Floating chat z-index** vs Radix Dialogs — `z-40` for the button, dialogs are `z-50`, so they overlay correctly. Don't bump the chat without re-checking.

---

## Out of scope (deliberately)

- A full APM (we're a *root cause* layer, not a metrics database).
- Building our own log shipper (use Vector / OTEL — they're great).
- Replacing PagerDuty / Opsgenie (we complement them).
