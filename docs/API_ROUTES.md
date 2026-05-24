# RootSense AI — API Routes

All routes live under `src/app/api/*` and run on the **Node.js runtime** (not Edge — the OpenAI streaming SDK is easier on Node).

Responses are intentionally minimal:
- **Streaming endpoints** return raw UTF-8 markdown chunks (no `data:` framing). The client reads with a `ReadableStreamDefaultReader` and accumulates.
- **JSON endpoints** return `application/json`.

---

## `POST /api/chat`

Stream a chat completion from the AI copilot.

### Request

```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Why did the payments service crash?" }
  ]
}
```

### Response

```http
200 OK
Content-Type: text/plain; charset=utf-8
Cache-Control: no-store
X-Provider: openai          // or "mock" if no OPENAI_API_KEY is set

### Likely root cause
**`NullPointerException` in `ChargeHandler.refund()`** introduced in `payments@v2024.5.22`.
…
```

### Client snippet

```ts
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages }),
  signal: controller.signal,
});

const reader = res.body!.getReader();
const decoder = new TextDecoder();
let acc = "";
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  acc += decoder.decode(value, { stream: true });
  setAssistantText(acc);
}
```

### Errors

| Status | When |
| --- | --- |
| 400 | `messages` missing or not an array |
| 500 | Server-side stream couldn't be opened |

---

## `POST /api/analyze`

Stream a root-cause analysis for a blob of logs.

### Request

```http
POST /api/analyze
Content-Type: application/json

{ "logs": "[ERROR] payments NPE at ChargeHandler.refund…" }
```

Body is capped at **16,000 chars** server-side.

### Response

```http
200 OK
Content-Type: text/plain; charset=utf-8

### Likely root cause
**`NullPointerException` in `ChargeHandler.refund()`** …

### Suggested fix
```bash
kubectl rollout undo deployment/payments --to-revision=18
```
```

### Errors

| Status | When |
| --- | --- |
| 400 | `logs` missing |

---

## `GET /api/metrics`

Return a fresh set of live metrics for the dashboard. (In production, replace with real Prometheus / OpenTelemetry queries.)

### Response

```http
200 OK
Content-Type: application/json

{
  "services": [
    {
      "service": "payments",
      "status": "down",
      "uptime": 0.972,
      "latencyP95": 1840,
      "errorRate": 0.084,
      "rps": 612
    },
    …
  ],
  "cpu":       [{ "t": 0, "v": 62.4 }, …],
  "memory":    [{ "t": 0, "v": 58.1 }, …],
  "latency":   [{ "t": 0, "v": 241.2 }, …],
  "errorRate": [{ "t": 0, "v": 0.6 }, …],
  "rps":       [{ "t": 0, "v": 8410 }, …]
}
```

---

## Future endpoints (suggested shape)

Not implemented in the demo, but here's the contract to extend to:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET`  | `/api/incidents`              | List incidents (filter by status, severity, service) |
| `GET`  | `/api/incidents/:id`          | Get one incident with events + recommendations |
| `POST` | `/api/incidents`              | Create an incident manually |
| `PATCH`| `/api/incidents/:id`          | Update status / assignee |
| `POST` | `/api/incidents/:id/events`   | Append an event to the timeline |
| `POST` | `/api/incidents/:id/apply`    | Apply a recommendation (rollback, scale, etc.) |
| `GET`  | `/api/logs`                   | Cursor-paginated log search |
| `POST` | `/api/logs/ingest`            | Push log batches from collectors |
| `GET`  | `/api/alerts`                 | List alerts (filter by ack, severity) |
| `POST` | `/api/alerts/:id/ack`         | Acknowledge an alert |
| `GET`  | `/api/team`                   | List workspace members |
| `POST` | `/api/team/invite`            | Invite a member |
| `POST` | `/api/auth/login`             | NextAuth credentials endpoint |
| `POST` | `/api/auth/signup`            | Create a user + workspace |

---

## Authentication

Demo auth is UI-only (login form just redirects). When you wire NextAuth.js:

- Protect `/api/*` (except `/api/chat` if you allow guest demos) with a middleware that calls `getServerSession()`.
- Use the JWT strategy with `NEXTAUTH_SECRET` from env.
- Scope every query by `workspaceId` derived from the session.

---

## Rate limiting

For production, drop in [Upstash Ratelimit](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted):

```ts
import { Ratelimit } from "@upstash/ratelimit";
const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
});
const { success } = await limiter.limit(`chat:${userId}`);
if (!success) return new Response("rate-limited", { status: 429 });
```
