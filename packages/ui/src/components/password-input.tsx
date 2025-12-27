import { Icons } from '@workspace/ui/components/icons';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import * as React from 'react';

function PasswordInput({
  className,
  ...props
}: React.ComponentProps<'input'> & {
  errors?: string[];
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled =
    props.value === '' || props.value === undefined || props.disabled;

  React.useEffect(() => {
    if (!props.value) {
      setShowPassword(false);
    }
  }, [props.value]);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('hide-password-toggle pr-12', className)}
        {...props}
        autoComplete="new-password"
      />

      {!disabled && (
        <button
          type="button"
          className="absolute right-4 top-3 hover:bg-transparent cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword ? (
            <Icons.EyeOff className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Icons.Eye className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}

export { PasswordInput };
