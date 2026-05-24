import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  Boxes,
  Brain,
  Check,
  CircleAlert,
  Clock,
  Cpu,
  Database,
  GitPullRequest,
  Github,
  LineChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <NeonBackground />
      <Nav />
      <Hero />
      <Logos />
      <Features />
      <DashboardPreview />
      <AnalyzerDemo />
      <Pricing />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  );
}

// =============================================================================
function NeonBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 -z-10 h-[480px] w-[920px] rounded-full bg-neon-violet/25 blur-[120px]" />
      <div className="pointer-events-none fixed top-[40%] -right-40 -z-10 h-[420px] w-[420px] rounded-full bg-neon-cyan/20 blur-[120px]" />
    </>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-violet to-neon-cyan blur-md opacity-60" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-violet to-neon-cyan">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="font-semibold tracking-tight">RootSense AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Customers</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/dashboard">Open dashboard <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="container relative pt-20 pb-24 lg:pt-32 lg:pb-32">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="ghost" className="mb-6 gap-1.5 border border-border/60 bg-card/60 backdrop-blur">
          <Sparkles className="h-3 w-3 text-neon-cyan" />
          <span className="text-[11px] uppercase tracking-wider">New · AI Predictive Outage Engine</span>
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-semibold tracking-tighter leading-[1.05]">
          Find root causes in <br />
          <span className="gradient-text bg-[length:200%_200%] animate-gradient-pan">seconds, not hours.</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          RootSense AI ingests your logs, metrics, and deploys, then explains <em>why</em>
          something broke — with the fix attached. Built for modern SRE and DevOps teams.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="gradient" size="xl" asChild>
            <Link href="/dashboard">Try the live demo <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href="/chat">
              <Bot className="h-4 w-4" /> Talk to RootSense AI
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          No credit card · Works with your existing logs · 14-day free trial
        </p>
      </div>

      <div className="mt-16">
        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-12 bg-gradient-to-tr from-neon-violet/20 via-transparent to-neon-cyan/20 blur-3xl" />
      <div className="relative gradient-border rounded-2xl p-2 shadow-2xl">
        <div className="rounded-xl overflow-hidden border border-border/60 bg-card/80 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-muted/30">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-sev-critical/70" />
              <span className="h-3 w-3 rounded-full bg-sev-medium/70" />
              <span className="h-3 w-3 rounded-full bg-sev-ok/70" />
            </div>
            <div className="flex-1 text-center text-xs text-muted-foreground font-mono">
              rootsense.ai/dashboard
            </div>
          </div>
          <div className="grid grid-cols-12 gap-3 p-4">
            <div className="col-span-3 space-y-3">
              {[
                { icon: Activity, label: "Dashboard", active: true },
                { icon: CircleAlert, label: "Incidents", badge: "3" },
                { icon: Bot, label: "AI Assistant" },
                { icon: LineChart, label: "Analytics" },
              ].map((it) => (
                <div
                  key={it.label}
                  className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs ${
                    it.active ? "bg-primary/15 text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <it.icon className="h-3.5 w-3.5" />
                  <span>{it.label}</span>
                  {it.badge && <span className="ml-auto text-[9px] text-sev-critical">{it.badge}</span>}
                </div>
              ))}
            </div>
            <div className="col-span-9 grid grid-cols-3 gap-3">
              <PreviewStat label="MTTR" value="11m 22s" delta="-38%" />
              <PreviewStat label="Active incidents" value="3" delta="-1" />
              <PreviewStat label="AI confidence" value="0.94" delta="+0.06" />
              <div className="col-span-2 rounded-lg border border-border/60 bg-card/50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Error rate (last hour)</span>
                  <Badge variant="critical" className="text-[9px]">SPIKE</Badge>
                </div>
                <MiniSparkline />
              </div>
              <div className="rounded-lg border border-border/60 bg-gradient-to-br from-neon-violet/10 to-neon-cyan/10 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-3 w-3 text-neon-cyan" />
                  <span className="text-xs font-medium">AI Root Cause</span>
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  NPE in <span className="font-mono text-foreground">ChargeHandler.refund()</span> after v2024.5.22. Rollback recommended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewStat({ label, value, delta }: { label: string; value: string; delta: string }) {
  const positive = delta.startsWith("+");
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-display font-semibold">{value}</p>
      <p className={`text-[10px] mt-0.5 ${positive ? "text-sev-ok" : "text-sev-critical"}`}>{delta}</p>
    </div>
  );
}

function MiniSparkline() {
  const points = [12, 14, 13, 16, 14, 12, 13, 18, 22, 28, 36, 44, 52, 48, 42];
  const max = Math.max(...points);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * 100} ${100 - (p / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-12 w-full">
      <defs>
        <linearGradient id="hp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--sev-critical))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--sev-critical))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#hp-grad)" />
      <path d={path} stroke="hsl(var(--sev-critical))" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function Logos() {
  const logos = ["Northwind", "Acme Corp", "Lumon", "Globex", "Initech", "Pied Piper"];
  return (
    <section className="container py-8 border-y border-border/40">
      <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">
        Trusted by 1,200+ engineering teams
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {logos.map((l) => (
          <span key={l} className="text-lg font-display font-semibold text-muted-foreground/60 hover:text-foreground/80 transition-colors">
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI Root Cause Analysis",
      body: "GPT-grade analysis across logs, deploys, and metrics — with severity, confidence, and the fix attached.",
      accent: "from-neon-violet to-neon-pink",
    },
    {
      icon: TrendingUp,
      title: "Predictive Outage Engine",
      body: "Anomaly detection learns your baselines and flags failures hours before they page someone.",
      accent: "from-neon-cyan to-neon-violet",
    },
    {
      icon: Bot,
      title: "Conversational Copilot",
      body: "Ask “why did checkout slow down?” in plain English. Streaming answers with code, queries, and runbooks.",
      accent: "from-neon-pink to-neon-violet",
    },
    {
      icon: Boxes,
      title: "Logs Explorer + ELK-class Filters",
      body: "Live tail, structured filters, severity colors, AI summarize, and trace-aware grouping out of the box.",
      accent: "from-neon-lime to-neon-cyan",
    },
    {
      icon: GitPullRequest,
      title: "Deploy-aware Correlation",
      body: "Every incident is correlated against deploys, feature flags, and infra changes — automatically.",
      accent: "from-neon-violet to-neon-cyan",
    },
    {
      icon: ShieldCheck,
      title: "SOC 2 ready & on-prem option",
      body: "SSO, audit logs, data residency. Self-host on Kubernetes when your security team asks.",
      accent: "from-neon-cyan to-neon-lime",
    },
  ];
  return (
    <section id="features" className="container py-24">
      <div className="max-w-2xl mb-14">
        <Badge variant="ghost" className="mb-3 text-[10px] uppercase tracking-widest">Features</Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">
          Built for the way incidents <span className="gradient-text">actually happen</span>.
        </h2>
        <p className="mt-3 text-muted-foreground">
          From the first anomaly to the post-mortem, RootSense AI is the connective tissue between your
          metrics, logs, and the humans on-call.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <Card
            key={f.title}
            className="group relative overflow-hidden hover:border-primary/40 transition-colors p-6"
          >
            <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl bg-gradient-to-br ${f.accent} opacity-30 group-hover:opacity-60 transition-opacity`} />
            <f.icon className="h-5 w-5 text-foreground mb-4" />
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section id="dashboard" className="container py-24 border-t border-border/40">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Badge variant="ghost" className="text-[10px] uppercase tracking-widest mb-3">Dashboard</Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">
            One pane of glass for <span className="gradient-text">reliability</span>.
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Live CPU, memory, latency, and error metrics — animated, interactive, and stitched
            together with your incident timeline. No more 12-tab on-call.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Live metrics with anomaly bands", "Auto-built incident timelines", "Severity-aware alert routing", "AI insights surfaced inline"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-sev-ok/15 text-sev-ok flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="lg" className="mt-7">
            <Link href="/dashboard">Open the live dashboard <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-tr from-neon-cyan/15 to-neon-violet/15 blur-3xl" />
          <div className="relative gradient-border rounded-2xl p-2">
            <div className="rounded-xl bg-card/80 backdrop-blur-xl p-5 space-y-3">
              {[
                { label: "CPU saturation", icon: Cpu, value: "86%", trend: "up", color: "sev-high" },
                { label: "DB connections", icon: Database, value: "92 / 100", trend: "up", color: "sev-medium" },
                { label: "Error rate", icon: Zap, value: "8.4%", trend: "up", color: "sev-critical" },
                { label: "p95 latency", icon: Clock, value: "412 ms", trend: "up", color: "sev-high" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
                  <div className="h-8 w-8 rounded-md bg-muted/60 flex items-center justify-center">
                    <m.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-lg font-display font-semibold">{m.value}</p>
                  </div>
                  <div className={`h-12 w-24 rounded bg-gradient-to-r from-transparent via-${m.color}/20 to-${m.color}/40`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyzerDemo() {
  return (
    <section className="container py-24 border-t border-border/40">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-8 bg-gradient-to-tr from-neon-violet/15 to-neon-pink/15 blur-3xl" />
          <Card className="relative p-5 font-mono text-xs">
            <div className="text-muted-foreground mb-3">// paste logs into RootSense AI…</div>
            <pre className="text-[11px] leading-relaxed whitespace-pre-wrap text-foreground/80">
{`[ERROR] payments  NPE at ChargeHandler.refund(ChargeHandler.java:142)
[ERROR] payments  Connection refused: stripe-api.internal:443
[WARN]  gateway   Circuit breaker half-open for upstream payments
[FATAL] ingest    OOMKilled pod=ingest-worker-7 memory=6.2GiB`}
            </pre>
            <div className="mt-4 rounded-lg border border-primary/40 bg-primary/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3 w-3 text-neon-cyan" />
                <span className="text-xs font-semibold">RootSense AI</span>
                <Badge variant="critical" className="ml-auto text-[9px]">CRITICAL · 0.94</Badge>
              </div>
              <p className="text-[11px] leading-relaxed">
                <b>Root cause:</b> NullPointerException in <span className="font-mono">ChargeHandler.refund()</span> shipped in
                <span className="font-mono"> payments@v2024.5.22</span>.
                <br />
                <b>Fix:</b> Rollback to v2024.5.18, patch null guard on <span className="font-mono">customer.defaultPaymentMethod</span>.
              </p>
            </div>
          </Card>
        </div>
        <div className="order-1 lg:order-2">
          <Badge variant="ghost" className="text-[10px] uppercase tracking-widest mb-3">AI Analyzer</Badge>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">
            Paste logs in. Get <span className="gradient-text">the fix</span> out.
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Upload a log file, stream from your collector, or paste a stack trace.
            RootSense AI extracts the dominant error, attributes it to a deploy or
            infra event, and writes the fix — often with the exact CLI invocation.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3 max-w-md">
            {[
              { k: "Avg time to RCA", v: "12s" },
              { k: "Auto-fix precision", v: "92%" },
              { k: "Log lines / s", v: "180k" },
              { k: "Languages", v: "20+" },
            ].map((s) => (
              <div key={s.k} className="rounded-lg border border-border/60 bg-card/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
                <p className="text-xl font-display font-semibold mt-0.5">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      tag: "Free forever",
      features: ["1 team workspace", "50 log GB / month", "AI root-cause (200 / mo)", "Community support"],
      cta: "Start free",
      variant: "outline" as const,
    },
    {
      name: "Growth",
      price: "$249",
      tag: "per month",
      features: ["10 workspaces", "1 TB log retention (30d)", "Unlimited AI RCA", "Slack + PagerDuty", "Anomaly detection"],
      cta: "Start 14-day trial",
      featured: true,
      variant: "gradient" as const,
    },
    {
      name: "Enterprise",
      price: "Custom",
      tag: "SSO · SOC 2 · on-prem",
      features: ["Unlimited workspaces", "Custom retention", "Dedicated CSM", "SOC 2 + HIPAA", "Self-host option"],
      cta: "Talk to sales",
      variant: "outline" as const,
    },
  ];
  return (
    <section id="pricing" className="container py-24 border-t border-border/40">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="ghost" className="text-[10px] uppercase tracking-widest mb-3">Pricing</Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">
          Simple, usage-based pricing
        </h2>
        <p className="mt-3 text-muted-foreground">No seat fees. No surprises.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={`relative p-6 ${p.featured ? "border-primary/50 shadow-[0_0_60px_-20px_hsl(var(--primary)/0.5)]" : ""}`}
          >
            {p.featured && (
              <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon-violet to-neon-cyan text-white">
                Most popular
              </Badge>
            )}
            <h3 className="font-semibold">{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-4xl font-display font-semibold">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.tag}</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-sev-ok shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button variant={p.variant} size="lg" asChild className="mt-7 w-full">
              <Link href="/signup">{p.cta}</Link>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote: "RootSense AI surfaces the root cause faster than our on-call can even open the runbook. It's like having a senior SRE on every page.",
      who: "Maya Chen",
      role: "Director of Engineering, Lumon",
      initials: "MC",
    },
    {
      quote: "We cut MTTR by 64% in the first quarter. The predictive alerts catch outages while they're still survivable.",
      who: "Diego Ramos",
      role: "Head of Platform, Globex",
      initials: "DR",
    },
    {
      quote: "The AI chat answers in our own jargon — services, owners, runbooks. Onboarding new on-call engineers takes a week, not a month.",
      who: "Aisha Patel",
      role: "SRE Lead, Initech",
      initials: "AP",
    },
  ];
  return (
    <section id="testimonials" className="container py-24 border-t border-border/40">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="ghost" className="text-[10px] uppercase tracking-widest mb-3">Customers</Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">
          Loved by reliability teams
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((t) => (
          <Card key={t.who} className="p-6 flex flex-col">
            <p className="text-sm leading-relaxed text-foreground/90 flex-1">“{t.quote}”</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center text-xs font-semibold text-white">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-medium">{t.who}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="container py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-10 sm:p-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/20 via-transparent to-neon-cyan/20 animate-gradient-pan bg-[length:200%_200%]" />
        <div className="relative">
          <h2 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight">
            Stop guessing. <span className="gradient-text">Start knowing.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Spin up your first AI-driven incident workspace in under 60 seconds.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="gradient" size="xl" asChild>
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/dashboard">View live demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          © 2026 RootSense AI · All systems nominal.
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">Docs</a>
          <a href="#" className="hover:text-foreground">Status</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground inline-flex items-center gap-1"><Github className="h-3.5 w-3.5" /> GitHub</a>
        </div>
      </div>
    </footer>
  );
}
