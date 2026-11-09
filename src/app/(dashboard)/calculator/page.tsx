'use client';

import React, { useState, useEffect } from 'react';
import {
  Calculator as CalcIcon,
  TrendingUp,
  Percent,
  Calendar,
  Save,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import InflationComparisonChart from '@/components/charts/InflationComparisonChart';
import { api } from '@/utils/api';
import { InflationCalculationResult } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function InflationCalculatorPage() {
  const { user } = useAuthStore();

  const [initialAmount, setInitialAmount] = useState<number>(100000);
  const [inflationRate, setInflationRate] = useState<number>(15);
  const [years, setYears] = useState<number>(5);
  const [result, setResult] = useState<InflationCalculationResult | null>(null);
  const [savedHistory, setSavedHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    handleCompute();
    if (user) {
      loadHistory();
    }
  }, [user]);

  const handleCompute = async () => {
    try {
      const res: any = await api.post('/inflation/compute', {
        initialAmount,
        inflationRate,
        years,
      });
      setResult(res.data);
    } catch (err) {
      console.warn('Failed to compute inflation:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const res: any = await api.get('/inflation/history');
      setSavedHistory(res.data || []);
    } catch (err) {
      console.warn('Failed to load calculation history:', err);
    }
  };

  const handleSaveCalculation = async () => {
    if (!result || !user) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await api.post('/inflation/save', result);
      setSaveMessage('Calculation saved to your history!');
      loadHistory();
    } catch (err: any) {
      setSaveMessage(err.message || 'Failed to save calculation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await api.delete(`/inflation/${id}`);
      setSavedHistory(savedHistory.filter((item) => item._id !== id));
    } catch (err) {
      console.warn('Failed to delete history item:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-forest-900 to-forest-800 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest border border-emerald-500/30">
              Purchasing Power Defense
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Inflation Calculator
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              See how inflation impacts your real purchasing power over time and why investing in productive equities is
              crucial to beating the rising cost of living in Pakistan.
            </p>
          </div>
        </div>

        {/* 2-Column Calculator & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Inputs (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl text-forest-900">Calculation Inputs</h2>
              <span className="text-[11px] font-mono text-emerald-700">FV = PV × (1 + r)ⁿ</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Initial Amount (PKR / TROIX)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <span className="absolute right-4 top-2.5 text-xs font-semibold text-slate-400">TROIX</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex justify-between">
                  <span>Annual Inflation Rate</span>
                  <span className="text-emerald-700 font-bold">{inflationRate}%</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="40"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex justify-between">
                  <span>Time Horizon (Years)</span>
                  <span className="text-emerald-700 font-bold">{years} Years</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <button
                onClick={handleCompute}
                className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <CalcIcon className="w-4 h-4 text-emerald-400" />
                <span>Calculate Now</span>
              </button>
            </div>

            {/* Save to History Button */}
            {user && result && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleSaveCalculation}
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4 text-emerald-600" />
                  <span>{isSaving ? 'Saving...' : 'Save Calculation to History'}</span>
                </button>
                {saveMessage && (
                  <p className="text-[11px] text-center text-emerald-700 font-medium mt-2">{saveMessage}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Visual Comparison & Output (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {result && (
              <>
                {/* 3 Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Future Value Needed
                    </span>
                    <span className="font-serif font-bold text-2xl text-forest-900 mt-1 block">
                      {result.futureValueNeeded.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500">to maintain purchasing power</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Purchasing Power Loss
                    </span>
                    <span className="font-serif font-bold text-2xl text-rose-600 mt-1 block">
                      -{result.purchasingPowerLossPercent}%
                    </span>
                    <span className="text-[11px] text-slate-500">if uninvested in cash</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Horizon
                    </span>
                    <span className="font-serif font-bold text-2xl text-emerald-700 mt-1 block">
                      {result.years} Years
                    </span>
                    <span className="text-[11px] text-slate-500">@ {result.inflationRate}% annual rate</span>
                  </div>
                </div>

                {/* Comparison Chart Component */}
                <InflationComparisonChart data={result.yearByYear} initialAmount={initialAmount} />

                {/* Year-by-Year Impact Table */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h3 className="font-serif font-bold text-lg text-forest-900">Year-by-Year Growth vs Erosion</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                          <th className="pb-2">Year</th>
                          <th className="pb-2">Cash Real Value</th>
                          <th className="pb-2">Bank Savings (~10%)</th>
                          <th className="pb-2">Stock Market (~16%)</th>
                          <th className="pb-2 text-right">Needed Capital</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {result.yearByYear.map((row) => (
                          <tr key={row.year} className="hover:bg-slate-50">
                            <td className="py-2.5 font-bold text-forest-900 font-sans">Year {row.year}</td>
                            <td className="py-2.5 text-rose-600">{row.cashPurchasingPower.toLocaleString()}</td>
                            <td className="py-2.5 text-blue-600">{row.bankSavingsValue.toLocaleString()}</td>
                            <td className="py-2.5 text-emerald-700 font-bold">
                              {row.stockMarketValue.toLocaleString()}
                            </td>
                            <td className="py-2.5 text-right text-slate-800">
                              {row.inflationAdjustedNeed.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Saved Calculations Drawer */}
            {savedHistory.length > 0 && (
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-forest-900">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Your Saved Simulations ({savedHistory.length})</span>
                </div>
                <div className="space-y-2">
                  {savedHistory.map((item) => (
                    <div
                      key={item._id}
                      className="p-3 rounded-xl bg-surface-light border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-forest-900">
                          {item.initialAmount?.toLocaleString()} TROIX @ {item.inflationRate}% for {item.years} yrs
                        </span>
                        <p className="text-[10px] text-slate-500">
                          Needed: {item.futureValueNeeded?.toLocaleString()} TROIX (Loss: {item.purchasingPowerLossPercent}%)
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteHistoryItem(item._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
