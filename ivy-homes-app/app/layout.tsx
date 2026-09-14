import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ivy Homes',
  description: 'Property search for the Ivy Homes internship assignment',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
