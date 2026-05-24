import Link from "next/link";
import { Activity } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[480px] w-[920px] rounded-full bg-neon-violet/15 blur-[120px]" />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-violet to-neon-cyan blur-md opacity-60" />
              <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="font-semibold tracking-tight">RootSense AI</span>
          </Link>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-card/30 border-l border-border/60 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-neon-violet/20 to-neon-cyan/20 blur-3xl" />
        <div className="relative max-w-md text-center px-8 space-y-6">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Why teams pick RootSense AI</p>
          <p className="text-3xl font-display font-semibold leading-tight">
            “We cut MTTR by <span className="gradient-text">64%</span> in the first quarter.”
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center text-xs font-semibold text-white">
              DR
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Diego Ramos</p>
              <p className="text-xs text-muted-foreground">Head of Platform, Globex</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
