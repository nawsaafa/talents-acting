'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  view?: ViewMode;
  onChange?: (view: ViewMode) => void;
}

export function ViewToggle({ view: controlledView, onChange }: ViewToggleProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Use controlled value if provided, otherwise read from URL
  const currentView: ViewMode = controlledView || (searchParams.get('view') as ViewMode) || 'grid';

  function handleViewChange(newView: ViewMode) {
    if (onChange) {
      onChange(newView);
    }

    // Update URL param
    const params = new URLSearchParams(searchParams.toString());
    if (newView === 'grid') {
      params.delete('view'); // grid is default, no need for param
    } else {
      params.set('view', newView);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white" role="group">
      <button
        type="button"
        onClick={() => handleViewChange('grid')}
        className={cn(
          'inline-flex items-center justify-center p-2 rounded-md transition-colors',
          currentView === 'grid'
            ? 'bg-[var(--color-primary)] text-white'
            : 'text-gray-600 hover:bg-gray-100'
        )}
        aria-label="Grid view"
        aria-pressed={currentView === 'grid'}
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => handleViewChange('list')}
        className={cn(
          'inline-flex items-center justify-center p-2 rounded-md transition-colors',
          currentView === 'list'
            ? 'bg-[var(--color-primary)] text-white'
            : 'text-gray-600 hover:bg-gray-100'
        )}
        aria-label="List view"
        aria-pressed={currentView === 'list'}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}
