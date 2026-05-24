"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  invertColor?: boolean; // for things like error rate where down is good
  accent?: "violet" | "cyan" | "pink" | "lime";
}

export function MetricCard({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  invertColor,
  accent = "violet",
}: MetricCardProps) {
  const positive = delta !== undefined && delta >= 0;
  const isGood = invertColor ? !positive : positive;

  const accentMap = {
    violet: "from-neon-violet/30 to-transparent",
    cyan: "from-neon-cyan/30 to-transparent",
    pink: "from-neon-pink/30 to-transparent",
    lime: "from-neon-lime/30 to-transparent",
  };

  return (
    <Card className="relative overflow-hidden group hover:border-primary/40 transition-colors">
      <div className={cn("absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl bg-gradient-to-br opacity-50 group-hover:opacity-90 transition-opacity", accentMap[accent])} />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
            <motion.p
              key={value}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-2xl font-display font-semibold tracking-tight"
            >
              {value}
            </motion.p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-card to-muted/50 flex items-center justify-center border border-border/60">
            <Icon className="h-4 w-4 text-foreground/80" />
          </div>
        </div>
        {delta !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
            <div
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                isGood
                  ? "bg-sev-ok/15 text-sev-ok"
                  : "bg-sev-critical/15 text-sev-critical"
              )}
            >
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta).toFixed(1)}%
            </div>
            {deltaLabel && <span className="text-[11px] text-muted-foreground">{deltaLabel}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
