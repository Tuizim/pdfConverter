import { cn } from '@/utils/cn.util';
import type { ButtonProps, ButtonSize, ButtonVariant } from './Button.model';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-soft hover:bg-brand-700 active:bg-brand-700',
  secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
  danger: 'bg-red-600 text-white shadow-soft hover:bg-red-700 active:bg-red-700',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'rounded-lg px-4 py-2.5 text-sm',
  lg: 'rounded-xl px-6 py-4 text-base',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
        'active:scale-[0.98]',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </button>
  );
}
