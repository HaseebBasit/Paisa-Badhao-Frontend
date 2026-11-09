'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Brain,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  PieChart,
} from 'lucide-react';
import { api } from '@/utils/api';
import { DailyEvaluation } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function AajKaJaizaPage() {
  const { user } = useAuthStore();
  const [evaluation, setEvaluation] = useState<DailyEvaluation | null>(null);
  const [quiz, setQuiz] = useState<any | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEvaluationAndQuiz();
  }, [user]);

  const loadEvaluationAndQuiz = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const evalRes: any = await api.get('/evaluations/today');
        setEvaluation(evalRes.data);
      } else {
        // Guest Demo preview
        setEvaluation({
          _id: 'guest',
          date: new Date().toISOString().split('T')[0],
          score: 92,
          grade: 'A+',
          tradingDiscipline: 88,
          riskManagement: 94,
          portfolioDiversification: 90,
          indicators: ['Diversified Portfolio', 'Positive Return', 'Good Risk Control'],
          aiFeedback:
            'Your virtual portfolio maintains healthy allocation across MEBL, LUCK, and FFC with prudent risk mitigation and consistent profit extraction.',
          tradeCount: 6,
          quizCompleted: false,
          quizScore: 0,
        });
      }

      const quizRes: any = await api.get('/evaluations/quiz');
      setQuiz(quizRes.data);
    } catch (err) {
      console.warn('Failed to load evaluation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer === null || !quiz) return;
    setQuizSubmitted(true);
    if (selectedQuizAnswer === quiz.correctAnswerIndex) {
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (c) {}
    }
  };

  const score = evaluation?.score || 92;
  const grade = evaluation?.grade || 'A+';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-forest-900 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest border border-emerald-500/30">
              Daily Evaluation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Aaj Ka Jaiza
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Check your daily performance, get tailored AI feedback based on your actual PSX trades, and test your
              discipline with our daily quiz.
            </p>
          </div>
        </div>

        {/* Showcase Trophy & Performance Scoreboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Trophy Hero Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white p-8 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-forest-900 border-2 border-emerald-500/30 shadow-lg flex items-center justify-center text-emerald-400">
                <Trophy className="w-16 h-16 text-gold-400" />
              </div>
              <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-forest-800 text-emerald-400 font-serif font-bold text-xs border border-emerald-400/40 shadow-xs">
                Top Tier
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-2xl text-forest-900">Disciplined Execution</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Consistency, sector diversification, and emotional composure earn top tier Jaiza rankings.
              </p>
            </div>

            <a
              href="#ai-feedback"
              className="px-6 py-2.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <span>View Detailed Report</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>

          {/* Right Circular Gauge & Checklist Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Your Performance</span>
              <span className="text-xs text-slate-400">{evaluation?.date || 'Today'}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Circular Gauge */}
              <div className="relative w-36 h-36 rounded-full border-8 border-emerald-500/20 border-t-emerald-600 flex flex-col items-center justify-center shrink-0 shadow-inner">
                <span className="font-serif font-black text-3xl text-emerald-700">{grade}</span>
                <span className="text-xs font-bold text-slate-600">{score}%</span>
              </div>

              {/* Checklist Badges */}
              <div className="space-y-3 flex-1 w-full">
                {(evaluation?.indicators || ['Diversified Portfolio', 'Positive Return', 'Good Risk Control']).map(
                  (ind) => (
                    <div
                      key={ind}
                      className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3 text-xs font-semibold text-emerald-900"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{ind}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 3 Component Score Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Discipline</span>
                  <span className="text-emerald-700">{evaluation?.tradingDiscipline || 85}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${evaluation?.tradingDiscipline || 85}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Risk Control</span>
                  <span className="text-emerald-700">{evaluation?.riskManagement || 90}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${evaluation?.riskManagement || 90}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Diversification</span>
                  <span className="text-emerald-700">{evaluation?.portfolioDiversification || 88}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${evaluation?.portfolioDiversification || 88}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Performance Feedback Section */}
        <section id="ai-feedback" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-emerald-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-forest-900">
                Paisa Dost AI Performance Feedback
              </h3>
              <p className="text-xs text-slate-500">Synthesized from your actual transaction records</p>
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {evaluation?.aiFeedback ||
              'Welcome to PAISA BADHAO! Your starting capital of 100,000 TROIX is primed and ready. Start by purchasing 2 to 3 quality PSX equities across diverse sectors to begin generating real performance metrics!'}
          </p>
        </section>

        {/* Daily Quiz Challenge */}
        {quiz && (
          <section className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-xl text-forest-900">Daily Knowledge Challenge</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">{quiz.date}</span>
            </div>

            <p className="font-serif font-bold text-base text-forest-900">{quiz.question}</p>

            <div className="space-y-2.5">
              {quiz.options.map((opt: string, i: number) => {
                const isSelected = selectedQuizAnswer === i;
                let optClass = 'bg-white border-slate-200 hover:border-emerald-500 text-slate-700';

                if (quizSubmitted) {
                  if (i === quiz.correctAnswerIndex) {
                    optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                  } else if (isSelected && i !== quiz.correctAnswerIndex) {
                    optClass = 'bg-rose-50 border-rose-400 text-rose-800';
                  }
                } else if (isSelected) {
                  optClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                }

                return (
                  <button
                    key={i}
                    disabled={quizSubmitted}
                    onClick={() => setSelectedQuizAnswer(i)}
                    className={`w-full text-left p-4 rounded-2xl text-xs border transition-all flex items-center justify-between cursor-pointer ${optClass}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && i === quiz.correctAnswerIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && quiz.explanation && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                <strong className="font-serif">Explanation: </strong>
                {quiz.explanation}
              </div>
            )}

            {!quizSubmitted && (
              <button
                onClick={handleQuizSubmit}
                disabled={selectedQuizAnswer === null}
                className="px-7 py-3 rounded-full bg-forest-800 hover:bg-forest-700 disabled:opacity-40 text-white font-bold text-xs tracking-wider uppercase transition-all"
              >
                Submit Daily Quiz
              </button>
            )}
          </section>
        )}
    </div>
  );
}
