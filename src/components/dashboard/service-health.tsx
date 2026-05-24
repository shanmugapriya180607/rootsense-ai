"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { services } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";

const statusStyle = {
  healthy: "bg-sev-ok",
  degraded: "bg-sev-medium",
  down: "bg-sev-critical",
} as const;

const statusBadge = {
  healthy: "ok" as const,
  degraded: "medium" as const,
  down: "critical" as const,
};

export function ServiceHealth() {
  return (
    <Card>
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Service Health</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{services.length} services monitored across regions</p>
        </div>
        <Badge variant="ghost" className="text-[10px]">LIVE</Badge>
      </div>
      <div className="divide-y divide-border/60">
        {services.map((s, i) => (
          <motion.div
            key={s.service}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-12 items-center gap-3 px-5 py-3 hover:bg-accent/30 transition-colors"
          >
            <div className="col-span-4 flex items-center gap-3 min-w-0">
              <span className={cn("relative flex h-2 w-2 shrink-0")}>
                <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60", statusStyle[s.status], s.status !== "healthy" && "animate-ping")} />
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", statusStyle[s.status])} />
              </span>
              <span className="font-mono text-sm truncate">{s.service}</span>
            </div>
            <div className="col-span-2 text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{(s.uptime * 100).toFixed(2)}%</span>
              <span className="ml-1 hidden sm:inline">uptime</span>
            </div>
            <div className="col-span-2 text-xs text-muted-foreground hidden md:block">
              <span className="text-foreground font-medium">{s.latencyP95}ms</span>
              <span className="ml-1">p95</span>
            </div>
            <div className="col-span-2 text-xs text-muted-foreground hidden md:block">
              <span className="text-foreground font-medium">{formatNumber(s.rps)}</span>
              <span className="ml-1">rps</span>
            </div>
            <div className="col-span-2 text-right">
              <Badge variant={statusBadge[s.status]} className="capitalize text-[10px]">
                {s.status}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
