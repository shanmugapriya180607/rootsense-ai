"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-sm prose-invert max-w-none",
        "[&_p]:my-2 [&_p]:leading-relaxed [&_p]:text-foreground/90",
        "[&_strong]:text-foreground [&_strong]:font-semibold",
        "[&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold",
        "[&_ul]:my-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:my-0.5 [&_li]:text-foreground/90",
        "[&_ol]:my-2 [&_ol]:pl-5 [&_ol]:list-decimal",
        "[&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_code]:rounded [&_code]:bg-muted/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:font-mono",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <div className="my-3 rounded-lg border border-border/60 overflow-hidden">
                  <div className="flex items-center justify-between bg-muted/40 px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                    <span>{match[1]}</span>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      background: "transparent",
                      padding: "12px 14px",
                      fontSize: "12.5px",
                      lineHeight: "1.55",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
