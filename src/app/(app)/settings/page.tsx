"use client";

import * as React from "react";
import { Bell, Bot, Database, KeyRound, Palette, Plug, Shield, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/app/theme-toggle";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "ai", label: "AI provider", icon: Bot },
  { id: "api", label: "API keys", icon: KeyRound },
  { id: "security", label: "Security", icon: Shield },
  { id: "data", label: "Data & retention", icon: Database },
];

export default function SettingsPage() {
  const [active, setActive] = React.useState("profile");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your workspace, integrations, and AI configuration.</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <Card className="p-2 h-fit sticky top-20">
          <nav className="space-y-0.5">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    active === s.id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </Card>

        <div className="space-y-4">
          {active === "profile" && <ProfileSection />}
          {active === "appearance" && <AppearanceSection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "integrations" && <IntegrationsSection />}
          {active === "ai" && <AISection />}
          {active === "api" && <APISection />}
          {active === "security" && <SecuritySection />}
          {active === "data" && <DataSection />}
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="px-6 py-5 border-b border-border/60">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </Card>
  );
}

function ProfileSection() {
  return (
    <SettingsCard title="Profile" description="Update your name, email, and avatar.">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center text-lg font-semibold text-white">
          SH
        </div>
        <Button variant="outline" size="sm">Change avatar</Button>
      </div>
      <Separator />
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input defaultValue="Shanmugapriya" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" defaultValue="shanmugapriya@rootsense.ai" />
        </div>
        <div className="space-y-2">
          <Label>Workspace</Label>
          <Input defaultValue="rootsense-corp" />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input defaultValue="Owner" disabled />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="gradient">Save changes</Button>
      </div>
    </SettingsCard>
  );
}

function AppearanceSection() {
  return (
    <SettingsCard title="Appearance" description="Switch themes, density, and accent.">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Theme</p>
          <p className="text-xs text-muted-foreground">Toggle between dark and light.</p>
        </div>
        <ThemeToggle />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Reduced motion</p>
          <p className="text-xs text-muted-foreground">Disable charts animations.</p>
        </div>
        <Switch />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">High-contrast mode</p>
          <p className="text-xs text-muted-foreground">For better readability on bright screens.</p>
        </div>
        <Switch />
      </div>
    </SettingsCard>
  );
}

function NotificationsSection() {
  const channels = [
    { name: "PagerDuty", desc: "Critical incidents", on: true },
    { name: "Slack #sre-alerts", desc: "All alerts above medium", on: true },
    { name: "Discord ops", desc: "Daily digest", on: false },
    { name: "Email", desc: "Weekly summary", on: true },
  ];
  return (
    <SettingsCard title="Notifications" description="Choose how RootSense AI reaches you.">
      {channels.map((c) => (
        <div key={c.name} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
          <Switch defaultChecked={c.on} />
        </div>
      ))}
    </SettingsCard>
  );
}

function IntegrationsSection() {
  const items = [
    { name: "GitHub", status: "Connected", desc: "Read deploys, attribute regressions" },
    { name: "Slack", status: "Connected", desc: "Alerts + bidirectional bot" },
    { name: "Discord", status: "Connected", desc: "Webhook channel for ops" },
    { name: "PagerDuty", status: "Connected", desc: "P1/P2 escalation" },
    { name: "Datadog", status: "Connect", desc: "Pull metrics + dashboards" },
    { name: "Kubernetes", status: "Connect", desc: "Cluster events + pod state" },
  ];
  return (
    <SettingsCard title="Integrations" description="Connect your existing tooling.">
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.name} className="rounded-lg border border-border/60 bg-background/40 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{it.name}</p>
              <Badge variant={it.status === "Connected" ? "ok" : "ghost"} className="text-[10px]">
                {it.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{it.desc}</p>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}

function AISection() {
  return (
    <SettingsCard title="AI provider" description="Configure which model powers RootSense AI.">
      <div className="space-y-2">
        <Label>Provider</Label>
        <Input defaultValue="OpenAI" disabled />
      </div>
      <div className="space-y-2">
        <Label>API key</Label>
        <Input type="password" placeholder="sk-… (set OPENAI_API_KEY in .env.local)" />
        <p className="text-[11px] text-muted-foreground">
          When unset, the app gracefully falls back to a realistic local mock so demos still work.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Default model</Label>
        <Input defaultValue="gpt-4o-mini" />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Auto root-cause new incidents</p>
          <p className="text-xs text-muted-foreground">RootSense AI summarizes & attributes the moment an incident opens.</p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Generate post-mortems on resolution</p>
          <p className="text-xs text-muted-foreground">Drafts a Notion-ready post-mortem in &lt; 60 seconds.</p>
        </div>
        <Switch defaultChecked />
      </div>
    </SettingsCard>
  );
}

function APISection() {
  return (
    <SettingsCard title="API keys" description="Tokens for your collectors and CI integrations.">
      <div className="rounded-lg border border-border/60 bg-background/40 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium font-mono">rs_live_…7f3a</p>
          <p className="text-xs text-muted-foreground">Created May 2 · Read/Write</p>
        </div>
        <Button variant="outline" size="sm">Revoke</Button>
      </div>
      <Button variant="gradient">Generate new key</Button>
    </SettingsCard>
  );
}

function SecuritySection() {
  return (
    <SettingsCard title="Security" description="MFA, sessions, and SSO.">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Two-factor authentication</p>
          <p className="text-xs text-muted-foreground">Required for all admins.</p>
        </div>
        <Switch defaultChecked />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">SAML SSO</p>
          <p className="text-xs text-muted-foreground">Okta · Active</p>
        </div>
        <Button variant="outline" size="sm">Manage</Button>
      </div>
    </SettingsCard>
  );
}

function DataSection() {
  return (
    <SettingsCard title="Data & retention" description="How long we keep your logs and incidents.">
      <div className="space-y-2">
        <Label>Log retention (days)</Label>
        <Input defaultValue="30" type="number" />
      </div>
      <div className="space-y-2">
        <Label>Incident retention (days)</Label>
        <Input defaultValue="365" type="number" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Anonymize PII in logs</p>
          <p className="text-xs text-muted-foreground">Hash emails, IPs, and bearer tokens automatically.</p>
        </div>
        <Switch defaultChecked />
      </div>
    </SettingsCard>
  );
}
