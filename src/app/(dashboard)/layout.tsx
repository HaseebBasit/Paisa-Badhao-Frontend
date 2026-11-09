'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  PieChart,
  Calculator,
  Award,
  Users,
  LogOut,
  Menu,
  X,
  Wallet as WalletIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import BrandLogo from '@/components/layout/BrandLogo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, wallet, loadSession, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('pb_token') : null;
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        await loadSession();
      } catch (err) {
        console.warn('Session load failed:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    initAuth();
  }, [loadSession, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Virtual Trading', href: '/trading', icon: TrendingUp, badge: 'Live PSX' },
    { name: 'Portfolio & Ledger', href: '/portfolio', icon: PieChart },
    { name: 'Learn & Literacy', href: '/learn', icon: BookOpen, badge: '10 Modules' },
    { name: 'Inflation Calculator', href: '/calculator', icon: Calculator },
    { name: 'Verified Mentors', href: '/experts', icon: Users },
    { name: 'Aaj Ka Jaiza', href: '/aaj-ka-jaiza', icon: Award, badge: 'Daily' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isNavActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const isDarkTerminal = pathname === '/trading';

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen bg-surface-light flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-md animate-pulse">
            PB
          </div>
          <h3 className="font-serif text-lg font-bold text-forest-900">
            Loading PAISA BADHAO Workspace...
          </h3>
          <p className="text-xs text-slate-500">
            Securing virtual ledger session and retrieving real-time portfolio balance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-surface-light text-forest-900 select-none">
      {/* 1. PERMANENTLY FIXED TOP HEADER */}
      <header className="h-16 shrink-0 w-full bg-forest-900 border-b border-emerald-900/40 text-white shadow-sm z-40 relative select-none">
        <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation drawer"
              className="lg:hidden p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-forest-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <BrandLogo variant="white" showTagline={false} />
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-emerald-800/40 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-semibold">PSX Simulation Active</span>
              <span className="text-emerald-500/70 text-[10px] uppercase tracking-wider font-mono">
                (August 2026 Sequential Dataset)
              </span>
            </div>
          </div>

          {/* User TROIX Balance, Terminal Quick Action, User Profile & Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800 border border-emerald-500/40 shadow-xs">
              <WalletIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold tracking-wide text-white">
                {wallet ? wallet.balance.toLocaleString() : '100,000'}
              </span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                TROIX
              </span>
            </div>

            <Link
              href="/trading"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
            >
              <span>Terminal</span>
              <ArrowRight className="w-3 h-3 text-emerald-300" />
            </Link>

            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-emerald-800/40">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400/80 flex items-center justify-center font-bold text-xs text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-white leading-tight">
                  {user?.name || 'Investor'}
                </p>
                <p className="text-[10px] text-emerald-300/80 leading-tight">Virtual Trader</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-forest-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY CONTAINER: Pinned Sidebar on Left + Independently Scrolling Main Content on Right */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* 2A. PERMANENTLY FIXED DESKTOP SIDEBAR: Full available height, never scrolls with content */}
        <aside
          aria-label="Dashboard Navigation Sidebar"
          className="hidden lg:flex flex-col w-64 shrink-0 h-full bg-forest-900 border-r border-emerald-900/30 text-slate-300 p-4 space-y-3 select-none justify-between overflow-y-auto z-20"
        >
          <div className="space-y-3">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Navigation Menu
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = isNavActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-300 hover:bg-forest-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          active
                            ? 'bg-emerald-800 text-white'
                            : 'bg-forest-800 text-emerald-300 border border-emerald-700/50'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Card: Paisa Dost AI Mentoring */}
          <div className="space-y-3 pt-4 border-t border-emerald-900/40">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 border border-emerald-600/30 text-white space-y-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Paisa Dost AI</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Ask questions about PSX trends, inflation, or valuation strategies in Urdu or English.
              </p>
            </div>

            <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SECP-Aligned</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* 2B. MOBILE SLIDE-OUT DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-xs bg-forest-900 h-full p-4 flex flex-col z-10 text-white shadow-2xl justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
                  <BrandLogo variant="white" size="sm" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-forest-800 border border-emerald-500/40">
                  <WalletIcon className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Virtual Balance
                    </p>
                    <p className="text-sm font-bold text-white">
                      {wallet ? wallet.balance.toLocaleString() : '100,000'}{' '}
                      <span className="text-emerald-400 text-xs">TROIX</span>
                    </p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const active = isNavActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          active
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-forest-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-forest-950 text-emerald-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-emerald-900/40 space-y-2">
                <div className="px-3 py-2 text-xs text-slate-400">
                  Logged in as <span className="text-white font-semibold">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-rose-400 text-xs font-semibold hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2C. INDEPENDENTLY SCROLLING MAIN CONTENT CANVAS: Only this area scrolls vertically! */}
        <main
          id="dashboard-main-content"
          className={`flex-1 h-full min-w-0 overflow-y-auto overflow-x-hidden select-text ${
            isDarkTerminal ? 'bg-[#070C0A]' : 'bg-surface-light'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
