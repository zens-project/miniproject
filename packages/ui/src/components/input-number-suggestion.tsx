import { Icons } from '@workspace/ui/components/icons';
import { cn } from '@workspace/ui/lib/utils';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import { Popover, PopoverAnchor, PopoverContent } from './popover';

export interface InputNumberSuggestionProps
  extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'min'> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showControls?: boolean;
  errors?: string[];
}

function InputNumberSuggestion({
  className,
  errors = [],
  value = 0,
  onChange,
  min = 0,
  max = 9999999999,
  step = 1,
  showControls = true,
  disabled,
  ...props
}: InputNumberSuggestionProps) {
  const [suggestions, setSuggestions] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value > 0) {
      const suggestionMultipliers = [1000, 10000, 100000, 1000000, 10000000];
      const newSuggestions = suggestionMultipliers
        .map((multiplier) => value * multiplier)
        .filter((suggestion) => suggestion <= max);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [value, max]);

  const formatCurrency = (num: number) => {
    return `${new Intl.NumberFormat('vi-VN').format(num)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    const inputValue = Number(numericValue);

    if (Number.isNaN(inputValue)) {
      onChange?.(min);
      return;
    } else {
      const clampedValue = Math.min(Math.max(inputValue, min), max);
      onChange?.(clampedValue);
    }
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = Number(e.target.value);
  //   console.log(inputValue);
  //   if (Number.isNaN(inputValue)) {
  //     onChange?.(min);
  //     return;
  //   } else {
  //     const clampedValue = Math.min(Math.max(inputValue, min), max);
  //     onChange?.(clampedValue);
  //   }
  // };

  const handleSuggestionClick = (suggestion: number) => {
    onChange?.(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor>
          <div className="relative rounded-xsmall overflow-hidden">
            <input
              type="text"
              inputMode="numeric"
              data-slot="input-number"
              value={formatCurrency(value)}
              onChange={handleInputChange}
              onFocus={() => {
                setTimeout(() => {
                  // if (suggestions.length > 0) {
                  setIsOpen(true);
                  // }
                }, 20);
              }}
              onBlur={() => {
                setIsOpen(false);
              }}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              placeholder="0"
              className={cn(
                'peer h-(--input-default) w-full rounded-xsmall txt-body-primary bg-neutral-alpha-200 outline-none text-neutral-1000 placeholder:font-normal placeholder:text-neutral-700 text-left',
                'focus-visible:text-neutral-1000 focus-visible:txt-body-primary',
                'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-neutral-700 disabled:bg-neutral-alpha-200 disabled:border-none',
                'read-only:pointer-events-none read-only:cursor-not-allowed read-only:border-dashed read-only:bg-transparent read-only:border-1 read-only:border-neutral-500',
                '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]',
                'text-right',
                'px-6 py-3',
                className,
              )}
              {...props}
            />
            {/* Focus indicator */}
            <div
              className={cn(
                'absolute bottom-0 left-1.5 right-1.5 w-full h-[1.5px]',
                errors.length === 0 &&
                  'peer-focus:bg-neutral-1000 transition-[background]',
                errors.length > 0 && 'bg-negative-800',
              )}
            />
            <span
              className={`absolute text-body-primary right-3 top-1/2 -translate-y-1/2 ${disabled ? 'text-neutral-700' : 'text-neutral-1000'}`}
            >
              đ
            </span>
          </div>
        </PopoverAnchor>

        {suggestions.length > 0 && (
          <PopoverContent
            className="p-0 border border-neutral-200"
            align="end"
            sideOffset={8}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
            }}
          >
            <div className="flex flex-col py-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="w-full cursor-pointer block px-4 py-2 text-right hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.toLocaleString('vi-VN')}đ
                </button>
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>

      {/* Error messages */}
      {errors.length > 0 &&
        errors.map((error: string) => (
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

export { InputNumberSuggestion };
