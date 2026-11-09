'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  PieChart,
  BookOpen,
  Calculator,
  Award,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Clock,
  Layers,
  Search,
  Eye,
  CheckCircle2,
  BarChart3,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { api } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { PortfolioSummary, PortfolioHolding, Trade, LearningModule, Stock } from '@/types';

export default function DashboardOverviewPage() {
  const { user, wallet, loadSession } = useAuthStore();
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalInvested: 0,
    totalCurrentValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    holdingsCount: 0,
  });
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [marketStocks, setMarketStocks] = useState<Stock[]>([]);
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '1W' | '1M' | 'ALL'>('1M');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await loadSession();

      // Load Portfolio & Holdings
      const pRes: any = await api.get('/portfolio');
      if (pRes?.data) {
        setSummary(pRes.data.summary || {
          totalInvested: 0,
          totalCurrentValue: 0,
          totalPnL: 0,
          totalPnLPercent: 0,
          holdingsCount: 0,
        });
        setHoldings(pRes.data.holdings || []);
      }

      // Load Recent Trades
      const tRes: any = await api.get('/trading/trades?limit=5');
      setRecentTrades(tRes?.data || []);

      // Load Learning Modules
      const mRes: any = await api.get('/learning/modules');
      setModules(mRes?.data || []);

      // Load Watchlist
      const wRes: any = await api.get('/portfolio/watchlist');
      setWatchlist(wRes?.data || []);

      // Load All PSX Stocks for Market Overview
      const sRes: any = await api.get('/market/stocks');
      if (sRes?.data) {
        setMarketStocks(sRes.data.filter((s: Stock) => !s.isIndex));
      }
    } catch (err) {
      console.warn('Dashboard data fetch warning:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const availableTroix = wallet?.balance ?? 100000;
  const netWorth = availableTroix + (summary?.totalCurrentValue || 0);
  const isPnLPositive = (summary?.totalPnL || 0) >= 0;

  // Completed modules count
  const completedModulesCount = modules.filter((m) => m.progress?.isCompleted).length;
  const progressPercent = modules.length > 0 ? Math.round((completedModulesCount / modules.length) * 100) : 0;

  // Synthetic portfolio equity curve based on actual invested and cash values
  const baseValue = 100000;
  const currentVal = netWorth;
  const chartPoints = [
    { label: 'Start', value: baseValue },
    { label: 'Week 1', value: baseValue + (currentVal - baseValue) * 0.2 },
    { label: 'Week 2', value: baseValue + (currentVal - baseValue) * 0.45 },
    { label: 'Week 3', value: baseValue + (currentVal - baseValue) * 0.75 },
    { label: 'Current', value: currentVal },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* User Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-600/40 text-emerald-300 border border-emerald-500/30">
              Personal Wealth Portal
            </span>
            <span className="text-xs text-emerald-400 font-mono">• Live PSX Simulation</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Welcome back, {user ? user.name : 'Investor'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Practice stock investing on the Pakistan Stock Exchange with your 100,000 TROIX capital.
            Track your equity positions, analyze historical trends, and prepare for real markets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/trading"
            className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all hover:scale-102"
          >
            <span>Open Trading Terminal</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
          <button
            onClick={loadDashboardData}
            title="Refresh Data"
            className="p-3 rounded-full bg-forest-800/80 hover:bg-forest-700 text-slate-300 hover:text-white border border-emerald-700/40 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Available TROIX */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Cash</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif font-black text-2xl sm:text-3xl text-forest-900">
              {availableTroix.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-700 font-bold ml-1.5 font-mono">TROIX</span>
            <p className="text-[11px] text-slate-400 mt-1">Virtual purchasing power</p>
          </div>
        </div>

        {/* Card 2: Total Net Worth */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Worth</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif font-black text-2xl sm:text-3xl text-forest-900">
              {netWorth.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-700 font-bold ml-1.5 font-mono">TROIX</span>
            <p className="text-[11px] text-slate-400 mt-1">Cash + Equity portfolio</p>
          </div>
        </div>

        {/* Card 3: Total Invested (Holdings Value) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Invested Holdings</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif font-black text-2xl sm:text-3xl text-forest-900">
              {summary.totalCurrentValue.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-700 font-bold ml-1.5 font-mono">TROIX</span>
            <p className="text-[11px] text-slate-400 mt-1">{summary.holdingsCount} active stocks held</p>
          </div>
        </div>

        {/* Card 4: Total Profit / Loss */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Profit / Loss</span>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isPnLPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {isPnLPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`font-serif font-black text-2xl sm:text-3xl ${
                isPnLPositive ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {isPnLPositive ? '+' : ''}
              {summary.totalPnL.toLocaleString()}
            </span>
            <span
              className={`text-xs font-bold ml-1.5 font-mono ${
                isPnLPositive ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              ({summary.totalPnLPercent}%)
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Unrealized return on equities</p>
          </div>
        </div>
      </div>

      {/* Portfolio Growth Graph & PSX Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Portfolio Performance Curve (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Valuation Analytics</span>
              <h2 className="font-serif font-bold text-xl text-forest-900">Portfolio Performance Curve</h2>
            </div>
            <div className="flex items-center gap-1 bg-surface-light p-1 rounded-xl border border-slate-200">
              {(['1D', '1W', '1M', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                    chartTimeframe === tf
                      ? 'bg-forest-900 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-forest-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Area Performance Graph */}
          <div className="w-full h-56 relative flex flex-col justify-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Area Gradient Fill */}
              <path
                d="M 0,140 Q 120,130 250,90 T 500,60 L 500,180 L 0,180 Z"
                fill="url(#pnlGrad)"
              />

              {/* Trend Stroke Line */}
              <path
                d="M 0,140 Q 120,130 250,90 T 500,60"
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Peak Marker Dot */}
              <circle cx="500" cy="60" r="5" fill="#047857" stroke="#ffffff" strokeWidth="2.5" />
            </svg>

            {/* Labels under chart */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-100">
              <span>Account Inception (100,000 TROIX)</span>
              <span>August 2026 Simulation Timeline</span>
              <span className="font-bold text-emerald-700">{netWorth.toLocaleString()} TROIX</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-light border border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">Cost Basis: {summary.totalInvested.toLocaleString()} TROIX</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest-900" />
              <span className="font-medium text-slate-700">Current Valuation: {netWorth.toLocaleString()} TROIX</span>
            </div>
          </div>
        </div>

        {/* Right: Top Performing PSX Stocks (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PSX Movers</span>
              <h3 className="font-serif font-bold text-xl text-forest-900">Top Performing Equities</h3>
            </div>
            <Link href="/trading" className="text-xs font-bold text-emerald-700 hover:underline">
              Terminal
            </Link>
          </div>

          <div className="space-y-2.5">
            {marketStocks.slice(0, 5).map((stock) => {
              const isUp = stock.change >= 0;
              return (
                <div
                  key={stock.symbol}
                  className="p-3.5 rounded-2xl bg-surface-light border border-slate-100 flex items-center justify-between hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-forest-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
                      {stock.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-forest-900">{stock.symbol}</h4>
                      <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{stock.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono font-bold text-xs text-forest-900">
                        {stock.currentPrice.toFixed(2)}
                      </p>
                      <p
                        className={`text-[10px] font-bold font-mono ${
                          isUp ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </p>
                    </div>

                    <Link
                      href={`/trading?symbol=${stock.symbol}`}
                      className="px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-[11px] font-semibold transition-colors"
                    >
                      Trade
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/trading"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 text-forest-900 hover:text-emerald-700 text-xs font-bold flex flex-col items-center justify-center gap-2 shadow-2xs transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span>Virtual Trading</span>
        </Link>

        <Link
          href="/portfolio"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 text-forest-900 hover:text-emerald-700 text-xs font-bold flex flex-col items-center justify-center gap-2 shadow-2xs transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PieChart className="w-4 h-4" />
          </div>
          <span>Portfolio Ledger</span>
        </Link>

        <Link
          href="/calculator"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 text-forest-900 hover:text-emerald-700 text-xs font-bold flex flex-col items-center justify-center gap-2 shadow-2xs transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calculator className="w-4 h-4" />
          </div>
          <span>Inflation Calc</span>
        </Link>

        <Link
          href="/learn"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 text-forest-900 hover:text-emerald-700 text-xs font-bold flex flex-col items-center justify-center gap-2 shadow-2xs transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <span>Learn Literacy</span>
        </Link>

        <Link
          href="/experts"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 text-forest-900 hover:text-emerald-700 text-xs font-bold flex flex-col items-center justify-center gap-2 shadow-2xs transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Verified Mentors</span>
        </Link>

        <Link
          href="/aaj-ka-jaiza"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 text-forest-900 hover:text-emerald-700 text-xs font-bold flex flex-col items-center justify-center gap-2 shadow-2xs transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="w-4 h-4" />
          </div>
          <span>Aaj Ka Jaiza</span>
        </Link>
      </div>

      {/* 2-Column: Current Holdings Table + Recent Activity & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Holdings Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Equity Positions</span>
              <h2 className="font-serif font-bold text-xl text-forest-900">Your PSX Holdings</h2>
            </div>
            <Link href="/portfolio" className="text-xs font-bold text-emerald-700 hover:underline">
              View Complete Ledger
            </Link>
          </div>

          {holdings.length === 0 ? (
            <div className="py-12 text-center space-y-4 bg-surface-light rounded-2xl p-6 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-forest-900">
                  Ready to Build Your Portfolio
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  You have exactly 100,000 TROIX available virtual cash. Explore top PSX stocks and execute your first risk-free simulation trade.
                </p>
              </div>

              {/* Quick Starter Trade Suggestions */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href="/trading?symbol=MEBL"
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-xs font-bold text-forest-900 shadow-2xs transition-all"
                >
                  Practice Buy: MEBL (Meezan Bank)
                </Link>
                <Link
                  href="/trading?symbol=LUCK"
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-xs font-bold text-forest-900 shadow-2xs transition-all"
                >
                  Practice Buy: LUCK (Lucky Cement)
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                    <th className="pb-2.5">Symbol</th>
                    <th className="pb-2.5">Shares</th>
                    <th className="pb-2.5">Avg Buy</th>
                    <th className="pb-2.5">Current</th>
                    <th className="pb-2.5 text-right">P&L</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {holdings.map((h) => {
                    const isUp = h.unrealizedPnL >= 0;
                    return (
                      <tr key={h._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 font-bold text-forest-900 font-sans">
                          <div>{h.symbol}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{h.name}</div>
                        </td>
                        <td className="py-3.5">{h.quantity}</td>
                        <td className="py-3.5">{h.averageBuyPrice.toFixed(2)}</td>
                        <td className="py-3.5">{h.currentPrice.toFixed(2)}</td>
                        <td
                          className={`py-3.5 text-right font-bold ${
                            isUp ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {h.unrealizedPnL.toLocaleString()} ({h.unrealizedPnLPercent}%)
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/trading?symbol=${h.symbol}`}
                            className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-sans font-semibold text-[11px] hover:bg-emerald-100 transition-colors"
                          >
                            Trade
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Trades & Education Progress (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Trades Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-forest-900">Recent Trades</h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            {recentTrades.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No orders recorded yet. Visit the Trading Terminal to place simulated market orders.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentTrades.map((t) => (
                  <div
                    key={t._id}
                    className="p-3 rounded-2xl bg-surface-light border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            t.type === 'BUY' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {t.type}
                        </span>
                        <span className="font-bold text-forest-900">{t.symbol}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(t.timestamp).toLocaleDateString()} @ {t.executionPrice.toFixed(2)} TROIX
                      </p>
                    </div>

                    <div className="text-right font-mono font-bold text-forest-900">
                      {t.quantity} Shares
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Progress Box */}
          <div className="bg-gradient-to-br from-forest-900 to-forest-800 text-white rounded-3xl p-6 shadow-md space-y-4 border border-emerald-800/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Financial Literacy Progress
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300">
                {completedModulesCount} / {modules.length || 10} Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-forest-950 rounded-full h-2 overflow-hidden border border-emerald-900/40">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Complete modules on PSX fundamentals, valuation metrics, and risk management to increase your Aaj Ka Jaiza performance score.
            </p>

            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-102"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
