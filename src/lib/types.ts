// =============================================================================
// RootSense AI — Domain Types
// Single source of truth for incident, log, metric, team, and alert shapes.
// =============================================================================

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type IncidentStatus = "open" | "investigating" | "mitigated" | "resolved";

export type ServiceName =
  | "api-gateway"
  | "auth-service"
  | "payments"
  | "checkout"
  | "search"
  | "recommendations"
  | "notifications"
  | "ingest-pipeline"
  | "billing"
  | "user-profile";

export interface Incident {
  id: string;
  title: string;
  service: ServiceName;
  severity: Severity;
  status: IncidentStatus;
  detectedAt: string; // ISO
  resolvedAt?: string; // ISO
  rootCause?: string;
  confidence: number; // 0..1
  affectedUsers: number;
  region: string;
  tags: string[];
  assignee?: string; // user id
  suggestedFix?: string;
  summary: string;
  events: IncidentEvent[];
  recommendations: Recommendation[];
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  type:
    | "detected"
    | "deploy"
    | "spike"
    | "alert"
    | "mitigation"
    | "rootcause"
    | "recovery"
    | "comment";
  message: string;
  actor?: string;
  meta?: Record<string, string | number>;
}

export interface Recommendation {
  id: string;
  kind:
    | "rollback"
    | "scale_up"
    | "restart_pod"
    | "memory_increase"
    | "db_optimize"
    | "api_throttle"
    | "circuit_breaker"
    | "cache_warm";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  estimatedMinutes: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";
  service: ServiceName;
  host: string;
  traceId?: string;
  message: string;
  meta?: Record<string, string | number>;
}

export interface MetricPoint {
  t: number; // unix seconds
  v: number;
}

export interface ServiceHealth {
  service: ServiceName;
  status: "healthy" | "degraded" | "down";
  uptime: number; // 0..1
  latencyP95: number; // ms
  errorRate: number; // 0..1
  rps: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "SRE Lead" | "SRE" | "Engineer" | "On-Call";
  oncall: boolean;
  avatarColor: string;
  initials: string;
}

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  service: ServiceName;
  triggeredAt: string;
  channel: "slack" | "discord" | "pagerduty" | "email";
  acknowledged: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  pending?: boolean;
}
