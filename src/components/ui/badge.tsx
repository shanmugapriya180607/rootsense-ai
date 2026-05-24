import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        critical:
          "border-sev-critical/40 bg-sev-critical/10 text-sev-critical",
        high: "border-sev-high/40 bg-sev-high/10 text-sev-high",
        medium: "border-sev-medium/40 bg-sev-medium/10 text-sev-medium",
        low: "border-sev-low/40 bg-sev-low/10 text-sev-low",
        info: "border-sev-info/40 bg-sev-info/10 text-sev-info",
        ok: "border-sev-ok/40 bg-sev-ok/10 text-sev-ok",
        ghost: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
