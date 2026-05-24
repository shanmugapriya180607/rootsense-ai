"use client";

import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { alerts } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";

const sevBadge = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
  info: "info",
} as const;

export function AlertStrip() {
  return (
    <Card>
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <h3 className="font-semibold">Recent Alerts</h3>
        </div>
        <Badge variant="ghost" className="text-[10px]">{alerts.filter((a) => !a.acknowledged).length} unack</Badge>
      </div>
      <div className="divide-y divide-border/60">
        {alerts.slice(0, 4).map((a) => (
          <div key={a.id} className="px-5 py-3 flex items-start gap-3">
            <Badge variant={sevBadge[a.severity]} className="capitalize shrink-0">{a.severity}</Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{a.title}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">{a.service}</span>
                <span>·</span>
                <span>{relativeTime(a.triggeredAt)}</span>
                <span>·</span>
                <span className="capitalize">{a.channel}</span>
              </div>
            </div>
            {!a.acknowledged && (
              <span className="text-[10px] text-sev-critical font-semibold">NEW</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
