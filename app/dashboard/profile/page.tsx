import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout';
import { Button, Card, CardBody } from '@/components/ui';
import { ProfileCompleteness, ProfilePreview } from '@/components/profile';
import { auth } from '@/lib/auth/auth';
import { getTalentProfileByUserId } from '@/lib/talents/queries';
import {
  User,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  MapPin,
  Calendar,
  Camera,
  Sparkles,
} from 'lucide-react';

const VALIDATION_STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    label: 'Pending Review',
    description: 'Your profile is being reviewed by our team.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  APPROVED: {
    icon: CheckCircle,
    label: 'Approved',
    description: 'Your profile is visible to professionals and companies.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  REJECTED: {
    icon: XCircle,
    label: 'Rejected',
    description: 'Your profile needs changes before it can be approved.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  SUSPENDED: {
    icon: XCircle,
    label: 'Suspended',
    description: 'Your profile has been temporarily suspended.',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
} as const;

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  NON_BINARY: 'Non-Binary',
  OTHER: 'Other',
};

export const metadata = {
  title: 'My Profile | Dashboard - Acting Institute',
  description: 'Manage your talent profile',
};

export default async function ProfileDashboardPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/profile');
  }

  // Check if user is a talent
  if (session.user.role !== 'TALENT' && session.user.role !== 'ADMIN') {
    return (
      <Container className="py-8">
        <Card>
          <CardBody className="text-center py-12">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Available</h2>
            <p className="text-gray-600 mb-6">
              Talent profiles are only available for users registered as talents.
            </p>
            <Link href="/">
              <Button variant="outline">Go to Home</Button>
            </Link>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // Fetch user's talent profile
  const profile = await getTalentProfileByUserId(session.user.id);

  // No profile yet - show create CTA
  if (!profile) {
    return (
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Create your talent profile to get discovered</p>
        </div>

        <Card>
          <CardBody className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Create Your Profile</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Showcase your talent to casting directors, production companies, and industry
              professionals. Our step-by-step wizard makes it easy!
            </p>
            <Link href="/dashboard/profile/edit">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // Has profile - show summary
  const statusConfig = VALIDATION_STATUS_CONFIG[profile.validationStatus];
  const StatusIcon = statusConfig.icon;

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Manage your talent profile</p>
      </div>

      {/* Validation Status Banner */}
      <div
        className={`mb-6 p-4 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
      >
        <div className="flex items-start gap-3">
          <StatusIcon className={`w-5 h-5 mt-0.5 ${statusConfig.color}`} />
          <div>
            <h3 className={`font-medium ${statusConfig.color}`}>{statusConfig.label}</h3>
            <p className="text-sm text-gray-600 mt-1">{statusConfig.description}</p>
            {profile.validationStatus === 'REJECTED' && profile.rejectionReason && (
              <p className="text-sm text-red-700 mt-2 bg-red-100 p-2 rounded">
                <strong>Reason:</strong> {profile.rejectionReason}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-40 bg-gray-100 rounded-lg overflow-hidden">
                  {profile.photo ? (
                    <Image
                      src={profile.photo}
                      alt={profile.firstName}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 mt-1">
                  {GENDER_LABELS[profile.gender]}
                  {profile.physique && ` | ${profile.physique}`}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Age Range: {profile.ageRangeMin}-{profile.ageRangeMax} years
                    </span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                {profile.bio && <p className="mt-4 text-gray-700 line-clamp-3">{profile.bio}</p>}

                {/* Skills Preview */}
                {profile.performanceSkills && profile.performanceSkills.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.performanceSkills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.performanceSkills.length > 5 && (
                        <span className="text-gray-500 text-xs py-1">
                          +{profile.performanceSkills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardBody>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/profile/edit" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/dashboard/profile/media" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="w-4 h-4 mr-2" />
                  Manage Media
                </Button>
              </Link>
              {profile.validationStatus === 'APPROVED' && profile.isPublic && (
                <Link href={`/talents/${profile.id}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Profile
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Profile Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility</span>
                  <span className={profile.isPublic ? 'text-green-600' : 'text-gray-500'}>
                    {profile.isPublic ? 'Public' : 'Hidden'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available</span>
                  <span className={profile.isAvailable ? 'text-green-600' : 'text-gray-500'}>
                    {profile.isAvailable ? 'Yes' : 'No'}
                  </span>
                </div>
                {profile.dailyRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Rate</span>
                    <span className="font-medium">
                      {Number(profile.dailyRate).toLocaleString()} MAD
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Profile Completeness */}
      <div className="mt-6">
        <ProfileCompleteness profile={profile} showDetails />
      </div>

      {/* Profile Preview */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Preview</h2>
        <ProfilePreview profile={profile} />
      </div>
    </Container>
  );
}
