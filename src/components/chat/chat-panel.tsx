"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, SendHorizontal, Sparkles, Square, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Why did the payments service crash?",
  "Summarize the last 24h of incidents",
  "How do I fix database timeouts?",
  "What is the root cause of INC-2041?",
];

const INITIAL: ChatMessage[] = [
  {
    id: "m-0",
    role: "assistant",
    createdAt: new Date().toISOString(),
    content:
      "Hi — I'm **RootSense AI**, your incident copilot. I can analyze logs, summarize incidents, suggest fixes, and explain root causes.\n\nTry asking me something below, or pick a suggestion.",
  },
];

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || streaming) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    };
    const assistantId = `a-${Date.now()}`;
    setMessages((m) => [
      ...m,
      userMsg,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString(), pending: true },
    ]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((msg) => (msg.id === assistantId ? { ...msg, content: acc, pending: true } : msg))
        );
      }
      setMessages((m) =>
        m.map((msg) => (msg.id === assistantId ? { ...msg, pending: false } : msg))
      );
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId
              ? { ...msg, pending: false, content: "Sorry — I hit an error reaching the model. Try again?" }
              : msg
          )
        );
      } else {
        setMessages((m) =>
          m.map((msg) => (msg.id === assistantId ? { ...msg, pending: false } : msg))
        );
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </AnimatePresence>

        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="group text-left rounded-lg border border-border/60 bg-card/50 p-3 hover:border-primary/50 hover:bg-card transition-all"
              >
                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {s}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border/60 p-3 bg-background/40 backdrop-blur">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about an incident, log, or metric…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={compact ? 2 : 3}
            className="resize-none pr-24 bg-card/60"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Voice input (preview)">
              <Mic className="!h-4 !w-4" />
            </Button>
            {streaming ? (
              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={stop}>
                <Square className="!h-3.5 !w-3.5" />
              </Button>
            ) : (
              <Button variant="gradient" size="icon" className="h-8 w-8" onClick={() => send(input)} disabled={!input.trim()}>
                <SendHorizontal className="!h-4 !w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-neon-cyan" />
          RootSense AI can analyze logs, incidents, and metrics. Press <kbd className="font-mono">↵</kbd> to send,
          <kbd className="font-mono">⇧↵</kbd> for newline.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback
          className={cn(
            "text-[10px] text-white",
            isUser
              ? "bg-gradient-to-br from-neon-pink to-neon-violet"
              : "bg-gradient-to-br from-neon-violet to-neon-cyan"
          )}
        >
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary/15 text-foreground rounded-tr-sm"
            : "bg-card/70 border border-border/60 text-foreground rounded-tl-sm"
        )}
      >
        {message.role === "assistant" ? (
          <>
            <Markdown>{message.content || "​"}</Markdown>
            {message.pending && (
              <span className="inline-block w-2 h-4 align-text-bottom bg-foreground/70 animate-blink rounded-sm ml-0.5" />
            )}
          </>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </motion.div>
  );
}
