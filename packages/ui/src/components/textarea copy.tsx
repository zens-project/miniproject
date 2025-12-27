import { cn } from '@workspace/ui/lib/utils';
import type * as React from 'react';
import { Icons } from './icons';

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  errors?: string[];
}

function Textarea({ className, errors = [], ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative rounded-xsmall">
        <textarea
          wrap="soft"
          data-slot="textarea"
          className={cn(
            'peer resize-y txt-body-primary bg-neutral-alpha-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full focus-visible:txt-body-primary rounded-md px-4 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
          )}
          {...props}
        />
        <div
          className={cn(
            'absolute bottom-0 left-1.5 right-2 h-[1.5px]',
            errors.length === 0 &&
              'peer-focus:bg-neutral-1000 transition-[background]',
            errors.length > 0 && 'bg-negative-800',
          )}
        />
      </div>
      {errors.length > 0 &&
        errors.map((error) => (
          <div
            key={error}
            className="flex flex-row gap-1 items-center caption-tertiary my-0.5 text-negative-900"
          >
            <Icons.AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ))}
    </div>
  );
}

export { Textarea };
