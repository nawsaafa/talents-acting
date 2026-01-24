'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { DashboardSummaryCard } from './DashboardSummaryCard';
import { ActivityFeed } from './ActivityFeed';
import { getTalentDashboardData } from '@/lib/activity/actions';
import type { TalentDashboardData } from '@/lib/activity/types';

// Icons as SVG components
function MessageIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

export function TalentActivitySection() {
  const [data, setData] = useState<TalentDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getTalentDashboardData();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load dashboard data');
      }
    });
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (isPending || !data) {
    return <TalentActivitySkeleton />;
  }

  const { stats, recentActivity, pendingRequests } = data;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardSummaryCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={<MessageIcon />}
          href="/messages"
          variant={stats.unreadMessages > 0 ? 'primary' : 'default'}
        />
        <DashboardSummaryCard
          title="Pending Requests"
          value={stats.pendingContactRequests}
          subtitle={stats.pendingContactRequests > 0 ? 'Awaiting your response' : undefined}
          icon={<ContactIcon />}
          href="/dashboard/requests"
          variant={stats.pendingContactRequests > 0 ? 'warning' : 'default'}
        />
        <DashboardSummaryCard
          title="Profile Views"
          value={stats.profileViews?.thisWeek || 0}
          subtitle="This week"
          icon={<EyeIcon />}
          trend={
            stats.profileViews && stats.profileViews.thisWeek > 0
              ? {
                  value: Math.round(
                    ((stats.profileViews.thisWeek - (stats.profileViews.today || 0)) /
                      Math.max(stats.profileViews.thisWeek, 1)) *
                      100
                  ),
                  isPositive: true,
                }
              : undefined
          }
          variant="success"
        />
        <DashboardSummaryCard
          title="Notifications"
          value={stats.unreadNotifications}
          icon={<BellIcon />}
          href="/notifications"
          variant={stats.unreadNotifications > 0 ? 'primary' : 'default'}
        />
      </div>

      {/* Response Rate Card */}
      {stats.responseRate && stats.responseRate.totalReceived > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500">Response Rate</h3>
          <div className="mt-4 flex items-end gap-4">
            <div className="text-3xl font-bold text-zinc-900">
              {Math.round(stats.responseRate.responseRate)}%
            </div>
            <div className="mb-1 text-sm text-zinc-500">
              {stats.responseRate.approved + stats.responseRate.declined} of{' '}
              {stats.responseRate.totalReceived} requests responded
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${stats.responseRate.responseRate}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-zinc-500">
            <span>{stats.responseRate.approved} approved</span>
            <span>{stats.responseRate.declined} declined</span>
            <span>{stats.responseRate.pending} pending</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending Requests */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">Pending Requests</h3>
            <Link
              href="/dashboard/requests"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          {pendingRequests.length > 0 ? (
            <div className="mt-4 space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
                    {request.requesterName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900">{request.requesterName}</p>
                    {request.requesterCompany && (
                      <p className="text-xs text-zinc-500">{request.requesterCompany}</p>
                    )}
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatProjectType(request.projectType)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
              <p className="text-sm text-zinc-500">No pending requests</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">Recent Activity</h3>
          </div>
          <div className="mt-4">
            <ActivityFeed items={recentActivity} emptyMessage="No recent activity to show" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TalentActivitySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg border border-zinc-200 bg-zinc-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-lg border border-zinc-200 bg-zinc-100" />
        <div className="h-64 rounded-lg border border-zinc-200 bg-zinc-100 lg:col-span-2" />
      </div>
    </div>
  );
}

function formatProjectType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
