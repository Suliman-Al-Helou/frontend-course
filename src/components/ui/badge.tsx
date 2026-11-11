import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Badge: شارة الحالة الدلالية والهوية البصرية الموحدة للمنصة */

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 motion-reduce:transition-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border border-primary/20 bg-primary/10 text-primary",
        primary: "border border-primary/20 bg-primary/10 text-primary",
        success: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        warning: "border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        destructive: "border border-destructive/20 bg-destructive/10 text-destructive",
        info: "border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
        hot: "border border-orange-500/20 bg-orange-500/15 text-orange-600 dark:text-orange-400",
        secondary: "border border-border bg-muted text-muted-foreground",
        outline: "border border-border bg-transparent text-foreground",
        // Backward compatibility
        upcoming: "border border-primary/20 bg-primary/15 text-primary",
        attended: "border border-emerald-500/20 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        missed: "border border-destructive/20 bg-destructive/15 text-destructive",
      },
      shape: {
        full: "rounded-full",
        rounded: "rounded-lg",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[11px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "full",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shape, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, shape, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
