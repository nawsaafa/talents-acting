'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { logout } from '@/lib/auth/actions';
import { User, Shield, MessageSquare, FolderOpen } from 'lucide-react';

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (session?.user) {
    const isTalent = session.user.role === 'TALENT';
    const isAdmin = session.user.role === 'ADMIN';
    const canUseCollections = ['PROFESSIONAL', 'COMPANY', 'ADMIN'].includes(session.user.role);

    return (
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <Shield className="w-4 h-4 mr-1" />
              Admin
            </Button>
          </Link>
        )}
        {isTalent && (
          <Link href="/dashboard/profile">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-1" />
              My Profile
            </Button>
          </Link>
        )}
        {canUseCollections && (
          <Link href="/collections">
            <Button variant="ghost" size="sm">
              <FolderOpen className="w-4 h-4 mr-1" />
              Collections
            </Button>
          </Link>
        )}
        <Link href="/messages">
          <Button variant="ghost" size="sm">
            <MessageSquare className="w-4 h-4 mr-1" />
            Messages
          </Button>
        </Link>
        <span className="text-sm text-gray-600 hidden sm:inline">{session.user.email}</span>
        <form action={logout}>
          <Button type="submit" variant="outline" size="sm">
            Sign Out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">Register</Button>
      </Link>
    </div>
  );
}
