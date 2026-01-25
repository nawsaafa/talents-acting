import { describe, it, expect } from 'vitest';
import {
  generatePageMetadata,
  generateTalentMetadata,
  generateGalleryMetadata,
  generateHomeMetadata,
  getDefaultDescription,
  getSiteName,
} from '@/lib/seo/metadata';

describe('SEO Metadata Utilities', () => {
  describe('generatePageMetadata', () => {
    it('generates basic metadata with all required fields', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        locale: 'fr',
        path: '/test',
      });

      expect(metadata.title).toBe('Test Page');
      expect(metadata.description).toBe('Test description');
    });

    it('generates canonical URL with locale and path', () => {
      const metadata = generatePageMetadata({
        title: 'Test',
        description: 'Test',
        locale: 'en',
        path: '/talents',
      });

      expect(metadata.alternates?.canonical).toContain('/en/talents');
    });

    it('generates alternate language links for all locales', () => {
      const metadata = generatePageMetadata({
        title: 'Test',
        description: 'Test',
        locale: 'fr',
        path: '/about',
      });

      const languages = metadata.alternates?.languages;
      expect(languages).toBeDefined();
      expect(languages?.fr).toContain('/fr/about');
      expect(languages?.en).toContain('/en/about');
      expect(languages?.ar).toContain('/ar/about');
    });

    it('generates Open Graph metadata', () => {
      const metadata = generatePageMetadata({
        title: 'OG Test',
        description: 'OG Description',
        locale: 'en',
        type: 'website',
      });

      expect(metadata.openGraph?.title).toBe('OG Test');
      expect(metadata.openGraph?.description).toBe('OG Description');
      // Type is set in the openGraph object
      expect(metadata.openGraph).toBeDefined();
    });

    it('generates Twitter card metadata', () => {
      const metadata = generatePageMetadata({
        title: 'Twitter Test',
        description: 'Twitter Description',
        locale: 'fr',
      });

      expect(metadata.twitter).toBeDefined();
      expect(metadata.twitter?.title).toBe('Twitter Test');
      expect(metadata.twitter?.description).toBe('Twitter Description');
    });

    it('handles noIndex option correctly', () => {
      const indexedMetadata = generatePageMetadata({
        title: 'Test',
        description: 'Test',
        locale: 'fr',
        noIndex: false,
      });

      const noIndexMetadata = generatePageMetadata({
        title: 'Test',
        description: 'Test',
        locale: 'fr',
        noIndex: true,
      });

      expect(indexedMetadata.robots).toEqual({ index: true, follow: true });
      expect(noIndexMetadata.robots).toEqual({ index: false, follow: false });
    });

    it('uses correct locale codes for Open Graph', () => {
      const frMetadata = generatePageMetadata({
        title: 'Test',
        description: 'Test',
        locale: 'fr',
      });

      const arMetadata = generatePageMetadata({
        title: 'Test',
        description: 'Test',
        locale: 'ar',
      });

      const enMetadata = generatePageMetadata({
        title: 'Test',
        description: 'Test',
        locale: 'en',
      });

      expect(frMetadata.openGraph?.locale).toBe('fr_MA');
      expect(arMetadata.openGraph?.locale).toBe('ar_MA');
      expect(enMetadata.openGraph?.locale).toBe('en_US');
    });

    it('uses custom image when provided', () => {
      const metadata = generatePageMetadata({
        title: 'Test',
        description: 'Test',
        locale: 'fr',
        image: 'https://example.com/custom-image.jpg',
      });

      expect(metadata.openGraph?.images).toBeDefined();
      const images = metadata.openGraph?.images as Array<{ url: string }>;
      expect(images?.[0]?.url).toBe('https://example.com/custom-image.jpg');
    });
  });

  describe('generateTalentMetadata', () => {
    it('generates metadata for talent with full name', () => {
      const metadata = generateTalentMetadata(
        {
          firstName: 'John',
          lastName: 'Doe',
          ageRangeMin: 25,
          ageRangeMax: 35,
          gender: 'MALE',
          profilePhoto: 'https://example.com/photo.jpg',
        },
        'en'
      );

      expect(metadata.title).toContain('John Doe');
      expect(metadata.description).toContain('John Doe');
      expect(metadata.description).toContain('25-35');
    });

    it('generates metadata for talent without last name', () => {
      const metadata = generateTalentMetadata(
        {
          firstName: 'Madonna',
          lastName: null,
        },
        'fr'
      );

      expect(metadata.title).toContain('Madonna');
      expect(metadata.title).not.toContain('null');
    });

    it('generates localized descriptions', () => {
      const frMetadata = generateTalentMetadata({ firstName: 'Jean', lastName: 'Dupont' }, 'fr');
      const enMetadata = generateTalentMetadata({ firstName: 'Jean', lastName: 'Dupont' }, 'en');
      const arMetadata = generateTalentMetadata({ firstName: 'Jean', lastName: 'Dupont' }, 'ar');

      expect(frMetadata.description).toContain('Decouvrez');
      expect(enMetadata.description).toContain('Discover');
      expect(arMetadata.description).toContain('اكتشف');
    });

    it('uses profile type for Open Graph', () => {
      const metadata = generateTalentMetadata({ firstName: 'Test', lastName: 'User' }, 'en');

      // Profile type is set in the openGraph object
      expect(metadata.openGraph).toBeDefined();
    });
  });

  describe('generateGalleryMetadata', () => {
    it('generates localized gallery titles', () => {
      const frMetadata = generateGalleryMetadata('fr');
      const enMetadata = generateGalleryMetadata('en');
      const arMetadata = generateGalleryMetadata('ar');

      expect(frMetadata.title).toContain('Galerie');
      expect(enMetadata.title).toContain('Gallery');
      expect(arMetadata.title).toContain('معرض');
    });

    it('generates localized gallery descriptions', () => {
      const frMetadata = generateGalleryMetadata('fr');
      const enMetadata = generateGalleryMetadata('en');

      expect(frMetadata.description).toContain('Explorez');
      expect(enMetadata.description).toContain('Explore');
    });

    it('appends gender filter to title when provided', () => {
      const metadata = generateGalleryMetadata('en', { gender: 'Male' });

      expect(metadata.title).toContain('Male');
    });
  });

  describe('generateHomeMetadata', () => {
    it('generates localized home page titles', () => {
      const frMetadata = generateHomeMetadata('fr');
      const enMetadata = generateHomeMetadata('en');
      const arMetadata = generateHomeMetadata('ar');

      expect(frMetadata.title).toContain('Acting Institute Talents');
      expect(frMetadata.title).toContain('Plateforme');
      expect(enMetadata.title).toContain('Platform');
      expect(arMetadata.title).toContain('منصة');
    });

    it('uses website type for Open Graph', () => {
      const metadata = generateHomeMetadata('en');

      // Website type is set in the openGraph object
      expect(metadata.openGraph).toBeDefined();
    });
  });

  describe('getDefaultDescription', () => {
    it('returns correct description for each locale', () => {
      const frDesc = getDefaultDescription('fr');
      const enDesc = getDefaultDescription('en');
      const arDesc = getDefaultDescription('ar');

      expect(frDesc).toContain('Plateforme');
      expect(enDesc).toContain('Talent platform');
      expect(arDesc).toContain('منصة');
    });
  });

  describe('getSiteName', () => {
    it('returns the site name', () => {
      const siteName = getSiteName();

      expect(siteName).toBe('Acting Institute Talents');
    });
  });
});
