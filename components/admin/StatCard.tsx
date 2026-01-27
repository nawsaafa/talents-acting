import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  className = '',
}: StatCardProps) {
  const trendColors = {
    up: 'text-[var(--color-gold)]',
    down: 'text-[var(--color-error)]',
    neutral: 'text-[var(--color-text-muted)]',
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)]
        border border-[var(--color-surface-light)]/30
        hover:border-[var(--color-gold)]/30
        transition-all duration-500 group
        ${className}
      `}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/0 to-[var(--color-gold)]/0 group-hover:from-[var(--color-gold)]/5 group-hover:to-transparent transition-all duration-500" />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent rounded-bl-[100px] opacity-50" />

      <div className="relative flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 rounded-xl text-[var(--color-gold)] border border-[var(--color-gold)]/20 shadow-lg shadow-[var(--color-gold)]/10 group-hover:shadow-[var(--color-gold)]/20 transition-all duration-300">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider truncate">
            {title}
          </p>
          <p
            className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {value}
          </p>
          {description && (
            <p
              className={`mt-1 text-sm ${
                trend ? trendColors[trend] : 'text-[var(--color-text-muted)]'
              }`}
            >
              {trend === 'up' && (
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
