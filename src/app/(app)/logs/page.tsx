"use client";

import * as React from "react";
import { Download, Filter, Loader2, Pause, Play, Search, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateLogs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/chat/markdown";
import { format } from "date-fns";

const levelClass = {
  DEBUG: "text-muted-foreground",
  INFO: "text-sev-info",
  WARN: "text-sev-medium",
  ERROR: "text-sev-critical",
  FATAL: "text-sev-critical font-semibold",
} as const;

const baseLogs = generateLogs(180);

export default function LogsPage() {
  const [q, setQ] = React.useState("");
  const [level, setLevel] = React.useState("ALL");
  const [service, setService] = React.useState("ALL");
  const [tailing, setTailing] = React.useState(true);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [aiText, setAiText] = React.useState("");
  const [aiLoading, setAiLoading] = React.useState(false);

  const filtered = baseLogs.filter((l) => {
    if (level !== "ALL" && l.level !== level) return false;
    if (service !== "ALL" && l.service !== service) return false;
    if (q && !`${l.message} ${l.service} ${l.host}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const summarize = async () => {
    setAiOpen(true);
    setAiText("");
    setAiLoading(true);
    const sample = filtered.slice(0, 40).map((l) => `[${l.level}] ${l.service} ${l.message}`).join("\n");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs: sample }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setAiText(acc);
      }
    } catch (e) {
      setAiText("Sorry — couldn't summarize right now.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Logs Explorer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length.toLocaleString()} of {baseLogs.length.toLocaleString()} log lines · tailing {tailing ? "on" : "off"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={tailing ? "outline" : "default"} size="sm" onClick={() => setTailing((t) => !t)}>
            {tailing ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Tail</>}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button variant="gradient" size="sm" onClick={summarize}>
            <Sparkles className="h-3.5 w-3.5" /> AI Summary
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-3 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages, hosts, trace IDs…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {(["ALL", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"] as const).map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            {(["ALL", "payments", "checkout", "api-gateway", "auth-service", "ingest-pipeline"] as const).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm">
          <Filter className="h-3.5 w-3.5" /> More filters
        </Button>
      </Card>

      {aiOpen && (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-neon-violet/15 blur-3xl rounded-full" />
          <div className="relative px-5 py-3 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neon-cyan" />
              <h3 className="text-sm font-semibold">AI Log Summary</h3>
              {aiLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setAiOpen(false)}>Close</Button>
          </div>
          <div className="relative px-5 py-4">
            {aiText ? (
              <Markdown>{aiText}</Markdown>
            ) : (
              <p className="text-sm text-muted-foreground">Analyzing logs…</p>
            )}
          </div>
        </Card>
      )}

      {/* Log Viewer */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b border-border/60 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
          <span>{filtered.length} lines</span>
          <span>UTC</span>
        </div>
        <div className="font-mono text-xs max-h-[680px] overflow-y-auto scrollbar-thin">
          {filtered.map((l) => (
            <div
              key={l.id}
              className={cn(
                "group grid grid-cols-[150px_70px_140px_1fr] gap-3 px-4 py-1.5 border-b border-border/30 hover:bg-accent/30 transition-colors"
              )}
            >
              <span className="text-muted-foreground">
                {format(new Date(l.timestamp), "MMM d HH:mm:ss")}
              </span>
              <span className={cn("font-semibold", levelClass[l.level])}>{l.level}</span>
              <span className="text-foreground/80 truncate">
                <span className="text-muted-foreground">{l.service}</span>/<span>{l.host}</span>
              </span>
              <span className={cn("truncate", l.level === "DEBUG" && "text-muted-foreground")}>
                {l.message}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No logs match your filters.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
