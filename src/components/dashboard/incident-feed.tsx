"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { incidents } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";

const sevBadge = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
  info: "info",
} as const;

export function IncidentFeed({ limit = 5 }: { limit?: number }) {
  return (
    <Card>
      <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Active Incidents</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Auto-detected by RootSense AI</p>
        </div>
        <Link href="/incidents" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border/60">
        {incidents.slice(0, limit).map((inc, i) => (
          <motion.div
            key={inc.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={`/incidents/${inc.id}`}
              className="block px-5 py-4 hover:bg-accent/30 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <Badge variant={sevBadge[inc.severity]} className="mt-0.5 capitalize shrink-0">
                  {inc.severity}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{inc.title}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono">{inc.id}</span>
                    <span>·</span>
                    <span className="font-mono">{inc.service}</span>
                    <span>·</span>
                    <span>{relativeTime(inc.detectedAt)}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{inc.affectedUsers.toLocaleString()} users</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
