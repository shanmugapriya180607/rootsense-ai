# RootSense AI — Deployment Guide

RootSense AI is a standard Next.js 14 app. It runs anywhere Node 18+ does. Three recommended targets:

1. **Vercel** — zero-config, edge CDN, easiest demo.
2. **Docker** — best for self-host or any container platform.
3. **Kubernetes** — production-grade with HPA and rolling deploys.

---

## 1. Vercel (recommended for demos)

```bash
npm i -g vercel
vercel
```

Set env vars in the Vercel dashboard (or via `vercel env add`):

| Var | Required? | Notes |
| --- | --- | --- |
| `OPENAI_API_KEY` | optional | Without it the AI falls back to a deterministic mock. |
| `OPENAI_MODEL` | optional | Defaults to `gpt-4o-mini`. |
| `NEXTAUTH_SECRET` | recommended | 32+ char random. |
| `NEXTAUTH_URL` | recommended | `https://<your-domain>`. |
| `DATABASE_URL` | only if Prisma is enabled | |

That's it. Push to `main` and you have a live deploy.

---

## 2. Docker

### `Dockerfile`

```dockerfile
# ---- Stage 1: deps & build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage 2: runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what's needed
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["npm", "start"]
```

### Build & run

```bash
docker build -t rootsense-ai:latest .
docker run --rm -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  -e NEXTAUTH_SECRET=$(openssl rand -hex 32) \
  rootsense-ai:latest
```

### docker-compose (with optional Postgres)

```yaml
version: "3.9"
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: http://localhost:3000
      DATABASE_URL: postgresql://rootsense:rootsense@db:5432/rootsense
    depends_on: [db]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: rootsense
      POSTGRES_PASSWORD: rootsense
      POSTGRES_DB: rootsense
    volumes: ["pgdata:/var/lib/postgresql/data"]

volumes: { pgdata: {} }
```

---

## 3. Kubernetes

Minimal Deployment + Service + HPA:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: rootsense-ai }
spec:
  replicas: 2
  selector: { matchLabels: { app: rootsense-ai } }
  template:
    metadata: { labels: { app: rootsense-ai } }
    spec:
      containers:
        - name: app
          image: ghcr.io/your-org/rootsense-ai:latest
          ports: [{ containerPort: 3000 }]
          env:
            - { name: OPENAI_API_KEY,  valueFrom: { secretKeyRef: { name: rootsense, key: openai } } }
            - { name: NEXTAUTH_SECRET, valueFrom: { secretKeyRef: { name: rootsense, key: nextauth } } }
            - { name: NEXTAUTH_URL,    value: https://rootsense.example.com }
          resources:
            requests: { cpu: 200m, memory: 256Mi }
            limits:   { cpu: 1,    memory: 1Gi }
          readinessProbe: { httpGet: { path: /, port: 3000 }, initialDelaySeconds: 5 }
          livenessProbe:  { httpGet: { path: /, port: 3000 }, initialDelaySeconds: 30 }
---
apiVersion: v1
kind: Service
metadata: { name: rootsense-ai }
spec:
  selector: { app: rootsense-ai }
  ports: [{ port: 80, targetPort: 3000 }]
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: rootsense-ai }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: rootsense-ai }
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
```

Pair with your favorite ingress (Traefik / Nginx / Cloud LB) and a TLS cert.

---

## Database (optional)

If you turn on Prisma (see [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md)):

```bash
DATABASE_URL=postgresql://... npx prisma migrate deploy
DATABASE_URL=postgresql://... npx prisma db seed
```

Recommended managed Postgres:
- **Neon** (serverless, generous free tier)
- **Supabase** (Postgres + free Auth UI)
- **AWS RDS / Aurora** for enterprise

---

## CDN & assets

Next.js handles asset hashing and immutable caching out of the box. If you front this with CloudFront/Cloudflare:

- Cache `/_next/static/*` aggressively (immutable, 1y).
- Don't cache `/api/*` (already `Cache-Control: no-store`).
- Don't cache HTML — let Next decide via its own headers.

---

## Observability for RootSense itself (meta!)

The fastest way to instrument:

```bash
npm i @vercel/otel @opentelemetry/api
```

Then in `instrumentation.ts`:

```ts
import { registerOTel } from "@vercel/otel";
export function register() { registerOTel({ serviceName: "rootsense-ai" }); }
```

Point the OTLP exporter at your collector (Honeycomb, Grafana Tempo, Datadog APM).

---

## Common pitfalls

- **`Hydration mismatch on charts`** — make sure charts use the seeded PRNG for initial state (already wired) and only start `setInterval` after mount.
- **`OpenAI 429`** — drop in `@upstash/ratelimit` on `/api/chat`. See [`API_ROUTES.md`](./API_ROUTES.md#rate-limiting).
- **`Edge runtime fails on `openai`**` — the routes are explicitly `runtime = "nodejs"` for this reason. Don't change them to `edge`.
- **`DATABASE_URL not set at build time`** — Prisma needs it for `prisma generate`. Inject it in your CI/CD before the build step (or use `DIRECT_URL` workaround on Vercel).
