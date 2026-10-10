import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* Badge = علامة صغيرة للحالة. الألوان كلها tokens، والـ dark بيتبدل تلقائيًا */

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-xs font-semibold [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        upcoming: 'border-primary/40 bg-primary/15 text-primary',
        attended: 'border-success/40 bg-success/15 text-success',
        missed: 'border-destructive/40 bg-destructive/15 text-destructive',
        secondary: 'border-border bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'upcoming' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };