'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  Coins,
  BookOpen,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Award,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import MarketTicker from '@/components/navigation/MarketTicker';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const { user, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-light">
      {/* Minimal Public Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-emerald-50/20 to-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300/40 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                <span>PAISA BADHAO</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-900 leading-[1.15] tracking-tight">
                Invest Smarter. <br />
                <span className="text-emerald-700 italic">Learn Before You Earn.</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Explore the Pakistan Stock Exchange (PSX) with risk-free virtual trading, learn financial literacy, and
                grow your financial knowledge using <strong className="text-forest-900 font-semibold">100,000 TROIX</strong> virtual currency.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={user ? '/trading' : '/register'}
                  className="px-8 py-4 rounded-full bg-forest-800 hover:bg-forest-700 text-white font-medium text-base flex items-center gap-2.5 shadow-lg shadow-forest-950/20 transition-all hover:scale-102"
                >
                  <span>Start Trading Now</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-forest-900 font-medium text-base border border-slate-200 shadow-xs transition-all hover:border-emerald-600"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust Subtext */}
              <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100,000 TROIX Free
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real PSX August 2026 Data
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Financial Risk
                </span>
              </div>
            </div>

            {/* Right Column: PSX Visual Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-forest-900 to-forest-800 p-6 text-white">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">PSX Terminal</p>
                      <p className="text-[11px] text-slate-300">Pakistan Stock Exchange</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                    KSE-100: +1.24%
                  </span>
                </div>

                {/* Simulated Stock Ticker Cards */}
                <div className="my-6 space-y-3">
                  <div className="p-3 rounded-2xl bg-forest-950/70 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-sm text-white">MEBL • Meezan Bank</p>
                      <p className="text-[11px] text-slate-400">Islamic Commercial Banking</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm text-emerald-400">295.50</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">+0.98%</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-forest-950/70 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-sm text-white">LUCK • Lucky Cement</p>
                      <p className="text-[11px] text-slate-400">Construction & Materials</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm text-white">829.00</p>
                      <p className="text-[10px] text-rose-400 font-semibold">-0.21%</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-forest-950/70 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-sm text-white">FFC • Fauji Fertilizer</p>
                      <p className="text-[11px] text-slate-400">Chemicals & Agribusiness</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm text-emerald-400">415.78</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">+1.32%</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Capital Pill */}
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-400/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
                      Starting Virtual Portfolio
                    </span>
                    <span className="text-xl font-bold font-mono text-white">100,000 TROIX</span>
                  </div>
                  <Link
                    href={user ? '/trading' : '/register'}
                    className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-forest-950 text-xs font-bold tracking-wide transition-all"
                  >
                    Trade Free
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Platform Highlights Cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-600 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900 mb-1">100,000 TROIX</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Every newly registered learner receives 100,000 TROIX virtual capital to begin risk-free equity trading.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-600 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900 mb-1">Virtual Trading</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Practice on authentic sequential historical PSX candle feeds with interactive controls and real order execution.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-600 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900 mb-1">Financial Education</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Structured interactive modules covering budgeting, inflation, compounding, and fundamental stock valuation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-600 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900 mb-1">Expert Guidance</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Connect with verified SECP advisors and market analysts, book 1-on-1 consultations, and track daily evaluations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Market Ticker */}
      <MarketTicker position="top" />

      {/* About PAISA BADHAO Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">About PAISA BADHAO</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 leading-tight">
                Empowering Pakistan’s Next Generation of Investors
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                PAISA BADHAO is a next-generation fintech and edtech platform designed to educate, empower, and enable
                Pakistanis to build long-term generational wealth through smart investing, financial literacy, and
                hands-on market knowledge.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <p className="font-serif font-bold text-2xl text-emerald-800">100,000</p>
                  <p className="text-xs text-slate-600 font-medium">Starting TROIX Capital</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <p className="font-serif font-bold text-2xl text-emerald-800">100% Risk-Free</p>
                  <p className="text-xs text-slate-600 font-medium">Virtual Equity Simulation</p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-forest-900 hover:text-emerald-700 transition-colors"
                >
                  <span>Read our full mission</span>
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </Link>
              </div>
            </div>

            {/* Visual Callout Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-gradient-to-br from-forest-800 to-forest-900 text-white p-8">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  Financial Freedom For Pakistan
                </span>
                <h3 className="font-serif text-2xl font-bold text-white leading-snug">
                  Learn Before You Earn. Invest With Confidence.
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Most people in Pakistan refrain from participating in the stock market due to fear of the unknown or
                  lack of practical exposure. PAISA BADHAO eliminates that barrier entirely by simulating real-world PSX
                  trading conditions.
                </p>
                <div className="pt-4 border-t border-emerald-800/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Created with dedication by</p>
                    <p className="text-sm font-serif font-bold text-emerald-400">Tooba Rehman</p>
                  </div>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                  >
                    Join Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 4-Step Preview Section */}
      <section className="py-20 bg-surface-light border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">Simple Process</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-2 mb-4">
            How It Works — Get Started in 4 Simple Steps
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-14">
            Follow a proven path from beginner curiosity to disciplined virtual investor.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-forest-800 text-emerald-400 flex items-center justify-center font-serif text-xl font-bold mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900 mb-2">Sign Up</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Create your free learner account and immediately receive 100,000 TROIX virtual trading capital.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-forest-800 text-emerald-400 flex items-center justify-center font-serif text-xl font-bold mb-4 shadow-sm">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900 mb-2">Learn</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Explore PSX basics, candlestick analysis, risk management, and inflation protection modules.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-forest-800 text-emerald-400 flex items-center justify-center font-serif text-xl font-bold mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900 mb-2">Trade</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Practice buy and sell execution on MEBL, LUCK, FFC, SAZEW, and PSO with our dark trading terminal.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-forest-800 text-emerald-400 flex items-center justify-center font-serif text-xl font-bold mb-4 shadow-sm">
                4
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900 mb-2">Grow</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Review your Aaj Ka Jaiza score, receive Paisa Dost AI feedback, and build disciplined investing habits.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href={user ? '/trading' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white font-medium text-sm shadow-md transition-all hover:scale-102"
            >
              <span>Learn Today, Invest Better Tomorrow</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Preview Section with Real Photographs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">Dedicated Leadership</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-2 mb-4">
            Meet the Minds Behind PAISA BADHAO
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-12">
            A committed team pioneering financial literacy and technological innovation for Pakistan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* ABDUL RAOF */}
            <div className="p-8 rounded-3xl bg-surface-light border border-slate-200/80 text-center hover:border-emerald-600 transition-all hover:shadow-lg flex flex-col items-center">
              <div className="relative w-28 h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white mb-4">
                <Image
                  src="/images/team-raof.jpg"
                  alt="ABDUL RAOF"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="font-serif font-bold text-xl text-forest-900">ABDUL RAOF</h3>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mt-1 mb-3">
                Team Lead
              </p>
              <p className="text-slate-600 text-xs leading-relaxed">
                Guiding architectural strategy, system resilience, and institutional product vision.
              </p>
            </div>

            {/* Tooba Rehman */}
            <div className="p-8 rounded-3xl bg-surface-light border border-slate-200/80 text-center hover:border-emerald-600 transition-all hover:shadow-lg flex flex-col items-center">
              <div className="relative w-28 h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white mb-4">
                <Image
                  src="/images/team-tooba.jpg"
                  alt="Tooba Rehman"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="font-serif font-bold text-xl text-forest-900">Tooba Rehman</h3>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mt-1 mb-3">
                Team Member
              </p>
              <p className="text-slate-600 text-xs leading-relaxed">
                Platform designer and creator driving UI/UX excellence, user workflows, and financial literacy curricula.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest-900 hover:text-emerald-700 transition-colors"
            >
              <span>Explore Dedicated Team Page</span>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-20 bg-forest-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest border border-emerald-500/30">
            Apna Paisa Barhao, Samajhdari Se Lagao
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
            Ready to Begin Your PSX Investing Journey?
          </h2>

          <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
            Register today, claim your 100,000 TROIX virtual capital, and master the stock market with risk-free practice.
          </p>

          <div className="pt-4">
            <Link
              href={user ? '/trading' : '/register'}
              className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-base inline-flex items-center gap-2 shadow-xl shadow-emerald-950/50 transition-all hover:scale-105"
            >
              <span>{user ? 'Open Trading Terminal' : 'Claim 100,000 TROIX & Start Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
