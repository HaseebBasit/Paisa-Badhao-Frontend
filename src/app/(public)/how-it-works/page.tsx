'use client';

import React from 'react';
import Link from 'next/link';
import {
  UserPlus,
  BookOpen,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Coins,
} from 'lucide-react';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';

export default function HowItWorksPage() {
  const { user } = useAuthStore();

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      subtitle: 'Create your free account',
      description:
        'Register your account in less than 30 seconds. Upon registration, you are immediately credited with exactly 100,000 TROIX virtual trading capital—completely risk-free.',
      icon: UserPlus,
      highlight: '100,000 TROIX Credited Once',
    },
    {
      number: '02',
      title: 'Learn',
      subtitle: 'Explore PSX & financial concepts',
      description:
        'Access interactive modules covering the Pakistan Stock Exchange (PSX), KSE-100 index structure, order types, candlestick charting, and inflation mitigation tactics.',
      icon: BookOpen,
      highlight: 'Self-Paced Quizzes & Certificates',
    },
    {
      number: '03',
      title: 'Trade',
      subtitle: 'Practice with 100,000 TROIX',
      description:
        'Open our dark-themed Trading Terminal. Analyze sequential August 2026 historical candlestick movements for MEBL, LUCK, FFC, SAZEW, and PSO with buy/sell execution.',
      icon: TrendingUp,
      highlight: 'Real Historical Simulation',
    },
    {
      number: '04',
      title: 'Grow',
      subtitle: 'Improve your portfolio with smart decisions',
      description:
        'Track your Aaj Ka Jaiza score, evaluate diversification across banking, cement, and energy sectors, and receive personalized AI recommendations from Paisa Dost.',
      icon: Award,
      highlight: 'AI Mentoring & Daily Analysis',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-light">
      <PublicNavbar />

      {/* Hero Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-white via-emerald-50/20 to-surface-light border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">Platform Blueprint</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-forest-900 mt-2 mb-4 tracking-tight">
            How It Works
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
            Get started in just a few simple steps. Master stock trading without ever putting real money on the line.
          </p>
        </div>
      </section>

      {/* 4 Steps Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col lg:flex-row items-center gap-10 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Step Card Visual */}
                  <div className="w-full lg:w-1/2 p-8 rounded-3xl bg-surface-light border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-600 transition-all">
                    <div className="absolute top-4 right-6 font-serif font-black text-6xl text-emerald-900/10 select-none">
                      {step.number}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-forest-800 text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
                      {step.highlight}
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-forest-900 mb-1">{step.title}</h3>
                    <p className="text-sm font-serif font-medium text-emerald-800 mb-4">{step.subtitle}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                  </div>

                  {/* Step Explanatory Checklist */}
                  <div className="w-full lg:w-1/2 space-y-4 px-4">
                    <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                      Phase {step.number} Highlights
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-forest-900">
                      Why this step matters in your journey
                    </h4>
                    <ul className="space-y-3 pt-2">
                      <li className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Designed to eliminate real financial downside while preserving realistic market mechanics.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Builds verifiable data in MongoDB that feeds directly into your personal Aaj Ka Jaiza evaluation.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Gives you hands-on muscle memory before navigating real brokerage platforms.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trophy Bottom Banner */}
          <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-500/20">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 shrink-0">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Learn Today, Invest Better Tomorrow
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Start trading PSX stocks with 100,000 TROIX virtual capital.
                </p>
              </div>
            </div>

            <Link
              href={user ? '/trading' : '/register'}
              className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-sm tracking-wide shrink-0 transition-all hover:scale-105"
            >
              Start Now →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
