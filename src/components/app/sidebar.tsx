"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Bell,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/incidents", label: "Incidents", icon: ShieldAlert, badge: "3" },
  { href: "/chat", label: "AI Assistant", icon: Bot, badge: "AI" },
  { href: "/logs", label: "Logs Explorer", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/alerts", label: "Alerts Center", icon: Bell, badge: "5" },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-5 border-b border-border/60">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-violet to-neon-cyan blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-violet to-neon-cyan">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">RootSense</span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">AI · Observability</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto scrollbar-thin">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-primary/10 to-transparent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-neon-violet to-neon-cyan"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge && (
                <Badge
                  variant={item.badge === "AI" ? "info" : "critical"}
                  className="h-5 px-1.5 text-[10px] font-semibold"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/60">
        <div className="glass rounded-lg p-3 space-y-2 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-neon-violet/30 blur-2xl" />
          <div className="relative flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neon-cyan" />
            <span className="text-xs font-semibold">AI Insights</span>
          </div>
          <p className="relative text-[11px] text-muted-foreground leading-relaxed">
            3 anomalies detected across 8 services in the last hour.
          </p>
          <Link
            href="/chat"
            className="relative inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-neon-violet to-neon-cyan px-3 py-1.5 text-xs font-semibold text-white hover:shadow-[0_0_24px_-6px_hsl(var(--neon-violet))] transition-shadow"
          >
            Ask RootSense AI
          </Link>
        </div>
      </div>
    </aside>
  );
}
