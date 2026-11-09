'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  ShieldCheck,
  PiggyBank,
  Building2,
  Award,
} from 'lucide-react';
import { api } from '@/utils/api';
import { LearningModule } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function LearnIndexPage() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadModules();
  }, [user]);

  const loadModules = async () => {
    setIsLoading(true);
    try {
      const res: any = await api.get('/learning/modules');
      setModules(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch modules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-6 h-6 text-emerald-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'Percent':
        return <Percent className="w-6 h-6 text-emerald-600" />;
      case 'PiggyBank':
        return <PiggyBank className="w-6 h-6 text-emerald-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-forest-900 to-forest-800 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest border border-emerald-500/30">
              Structured Education
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Learn & Financial Literacy
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Build your financial knowledge with easy-to-understand resources. Master the Pakistan Stock Exchange,
              inflation defense, and intelligent risk management with interactive quizzes.
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-forest-900">Curated Learning Modules</h2>
            <span className="text-xs font-semibold text-slate-500">{modules.length} Modules Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => {
              const isCompleted = m.progress?.isCompleted;
              const percent = m.progress?.progressPercent || 0;

              return (
                <div
                  key={m.slug}
                  className="rounded-3xl bg-white border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-600 hover:shadow-lg transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        {getIcon(m.icon)}
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                        {m.level}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg text-forest-900 group-hover:text-emerald-700 transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed mt-1.5 line-clamp-2">
                        {m.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-500">Progress</span>
                        <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-700'}>
                          {isCompleted ? 'Completed' : `${percent}%`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs mt-6">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {m.estimatedTime}
                    </span>

                    <Link
                      href={`/learn/${m.slug}`}
                      className="px-4 py-2 rounded-full bg-forest-800 hover:bg-forest-700 text-white font-medium flex items-center gap-1.5 transition-all shadow-2xs group-hover:bg-emerald-600"
                    >
                      <span>{isCompleted ? 'Review Module' : percent > 0 ? 'Continue' : 'Start Module'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}
