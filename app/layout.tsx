import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoyageAI - AI Travel Planner',
  description: 'Plan your perfect trip with AI-powered travel itineraries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  );
}