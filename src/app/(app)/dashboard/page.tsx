"use client";

import { Activity, AlertTriangle, Clock, Cpu, Database, Gauge, MemoryStick, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { LiveChart } from "@/components/dashboard/live-chart";
import { ServiceHealth } from "@/components/dashboard/service-health";
import { IncidentFeed } from "@/components/dashboard/incident-feed";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { AlertStrip } from "@/components/dashboard/alert-strip";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight flex items-center gap-2">
            Reliability Overview
            <Badge variant="ok" className="ml-2 gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sev-ok" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sev-ok" />
              </span>
              LIVE
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Last updated just now · Auto-refreshing every 3.5s · Region <span className="font-mono text-foreground">global</span>
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="MTTR (24h)" value="11m 22s" delta={-38.4} deltaLabel="vs last week" icon={Clock} invertColor accent="violet" />
        <MetricCard label="Active incidents" value="3" delta={-25.0} deltaLabel="vs yesterday" icon={AlertTriangle} invertColor accent="pink" />
        <MetricCard label="Error rate" value="2.1%" delta={42.8} deltaLabel="last hour" icon={Zap} invertColor accent="cyan" />
        <MetricCard label="Users affected" value="15.6k" delta={-12.4} deltaLabel="last hour" icon={Users} invertColor accent="lime" />
      </div>

      {/* Live charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ChartTile title="CPU saturation" badge="86%" badgeVariant="high" icon={Cpu}>
          <LiveChart variant="area" color="hsl(var(--neon-violet))" base={62} variance={14} spikeAt={42} spikeMag={28} unit="%" />
        </ChartTile>
        <ChartTile title="Memory pressure" badge="74%" badgeVariant="medium" icon={MemoryStick}>
          <LiveChart variant="area" color="hsl(var(--neon-cyan))" base={58} variance={6} trend={0.18} unit="%" seed={11} />
        </ChartTile>
        <ChartTile title="API p95 latency" badge="412ms" badgeVariant="high" icon={Gauge}>
          <LiveChart variant="line" color="hsl(var(--neon-pink))" base={240} variance={60} spikeAt={38} spikeMag={340} unit="ms" seed={9} />
        </ChartTile>
      </div>

      {/* Error rate + DB */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ChartTile title="Error rate (5xx)" badge="2.1% · spike" badgeVariant="critical" icon={AlertTriangle} className="lg:col-span-2">
          <LiveChart variant="area" color="hsl(var(--sev-critical))" base={0.6} variance={0.4} spikeAt={45} spikeMag={6.5} unit="%" seed={13} height={240} />
        </ChartTile>
        <ChartTile title="DB connections" badge="92/100" badgeVariant="medium" icon={Database}>
          <LiveChart variant="area" color="hsl(var(--neon-lime))" base={68} variance={8} trend={0.25} unit="" seed={17} height={240} />
        </ChartTile>
      </div>

      {/* Service health, alerts, AI insights, incident feed */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ServiceHealth />
          <IncidentFeed />
        </div>
        <div className="space-y-4">
          <AIInsights />
          <AlertStrip />
        </div>
      </div>
    </div>
  );
}

function ChartTile({
  title,
  badge,
  badgeVariant,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  badge?: string;
  badgeVariant?: "critical" | "high" | "medium" | "low" | "info" | "ok";
  icon: any;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <h3 className="text-sm font-semibold truncate">{title}</h3>
        </div>
        {badge && badgeVariant && (
          <Badge variant={badgeVariant} className="text-[10px]">{badge}</Badge>
        )}
      </div>
      <div className="px-2 pt-2 pb-2">{children}</div>
    </Card>
  );
}
