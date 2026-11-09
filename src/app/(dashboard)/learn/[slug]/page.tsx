'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/utils/api';
import { LearningModule, Lesson, QuizQuestion } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function ModuleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user } = useAuthStore();

  const [moduleData, setModuleData] = useState<LearningModule | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'lessons' | 'quiz'>('lessons');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScoreResult, setQuizScoreResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      loadModule();
    }
  }, [slug]);

  const loadModule = async () => {
    try {
      const res: any = await api.get(`/learning/modules/${slug}`);
      setModuleData(res.data.module);
      setCompletedLessonIds(res.data.progress?.completedLessons || []);
    } catch (err) {
      console.warn('Failed to load module:', err);
    }
  };

  const handleCompleteCurrentLesson = async () => {
    if (!moduleData) return;
    const currentLesson = moduleData.lessons[activeLessonIndex];

    try {
      if (user) {
        await api.post('/learning/lesson/complete', {
          slug,
          lessonId: currentLesson.id,
        });
      }

      if (!completedLessonIds.includes(currentLesson.id)) {
        setCompletedLessonIds([...completedLessonIds, currentLesson.id]);
      }

      if (activeLessonIndex < moduleData.lessons.length - 1) {
        setActiveLessonIndex(activeLessonIndex + 1);
      } else {
        // Switch to Quiz when all lessons finished
        setActiveTab('quiz');
      }
    } catch (err) {
      console.warn('Failed to save lesson progress:', err);
    }
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!moduleData || !moduleData.quiz) return;

    const answersArray = moduleData.quiz.map((_, idx) => selectedAnswers[idx] ?? -1);

    if (answersArray.includes(-1)) {
      alert('Please answer all quiz questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (user) {
        const res: any = await api.post('/learning/quiz/submit', {
          slug,
          answers: answersArray,
        });
        setQuizScoreResult(res.data);
      } else {
        // Guest mode scoring
        let correct = 0;
        moduleData.quiz.forEach((q, i) => {
          if (answersArray[i] === q.correctAnswerIndex) correct++;
        });
        const pct = Math.round((correct / moduleData.quiz.length) * 100);
        setQuizScoreResult({ percentage: pct, passed: pct >= 70 });
      }

      setQuizSubmitted(true);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (c) {}
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScoreResult(null);
  };

  if (!moduleData) {
    return (
      <div className="p-12 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading module content...</p>
      </div>
    );
  }

  const currentLesson: Lesson = moduleData.lessons[activeLessonIndex] || moduleData.lessons[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Modules</span>
          </Link>

          {/* Tab Switcher: Lessons vs Quiz */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'lessons' ? 'bg-forest-800 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Lessons ({moduleData.lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quiz' ? 'bg-forest-800 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Interactive Quiz ({moduleData.quiz.length} Questions)
            </button>
          </div>
        </div>

        {/* 2-Column Lesson Player */}
        {activeTab === 'lessons' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Lesson Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-xs">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  {moduleData.category}
                </span>
                <h2 className="font-serif font-bold text-xl text-forest-900 mt-2">{moduleData.title}</h2>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Lessons</span>
                {moduleData.lessons.map((lesson, idx) => {
                  const isActive = idx === activeLessonIndex;
                  const isDone = completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl text-xs font-medium transition-all flex items-center justify-between border cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-mono text-xs text-slate-400">0{idx + 1}.</span>
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Reading View */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-700 font-bold tracking-wider uppercase">
                    Lesson {activeLessonIndex + 1} of {moduleData.lessons.length}
                  </span>
                  <h1 className="font-serif font-bold text-2xl sm:text-3xl text-forest-900 mt-1">
                    {currentLesson.title}
                  </h1>
                </div>
              </div>

              {/* Lesson Text Body */}
              <div className="prose prose-emerald max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line font-sans">
                {currentLesson.content}
              </div>

              {/* Key Takeaways Box */}
              {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 space-y-2">
                  <h4 className="font-serif font-bold text-sm text-emerald-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Key Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-900">
                    {currentLesson.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex(Math.max(0, activeLessonIndex - 1))}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous Lesson
                </button>

                <button
                  onClick={handleCompleteCurrentLesson}
                  className="px-6 py-2.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>
                    {activeLessonIndex === moduleData.lessons.length - 1
                      ? 'Complete & Take Quiz'
                      : 'Complete & Next'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Quiz View */
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-8">
            <div className="text-center space-y-2 pb-6 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Knowledge Assessment
              </span>
              <h2 className="font-serif font-bold text-3xl text-forest-900">Module Quiz</h2>
              <p className="text-xs text-slate-500">
                Test your understanding of {moduleData.title}. Score at least 70% to master the module.
              </p>
            </div>

            {/* Score Banner if Submitted */}
            {quizSubmitted && quizScoreResult && (
              <div
                className={`p-6 rounded-2xl text-center space-y-2 ${
                  quizScoreResult.passed
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border border-amber-300 text-amber-950'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-lg text-white bg-emerald-600">
                  {quizScoreResult.percentage}%
                </div>
                <h3 className="font-serif font-bold text-xl">
                  {quizScoreResult.passed ? 'Outstanding! Module Mastered.' : 'Keep Practicing!'}
                </h3>
                <p className="text-xs text-slate-600">
                  {quizScoreResult.passed
                    ? 'Your result has been logged and added to your Aaj Ka Jaiza evaluation.'
                    : 'Review the lessons and attempt the quiz again to solidify your knowledge.'}
                </p>
                <button
                  onClick={handleResetQuiz}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-8">
              {moduleData.quiz.map((q, qIdx) => {
                const selectedOpt = selectedAnswers[qIdx];

                return (
                  <div key={qIdx} className="space-y-3">
                    <p className="font-serif font-bold text-base text-forest-900 flex items-start gap-2.5">
                      <span className="font-mono text-emerald-700">Q{qIdx + 1}.</span>
                      <span>{q.question}</span>
                    </p>

                    <div className="space-y-2 pl-6">
                      {q.options.map((option, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        let optionStyle = 'bg-white border-slate-200 hover:border-emerald-500 text-slate-700';

                        if (quizSubmitted) {
                          if (optIdx === q.correctAnswerIndex) {
                            optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isSelected && optIdx !== q.correctAnswerIndex) {
                            optionStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                            className={`w-full text-left p-3.5 rounded-2xl text-xs border transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {quizSubmitted && optIdx === q.correctAnswerIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && q.explanation && (
                      <div className="ml-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                        <strong className="text-forest-900 font-serif">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Button */}
            {!quizSubmitted && (
              <div className="pt-6 border-t border-slate-100 text-center">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-full bg-forest-800 hover:bg-forest-700 disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-md transition-all hover:scale-102"
                >
                  {isSubmitting ? 'Evaluating...' : 'Submit Quiz Answers'}
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
