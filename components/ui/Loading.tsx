interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

const colorStyles = {
  primary: 'border-[var(--color-primary)] border-t-transparent',
  secondary: 'border-[var(--color-secondary)] border-t-transparent',
  white: 'border-white border-t-transparent',
  current: 'border-current border-t-transparent',
};

export function Loading({
  size = 'md',
  color = 'primary',
  className = '',
}: LoadingProps) {
  return (
    <div
      className={`
        inline-block
        rounded-full
        animate-spin
        ${sizeStyles[size]}
        ${colorStyles[color]}
        ${className}
      `.trim()}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <Loading size="lg" />
      <p className="mt-4 text-[var(--color-neutral-600)]">{message}</p>
    </div>
  );
}
