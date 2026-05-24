"use client";

import * as React from "react";
import { Bot, MessageSquare, Plus, Sparkles, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatPanel } from "@/components/chat/chat-panel";

const sessions = [
  { id: "s1", title: "Why did payments crash?", time: "2m ago", active: true },
  { id: "s2", title: "Summarize last 24h incidents", time: "1h ago" },
  { id: "s3", title: "Fix DB timeout playbook", time: "yesterday" },
  { id: "s4", title: "INC-2039 — heap analysis", time: "yesterday" },
  { id: "s5", title: "Anomaly: 401 spike on /charge", time: "2d ago" },
];

export default function ChatPage() {
  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-7rem)] flex flex-col">
      <div className="mb-4 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight flex items-center gap-2">
            AI Assistant
            <Badge variant="info" className="gap-1">
              <Sparkles className="h-3 w-3" /> Streaming
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your incident copilot — knows your services, deploys, and runbooks.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" /> New chat
        </Button>
      </div>

      <div className="flex-1 grid lg:grid-cols-[260px_1fr] gap-4 min-h-0">
        <Card className="hidden lg:flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Chat history</h3>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
            {sessions.map((s) => (
              <button
                key={s.id}
                className={`group w-full text-left rounded-md px-2.5 py-2 hover:bg-accent/40 transition-colors ${
                  s.active ? "bg-accent/60" : ""
                }`}
              >
                <p className="text-xs font-medium truncate">{s.title}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-muted-foreground">{s.time}</p>
                  <Trash2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-border/60">
            <div className="rounded-md bg-gradient-to-br from-neon-violet/10 to-neon-cyan/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Bot className="h-3.5 w-3.5 text-neon-cyan" />
                Provider
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Auto-detects OPENAI_API_KEY · Falls back to local mock.
              </p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden flex flex-col min-h-0">
          <ChatPanel />
        </Card>
      </div>
    </div>
  );
}
