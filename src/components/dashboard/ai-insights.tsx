"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const insights = [
  {
    icon: AlertTriangle,
    color: "text-sev-critical",
    bg: "bg-sev-critical/10",
    title: "Predicted outage in `ingest-pipeline` within ~14h",
    body: "Heap growth pattern matches the leak signature from INC-1922. Recommended: increase JVM heap or roll a patched build.",
    tag: "Predictive",
  },
  {
    icon: TrendingUp,
    color: "text-sev-high",
    bg: "bg-sev-high/10",
    title: "Deploy-correlated regressions trending up (+38% w/w)",
    body: "2 of the last 3 critical incidents shipped with a new release. Tightening canary thresholds would have caught both.",
    tag: "Anomaly",
  },
  {
    icon: Brain,
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/10",
    title: "Auto-tagged 14 alerts as `noise`",
    body: "Suppressing low-signal alerts from staging would cut on-call pages by ~22% without raising MTTD.",
    tag: "Cleanup",
  },
];

export function AIInsights() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 h-40 w-40 bg-neon-violet/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 bg-neon-cyan/15 rounded-full blur-3xl" />
      <div className="relative px-5 py-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-neon-cyan" />
          <h3 className="font-semibold">RootSense AI · Insights</h3>
        </div>
        <Badge variant="info" className="text-[10px]">Updated 32s ago</Badge>
      </div>
      <div className="relative divide-y divide-border/60">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="px-5 py-4 flex items-start gap-3"
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${ins.bg}`}>
                <Icon className={`h-4 w-4 ${ins.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{ins.title}</p>
                  <Badge variant="ghost" className="text-[9px] shrink-0">{ins.tag}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{ins.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="relative px-5 py-3 border-t border-border/60">
        <Link
          href="/chat"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Ask RootSense AI <Sparkles className="h-3 w-3" />
        </Link>
      </div>
    </Card>
  );
}
