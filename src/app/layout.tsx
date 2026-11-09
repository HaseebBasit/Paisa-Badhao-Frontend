import type { Metadata } from 'next';
import './globals.css';
import IntroExperience from '@/components/intro/IntroExperience';
import PaisaDostChat from '@/components/ai/PaisaDostChat';

export const metadata: Metadata = {
  title: 'PAISA BADHAO — Invest. Learn. Grow.',
  description:
    'Apna Paisa Barhao, Samajhdari Se Lagao. Risk-free Pakistan Stock Exchange (PSX) virtual trading simulation with 100,000 TROIX starting capital, financial literacy courses, and AI mentoring.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Hide page content until the intro animation has completed. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.add('intro-pending');
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface-light text-forest-900 antialiased selection:bg-emerald-200 selection:text-forest-900">
        {/* Mandatory Full-Screen Opening Intro Experience */}
        <IntroExperience />

        {/* Global Page Content Container */}
        <div id="main-content-shell" className="flex-1 flex flex-col">
          {children}
        </div>

        {/* Global Floating AI Assistant: Paisa Dost */}
        <PaisaDostChat />
      </body>
    </html>
  );
}
