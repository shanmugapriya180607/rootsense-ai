// =============================================================================
// AI provider abstraction.
// Uses OpenAI if OPENAI_API_KEY is set, otherwise generates streaming
// mock responses so the demo works offline.
// =============================================================================

import OpenAI from "openai";

export const SYSTEM_PROMPT = `You are RootSense AI, an expert SRE/DevOps incident copilot.
Your job: analyze logs, summarize incidents, explain root causes, and suggest concrete fixes.
- Be concise and actionable.
- Use markdown: short headings, bullet lists, fenced code blocks for shell/SQL/YAML.
- Always include: probable root cause, severity, affected service, suggested fix, and confidence (0–1).
- When the user shares logs, identify the dominant error pattern first.`;

export interface ChatRole {
  role: "system" | "user" | "assistant";
  content: string;
}

export function isAIConfigured() {
  return !!process.env.OPENAI_API_KEY;
}

// ---------------------------------------------------------------------------- OpenAI stream
export async function streamOpenAI(messages: ChatRole[]) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    temperature: 0.4,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
  });

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const part of stream) {
          const delta = part.choices?.[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        controller.enqueue(encoder.encode("\n\n_⚠️ stream error_"));
      } finally {
        controller.close();
      }
    },
  });
}

// ---------------------------------------------------------------------------- Mock stream
const MOCK_BANK: Record<string, string> = {
  payments: `### Likely root cause
**\`NullPointerException\` in \`ChargeHandler.refund()\`** introduced in \`payments@v2024.5.22\`.

- **Affected service:** \`payments\` (us-east-1)
- **Severity:** Critical
- **Confidence:** 0.94

The error first appeared ~90 seconds after the v2024.5.22 rollout. Heap dumps and the stack trace consistently point to:

\`\`\`java
at com.rootsense.payments.ChargeHandler.refund(ChargeHandler.java:142)
  caused by: customer.defaultPaymentMethod is null
\`\`\`

### Suggested fix
1. **Roll back** to \`v2024.5.18\` — restores service in ~3 minutes.
2. Patch the null check in \`ChargeHandler.refund()\` before re-deploying.
3. Enable the **circuit breaker** on the Stripe upstream to fail fast.

\`\`\`bash
kubectl rollout undo deployment/payments --to-revision=18
\`\`\`

Confidence is high because the pattern aligns with a known Stripe API field becoming nullable in their May migration.`,

  database: `### Likely root cause
**Sequential scan** on \`payments.transactions(user_id, created_at)\` — the query planner switched after a recent \`ANALYZE\`.

- **Affected service:** \`payments\`
- **Severity:** High
- **Confidence:** 0.96

### Suggested fix
Add a composite index, created \`CONCURRENTLY\` to avoid taking a long lock:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_transactions_user_created
  ON payments.transactions (user_id, created_at DESC);
\`\`\`

In staging this drops the query from **2.1s → 18ms**.`,

  summary: `### Last 24h — incident summary

| # | Service | Severity | Status | Root cause |
| - | --- | --- | --- | --- |
| INC-2041 | payments | 🔴 Critical | Investigating | NPE in \`ChargeHandler.refund()\` after v2024.5.22 |
| INC-2040 | checkout | 🟠 High | Open | CPU saturation, autoscaler capped |
| INC-2039 | ingest-pipeline | 🟡 Medium | Investigating | Suspected memory leak in \`EventBatchAccumulator\` |
| INC-2038 | payments | 🟠 High | ✅ Resolved | Missing index on transactions |

**MTTR (24h):** 11m 22s · **Active incidents:** 3 · **Affected users:** ~15.6k

The dominant pattern this week is **deploy-correlated regressions** — 2 of the last 3 high-severity incidents shipped via a new release. Consider tightening pre-deploy canary thresholds.`,

  kubernetes: `### Likely root cause
Three notifications pods are in **\`CrashLoopBackOff\`** — the pods created _before_ the config-map rollout have a stale mount.

- **Affected service:** \`notifications\`
- **Severity:** Low
- **Confidence:** 0.88

### Suggested fix
\`\`\`bash
kubectl rollout restart deployment/notifications -n prod
\`\`\`

This is a known interaction with config-map updates when \`subPath\` is used — pods don't pick up changes without a restart.`,

  generic: `### Analysis
I've reviewed the context. Based on the patterns I'm seeing:

- **Probable root cause:** correlated traffic burst with auto-scaler ceiling reached.
- **Severity:** Medium
- **Confidence:** 0.78

### Suggested actions
1. **Scale up** the affected deployment to absorb the burst.
2. Enable a **circuit breaker** on the most-affected upstream.
3. Add a **canary gate** in CI for this service before the next deploy.

\`\`\`bash
kubectl scale deployment/checkout --replicas=12 -n prod
\`\`\`

Want me to draft the runbook for this?`,
};

function pickMock(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("summar") || p.includes("24h") || p.includes("week")) return MOCK_BANK.summary;
  if (p.includes("payment") || p.includes("crash") || p.includes("server")) return MOCK_BANK.payments;
  if (p.includes("database") || p.includes("query") || p.includes("timeout") || p.includes("sql")) return MOCK_BANK.database;
  if (p.includes("pod") || p.includes("k8s") || p.includes("kubernetes")) return MOCK_BANK.kubernetes;
  return MOCK_BANK.generic;
}

export function streamMock(messages: ChatRole[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const reply = pickMock(lastUser);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const tokens = reply.match(/[\s]+|[^\s]+/g) || [reply];
      for (const tok of tokens) {
        controller.enqueue(encoder.encode(tok));
        await new Promise((r) => setTimeout(r, 18 + Math.random() * 22));
      }
      controller.close();
    },
  });
}

export function chatStream(messages: ChatRole[]) {
  return isAIConfigured() ? streamOpenAI(messages) : Promise.resolve(streamMock(messages));
}
