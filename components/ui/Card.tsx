import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const shadowStyles = {
  none: '',
  sm: 'shadow-[var(--shadow-sm)]',
  md: 'shadow-[var(--shadow-md)]',
  lg: 'shadow-[var(--shadow-lg)]',
};

export function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-white
        border border-[var(--color-neutral-200)]
        rounded-[var(--radius-lg)]
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${hover ? 'transition-shadow duration-[var(--transition-normal)] hover:shadow-[var(--shadow-md)]' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`pb-4 border-b border-[var(--color-neutral-200)] ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`py-4 ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`pt-4 border-t border-[var(--color-neutral-200)] ${className}`.trim()}>
      {children}
    </div>
  );
}
