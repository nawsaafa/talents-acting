import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

// Base URL for the site
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://actinginstitute.ma';

/**
 * Generate dynamic sitemap with all localized pages
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages that exist for all locales
  const staticPages = ['', '/talents', '/about', '/contact', '/login', '/register'];

  // Generate entries for all static pages in all locales
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: now,
      changeFrequency: page === '' ? 'daily' : ('weekly' as const),
      priority: page === '' ? 1 : page === '/talents' ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${page}`])),
      },
    }))
  );

  // Note: For dynamic talent pages, you would fetch from database
  // Example (requires database access):
  // const talents = await prisma.talentProfile.findMany({
  //   where: { validationStatus: 'APPROVED', isPublic: true },
  //   select: { id: true, updatedAt: true },
  // });
  //
  // const talentEntries = talents.flatMap((talent) =>
  //   locales.map((locale) => ({
  //     url: `${BASE_URL}/${locale}/talents/${talent.id}`,
  //     lastModified: talent.updatedAt,
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.6,
  //     alternates: {
  //       languages: Object.fromEntries(
  //         locales.map((l) => [l, `${BASE_URL}/${l}/talents/${talent.id}`])
  //       ),
  //     },
  //   }))
  // );

  return [...staticEntries];
}
