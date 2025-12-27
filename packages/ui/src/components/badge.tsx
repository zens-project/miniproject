import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-primary-700)] text-white hover:bg-[var(--color-primary-800)]',
        secondary:
          'border-transparent bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-200)]',
        positive:
          'border-transparent bg-[var(--color-positive-100)] text-[var(--color-positive-700)] hover:bg-[var(--color-positive-200)]',
        negative:
          'border-transparent bg-[var(--color-negative-100)] text-[var(--color-negative-700)] hover:bg-[var(--color-negative-200)]',
        warning:
          'border-transparent bg-[var(--color-warning-100)] text-[var(--color-warning-700)] hover:bg-[var(--color-warning-200)]',
        outline: 'text-[var(--color-neutral-900)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
