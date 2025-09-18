import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remote Control - Easy Picsy',
  description: 'Booth remote control interface',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RemoteControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}