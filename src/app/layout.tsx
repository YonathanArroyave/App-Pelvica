import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PinLockGate } from '@/components/auth/PinLockGate';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'PelvicRehab - 12 Semanas',
  description: 'Rehabilitación Pélvica Neuromuscular y Salud Sexual Masculina (Reto Clínico 12 Semanas)',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PelvicRehab',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#090A0F',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark bg-[#090A0F]">
      <body className="bg-[#090A0F] text-[#F0F4F8] antialiased min-h-screen">
        <PinLockGate>{children}</PinLockGate>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
