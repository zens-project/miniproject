'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-[var(--color-neutral-900)] group-[.toaster]:border-[var(--color-neutral-200)] group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-[var(--color-neutral-600)]',
          actionButton:
            'group-[.toast]:bg-[var(--color-primary-700)] group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-[var(--color-neutral-100)] group-[.toast]:text-[var(--color-neutral-900)]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
