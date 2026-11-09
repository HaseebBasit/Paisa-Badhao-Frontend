import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-900 text-slate-300 border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-950/60">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo variant="white" showTagline={true} />
            <p className="text-slate-400 text-sm max-w-md leading-relaxed mt-3">
              PAISA BADHAO is Pakistan’s premier financial literacy and risk-free stock market simulation platform.
              Empowering individuals across the nation to learn equity investing, master portfolio management, and
              practice on real historical PSX data with 100,000 TROIX starting virtual capital.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider">
                Invest • Learn • Grow
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-white font-serif font-bold text-base mb-4 tracking-wide">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-emerald-400 transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Education & Simulator */}
          <div>
            <h4 className="text-white font-serif font-bold text-base mb-4 tracking-wide">Financial Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/learn" className="hover:text-emerald-400 transition-colors">
                  Learn & Literacy
                </Link>
              </li>
              <li>
                <Link href="/trading" className="hover:text-emerald-400 transition-colors">
                  Virtual Trading (Dark)
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-emerald-400 transition-colors">
                  Inflation Calculator
                </Link>
              </li>
              <li>
                <Link href="/experts" className="hover:text-emerald-400 transition-colors">
                  Verified Mentors
                </Link>
              </li>
              <li>
                <Link href="/aaj-ka-jaiza" className="hover:text-emerald-400 transition-colors">
                  Aaj Ka Jaiza
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Creator Credit & Regulatory Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col space-y-1 text-center md:text-left">
            <p className="text-sm font-serif font-bold text-emerald-400 tracking-wide">
              This Website Is Made By Tooba Rehman.
            </p>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Disclaimer: PAISA BADHAO is an educational simulation platform. TROIX is a simulated virtual currency with
              zero real-world cash equivalence. Simulated trading does not constitute financial advice or live broker
              execution.
            </p>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            &copy; {new Date().getFullYear()} PAISA BADHAO. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
