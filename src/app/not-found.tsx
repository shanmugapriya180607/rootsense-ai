import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-neon-violet/15 blur-3xl" />

      <div className="relative text-center max-w-md">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-neon-violet to-neon-cyan mb-6 mx-auto">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-7xl font-display font-semibold tracking-tighter gradient-text">404</h1>
        <p className="mt-2 text-lg font-semibold">No incidents detected at this URL.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has been resolved, rolled back, or never existed.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
          </Button>
          <Button asChild variant="gradient">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
