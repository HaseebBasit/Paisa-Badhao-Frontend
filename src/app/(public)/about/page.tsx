'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Target,
  Eye,
  BookOpen,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-light">
      <PublicNavbar />

      {/* Hero Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-white via-emerald-50/30 to-surface-light border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-widest">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span>About Us</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-forest-900 tracking-tight leading-tight">
              About PAISA BADHAO
            </h1>

            <p className="text-xl font-serif text-emerald-800 font-medium">
              Empowering Pakistan’s Investors
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              PAISA BADHAO is a next-generation fintech and edtech platform designed to educate, empower, and enable
              Pakistanis to build generational wealth through smart investing, disciplined capital allocation, and
              market knowledge.
            </p>

            <div className="pt-2">
              <a
                href="#mission"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 hover:bg-forest-700 text-white text-sm font-medium transition-all"
              >
                <span>Our Mission</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* 4 Metrics Cards */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <p className="font-serif font-bold text-3xl text-emerald-700">100K+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Active Learners Target</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <p className="font-serif font-bold text-3xl text-emerald-700">10K+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Trades Simulated</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <p className="font-serif font-bold text-3xl text-emerald-700">5+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Verified Mentors</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <p className="font-serif font-bold text-3xl text-emerald-700">1 Goal</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Financial Freedom</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 rounded-3xl bg-surface-light border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-forest-900">Our Mission</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                To democratize financial education across Pakistan by offering accessible, high-quality learning
                resources, transparent PSX market simulation with 100,000 TROIX, and AI-guided mentoring that bridges
                the gap between theory and confident capital deployment.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface-light border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-forest-900">Our Vision</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                A financially empowered Pakistan where every citizen understands inflation protection, compound
                growth, and the role of the national equity market—enabling families to preserve their purchasing power
                and participate meaningfully in economic growth.
              </p>
            </div>
          </div>

          {/* Why Financial Literacy Matters */}
          <div className="mt-16 space-y-6">
            <h2 className="font-serif text-3xl font-bold text-forest-900">
              Why Financial Literacy Matters in Pakistan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-emerald-800">Defeating Inflation</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  With double-digit inflation rates historically common, holding uninvested cash guarantees a steady
                  erosion of living standards. Literacy equips individuals to identify productive assets.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-emerald-800">Overcoming Market Fear</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Misconceptions that the stock exchange is gambling prevent millions from benefiting from corporate
                  dividends and capital appreciation. Safe simulation removes the fear.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-emerald-800">Disciplined Risk Control</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Education teaches position sizing, diversification across banking, cement, and energy, and emotional
                  patience rather than chasing unvetted social media stock tips.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview with Real Photographs */}
      <section className="py-20 bg-surface-light border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">The Innovators</span>
          <h2 className="font-serif text-3xl font-bold text-forest-900 mt-2 mb-10">Our Leadership Team</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center gap-5 shadow-xs">
              <div className="relative w-20 h-24 rounded-2xl overflow-hidden shadow-xs border border-slate-100 shrink-0">
                <Image
                  src="/images/team-raof.jpg"
                  alt="Muhammad Raof"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-forest-900">Muhammad Raof</h3>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Team Lead</p>
                <p className="text-xs text-slate-500 mt-1">Driving technological architecture and system scalability.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex items-center gap-5 shadow-xs">
              <div className="relative w-20 h-24 rounded-2xl overflow-hidden shadow-xs border border-slate-100 shrink-0">
                <Image
                  src="/images/team-tooba.jpg"
                  alt="Tooba Rehman"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-forest-900">Tooba Rehman</h3>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Team Member</p>
                <p className="text-xs text-slate-500 mt-1">Creator and lead developer of the PAISA BADHAO experience.</p>
              </div>
            </div>
          </div>

          {/* Website Credit Callout */}
          <div className="mt-12 p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 max-w-xl mx-auto text-center">
            <p className="font-serif font-bold text-base text-emerald-900">
              This Website Is Made By Tooba Rehman.
            </p>
            <p className="text-xs text-emerald-800/80 mt-1">
              Conceived, designed, and developed to provide a premier Pakistani financial technology experience.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
