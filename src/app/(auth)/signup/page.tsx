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

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Workspace ready 🚀");
      router.push("/dashboard");
    }, 700);
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold tracking-tight">Create your workspace</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        14-day free trial · No credit card required.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-2">
        <Button variant="outline" size="lg" type="button">
          <Github className="h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" size="lg" type="button">
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="#EA4335" d="M12 11v3.4h4.7c-.2 1.2-1.4 3.6-4.7 3.6-2.8 0-5.1-2.3-5.1-5.2S9.2 7.6 12 7.6c1.6 0 2.7.7 3.3 1.2l2.3-2.2C16 5.2 14.2 4.4 12 4.4 7.7 4.4 4.3 7.8 4.3 12.2S7.7 20 12 20c6 0 7.4-5.3 6.8-8h-6.8z" />
          </svg>
          Google
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Ada Lovelace" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace">Workspace</Label>
            <Input id="workspace" placeholder="acme-corp" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 10 characters" required />
          <p className="text-[10px] text-muted-foreground">
            Use 10+ characters with a mix of letters, numbers, and symbols.
          </p>
        </div>
        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create workspace"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
