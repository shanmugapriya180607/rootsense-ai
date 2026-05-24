# RootSense AI — Database Schema

The demo runs with in-memory mock data so you can show off the UI without any database.
When you're ready to persist real data, drop the Prisma schema below into `prisma/schema.prisma` and run:

```bash
npm i -D prisma
npm i @prisma/client
npx prisma migrate dev --name init
```

The TypeScript types in `src/lib/types.ts` already match the Prisma model shapes, so swapping `mock-data.ts` for `prisma.<model>.findMany(...)` calls is a one-file change per page.

---

## ER Diagram

```
┌──────────────┐ 1     N ┌──────────────┐
│  Workspace   │────────►│     User     │
└──────┬───────┘         └──────┬───────┘
       │ 1                       │ N
       │                         │ (assignee)
       │ N                       ▼
┌──────▼───────┐         ┌──────────────┐
│   Service    │         │   Incident   │
└──────┬───────┘ ◄───────┴──────┬───────┘
       │ 1                       │ 1
       │ N                       │ N
┌──────▼───────┐         ┌──────▼───────┐
│   LogEntry   │         │ IncidentEvent│
└──────────────┘         └──────────────┘
                                  │
                                  │ 1
                                  │ N
                          ┌───────▼────────┐
                          │ Recommendation │
                          └────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     Alert    │     │  ChatSession │     │  ChatMessage │
└──────────────┘     └──────┬───────┘     └──────┬───────┘
                            └────────1 : N──────┘
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =========================================================================
// Auth / Workspace
// =========================================================================

model Workspace {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      String
  plan      Plan     @default(STARTER)
  createdAt DateTime @default(now())

  users     User[]
  services  Service[]
  incidents Incident[]
  alerts    Alert[]
  logs      LogEntry[]
  sessions  ChatSession[]
}

enum Plan {
  STARTER
  GROWTH
  ENTERPRISE
}

model User {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  name        String
  email       String    @unique
  passwordHash String?
  role        Role      @default(ENGINEER)
  onCall      Boolean   @default(false)
  createdAt   DateTime  @default(now())

  assigned    Incident[] @relation("Assignee")
  comments    IncidentEvent[] @relation("Author")
  sessions    ChatSession[]
}

enum Role {
  OWNER
  SRE_LEAD
  SRE
  ENGINEER
  ON_CALL
}

// =========================================================================
// Observability — Services & Logs
// =========================================================================

model Service {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  name        String
  region      String?
  status      ServiceStatus @default(HEALTHY)
  uptime      Float     @default(1)
  latencyP95Ms Int      @default(0)
  errorRate   Float     @default(0)
  rps         Int       @default(0)

  incidents   Incident[]
  logs        LogEntry[]
  alerts      Alert[]

  @@unique([workspaceId, name])
}

enum ServiceStatus {
  HEALTHY
  DEGRADED
  DOWN
}

model LogEntry {
  id        String   @id @default(cuid())
  workspaceId String
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  serviceId String?
  service   Service? @relation(fields: [serviceId], references: [id], onDelete: SetNull)
  timestamp DateTime @default(now())
  level     LogLevel
  host      String?
  traceId   String?
  message   String   @db.Text
  meta      Json?

  @@index([workspaceId, timestamp])
  @@index([serviceId, timestamp])
  @@index([level])
}

enum LogLevel {
  DEBUG
  INFO
  WARN
  ERROR
  FATAL
}

// =========================================================================
// Incidents
// =========================================================================

model Incident {
  id            String          @id @default(cuid())
  publicId      String          @unique          // e.g. INC-2041
  workspaceId   String
  workspace     Workspace       @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  serviceId     String?
  service       Service?        @relation(fields: [serviceId], references: [id], onDelete: SetNull)
  assigneeId    String?
  assignee      User?           @relation("Assignee", fields: [assigneeId], references: [id], onDelete: SetNull)

  title         String
  summary       String          @db.Text
  rootCause     String?         @db.Text
  suggestedFix  String?         @db.Text
  severity      Severity
  status        IncidentStatus  @default(OPEN)
  confidence    Float           @default(0)
  affectedUsers Int             @default(0)
  region        String?
  tags          String[]        @default([])

  detectedAt    DateTime        @default(now())
  resolvedAt    DateTime?

  events           IncidentEvent[]
  recommendations  Recommendation[]
  alerts           Alert[]

  @@index([workspaceId, status, severity])
  @@index([workspaceId, detectedAt])
}

enum Severity {
  CRITICAL
  HIGH
  MEDIUM
  LOW
  INFO
}

enum IncidentStatus {
  OPEN
  INVESTIGATING
  MITIGATED
  RESOLVED
}

model IncidentEvent {
  id         String        @id @default(cuid())
  incidentId String
  incident   Incident      @relation(fields: [incidentId], references: [id], onDelete: Cascade)
  type       EventType
  message    String
  meta       Json?
  authorId   String?
  author     User?         @relation("Author", fields: [authorId], references: [id], onDelete: SetNull)
  timestamp  DateTime      @default(now())

  @@index([incidentId, timestamp])
}

enum EventType {
  DETECTED
  DEPLOY
  SPIKE
  ALERT
  MITIGATION
  ROOTCAUSE
  RECOVERY
  COMMENT
}

model Recommendation {
  id              String           @id @default(cuid())
  incidentId      String
  incident        Incident         @relation(fields: [incidentId], references: [id], onDelete: Cascade)
  kind            RecommendationKind
  title           String
  description     String           @db.Text
  impact          Impact           @default(MEDIUM)
  estimatedMinutes Int             @default(5)
  appliedAt       DateTime?
  appliedById     String?
}

enum Impact {
  LOW
  MEDIUM
  HIGH
}

enum RecommendationKind {
  ROLLBACK
  SCALE_UP
  RESTART_POD
  MEMORY_INCREASE
  DB_OPTIMIZE
  API_THROTTLE
  CIRCUIT_BREAKER
  CACHE_WARM
}

// =========================================================================
// Alerts
// =========================================================================

model Alert {
  id           String         @id @default(cuid())
  workspaceId  String
  workspace    Workspace      @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  serviceId    String?
  service      Service?       @relation(fields: [serviceId], references: [id], onDelete: SetNull)
  incidentId   String?
  incident     Incident?      @relation(fields: [incidentId], references: [id], onDelete: SetNull)

  title        String
  description  String         @db.Text
  severity     Severity
  channel      AlertChannel
  acknowledged Boolean        @default(false)
  triggeredAt  DateTime       @default(now())
  ackedAt      DateTime?

  @@index([workspaceId, acknowledged, triggeredAt])
}

enum AlertChannel {
  SLACK
  DISCORD
  PAGERDUTY
  EMAIL
}

// =========================================================================
// AI Chat
// =========================================================================

model ChatSession {
  id          String        @id @default(cuid())
  workspaceId String
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String        @default("New chat")
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  messages    ChatMessage[]

  @@index([workspaceId, userId, updatedAt])
}

model ChatMessage {
  id         String       @id @default(cuid())
  sessionId  String
  session    ChatSession  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  role       MessageRole
  content    String       @db.Text
  createdAt  DateTime     @default(now())

  @@index([sessionId, createdAt])
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}
```

---

## Indexes & query patterns

The schema is pre-tuned for the most common dashboard queries:

| Query | Index used |
| --- | --- |
| Active incidents on the dashboard | `Incident(workspaceId, status, severity)` |
| Recent incident feed | `Incident(workspaceId, detectedAt DESC)` |
| Logs tail for a service | `LogEntry(serviceId, timestamp DESC)` |
| Severity-filtered logs | `LogEntry(level)` |
| Unacknowledged alerts | `Alert(workspaceId, acknowledged, triggeredAt DESC)` |
| User chat history | `ChatSession(workspaceId, userId, updatedAt DESC)` |

For higher write throughput, consider **TimescaleDB** for `LogEntry` (it's already shaped like a hypertable).

---

## Seeding

Use [`src/lib/mock-data.ts`](../src/lib/mock-data.ts) as your seed source. Convert mock objects to Prisma `createMany` calls in a small `prisma/seed.ts` script and reference it in `package.json`:

```json
"prisma": { "seed": "tsx prisma/seed.ts" }
```
