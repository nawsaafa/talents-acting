import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showArrow?: boolean;
  glow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)]
    text-[var(--color-black)] font-semibold
    border border-[var(--color-gold)]
    hover:from-[var(--color-gold-light)] hover:to-[var(--color-gold)]
    hover:shadow-[0_0_30px_rgba(201,162,39,0.3)]
    focus-visible:ring-[var(--color-gold)]
  `,
  secondary: `
    bg-[var(--color-surface)]
    text-[var(--color-text-primary)]
    border border-[var(--color-surface-light)]
    hover:bg-[var(--color-surface-light)]
    hover:border-[var(--color-gold)]
    focus-visible:ring-[var(--color-gold)]
  `,
  outline: `
    bg-transparent
    text-[var(--color-gold)]
    border border-[var(--color-gold)]
    hover:bg-[var(--color-gold)]
    hover:text-[var(--color-black)]
    focus-visible:ring-[var(--color-gold)]
  `,
  ghost: `
    bg-transparent
    text-[var(--color-text-secondary)]
    border border-transparent
    hover:text-[var(--color-gold)]
    hover:bg-[var(--color-gold-muted)]
    focus-visible:ring-[var(--color-gold)]
  `,
  danger: `
    bg-[var(--color-error)]
    text-white
    border border-[var(--color-error)]
    hover:bg-[var(--color-error-light)]
    focus-visible:ring-[var(--color-error)]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-3',
  xl: 'px-10 py-5 text-xl gap-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      showArrow = false,
      glow = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          group relative inline-flex items-center justify-center font-medium
          rounded-sm
          transition-all duration-500 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-black)]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${glow ? 'animate-pulse-gold' : ''}
          ${className}
        `
          .trim()
          .replace(/\s+/g, ' ')}
        {...props}
      >
        {/* Shimmer effect on hover */}
        <span className="absolute inset-0 rounded-sm overflow-hidden">
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </span>

        <span className="relative flex items-center gap-inherit">
          {isLoading ? (
            <Loader2
              className="animate-spin"
              size={size === 'sm' ? 14 : size === 'xl' ? 24 : size === 'lg' ? 20 : 16}
            />
          ) : (
            leftIcon
          )}
          <span>{children}</span>
          {!isLoading && rightIcon}
          {!isLoading && showArrow && (
            <ArrowRight
              className="opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 ease-out"
              size={size === 'sm' ? 14 : size === 'xl' ? 24 : size === 'lg' ? 20 : 16}
            />
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
