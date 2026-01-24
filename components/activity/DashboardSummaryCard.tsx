import type { ReactNode } from 'react';
import Link from 'next/link';

interface DashboardSummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  href?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: {
    icon: 'bg-zinc-100 text-zinc-600',
    value: 'text-zinc-900',
  },
  primary: {
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-900',
  },
  success: {
    icon: 'bg-green-100 text-green-600',
    value: 'text-green-900',
  },
  warning: {
    icon: 'bg-amber-100 text-amber-600',
    value: 'text-amber-900',
  },
  danger: {
    icon: 'bg-red-100 text-red-600',
    value: 'text-red-900',
  },
};

export function DashboardSummaryCard({
  title,
  value,
  subtitle,
  icon,
  href,
  trend,
  variant = 'default',
}: DashboardSummaryCardProps) {
  const styles = variantStyles[variant];

  const content = (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${styles.value}`}>
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-zinc-500">vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${styles.icon}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

// Format large numbers with K/M suffix
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
