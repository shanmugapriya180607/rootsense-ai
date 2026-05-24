"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Welcome back, Shanmugapriya 👋");
      router.push("/dashboard");
    }, 700);
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Log in to your RootSense AI workspace.</p>

      <div className="mt-7 grid grid-cols-2 gap-2">
        <SocialButton provider="github" />
        <SocialButton provider="google" />
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" defaultValue="shanmugapriya@rootsense.ai" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••••" defaultValue="rootsense-demo" required />
        </div>
        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        No account?{" "}
        <Link href="/signup" className="text-foreground font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

function SocialButton({ provider }: { provider: "github" | "google" }) {
  const labels = { github: "GitHub", google: "Google" };
  return (
    <Button variant="outline" size="lg" type="button">
      {provider === "github" ? (
        <Github className="h-4 w-4" />
      ) : (
        <GoogleIcon className="h-4 w-4" />
      )}
      <span>{labels[provider]}</span>
    </Button>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#EA4335" d="M12 11v3.4h4.7c-.2 1.2-1.4 3.6-4.7 3.6-2.8 0-5.1-2.3-5.1-5.2S9.2 7.6 12 7.6c1.6 0 2.7.7 3.3 1.2l2.3-2.2C16 5.2 14.2 4.4 12 4.4 7.7 4.4 4.3 7.8 4.3 12.2S7.7 20 12 20c6 0 7.4-5.3 6.8-8h-6.8z" />
    </svg>
  );
}
