import type { Thing, WithContext, Organization, Person, WebSite, BreadcrumbList } from 'schema-dts';

// Base URL for the site
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://actinginstitute.ma';

/**
 * Generate Organization structured data for the talent agency
 */
export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Acting Institute Talents',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Talent platform for actors, comedians and performers in Morocco',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
      addressLocality: 'Casablanca',
    },
    sameAs: [],
  };
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Acting Institute Talents',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/talents?search={search_term_string}`,
    } as unknown as WebSite['potentialAction'],
  };
}

/**
 * Generate Person structured data for a talent profile
 */
export function generateTalentSchema(talent: {
  firstName: string;
  lastName?: string | null;
  gender?: string | null;
  profilePhoto?: string | null;
  bio?: string | null;
  skills?: string[];
}): WithContext<Person> {
  const name = talent.lastName ? `${talent.firstName} ${talent.lastName}` : talent.firstName;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    givenName: talent.firstName,
    familyName: talent.lastName || undefined,
    gender: talent.gender || undefined,
    image: talent.profilePhoto || undefined,
    description: talent.bio || undefined,
    jobTitle: 'Actor',
    worksFor: {
      '@type': 'Organization',
      name: 'Acting Institute Talents',
    },
    knowsAbout: talent.skills || [],
  };
}

/**
 * Generate BreadcrumbList structured data for navigation
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Convert structured data to JSON-LD script tag content
 */
export function toJsonLd<T extends Thing>(data: WithContext<T>): string {
  return JSON.stringify(data);
}

/**
 * Generate JSON-LD script element props for Next.js
 */
export function getJsonLdScript<T extends Thing>(
  data: WithContext<T>
): { type: string; dangerouslySetInnerHTML: { __html: string } } {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: toJsonLd(data),
    },
  };
}
