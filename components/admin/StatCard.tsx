import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  className = "",
}: StatCardProps) {
  const trendColors = {
    up: "text-[var(--color-success)]",
    down: "text-[var(--color-error)]",
    neutral: "text-[var(--color-neutral-500)]",
  };

  return (
    <Card className={`flex items-start gap-4 ${className}`} padding="lg">
      {icon && (
        <div className="flex-shrink-0 p-3 bg-[var(--color-primary-50)] rounded-[var(--radius-md)] text-[var(--color-primary)]">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-neutral-500)] truncate">
          {title}
        </p>
        <p className="mt-1 text-2xl font-semibold text-[var(--color-neutral-900)]">
          {value}
        </p>
        {description && (
          <p
            className={`mt-1 text-sm ${
              trend ? trendColors[trend] : "text-[var(--color-neutral-500)]"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
