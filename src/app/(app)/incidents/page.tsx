"use client";

import Link from "next/link";
import * as React from "react";
import { Filter, Search, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { incidents, getMemberById } from "@/lib/mock-data";
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

export default function IncidentsPage() {
  const [tab, setTab] = React.useState<"all" | "open" | "investigating" | "resolved">("all");
  const [q, setQ] = React.useState("");

  const filtered = incidents.filter((i) => {
    if (tab !== "all") {
      if (tab === "resolved") return i.status === "resolved";
      if (tab === "open") return i.status === "open";
      if (tab === "investigating") return i.status === "investigating";
    }
    if (q && !`${i.id} ${i.title} ${i.service}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Incidents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {incidents.filter((i) => i.status !== "resolved").length} active · {incidents.length} total
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({incidents.length})</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="investigating">Investigating</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search incidents…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No incidents match your filters</p>
            <p className="text-xs text-muted-foreground mt-1">Try clearing the search or switching tabs.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <div className="col-span-5">Incident</div>
              <div className="col-span-2">Service</div>
              <div className="col-span-1">Severity</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">AI</div>
              <div className="col-span-1">Users</div>
              <div className="col-span-1 text-right">Detected</div>
            </div>
            {filtered.map((inc) => {
              const assignee = getMemberById(inc.assignee);
              return (
                <Link
                  key={inc.id}
                  href={`/incidents/${inc.id}`}
                  className="grid grid-cols-12 items-center gap-3 px-5 py-3.5 hover:bg-accent/30 transition-colors group"
                >
                  <div className="col-span-5 min-w-0">
                    <div className="flex items-start gap-2">
                      <Badge variant={sevBadge[inc.severity]} className="capitalize shrink-0 mt-0.5">{inc.severity}</Badge>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{inc.title}</p>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-mono">{inc.id}</span>
                          {assignee && (
                            <>
                              <span>·</span>
                              <span>assigned to {assignee.name.split(" ")[0]}</span>
                            </>
                          )}
                          {inc.tags.slice(0, 2).map((t) => (
                            <Badge key={t} variant="ghost" className="text-[9px] h-4 px-1.5">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 font-mono text-xs">{inc.service}</div>
                  <div className="col-span-1">
                    <span className="text-xs capitalize">{inc.severity}</span>
                  </div>
                  <div className="col-span-1">
                    <Badge variant={statusBadge[inc.status]} className="capitalize text-[10px]">{inc.status}</Badge>
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs font-mono">{(inc.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="col-span-1 text-xs">{inc.affectedUsers.toLocaleString()}</div>
                  <div className="col-span-1 text-xs text-muted-foreground text-right">{relativeTime(inc.detectedAt)}</div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
