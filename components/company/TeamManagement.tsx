'use client';

import { useState } from 'react';
import { CompanyMemberStatus, CompanyMemberRole } from '@prisma/client';
import { InviteMemberForm } from './InviteMemberForm';
import { cancelInvitation, removeMember } from '@/lib/company/actions';

interface TeamMember {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: CompanyMemberStatus;
  role: CompanyMemberRole;
  invitedAt: Date;
  acceptedAt: Date | null;
}

interface TeamManagementProps {
  members: TeamMember[];
  companyName: string;
}

export function TeamManagement({ members, companyName }: TeamManagementProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeMembers = members.filter((m) => m.status === 'ACTIVE');
  const pendingInvites = members.filter((m) => m.status === 'PENDING');

  const handleCancelInvite = async (memberId: string) => {
    setIsLoading(memberId);
    setError(null);
    try {
      const result = await cancelInvitation(memberId);
      if (!result.success) {
        setError(result.error || 'Failed to cancel invitation');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }
    setIsLoading(memberId);
    setError(null);
    try {
      const result = await removeMember(memberId);
      if (!result.success) {
        setError(result.error || 'Failed to remove member');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusBadge = (status: CompanyMemberStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Active
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Pending
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
            Inactive
          </span>
        );
    }
  };

  const getRoleBadge = (role: CompanyMemberRole) => {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}
      >
        {role === 'ADMIN' ? 'Admin' : 'Member'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Team Members</h2>
          <p className="text-sm text-zinc-600">
            {activeMembers.length} active member{activeMembers.length !== 1 ? 's' : ''}
            {pendingInvites.length > 0 &&
              `, ${pendingInvites.length} pending invite${pendingInvites.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showInviteForm ? 'Cancel' : 'Invite Member'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Invite Form */}
      {showInviteForm && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <InviteMemberForm onSuccess={() => setShowInviteForm(false)} />
        </div>
      )}

      {/* Active Members */}
      {activeMembers.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-zinc-700">Active Members</h3>
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {activeMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div>
                        <div className="font-medium text-zinc-900">
                          {member.firstName && member.lastName
                            ? `${member.firstName} ${member.lastName}`
                            : 'Team Member'}
                        </div>
                        <div className="text-sm text-zinc-500">{member.email}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">{getRoleBadge(member.role)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-500">
                      {member.acceptedAt ? new Date(member.acceptedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={isLoading === member.id}
                        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {isLoading === member.id ? 'Removing...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-zinc-700">Pending Invitations</h3>
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Invited
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {pendingInvites.map((member) => (
                  <tr key={member.id}>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="text-sm text-zinc-900">{member.email}</div>
                      {member.firstName && (
                        <div className="text-xs text-zinc-500">{member.firstName}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">{getStatusBadge(member.status)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-500">
                      {new Date(member.invitedAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <button
                        onClick={() => handleCancelInvite(member.id)}
                        disabled={isLoading === member.id}
                        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {isLoading === member.id ? 'Canceling...' : 'Cancel'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {members.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-zinc-900">No team members yet</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Invite colleagues to join {companyName} and share access to the talent database.
          </p>
          <button
            onClick={() => setShowInviteForm(true)}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Invite Your First Member
          </button>
        </div>
      )}
    </div>
  );
}
