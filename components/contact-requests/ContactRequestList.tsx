'use client';

import { useState, useTransition } from 'react';
import { ContactRequestStatus } from '@prisma/client';
import { Filter, Loader2, Inbox } from 'lucide-react';
import { ContactRequestCard } from './ContactRequestCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { respondToRequest } from '@/lib/contact-requests/actions';
import type { ContactRequestInfo } from '@/lib/contact-requests/types';

interface ContactRequestListProps {
  initialRequests: ContactRequestInfo[];
  totalCount: number;
  hasMore: boolean;
  viewType: 'requester' | 'talent' | 'admin';
  onLoadMore?: () => Promise<ContactRequestInfo[]>;
  onFilterChange?: (status: ContactRequestStatus | undefined) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
];

export function ContactRequestList({
  initialRequests,
  totalCount,
  hasMore: initialHasMore,
  viewType,
  onLoadMore,
  onFilterChange,
}: ContactRequestListProps) {
  const [requests, setRequests] = useState<ContactRequestInfo[]>(initialRequests);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [statusFilter, setStatusFilter] = useState<ContactRequestStatus | ''>('');
  const [isLoadingMore, startLoadingMore] = useTransition();
  const [respondingIds, setRespondingIds] = useState<Set<string>>(new Set());

  const handleFilterChange = (value: string) => {
    const newStatus = value as ContactRequestStatus | '';
    setStatusFilter(newStatus);
    onFilterChange?.(newStatus || undefined);
  };

  const handleLoadMore = async () => {
    if (!onLoadMore) return;

    startLoadingMore(async () => {
      const moreRequests = await onLoadMore();
      setRequests((prev) => [...prev, ...moreRequests]);
      setHasMore(moreRequests.length > 0);
    });
  };

  const handleRespond = async (requestId: string, approve: boolean, reason?: string) => {
    setRespondingIds((prev) => new Set(prev).add(requestId));

    try {
      const result = await respondToRequest({
        requestId,
        approve,
        declineReason: reason,
      });

      if (result.success && result.request) {
        // Update the request in the list
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: result.request!.status,
                  respondedAt: result.request!.respondedAt,
                  declineReason: result.request!.declineReason,
                }
              : req
          )
        );
      }
    } finally {
      setRespondingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  // Filter requests based on current filter
  const filteredRequests = statusFilter
    ? requests.filter((r) => r.status === statusFilter)
    : requests;

  return (
    <div className="space-y-4">
      {/* Header with filter */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-neutral-600)]">
          Showing {filteredRequests.length} of {totalCount} requests
        </p>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--color-neutral-500)]" />
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <div className="py-12 text-center">
          <Inbox className="w-12 h-12 mx-auto text-[var(--color-neutral-400)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-neutral-700)]">No requests found</h3>
          <p className="text-sm text-[var(--color-neutral-500)] mt-1">
            {statusFilter
              ? `No ${statusFilter.toLowerCase()} requests to display.`
              : viewType === 'requester'
                ? "You haven't sent any contact requests yet."
                : viewType === 'talent'
                  ? "You haven't received any contact requests yet."
                  : 'No contact requests in the system.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <ContactRequestCard
              key={request.id}
              request={request}
              viewType={viewType}
              onRespond={viewType === 'talent' ? handleRespond : undefined}
              isResponding={respondingIds.has(request.id)}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={handleLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
