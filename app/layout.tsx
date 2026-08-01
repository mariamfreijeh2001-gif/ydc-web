import type { Metadata, Viewport } from 'next';
import { Rethink_Sans } from 'next/font/google';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { StructuredData } from '@/components/StructuredData';
import { site } from '@/content/site';
import '@/styles/globals.css';

// The WordPress theme used Rethink Sans at 400/500/600/700.
const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  // Icons come from app/icon.png and app/apple-icon.png (the clinic's own logo mark,
  // the same artwork the WordPress site used), which Next links automatically.
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#004A5E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rethinkSans.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
        <StructuredData />
      </body>
    </html>
  );
}
