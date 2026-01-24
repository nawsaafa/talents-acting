'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { DashboardSummaryCard } from './DashboardSummaryCard';
import { ActivityFeed } from './ActivityFeed';
import { getCompanyDashboardData } from '@/lib/activity/actions';
import type { CompanyDashboardData } from '@/lib/activity/types';

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

function FolderIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

export function CompanyActivitySection() {
  const [data, setData] = useState<CompanyDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getCompanyDashboardData();
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
    return <CompanyActivitySkeleton />;
  }

  const { stats, recentActivity, recentCollections, teamActivitySummary } = data;

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
          title="Sent Requests"
          value={stats.sentContactRequests || 0}
          subtitle={`${stats.pendingContactRequests} pending`}
          icon={<ContactIcon />}
          href="/dashboard/requests"
          variant="default"
        />
        <DashboardSummaryCard
          title="Collections"
          value={stats.totalCollections || 0}
          subtitle={`${stats.totalTalentsInCollections || 0} talents saved`}
          icon={<FolderIcon />}
          href="/collections"
          variant="success"
        />
        <DashboardSummaryCard
          title="Team Members"
          value={teamActivitySummary?.totalMembers || 0}
          subtitle={`${teamActivitySummary?.activeMembers || 0} active`}
          icon={<UsersIcon />}
          href="/dashboard/company/team"
          variant="default"
        />
      </div>

      {/* Team Activity Summary */}
      {teamActivitySummary && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">Team Activity This Week</h3>
          <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-zinc-900">{teamActivitySummary.totalMembers}</p>
              <p className="text-sm text-zinc-500">Total Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {teamActivitySummary.activeMembers}
              </p>
              <p className="text-sm text-zinc-500">Active Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {teamActivitySummary.messagesSentThisWeek}
              </p>
              <p className="text-sm text-zinc-500">Messages Sent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {teamActivitySummary.collectionsCreatedThisWeek}
              </p>
              <p className="text-sm text-zinc-500">Collections Created</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Collections */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">Recent Collections</h3>
            <Link
              href="/collections"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          {recentCollections.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recentCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  className="block rounded-lg border border-zinc-100 bg-zinc-50 p-3 transition-colors hover:border-zinc-200 hover:bg-zinc-100"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-900">{collection.name}</p>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {collection.talentCount}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Updated {formatRelativeTime(collection.updatedAt)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
              <p className="text-sm text-zinc-500">No collections yet</p>
              <Link
                href="/talents"
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Browse talents to create one
              </Link>
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

function CompanyActivitySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg border border-zinc-200 bg-zinc-100" />
        ))}
      </div>
      <div className="h-24 rounded-lg border border-zinc-200 bg-zinc-100" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-lg border border-zinc-200 bg-zinc-100" />
        <div className="h-64 rounded-lg border border-zinc-200 bg-zinc-100 lg:col-span-2" />
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}
