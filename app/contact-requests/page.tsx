import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card, CardBody } from '@/components/ui';
import { ContactRequestList, ContactInfoReveal } from '@/components/contact-requests';
import { auth } from '@/lib/auth/auth';
import { getMySentRequests, getRequest, getMyRequestCounts } from '@/lib/contact-requests/actions';
import { Send, ArrowLeft, Inbox, Clock, CheckCircle, XCircle } from 'lucide-react';

export const metadata = {
  title: 'My Contact Requests | Talents Acting',
  description: 'View and manage your sent contact requests',
};

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ContactRequestsPage({ searchParams }: PageProps) {
  const session = await auth();
  const params = await searchParams;

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login?callbackUrl=/contact-requests');
  }

  // Check if user is a professional or company
  if (
    session.user.role !== 'PROFESSIONAL' &&
    session.user.role !== 'COMPANY' &&
    session.user.role !== 'ADMIN'
  ) {
    return (
      <Container className="py-8">
        <Card>
          <CardBody className="text-center py-12">
            <Inbox className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Not Available</h2>
            <p className="text-gray-600 mb-6">
              Contact requests are available for professionals and companies.
            </p>
            <Link href="/">
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors">
                Go to Home
              </button>
            </Link>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // If a specific request ID is provided, show detail view
  if (params.id) {
    const request = await getRequest(params.id);

    if (!request) {
      return (
        <Container className="py-8">
          <Card>
            <CardBody className="text-center py-12">
              <Inbox className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Not Found</h2>
              <p className="text-gray-600 mb-6">
                The contact request you&apos;re looking for doesn&apos;t exist or you don&apos;t
                have access to it.
              </p>
              <Link href="/contact-requests">
                <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors">
                  Back to Requests
                </button>
              </Link>
            </CardBody>
          </Card>
        </Container>
      );
    }

    return (
      <Container className="py-8">
        <div className="mb-6">
          <Link
            href="/contact-requests"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all requests
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Request</h1>
          <p className="mt-2 text-gray-600">Request to connect with {request.talentName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Details */}
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Request Details</h2>

              <div className="space-y-4">
                {/* Status */}
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="mt-1 flex items-center gap-2">
                    {request.status === 'PENDING' && (
                      <>
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium text-yellow-700">Pending</span>
                      </>
                    )}
                    {request.status === 'APPROVED' && (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-700">Approved</span>
                      </>
                    )}
                    {request.status === 'DECLINED' && (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-700">Declined</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Talent */}
                <div>
                  <span className="text-sm text-gray-500">Talent</span>
                  <p className="font-medium">{request.talentName}</p>
                </div>

                {/* Project Type */}
                <div>
                  <span className="text-sm text-gray-500">Project Type</span>
                  <p className="font-medium">
                    {request.projectType.replace(/_/g, ' ')}
                    {request.projectName && `: ${request.projectName}`}
                  </p>
                </div>

                {/* Purpose */}
                <div>
                  <span className="text-sm text-gray-500">Purpose</span>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{request.purpose}</p>
                </div>

                {/* Personal Message */}
                {request.message && (
                  <div>
                    <span className="text-sm text-gray-500">Personal Message</span>
                    <p className="mt-1 text-gray-700 italic">&quot;{request.message}&quot;</p>
                  </div>
                )}

                {/* Decline Reason */}
                {request.status === 'DECLINED' && request.declineReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-[var(--radius-md)] border border-red-200">
                    <span className="text-sm font-medium text-red-700">Decline Reason</span>
                    <p className="mt-1 text-red-600">{request.declineReason}</p>
                  </div>
                )}

                {/* Dates */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Submitted</span>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                  {request.respondedAt && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Responded</span>
                      <span>{new Date(request.respondedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Contact Info (if approved) */}
          <div>
            <ContactInfoReveal
              requestId={request.id}
              talentName={request.talentName}
              isApproved={request.status === 'APPROVED'}
            />
          </div>
        </div>
      </Container>
    );
  }

  // List view
  const [requestsResult, counts] = await Promise.all([
    getMySentRequests({ limit: 20 }),
    getMyRequestCounts(),
  ]);

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Contact Requests</h1>
        <p className="mt-2 text-gray-600">Track your sent contact requests to talents</p>
      </div>

      {/* Stats */}
      {counts.sent && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-[var(--color-neutral-900)]">
                {counts.sent.total}
              </div>
              <div className="text-sm text-[var(--color-neutral-600)]">Total Requests</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{counts.sent.pending}</div>
              <div className="text-sm text-[var(--color-neutral-600)]">Pending</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-green-600">{counts.sent.approved}</div>
              <div className="text-sm text-[var(--color-neutral-600)]">Approved</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-red-600">{counts.sent.declined}</div>
              <div className="text-sm text-[var(--color-neutral-600)]">Declined</div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Request List */}
      {requestsResult.requests.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Send className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Requests Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t sent any contact requests to talents yet. Browse our talent directory
              to find the perfect match for your project.
            </p>
            <Link href="/talents">
              <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors">
                Browse Talents
              </button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <ContactRequestList
          initialRequests={requestsResult.requests}
          totalCount={requestsResult.total}
          hasMore={requestsResult.hasMore}
          viewType="requester"
        />
      )}
    </Container>
  );
}
