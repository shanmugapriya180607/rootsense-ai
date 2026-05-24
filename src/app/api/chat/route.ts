import { NextRequest } from "next/server";
import { chatStream, type ChatRole } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = (body?.messages || []) as ChatRole[];
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("messages required", { status: 400 });
    }

    const stream = await chatStream(messages);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Provider": process.env.OPENAI_API_KEY ? "openai" : "mock",
      },
    });
  } catch (err) {
    return new Response("server error", { status: 500 });
  }
}
