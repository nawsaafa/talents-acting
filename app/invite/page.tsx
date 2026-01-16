import { Metadata } from 'next';
import { Suspense } from 'react';
import { InviteContent } from './InviteContent';

export const metadata: Metadata = {
  title: 'Accept Invitation - Talents Acting',
  description: 'Accept your team invitation to join a company on Talents Acting',
};

function LoadingFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-sm text-zinc-600">Loading...</p>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 sm:py-16">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <Suspense fallback={<LoadingFallback />}>
            <InviteContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
