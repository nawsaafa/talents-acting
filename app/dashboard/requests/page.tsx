import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card, CardBody } from '@/components/ui';
import { ContactRequestList } from '@/components/contact-requests';
import { auth } from '@/lib/auth/auth';
import { getMyReceivedRequests, getMyRequestCounts } from '@/lib/contact-requests/actions';
import { Inbox, UserCheck, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Contact Requests | Dashboard - Talents Acting',
  description: 'Manage your received contact requests',
};

export default async function TalentRequestsPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/requests');
  }

  // Check if user is a talent
  if (session.user.role !== 'TALENT' && session.user.role !== 'ADMIN') {
    return (
      <Container className="py-8">
        <Card>
          <CardBody className="text-center py-12">
            <UserCheck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Not Available</h2>
            <p className="text-gray-600 mb-6">This page is only available for talent profiles.</p>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // Fetch requests and counts
  const [requestsResult, counts] = await Promise.all([
    getMyReceivedRequests({ limit: 20 }),
    getMyRequestCounts(),
  ]);

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Requests</h1>
        <p className="mt-2 text-gray-600">
          Professionals and companies would like to connect with you. Review their requests and
          decide whether to share your contact information.
        </p>
      </div>

      {/* Stats */}
      {counts.received && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-[var(--color-neutral-900)]">
                {counts.received.total}
              </div>
              <div className="text-sm text-[var(--color-neutral-600)]">Total Received</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">
                  {counts.received.pending}
                </span>
              </div>
              <div className="text-sm text-[var(--color-neutral-600)]">Pending</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">
                  {counts.received.approved}
                </span>
              </div>
              <div className="text-sm text-[var(--color-neutral-600)]">Approved</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-red-600">{counts.received.declined}</span>
              </div>
              <div className="text-sm text-[var(--color-neutral-600)]">Declined</div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Pending Notice */}
      {counts.received && counts.received.pending > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-[var(--radius-lg)]">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">
                You have {counts.received.pending} pending request
                {counts.received.pending !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Review the requests below and decide whether to share your contact information. Your
                privacy is protected until you approve each request.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Request List */}
      {requestsResult.requests.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Inbox className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Requests Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven&apos;t received any contact requests yet. Make sure your profile is complete
              and public to increase your visibility to professionals and companies.
            </p>
            <Link href="/dashboard/profile">
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors">
                View My Profile
              </button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Privacy Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-[var(--radius-lg)]">
            <p className="text-sm text-blue-700">
              <strong>Privacy Tip:</strong> Your contact information (email and phone) will only be
              shared with requesters you approve. Declining a request does not reveal any personal
              information.
            </p>
          </div>

          <ContactRequestList
            initialRequests={requestsResult.requests}
            totalCount={requestsResult.total}
            hasMore={requestsResult.hasMore}
            viewType="talent"
          />
        </>
      )}
    </Container>
  );
}
