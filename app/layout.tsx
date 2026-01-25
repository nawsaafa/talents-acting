import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talents Acting',
  description: 'Talent management platform for actors, comedians, and performers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
