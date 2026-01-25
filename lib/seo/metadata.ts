import type { Metadata } from 'next';

// Base URL for the site - used for canonical URLs and Open Graph
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://actinginstitute.ma';

// Supported locales for hreflang tags
const SUPPORTED_LOCALES = ['fr', 'en', 'ar'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// Default metadata values
const DEFAULT_SITE_NAME = 'Acting Institute Talents';
const DEFAULT_DESCRIPTION = {
  fr: 'Plateforme de talents pour acteurs, comediens et artistes au Maroc',
  en: 'Talent platform for actors, comedians and performers in Morocco',
  ar: 'منصة المواهب للممثلين والكوميديين والفنانين في المغرب',
};

export interface MetadataConfig {
  title: string;
  description: string;
  locale: SupportedLocale;
  path?: string;
  image?: string;
  type?: 'website' | 'profile' | 'article';
  noIndex?: boolean;
}

/**
 * Generate complete metadata for a page including Open Graph and Twitter cards
 */
export function generatePageMetadata(config: MetadataConfig): Metadata {
  const {
    title,
    description,
    locale,
    path = '',
    image,
    type = 'website',
    noIndex = false,
  } = config;

  const url = `${BASE_URL}/${locale}${path}`;
  const imageUrl = image || `${BASE_URL}/og-image.jpg`;

  // Generate alternate language links
  const alternateLanguages: Record<string, string> = {};
  for (const lang of SUPPORTED_LOCALES) {
    alternateLanguages[lang] = `${BASE_URL}/${lang}${path}`;
  }

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: DEFAULT_SITE_NAME,
      locale: locale === 'ar' ? 'ar_MA' : locale === 'fr' ? 'fr_MA' : 'en_US',
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/**
 * Generate metadata for talent profile pages
 */
export function generateTalentMetadata(
  talent: {
    firstName: string;
    lastName?: string | null;
    ageRangeMin?: number | null;
    ageRangeMax?: number | null;
    gender?: string | null;
    profilePhoto?: string | null;
  },
  locale: SupportedLocale
): Metadata {
  const name = talent.lastName ? `${talent.firstName} ${talent.lastName}` : talent.firstName;

  const ageRange =
    talent.ageRangeMin && talent.ageRangeMax ? `${talent.ageRangeMin}-${talent.ageRangeMax}` : '';

  const descriptions: Record<SupportedLocale, string> = {
    fr: `Decouvrez le profil de ${name}${ageRange ? `, ${ageRange} ans` : ''} - Acting Institute Talents`,
    en: `Discover ${name}'s profile${ageRange ? `, age ${ageRange}` : ''} - Acting Institute Talents`,
    ar: `اكتشف ملف ${name}${ageRange ? `، ${ageRange} سنة` : ''} - معهد التمثيل للمواهب`,
  };

  return generatePageMetadata({
    title: `${name} | Acting Institute Talents`,
    description: descriptions[locale],
    locale,
    path: `/talents/${talent.firstName.toLowerCase()}`,
    image: talent.profilePhoto || undefined,
    type: 'profile',
  });
}

/**
 * Generate metadata for the talents gallery page
 */
export function generateGalleryMetadata(
  locale: SupportedLocale,
  filters?: {
    gender?: string;
    ageRange?: string;
  }
): Metadata {
  const titles: Record<SupportedLocale, string> = {
    fr: 'Galerie des Talents',
    en: 'Talent Gallery',
    ar: 'معرض المواهب',
  };

  const descriptions: Record<SupportedLocale, string> = {
    fr: 'Explorez notre base de donnees de talents - acteurs, comediens et artistes au Maroc',
    en: 'Explore our talent database - actors, comedians and performers in Morocco',
    ar: 'استكشف قاعدة بيانات المواهب لدينا - الممثلين والكوميديين والفنانين في المغرب',
  };

  let title = titles[locale];
  if (filters?.gender) {
    title += ` - ${filters.gender}`;
  }

  return generatePageMetadata({
    title: `${title} | Acting Institute`,
    description: descriptions[locale],
    locale,
    path: '/talents',
    type: 'website',
  });
}

/**
 * Generate metadata for the home page
 */
export function generateHomeMetadata(locale: SupportedLocale): Metadata {
  const titles: Record<SupportedLocale, string> = {
    fr: 'Acting Institute Talents - Plateforme de Talents au Maroc',
    en: 'Acting Institute Talents - Talent Platform in Morocco',
    ar: 'معهد التمثيل للمواهب - منصة المواهب في المغرب',
  };

  return generatePageMetadata({
    title: titles[locale],
    description: DEFAULT_DESCRIPTION[locale],
    locale,
    path: '',
    type: 'website',
  });
}

/**
 * Get default description for a locale
 */
export function getDefaultDescription(locale: SupportedLocale): string {
  return DEFAULT_DESCRIPTION[locale];
}

/**
 * Get site name
 */
export function getSiteName(): string {
  return DEFAULT_SITE_NAME;
}
