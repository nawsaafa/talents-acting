import Link from 'next/link';
import { Container } from '@/components/layout';
import { Button, Card, CardBody } from '@/components/ui';
import { getApprovedTalentCount } from '@/lib/talents/queries';
import { Search, UserPlus, Star, Users, Shield, Eye } from 'lucide-react';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export default async function Home() {
  let talentCount = 0;
  try {
    talentCount = await getApprovedTalentCount();
  } catch {
    // Database not available during build or initial render
  }

  return (
    <Container as="section" className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Discover Amazing Talent
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Connect with actors, comedians, and performers. Find the perfect talent for your next
          production.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/talents">
            <Button size="lg" leftIcon={<Search size={20} />}>
              Browse {talentCount > 0 ? `${talentCount} ` : ''}Talents
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" leftIcon={<UserPlus size={20} />}>
              Join as Talent
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        <Card hover>
          <CardBody className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Diverse Talent Pool</h3>
            <p className="text-gray-600">
              Browse through a wide range of actors, comedians, and performers with varied skills
              and experience levels.
            </p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-4">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Profiles</h3>
            <p className="text-gray-600">
              All talent profiles are reviewed and verified to ensure quality and authenticity for
              your productions.
            </p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
              <Eye className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Access</h3>
            <p className="text-gray-600">
              Professionals and companies get full access to contact details and complete talent
              information.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardBody className="text-center py-12">
          <Star className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Showcase Your Talent?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Create your profile today and get discovered by casting directors, production companies,
            and industry professionals.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Create Your Profile
            </Button>
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
}
