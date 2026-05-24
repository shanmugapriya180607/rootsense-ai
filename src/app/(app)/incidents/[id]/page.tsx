"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  GitBranch,
  Megaphone,
  Sparkles,
  Users,
  Zap,
  Bug,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LiveChart } from "@/components/dashboard/live-chart";
import { getIncidentById, getMemberById } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";

const sevBadge = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
  info: "info",
} as const;

const statusBadge = {
  open: "high",
  investigating: "info",
  mitigated: "low",
  resolved: "ok",
} as const;

const eventIcons = {
  detected: Bug,
  deploy: GitBranch,
  spike: Zap,
  alert: Megaphone,
  mitigation: Wrench,
  rootcause: Sparkles,
  recovery: CheckCircle2,
  comment: Bot,
} as const;

const recIcons = {
  rollback: RefreshCw,
  scale_up: Zap,
  restart_pod: RefreshCw,
  memory_increase: Zap,
  db_optimize: Wrench,
  api_throttle: Zap,
  circuit_breaker: Wrench,
  cache_warm: Wrench,
} as const;

export default function IncidentDetailsPage({ params }: { params: { id: string } }) {
  const inc = getIncidentById(params.id);
  if (!inc) notFound();
  const assignee = getMemberById(inc.assignee);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="space-y-3">
        <Link
          href="/incidents"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> All incidents
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={sevBadge[inc.severity]} className="capitalize">{inc.severity}</Badge>
              <Badge variant={statusBadge[inc.status]} className="capitalize">{inc.status}</Badge>
              <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="font-mono text-xs">{inc.service}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{inc.region}</span>
            </div>
            <h1 className="text-2xl font-display font-semibold tracking-tight">{inc.title}</h1>
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{inc.summary}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Acknowledge</Button>
            <Button variant="gradient" size="sm">
              <Bot className="h-4 w-4" /> Ask AI
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <StatCard label="Detected" value={relativeTime(inc.detectedAt)} icon={Clock} />
        <StatCard label="Affected users" value={inc.affectedUsers.toLocaleString()} icon={Users} />
        <StatCard label="AI confidence" value={`${(inc.confidence * 100).toFixed(0)}%`} icon={Sparkles}>
          <Progress value={inc.confidence * 100} className="mt-2 h-1" />
        </StatCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Root cause */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-neon-violet/15 blur-3xl rounded-full" />
            <div className="relative px-5 py-4 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-neon-cyan" />
                <h3 className="font-semibold">RootSense AI · Root Cause Analysis</h3>
              </div>
              <Badge variant="info" className="text-[10px]">Confidence {(inc.confidence * 100).toFixed(0)}%</Badge>
            </div>
            <div className="relative px-5 py-4 space-y-3">
              {inc.rootCause && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Probable root cause</p>
                  <p className="text-sm leading-relaxed">{inc.rootCause}</p>
                </div>
              )}
              {inc.suggestedFix && (
                <div className="pt-3 border-t border-border/60">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Suggested fix</p>
                  <p className="text-sm leading-relaxed">{inc.suggestedFix}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-3 border-t border-border/60 flex-wrap">
                {inc.tags.map((t) => (
                  <Badge key={t} variant="ghost" className="text-[10px]">{t}</Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Charts */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <div className="px-5 py-3 border-b border-border/60">
                <h4 className="text-sm font-semibold">Error rate during incident</h4>
              </div>
              <div className="p-2">
                <LiveChart variant="area" color="hsl(var(--sev-critical))" base={0.6} spikeAt={20} spikeMag={6} unit="%" seed={inc.id.length} />
              </div>
            </Card>
            <Card>
              <div className="px-5 py-3 border-b border-border/60">
                <h4 className="text-sm font-semibold">p95 latency</h4>
              </div>
              <div className="p-2">
                <LiveChart variant="line" color="hsl(var(--neon-pink))" base={240} variance={40} spikeAt={22} spikeMag={520} unit="ms" seed={inc.id.length + 7} />
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="font-semibold">Incident Timeline</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Chronological events, AI-correlated.</p>
            </div>
            <div className="p-5">
              <ol className="relative space-y-5 ml-3">
                <span className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-neon-violet/60 via-border to-transparent" />
                {inc.events.map((ev) => {
                  const Icon = eventIcons[ev.type];
                  return (
                    <li key={ev.id} className="relative pl-7">
                      <span className="absolute -left-0.5 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-br from-neon-violet to-neon-cyan ring-4 ring-background" />
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-md bg-muted/40 flex items-center justify-center shrink-0">
                          <Icon className="h-3.5 w-3.5 text-foreground/80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-sm">{ev.message}</p>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {relativeTime(ev.timestamp)}
                            </span>
                          </div>
                          {ev.actor && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">by {ev.actor}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Assignee */}
          {assignee && (
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Assigned to</p>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${assignee.avatarColor} flex items-center justify-center text-xs font-semibold text-white`}>
                  {assignee.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{assignee.name}</p>
                  <p className="text-xs text-muted-foreground">{assignee.role}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card>
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="font-semibold">AI Recommendations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Ranked by impact and effort.</p>
            </div>
            <div className="divide-y divide-border/60">
              {inc.recommendations.map((rec) => {
                const Icon = recIcons[rec.kind];
                return (
                  <div key={rec.id} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-neon-violet/20 to-neon-cyan/20 border border-border/60 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{rec.title}</p>
                          <Badge variant="info" className="text-[9px] shrink-0 uppercase">
                            {rec.impact}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Button variant="gradient" size="sm">Apply fix</Button>
                          <Button variant="ghost" size="sm">
                            View runbook <ChevronRight className="h-3 w-3" />
                          </Button>
                          <span className="text-[10px] text-muted-foreground ml-auto">~{rec.estimatedMinutes} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  children,
}: {
  label: string;
  value: string;
  icon: any;
  children?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-display font-semibold tracking-tight">{value}</p>
      {children}
    </Card>
  );
}
