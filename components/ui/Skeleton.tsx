'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

/**
 * Skeleton loading placeholder component
 * Used to show loading state before content is ready
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, variantClasses[variant], className)}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width,
            }}
            role="presentation"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      role="presentation"
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for talent card loading state
 */
export function TalentCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Image placeholder */}
      <Skeleton variant="rectangular" className="mb-4 aspect-[3/4] w-full" />
      {/* Name */}
      <Skeleton variant="text" className="mb-2 h-5 w-3/4" />
      {/* Details */}
      <Skeleton variant="text" className="mb-1 h-4 w-1/2" />
      <Skeleton variant="text" className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Skeleton grid for talent gallery loading state
 */
export function TalentGallerySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      role="status"
      aria-label="Loading talents"
    >
      {Array.from({ length: count }).map((_, index) => (
        <TalentCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Skeleton for profile page header
 */
export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
      {/* Avatar */}
      <Skeleton variant="circular" width={160} height={160} />
      {/* Info */}
      <div className="flex-1 space-y-3 text-center md:text-left">
        <Skeleton variant="text" className="mx-auto h-8 w-48 md:mx-0" />
        <Skeleton variant="text" className="mx-auto h-5 w-32 md:mx-0" />
        <Skeleton variant="text" lines={3} className="h-4" />
      </div>
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton variant="text" className="h-4" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton for dashboard stats card
 */
export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Skeleton variant="text" className="mb-2 h-4 w-24" />
      <Skeleton variant="text" className="h-8 w-16" />
    </div>
  );
}

export default Skeleton;
