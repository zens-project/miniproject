import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-primary-700)] text-white hover:bg-[var(--color-primary-800)] focus-visible:ring-[var(--color-primary-700)] active:scale-95',
        secondary:
          'bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-200)] focus-visible:ring-[var(--color-neutral-400)] active:scale-95',
        tertiary:
          'bg-transparent text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] focus-visible:ring-[var(--color-primary-700)] active:scale-95',
        danger:
          'bg-[var(--color-negative-600)] text-white hover:bg-[var(--color-negative-700)] focus-visible:ring-[var(--color-negative-600)] active:scale-95',
        ghost:
          'bg-transparent hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)] active:scale-95',
        link: 'text-[var(--color-primary-700)] underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
