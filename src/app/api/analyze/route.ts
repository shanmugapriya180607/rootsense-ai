import { NextRequest, NextResponse } from "next/server";
import { chatStream, type ChatRole, isAIConfigured } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/analyze
 * Body: { logs: string }
 * Returns: stream of markdown analysis (or a structured JSON object in mock mode)
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const logs = String(body?.logs || "").slice(0, 16_000);
  if (!logs) return NextResponse.json({ error: "logs required" }, { status: 400 });

  const messages: ChatRole[] = [
    {
      role: "user",
      content: `Analyze the following logs and return a root-cause analysis in markdown.
Include: probable root cause, severity (critical|high|medium|low|info), affected service, suggested fix (with shell/SQL snippets if applicable), and a confidence score (0-1).

\`\`\`
${logs}
\`\`\``,
    },
  ];

  const stream = await chatStream(messages);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Provider": isAIConfigured() ? "openai" : "mock",
    },
  });
}
