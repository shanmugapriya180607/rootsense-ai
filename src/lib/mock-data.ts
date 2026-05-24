// =============================================================================
// Mock data layer.
// Realistic enough to make the dashboard feel alive without a real backend.
// =============================================================================

import {
  Alert,
  Incident,
  LogEntry,
  ServiceHealth,
  ServiceName,
  TeamMember,
  Recommendation,
} from "./types";
import { mulberry32 } from "./utils";

const NOW = Date.UTC(2026, 4, 24, 14, 30, 0); // Stable seed for SSR/CSR parity
const minutesAgo = (m: number) => new Date(NOW - m * 60_000).toISOString();

// ---------------------------------------------------------------------------- Services
export const services: ServiceHealth[] = [
  { service: "api-gateway", status: "degraded", uptime: 0.9982, latencyP95: 412, errorRate: 0.021, rps: 8420 },
  { service: "auth-service", status: "healthy", uptime: 0.9998, latencyP95: 89, errorRate: 0.001, rps: 3120 },
  { service: "payments", status: "down", uptime: 0.972, latencyP95: 1840, errorRate: 0.084, rps: 612 },
  { service: "checkout", status: "degraded", uptime: 0.991, latencyP95: 720, errorRate: 0.034, rps: 1240 },
  { service: "search", status: "healthy", uptime: 0.9995, latencyP95: 142, errorRate: 0.003, rps: 5240 },
  { service: "recommendations", status: "healthy", uptime: 0.9994, latencyP95: 188, errorRate: 0.004, rps: 4120 },
  { service: "notifications", status: "healthy", uptime: 0.9997, latencyP95: 76, errorRate: 0.002, rps: 980 },
  { service: "ingest-pipeline", status: "degraded", uptime: 0.9954, latencyP95: 624, errorRate: 0.018, rps: 12400 },
];

// ---------------------------------------------------------------------------- Incidents
const recs: Record<string, Recommendation> = {
  rollback: {
    id: "rec-rollback",
    kind: "rollback",
    title: "Rollback to deployment v2024.5.18",
    description:
      "The regression appeared immediately after deploy `payments@v2024.5.22`. Rolling back to the previous green deployment will restore service in ~3 minutes.",
    impact: "high",
    estimatedMinutes: 3,
  },
  scale_up: {
    id: "rec-scale",
    kind: "scale_up",
    title: "Scale checkout pods from 6 → 12",
    description:
      "CPU is sustained above 86% across all checkout pods. Horizontal scale-up will shed pressure and restore p95 latency.",
    impact: "medium",
    estimatedMinutes: 4,
  },
  memory_increase: {
    id: "rec-mem",
    kind: "memory_increase",
    title: "Increase JVM heap on ingest workers",
    description:
      "Memory pressure has been climbing linearly for 36h with no GC reclamation — classic leak pattern. Bump heap to 6GiB while a fix ships.",
    impact: "medium",
    estimatedMinutes: 10,
  },
  db_optimize: {
    id: "rec-db",
    kind: "db_optimize",
    title: "Add missing index on payments.transactions(user_id, created_at)",
    description:
      "Top slow query (47% of DB time) is a sequential scan. Adding the composite index drops execution from 2.1s → 18ms in staging.",
    impact: "high",
    estimatedMinutes: 6,
  },
  restart_pod: {
    id: "rec-restart",
    kind: "restart_pod",
    title: "Rolling restart of notifications deployment",
    description:
      "Three pods are stuck in CrashLoopBackOff with the same stack trace. A rolling restart on the deployment will pull the patched image.",
    impact: "low",
    estimatedMinutes: 2,
  },
  circuit_breaker: {
    id: "rec-cb",
    kind: "circuit_breaker",
    title: "Enable circuit breaker on Stripe upstream",
    description:
      "Upstream Stripe latency spiked from 80ms → 1.4s. A circuit breaker will fail fast and prevent thread-pool exhaustion in the checkout service.",
    impact: "high",
    estimatedMinutes: 1,
  },
};

export const incidents: Incident[] = [
  {
    id: "INC-2041",
    title: "Payments service crash loop after v2024.5.22 deploy",
    service: "payments",
    severity: "critical",
    status: "investigating",
    detectedAt: minutesAgo(18),
    confidence: 0.94,
    affectedUsers: 12482,
    region: "us-east-1",
    tags: ["deploy", "crashloop", "stripe"],
    assignee: "u-2",
    suggestedFix: "Rollback to v2024.5.18 and patch the null pointer in `ChargeHandler.refund()`.",
    summary:
      "A null-pointer exception in `ChargeHandler.refund()` shipped in v2024.5.22 is causing pod restarts and 5xx responses on the /charges endpoint. The error rate jumped from 0.4% → 8.4% within 90s of the deploy.",
    rootCause:
      "Recent change introduced an unchecked `customer.defaultPaymentMethod` access. For ~12% of refund requests, that field is null after a recent Stripe API migration.",
    events: [
      { id: "e1", timestamp: minutesAgo(35), type: "deploy", message: "Deployed payments@v2024.5.22 to us-east-1", actor: "ci-bot" },
      { id: "e2", timestamp: minutesAgo(33), type: "spike", message: "Error rate exceeded 2% threshold (was 0.4%)", meta: { errorRate: 0.024 } },
      { id: "e3", timestamp: minutesAgo(32), type: "alert", message: "PagerDuty alert P1 triggered", actor: "pagerduty" },
      { id: "e4", timestamp: minutesAgo(28), type: "detected", message: "RootSense AI auto-detected anomaly across 3 dimensions" },
      { id: "e5", timestamp: minutesAgo(22), type: "rootcause", message: "Root cause attributed to ChargeHandler.refund() NPE", meta: { confidence: 0.94 } },
      { id: "e6", timestamp: minutesAgo(14), type: "mitigation", message: "On-call paged Maya Chen (SRE Lead)", actor: "rootsense" },
      { id: "e7", timestamp: minutesAgo(6), type: "comment", message: "Rollback PR opened: #4812", actor: "maya.chen" },
    ],
    recommendations: [recs.rollback, recs.circuit_breaker],
  },
  {
    id: "INC-2040",
    title: "Checkout p95 latency breached SLO",
    service: "checkout",
    severity: "high",
    status: "open",
    detectedAt: minutesAgo(46),
    confidence: 0.87,
    affectedUsers: 3120,
    region: "eu-west-1",
    tags: ["latency", "slo-breach", "cpu"],
    assignee: "u-3",
    summary:
      "Checkout p95 latency climbed from 240ms → 720ms over 22 minutes, driven by sustained CPU saturation on 4 of 6 pods. No correlated deploy.",
    rootCause:
      "Traffic surge from a flash sale in EU pushed CPU above 86%. Auto-scaler is rate-limited by max replicas (currently capped at 6).",
    events: [
      { id: "e1", timestamp: minutesAgo(46), type: "spike", message: "p95 latency crossed 400ms" },
      { id: "e2", timestamp: minutesAgo(44), type: "detected", message: "Anomaly score 0.81 — sustained pattern" },
      { id: "e3", timestamp: minutesAgo(40), type: "alert", message: "Slack alert sent to #sre-eu" },
      { id: "e4", timestamp: minutesAgo(31), type: "rootcause", message: "CPU saturation correlated with EU traffic spike" },
    ],
    recommendations: [recs.scale_up, recs.circuit_breaker],
  },
  {
    id: "INC-2039",
    title: "Memory leak in ingest workers (slow)",
    service: "ingest-pipeline",
    severity: "medium",
    status: "investigating",
    detectedAt: minutesAgo(2160),
    confidence: 0.91,
    affectedUsers: 0,
    region: "global",
    tags: ["memory-leak", "jvm", "gc"],
    assignee: "u-4",
    summary:
      "Heap utilization is climbing linearly at ~120MiB/hour across all 8 ingest workers with GC not reclaiming. Will OOM in approximately 14h.",
    rootCause:
      "Suspected unbounded cache in `EventBatchAccumulator`. Heap dump shows 2.1M retained `BatchKey` objects.",
    events: [
      { id: "e1", timestamp: minutesAgo(2160), type: "detected", message: "Anomaly: monotonic heap growth pattern detected" },
      { id: "e2", timestamp: minutesAgo(2120), type: "rootcause", message: "Suspected EventBatchAccumulator cache" },
      { id: "e3", timestamp: minutesAgo(1800), type: "comment", message: "Heap dump captured — under analysis", actor: "diego.r" },
    ],
    recommendations: [recs.memory_increase],
  },
  {
    id: "INC-2038",
    title: "Database query timeout — payments.transactions",
    service: "payments",
    severity: "high",
    status: "resolved",
    detectedAt: minutesAgo(4380),
    resolvedAt: minutesAgo(4040),
    confidence: 0.96,
    affectedUsers: 821,
    region: "us-east-1",
    tags: ["database", "postgres", "missing-index"],
    summary:
      "A reporting query against `payments.transactions` was issuing sequential scans, blocking write traffic for ~6 minutes during a daily batch.",
    rootCause:
      "Missing composite index on `(user_id, created_at)`. Query planner switched to seqscan after recent stats refresh.",
    events: [
      { id: "e1", timestamp: minutesAgo(4380), type: "detected", message: "DB connection pool saturated" },
      { id: "e2", timestamp: minutesAgo(4360), type: "rootcause", message: "Seq scan on payments.transactions identified", meta: { confidence: 0.96 } },
      { id: "e3", timestamp: minutesAgo(4100), type: "mitigation", message: "Index created concurrently" },
      { id: "e4", timestamp: minutesAgo(4040), type: "recovery", message: "Latency returned to baseline" },
    ],
    recommendations: [recs.db_optimize],
  },
  {
    id: "INC-2037",
    title: "Notifications pods CrashLoopBackOff",
    service: "notifications",
    severity: "low",
    status: "resolved",
    detectedAt: minutesAgo(7320),
    resolvedAt: minutesAgo(7290),
    confidence: 0.88,
    affectedUsers: 0,
    region: "us-west-2",
    tags: ["k8s", "crashloop", "config"],
    summary:
      "Three of nine notifications pods were stuck in CrashLoopBackOff after a config-map update. A rolling restart resolved it.",
    rootCause: "Stale config-map mounted in pods created before the rollout.",
    events: [
      { id: "e1", timestamp: minutesAgo(7320), type: "detected", message: "Pods stuck in CrashLoopBackOff" },
      { id: "e2", timestamp: minutesAgo(7305), type: "rootcause", message: "Config-map staleness identified" },
      { id: "e3", timestamp: minutesAgo(7290), type: "recovery", message: "Rolling restart completed" },
    ],
    recommendations: [recs.restart_pod],
  },
];

// ---------------------------------------------------------------------------- Logs
const LOG_SOURCES: ServiceName[] = [
  "payments",
  "checkout",
  "api-gateway",
  "auth-service",
  "ingest-pipeline",
];

const LOG_TEMPLATES: Array<{ level: LogEntry["level"]; msg: string; weight: number }> = [
  { level: "ERROR", msg: "NullPointerException at ChargeHandler.refund(ChargeHandler.java:142)", weight: 6 },
  { level: "ERROR", msg: "Connection refused: stripe-api.internal:443 after 3 retries", weight: 4 },
  { level: "WARN", msg: "Circuit breaker half-open for upstream payments-gateway", weight: 5 },
  { level: "WARN", msg: "Heap utilization 87% — GC pause 412ms", weight: 6 },
  { level: "INFO", msg: "Processed batch id=batch_2841 size=1024 in 138ms", weight: 12 },
  { level: "INFO", msg: "Auth token refreshed for tenant=acme-corp", weight: 10 },
  { level: "DEBUG", msg: "Cache miss key=user:profile:8421 source=db", weight: 8 },
  { level: "ERROR", msg: "Deadline exceeded calling /search/v2 (1.84s > 1.5s)", weight: 4 },
  { level: "FATAL", msg: "OOMKilled — pod=ingest-worker-7 memory.usage=6.2GiB limit=6.0GiB", weight: 2 },
  { level: "INFO", msg: "Scheduler tick: 18 jobs ran (success=18 failed=0)", weight: 7 },
  { level: "WARN", msg: "Slow query: SELECT * FROM transactions WHERE user_id = $1 (2104ms)", weight: 4 },
  { level: "INFO", msg: "Deployed payments@v2024.5.22 — rollout 100%", weight: 1 },
];

export function generateLogs(count: number, seed = 42): LogEntry[] {
  const rand = mulberry32(seed);
  const totalWeight = LOG_TEMPLATES.reduce((a, b) => a + b.weight, 0);
  const pick = () => {
    let r = rand() * totalWeight;
    for (const t of LOG_TEMPLATES) {
      r -= t.weight;
      if (r <= 0) return t;
    }
    return LOG_TEMPLATES[0];
  };
  const logs: LogEntry[] = [];
  for (let i = 0; i < count; i++) {
    const tpl = pick();
    const minutes = i * 0.4;
    logs.push({
      id: `log-${i}`,
      timestamp: new Date(NOW - minutes * 60_000).toISOString(),
      level: tpl.level,
      service: LOG_SOURCES[Math.floor(rand() * LOG_SOURCES.length)],
      host: `pod-${Math.floor(rand() * 32).toString().padStart(2, "0")}`,
      traceId: `tr_${Math.floor(rand() * 1e9).toString(36)}`,
      message: tpl.msg,
    });
  }
  return logs;
}

// ---------------------------------------------------------------------------- Metric series
export function generateSeries(opts: {
  points?: number;
  base?: number;
  variance?: number;
  trend?: number;
  spikeAt?: number;
  spikeMag?: number;
  seed?: number;
}) {
  const {
    points = 60,
    base = 50,
    variance = 8,
    trend = 0,
    spikeAt,
    spikeMag = 30,
    seed = 1,
  } = opts;
  const rand = mulberry32(seed);
  const result: { t: number; v: number }[] = [];
  for (let i = 0; i < points; i++) {
    let v = base + (rand() - 0.5) * variance + trend * i;
    if (spikeAt !== undefined && i >= spikeAt) {
      const decay = Math.exp(-(i - spikeAt) / 6);
      v += spikeMag * decay;
    }
    result.push({ t: i, v: Math.max(0, Math.round(v * 10) / 10) });
  }
  return result;
}

// ---------------------------------------------------------------------------- Team
export const team: TeamMember[] = [
  { id: "u-1", name: "Shanmugapriya", email: "shanmugapriya@rootsense.ai", role: "Owner", oncall: false, avatarColor: "from-neon-violet to-neon-pink", initials: "SH" },
  { id: "u-2", name: "Maya Chen", email: "maya@rootsense.ai", role: "SRE Lead", oncall: true, avatarColor: "from-neon-cyan to-neon-violet", initials: "MC" },
  { id: "u-3", name: "Jordan Park", email: "jordan@rootsense.ai", role: "SRE", oncall: false, avatarColor: "from-neon-pink to-neon-violet", initials: "JP" },
  { id: "u-4", name: "Diego Ramos", email: "diego@rootsense.ai", role: "Engineer", oncall: false, avatarColor: "from-neon-lime to-neon-cyan", initials: "DR" },
  { id: "u-5", name: "Aisha Patel", email: "aisha@rootsense.ai", role: "Engineer", oncall: false, avatarColor: "from-neon-violet to-neon-cyan", initials: "AP" },
  { id: "u-6", name: "Lukas Weber", email: "lukas@rootsense.ai", role: "On-Call", oncall: true, avatarColor: "from-neon-cyan to-neon-lime", initials: "LW" },
];

// ---------------------------------------------------------------------------- Alerts
export const alerts: Alert[] = [
  {
    id: "alert-1",
    title: "P1: payments error rate above 5%",
    severity: "critical",
    service: "payments",
    triggeredAt: minutesAgo(16),
    channel: "pagerduty",
    acknowledged: true,
    description: "5xx rate breached 5% threshold for 3 consecutive minutes.",
  },
  {
    id: "alert-2",
    title: "checkout p95 latency above 500ms",
    severity: "high",
    service: "checkout",
    triggeredAt: minutesAgo(44),
    channel: "slack",
    acknowledged: true,
    description: "p95 latency 720ms (threshold 500ms) sustained for 8 minutes.",
  },
  {
    id: "alert-3",
    title: "ingest-pipeline memory growth >100MiB/h",
    severity: "medium",
    service: "ingest-pipeline",
    triggeredAt: minutesAgo(120),
    channel: "slack",
    acknowledged: false,
    description: "Heap growth pattern matches known leak signature.",
  },
  {
    id: "alert-4",
    title: "api-gateway anomaly score 0.78",
    severity: "medium",
    service: "api-gateway",
    triggeredAt: minutesAgo(180),
    channel: "discord",
    acknowledged: false,
    description: "Unusual mix of 401/429 responses from /v1/charge.",
  },
  {
    id: "alert-5",
    title: "auth-service rate-limit warnings",
    severity: "low",
    service: "auth-service",
    triggeredAt: minutesAgo(300),
    channel: "email",
    acknowledged: true,
    description: "Burst from tenant `loadtest-eu` hit per-minute limit.",
  },
];

export function getIncidentById(id: string) {
  return incidents.find((i) => i.id === id);
}

export function getMemberById(id?: string) {
  if (!id) return undefined;
  return team.find((m) => m.id === id);
}
