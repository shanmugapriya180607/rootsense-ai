"use client";

import * as React from "react";
import { Bell, BellOff, Check, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { alerts } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";

const sevBadge = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
  info: "info",
} as const;

const channelIcon = {
  slack: MessageSquare,
  discord: MessageSquare,
  pagerduty: Bell,
  email: Bell,
} as const;

export default function AlertsPage() {
  const [tab, setTab] = React.useState<"all" | "unack" | "ack">("all");
  const filtered = alerts.filter((a) =>
    tab === "all" ? true : tab === "unack" ? !a.acknowledged : a.acknowledged
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Alerts Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {alerts.filter((a) => !a.acknowledged).length} unacknowledged · {alerts.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4" /> Acknowledge all
          </Button>
          <Button variant="outline" size="sm">
            <BellOff className="h-4 w-4" /> Mute for 1h
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="unack">Unacknowledged ({alerts.filter((a) => !a.acknowledged).length})</TabsTrigger>
          <TabsTrigger value="ack">Acknowledged ({alerts.filter((a) => a.acknowledged).length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid lg:grid-cols-3 gap-4">
        {(["critical", "high", "medium"] as const).map((sev) => {
          const c = alerts.filter((a) => a.severity === sev).length;
          return (
            <Card key={sev} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground capitalize">{sev} alerts</p>
                <Badge variant={sev}>{c}</Badge>
              </div>
              <p className="mt-2 text-2xl font-display font-semibold">{c}</p>
              <p className="text-xs text-muted-foreground mt-1">Across {new Set(alerts.filter((a) => a.severity === sev).map((a) => a.service)).size} services</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="divide-y divide-border/60">
          {filtered.map((a) => {
            const Icon = channelIcon[a.channel];
            return (
              <div key={a.id} className="px-5 py-4 flex items-start gap-4 hover:bg-accent/30 transition-colors">
                <Badge variant={sevBadge[a.severity]} className="capitalize shrink-0 mt-0.5">{a.severity}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{a.description}</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                    <span className="font-mono">{a.service}</span>
                    <span>·</span>
                    <span>{relativeTime(a.triggeredAt)}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 capitalize">
                      <Icon className="h-3 w-3" />
                      {a.channel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!a.acknowledged && (
                    <Badge variant="critical" className="text-[10px]">NEW</Badge>
                  )}
                  {a.acknowledged ? (
                    <Badge variant="ok" className="text-[10px] gap-1">
                      <Check className="h-2.5 w-2.5" /> Acked
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">Acknowledge</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
