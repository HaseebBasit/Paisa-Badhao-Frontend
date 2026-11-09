'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import BrandLogo from '../layout/BrandLogo';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, wallet } = useAuthStore();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'How It Works', href: '/how-it-works' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <BrandLogo showTagline={true} />

        {/* Minimal Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs text-slate-500 font-medium">{user.name}</span>
                <span className="text-xs font-semibold text-emerald-700">
                  {wallet ? wallet.balance.toLocaleString() : '100,000'} TROIX
                </span>
              </div>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white text-sm font-medium flex items-center gap-2 shadow-sm transition-all hover:scale-102"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-forest-800 hover:text-emerald-700 px-4 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white text-sm font-medium flex items-center gap-2 shadow-sm transition-all hover:scale-102 hover:shadow-emerald-900/10"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-emerald-900/10 px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href) ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full bg-forest-800 text-white text-center text-sm font-medium"
              >
                Open Dashboard ({wallet?.balance.toLocaleString()} TROIX)
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full border border-forest-800 text-forest-800 text-center text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full bg-forest-800 text-white text-center text-sm font-medium"
                >
                  Sign Up (Get 100,000 TROIX)
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
