import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { StorageProvider } from '@/components/StorageProvider';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: 'AWS Prep Buddy',
  description: 'Daily practice for the AWS Cloud Practitioner (CLF-C02) certification',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'AWS Prep' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A84FF',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body style={{ minHeight: '100dvh', background: '#000000' }}>
          <StorageProvider>{children}</StorageProvider>
        </body>
    </html>
  );
}
