import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { PremiumSection } from '@/components/talents';
import {
  getPublicTalentById,
  getTalentWithAccessControl,
  type PremiumTalentProfile,
} from '@/lib/talents/queries';
import { auth } from '@/lib/auth/auth';
import { getUserSubscriptionByRole } from '@/lib/payment/queries';
import { buildAccessContext } from '@/lib/access/control';
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  Calendar,
  Ruler,
  Mail,
  Phone,
  Languages,
  Drama,
} from 'lucide-react';

interface TalentDetailPageProps {
  params: Promise<{ id: string }>;
}

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  NON_BINARY: 'Non-Binary',
  OTHER: 'Other',
};

const PHYSIQUE_LABELS: Record<string, string> = {
  SLIM: 'Slim',
  AVERAGE: 'Average',
  ATHLETIC: 'Athletic',
  MUSCULAR: 'Muscular',
  CURVY: 'Curvy',
  PLUS_SIZE: 'Plus Size',
};

export async function generateMetadata({ params }: TalentDetailPageProps) {
  const { id } = await params;
  const talent = await getPublicTalentById(id);

  if (!talent) {
    return { title: 'Talent Not Found' };
  }

  return {
    title: `${talent.firstName} | Talents - Acting Institute`,
    description: `View profile of ${talent.firstName}, ${GENDER_LABELS[talent.gender]}, ${talent.ageRangeMin}-${talent.ageRangeMax} years`,
  };
}

export default async function TalentDetailPage({ params }: TalentDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  // Build access context with subscription status
  let hasAccess = false;
  let talent;

  if (session?.user) {
    // Get subscription status for the user
    const subscription = await getUserSubscriptionByRole(session.user.id, session.user.role);

    // Build access context
    const context = buildAccessContext({
      id: session.user.id,
      role: session.user.role,
      subscriptionStatus: subscription?.status,
      subscriptionEndsAt: subscription?.endsAt,
    });

    // Fetch talent with access control (handles logging and access checks)
    const result = await getTalentWithAccessControl(id, context);
    talent = result.data;
    hasAccess = result.hasFullAccess || result.accessLevel === 'premium';
  } else {
    // Unauthenticated user - public access only
    talent = await getPublicTalentById(id);
    hasAccess = false;
  }

  if (!talent) {
    notFound();
  }

  return (
    <Container className="py-8">
      {/* Back Link */}
      <Link
        href="/talents"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Talents
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photo and Quick Info */}
        <div className="lg:col-span-1">
          {/* Photo */}
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
            {talent.photo ? (
              <Image
                src={talent.photo}
                alt={talent.firstName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-6xl text-gray-400">{talent.firstName.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Availability Badge */}
          {talent.isAvailable && (
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Available for Work</span>
            </div>
          )}

          {/* Quick Stats */}
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {talent.ageRangeMin}-{talent.ageRangeMax} years
              </span>
            </div>
            {talent.height && (
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                <span>{talent.height} cm</span>
              </div>
            )}
            {talent.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{talent.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {talent.firstName}
              {hasAccess && ` ${(talent as PremiumTalentProfile).lastName}`}
            </h1>
            <p className="mt-1 text-lg text-gray-600">
              {GENDER_LABELS[talent.gender]}
              {talent.physique && ` | ${PHYSIQUE_LABELS[talent.physique]}`}
            </p>
          </div>

          {/* Physical Attributes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Physical Attributes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {talent.hairColor && (
                <div>
                  <span className="text-sm text-gray-500">Hair Color</span>
                  <p className="font-medium">{talent.hairColor}</p>
                </div>
              )}
              {talent.eyeColor && (
                <div>
                  <span className="text-sm text-gray-500">Eye Color</span>
                  <p className="font-medium">{talent.eyeColor}</p>
                </div>
              )}
              {talent.hairLength && (
                <div>
                  <span className="text-sm text-gray-500">Hair Length</span>
                  <p className="font-medium">{talent.hairLength}</p>
                </div>
              )}
              {talent.ethnicAppearance && (
                <div>
                  <span className="text-sm text-gray-500">Ethnic Appearance</span>
                  <p className="font-medium">{talent.ethnicAppearance}</p>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {(talent.languages?.length > 0 || talent.performanceSkills?.length > 0) && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Languages</h2>
              <div className="space-y-4">
                {talent.languages && talent.languages.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Languages className="w-4 h-4" />
                      <span className="font-medium">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {talent.languages.map((lang) => (
                        <span
                          key={lang}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {talent.performanceSkills && talent.performanceSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Drama className="w-4 h-4" />
                      <span className="font-medium">Performance Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {talent.performanceSkills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Premium Section - Bio and Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact & Details</h2>
            <PremiumSection isUnlocked={hasAccess}>
              {hasAccess &&
                (() => {
                  const premiumTalent = talent as PremiumTalentProfile;
                  return (
                    <div className="space-y-4">
                      {premiumTalent.bio && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">About</h3>
                          <p className="text-gray-600 whitespace-pre-line">{premiumTalent.bio}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        {premiumTalent.contactEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a
                              href={`mailto:${premiumTalent.contactEmail}`}
                              className="text-blue-600 hover:underline"
                            >
                              {premiumTalent.contactEmail}
                            </a>
                          </div>
                        )}
                        {premiumTalent.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a
                              href={`tel:${premiumTalent.contactPhone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {premiumTalent.contactPhone}
                            </a>
                          </div>
                        )}
                      </div>

                      {premiumTalent.dailyRate && (
                        <div className="pt-4 border-t">
                          <span className="text-sm text-gray-500">Daily Rate</span>
                          <p className="text-2xl font-bold text-gray-900">
                            {Number(premiumTalent.dailyRate).toLocaleString()} MAD
                            {premiumTalent.rateNegotiable && (
                              <span className="text-sm font-normal text-gray-500 ml-2">
                                (Negotiable)
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </PremiumSection>
          </section>
        </div>
      </div>
    </Container>
  );
}
