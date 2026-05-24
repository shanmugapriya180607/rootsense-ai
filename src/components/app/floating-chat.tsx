"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "@/components/chat/chat-panel";

export function FloatingChat() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[440px] h-[70vh] max-h-[640px] glass rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-gradient-to-r from-neon-violet/10 to-neon-cyan/10">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-md bg-neon-violet blur-md opacity-50" />
                  <div className="relative h-8 w-8 rounded-md bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">RootSense AI</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Incident copilot · online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  aria-label="Open full chat"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ChatPanel compact />
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        variant="gradient"
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-5 right-5 sm:right-6 z-40 h-14 w-14 rounded-full shadow-[0_0_40px_-8px_hsl(var(--neon-violet))]"
        aria-label="Open AI assistant"
      >
        {open ? <X className="!h-5 !w-5" /> : <Bot className="!h-5 !w-5" />}
      </Button>
    </>
  );
}
