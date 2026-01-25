import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/layout';
import { Button, Card, CardBody } from '@/components/ui';
import { getApprovedTalentCount } from '@/lib/talents/queries';
import { Search, UserPlus, Star, Users, Shield, Eye } from 'lucide-react';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let talentCount = 0;
  try {
    talentCount = await getApprovedTalentCount();
  } catch {
    // Database not available during build or initial render
  }

  return <HomeContent talentCount={talentCount} />;
}

function HomeContent({ talentCount }: { talentCount: number }) {
  const t = useTranslations();

  return (
    <Container as="section" className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t('metadata.siteTitle')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {t('metadata.siteDescription')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/talents">
            <Button size="lg" leftIcon={<Search size={20} />}>
              {t('common.navigation.talents')} {talentCount > 0 ? `(${talentCount})` : ''}
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" leftIcon={<UserPlus size={20} />}>
              {t('common.navigation.register')}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('talents.search.title')}
            </h3>
            <p className="text-gray-600">{t('metadata.siteDescription')}</p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-4">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('common.status.approved')}
            </h3>
            <p className="text-gray-600">{t('admin.validation.title')}</p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
              <Eye className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('common.labels.details')}
            </h3>
            <p className="text-gray-600">{t('talents.profile.viewPublicProfile')}</p>
          </CardBody>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardBody className="text-center py-12">
          <Star className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('talents.profile.title')}</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">{t('metadata.siteDescription')}</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              {t('common.navigation.register')}
            </Button>
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
}
