import type { Metadata, Viewport } from 'next';
import { TranslationProvider } from '@/components/i18n';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { SessionProvider } from '@/components/auth';
import { routing, type Locale } from '@/i18n/routing';
import { getDirection } from '@/i18n/config';
import { getSiteName, getDefaultDescription } from '@/lib/seo/metadata';
import '@/styles/rtl.css';

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

// Base metadata for the application
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://actinginstitute.ma'),
  title: {
    default: getSiteName(),
    template: `%s | ${getSiteName()}`,
  },
  description: getDefaultDescription('fr'),
  applicationName: getSiteName(),
  authors: [{ name: 'Acting Institute' }],
  generator: 'Next.js',
  keywords: [
    'acting',
    'talents',
    'actors',
    'Morocco',
    'casting',
    'comedians',
    'performers',
    'Maroc',
    'acteurs',
  ],
  creator: 'Acting Institute',
  publisher: 'Acting Institute',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: getSiteName(),
    locale: 'fr_MA',
    alternateLocale: ['en_US', 'ar_MA'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@actinginstitute',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification tokens when available
    // google: 'verification-token',
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Load messages directly for the current locale
  const messages = (await import(`@/messages/${locale}.json`)).default;

  // Get text direction for the locale
  const dir = getDirection(locale as Locale);

  return (
    <div dir={dir} className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>
      <TranslationProvider locale={locale} messages={messages}>
        <SessionProvider>
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </TranslationProvider>
    </div>
  );
}
