"use client";

import { Activity, AlertTriangle, Clock, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { LiveChart } from "@/components/dashboard/live-chart";

const failureBySvc = [
  { service: "payments", count: 41 },
  { service: "checkout", count: 28 },
  { service: "ingest-pipeline", count: 19 },
  { service: "api-gateway", count: 14 },
  { service: "auth-service", count: 6 },
  { service: "search", count: 3 },
];

const sevDistribution = [
  { sev: "Critical", color: "bg-sev-critical", pct: 14 },
  { sev: "High", color: "bg-sev-high", pct: 24 },
  { sev: "Medium", color: "bg-sev-medium", pct: 38 },
  { sev: "Low", color: "bg-sev-low", pct: 24 },
];

const predictions = [
  { service: "ingest-pipeline", risk: 0.78, eta: "~14h", reason: "Heap growth pattern matches INC-1922" },
  { service: "payments", risk: 0.62, eta: "~3 days", reason: "Stripe upstream latency creeping up" },
  { service: "checkout", risk: 0.31, eta: "stable", reason: "Auto-scaler headroom recovered" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Trend analysis across MTTR, frequency, severity, and AI predictions.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="MTTR (30d)" value="14m 08s" delta={-22.3} deltaLabel="vs prior 30d" icon={Clock} invertColor accent="violet" />
        <MetricCard label="Incidents (30d)" value="111" delta={6.7} deltaLabel="vs prior" icon={AlertTriangle} invertColor accent="pink" />
        <MetricCard label="Auto-resolved by AI" value="38%" delta={11.1} deltaLabel="vs prior" icon={Sparkles} accent="cyan" />
        <MetricCard label="False-positive rate" value="4.2%" delta={-3.8} deltaLabel="vs prior" icon={TrendingDown} invertColor accent="lime" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Incident frequency (90 days)</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Rolling 7d average · weekly bands</p>
            </div>
            <Badge variant="info" className="text-[10px]">Trend ↘ 18%</Badge>
          </div>
          <div className="p-2">
            <LiveChart variant="area" color="hsl(var(--neon-violet))" base={3.2} variance={1.2} trend={-0.005} unit="" seed={3} height={260} />
          </div>
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="font-semibold">Severity distribution</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
          </div>
          <div className="p-5 space-y-4">
            {sevDistribution.map((s) => (
              <div key={s.sev}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>{s.sev}</span>
                  <span className="font-mono text-muted-foreground">{s.pct}%</span>
                </div>
                <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="font-semibold">Failures by service</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Top contributors · 30d</p>
          </div>
          <div className="p-5 space-y-3">
            {failureBySvc.map((s) => {
              const max = failureBySvc[0].count;
              return (
                <div key={s.service}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-mono">{s.service}</span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-violet to-neon-cyan"
                      style={{ width: `${(s.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-neon-violet/15 blur-3xl rounded-full" />
          <div className="relative px-5 py-4 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neon-cyan" />
              <h3 className="font-semibold">AI Predictions</h3>
            </div>
            <Badge variant="info" className="text-[10px]">Trained on 90d history</Badge>
          </div>
          <div className="relative divide-y divide-border/60">
            {predictions.map((p) => (
              <div key={p.service} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm">{p.service}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk</p>
                    <p
                      className={`text-lg font-display font-semibold ${
                        p.risk > 0.7 ? "text-sev-critical" : p.risk > 0.4 ? "text-sev-medium" : "text-sev-ok"
                      }`}
                    >
                      {(p.risk * 100).toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">ETA {p.eta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
