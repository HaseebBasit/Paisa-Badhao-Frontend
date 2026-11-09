'use client';

import React, { useState } from 'react';
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
  Bell,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import BrandLogo from '../layout/BrandLogo';

export const DashboardNav: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, wallet, logout } = useAuthStore();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Virtual Trading', href: '/trading', icon: TrendingUp, highlight: true },
    { name: 'Portfolio & Ledger', href: '/portfolio', icon: PieChart },
    { name: 'Learn & Literacy', href: '/learn', icon: BookOpen },
    { name: 'Inflation Calculator', href: '/calculator', icon: Calculator },
    { name: 'Verified Mentors', href: '/experts', icon: Users },
    { name: 'Aaj Ka Jaiza', href: '/aaj-ka-jaiza', icon: Award },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 w-full bg-forest-900 border-b border-emerald-900/40 text-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation sidebar"
              className="lg:hidden p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-forest-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <BrandLogo variant="white" showTagline={false} />
          </div>

          {/* User TROIX Balance & Profile badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-forest-800 border border-emerald-500/40 shadow-xs">
              <WalletIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold tracking-wide text-white">
                {wallet ? wallet.balance.toLocaleString() : '100,000'}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">TROIX</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-emerald-800/40">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center font-bold text-xs text-white">
                {user ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-white leading-tight">{user ? user.name : 'Learner'}</p>
                <p className="text-[10px] text-emerald-300/80 leading-tight">Virtual Trader</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-forest-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer for Mobile & Persistent Sidebar for Desktop */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-forest-900 border-r border-emerald-900/30 text-slate-300 p-4 space-y-2 select-none">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
            Platform Menu
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-950/40'
                      : 'text-slate-300 hover:bg-forest-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-emerald-950/60">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-emerald-400 py-2 rounded-lg hover:bg-forest-800 transition-colors"
            >
              <span>Back to Public Website</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-xs bg-forest-900 h-full p-4 flex flex-col z-10 text-white shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
                <BrandLogo variant="white" />
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                        active ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:bg-forest-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto pt-4 border-t border-emerald-900/40">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 text-sm font-medium hover:bg-rose-950/30 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardNav;
