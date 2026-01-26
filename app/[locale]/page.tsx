import { getApprovedTalentCount } from '@/lib/talents/queries';
import { HomeContent } from './HomeContent';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export default async function Home() {
  let talentCount = 0;
  try {
    talentCount = await getApprovedTalentCount();
  } catch {
    // Database not available during build or initial render
  }

  return <HomeContent talentCount={talentCount} />;
}
