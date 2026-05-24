"use client";

import { Mail, MoreHorizontal, Plus, Shield, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { team, incidents, getMemberById } from "@/lib/mock-data";

export default function TeamPage() {
  const incidentsByAssignee: Record<string, number> = {};
  for (const inc of incidents) {
    if (inc.assignee) incidentsByAssignee[inc.assignee] = (incidentsByAssignee[inc.assignee] || 0) + 1;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Team Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {team.length} members · {team.filter((m) => m.oncall).length} on-call right now
          </p>
        </div>
        <Button variant="gradient" size="sm">
          <Plus className="h-4 w-4" /> Invite member
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((m) => (
          <Card key={m.id} className="p-5 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${m.avatarColor} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
            <div className="relative flex items-start gap-3">
              <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${m.avatarColor} flex items-center justify-center text-sm font-semibold text-white shrink-0`}>
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{m.name}</p>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                  <Mail className="h-3 w-3" />
                  {m.email}
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge variant={m.role === "Owner" ? "info" : "ghost"} className="text-[10px] gap-1">
                    {m.role === "Owner" ? <Star className="h-2.5 w-2.5" /> : <Shield className="h-2.5 w-2.5" />}
                    {m.role}
                  </Badge>
                  {m.oncall && (
                    <Badge variant="critical" className="text-[10px] gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-sev-critical animate-pulse" />
                      On-call
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="relative grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/60">
              <div>
                <p className="text-lg font-display font-semibold">{incidentsByAssignee[m.id] || 0}</p>
                <p className="text-[10px] text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-lg font-display font-semibold">{Math.floor(Math.random() * 22 + 4)}</p>
                <p className="text-[10px] text-muted-foreground">Resolved (30d)</p>
              </div>
              <div>
                <p className="text-lg font-display font-semibold">{Math.floor(Math.random() * 12 + 3)}m</p>
                <p className="text-[10px] text-muted-foreground">Avg MTTR</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="font-semibold">Recent activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Comments, assignments, status changes.</p>
        </div>
        <div className="divide-y divide-border/60">
          {[
            { who: "u-2", verb: "assigned to themselves", what: "INC-2041 — Payments service crash loop", time: "12m ago" },
            { who: "u-3", verb: "added a comment on", what: "INC-2040 — Checkout p95 latency", time: "44m ago" },
            { who: "u-2", verb: "marked as mitigated", what: "INC-2038 — DB query timeout", time: "2h ago" },
            { who: "u-4", verb: "captured a heap dump for", what: "INC-2039 — Ingest memory leak", time: "5h ago" },
            { who: "u-6", verb: "acknowledged alert", what: "P1: payments error rate above 5%", time: "16m ago" },
          ].map((a, i) => {
            const m = getMemberById(a.who);
            return (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${m?.avatarColor} flex items-center justify-center text-[10px] font-semibold text-white shrink-0`}>
                  {m?.initials}
                </div>
                <p className="text-sm flex-1 min-w-0 truncate">
                  <span className="font-medium">{m?.name}</span>{" "}
                  <span className="text-muted-foreground">{a.verb}</span>{" "}
                  <span className="text-foreground">{a.what}</span>
                </p>
                <span className="text-[11px] text-muted-foreground shrink-0">{a.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
