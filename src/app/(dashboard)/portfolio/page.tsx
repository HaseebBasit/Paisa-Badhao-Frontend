'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PieChart,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  Coins,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { api } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { PortfolioHolding, PortfolioSummary, Stock } from '@/types';

export default function PortfolioPage() {
  const { user, wallet, loadSession } = useAuthStore();
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalInvested: 0,
    totalCurrentValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    holdingsCount: 0,
  });
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions' | 'watchlist'>('holdings');

  useEffect(() => {
    loadSession();
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const pRes: any = await api.get('/portfolio');
      if (pRes.data) {
        setSummary(pRes.data.summary);
        setHoldings(pRes.data.holdings || []);
      }

      const txRes: any = await api.get('/wallet/transactions');
      setTransactions(txRes.data || []);

      const wRes: any = await api.get('/portfolio/watchlist');
      setWatchlist(wRes.data || []);
    } catch (err) {
      console.warn('Failed to load portfolio:', err);
    }
  };

  const isUp = summary.totalPnL >= 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Asset Management</span>
            <h1 className="font-serif text-3xl font-extrabold text-forest-900 mt-1">
              Portfolio & Transaction Ledger
            </h1>
            <p className="text-xs text-slate-500">
              Audit all simulated equity holdings, order executions, and TROIX wallet movements.
            </p>
          </div>

          <Link
            href="/trading"
            className="px-6 py-2.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
          >
            <span>Trade PSX Stocks</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Available Capital</span>
            <span className="font-serif font-black text-2xl text-forest-900 mt-1 block">
              {(wallet?.balance ?? 100000).toLocaleString()}{' '}
              <span className="text-xs font-mono text-emerald-700 font-bold">TROIX</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Uncommitted cash balance</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Market Holdings Value</span>
            <span className="font-serif font-black text-2xl text-forest-900 mt-1 block">
              {summary.totalCurrentValue.toLocaleString()}{' '}
              <span className="text-xs font-mono text-emerald-700 font-bold">TROIX</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-1">{summary.holdingsCount} Open Stock Positions</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cumulative P&L</span>
            <span
              className={`font-serif font-black text-2xl mt-1 block ${
                isUp ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {isUp ? '+' : ''}
              {summary.totalPnL.toLocaleString()}{' '}
              <span className="text-xs font-mono font-bold">({summary.totalPnLPercent}%)</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Total unrealized gains/losses</p>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'holdings' ? 'bg-forest-800 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Active Holdings ({holdings.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Wallet Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'watchlist' ? 'bg-forest-800 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>

        {/* Tab 1: Holdings */}
        {activeTab === 'holdings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            {holdings.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-slate-500 font-medium">No active stock positions in portfolio.</p>
                <Link
                  href="/trading"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-800 text-white text-xs font-bold"
                >
                  <span>Open Virtual Trading Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                      <th className="pb-3">Stock Symbol</th>
                      <th className="pb-3">Company Name</th>
                      <th className="pb-3">Shares Owned</th>
                      <th className="pb-3">Avg Cost</th>
                      <th className="pb-3">Current Price</th>
                      <th className="pb-3">Market Value</th>
                      <th className="pb-3 text-right">Unrealized P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {holdings.map((h) => {
                      const isHoldingUp = h.unrealizedPnL >= 0;
                      return (
                        <tr key={h._id} className="hover:bg-slate-50">
                          <td className="py-3.5 font-bold text-forest-900 font-sans">{h.symbol}</td>
                          <td className="py-3.5 font-sans text-slate-500">{h.name}</td>
                          <td className="py-3.5 font-bold text-slate-800">{h.quantity}</td>
                          <td className="py-3.5">{h.averageBuyPrice.toFixed(2)}</td>
                          <td className="py-3.5">{h.currentPrice.toFixed(2)}</td>
                          <td className="py-3.5 font-bold text-forest-900">{h.currentMarketValue.toLocaleString()}</td>
                          <td
                            className={`py-3.5 text-right font-bold ${
                              isHoldingUp ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {isHoldingUp ? '+' : ''}
                            {h.unrealizedPnL.toLocaleString()} ({h.unrealizedPnLPercent}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Transactions */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 text-right">Balance After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50">
                      <td className="py-3 text-slate-500 font-sans">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                            tx.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 font-sans text-slate-700 max-w-md truncate">{tx.description}</td>
                      <td
                        className={`py-3 font-bold ${
                          tx.type === 'CREDIT' ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {tx.type === 'CREDIT' ? '+' : '-'}
                        {tx.amount.toLocaleString()} TROIX
                      </td>
                      <td className="py-3 text-right font-bold text-forest-900">
                        {tx.balanceAfter.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Watchlist */}
        {activeTab === 'watchlist' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((stock) => {
              const isStockUp = stock.change >= 0;
              return (
                <div
                  key={stock.symbol}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-lg text-forest-900">{stock.symbol}</span>
                    <p className="text-xs text-slate-500 truncate max-w-[160px]">{stock.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{stock.sector}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-bold text-base text-forest-900">
                      {stock.currentPrice ? stock.currentPrice.toFixed(2) : '--'}
                    </p>
                    <span
                      className={`text-xs font-semibold block ${
                        isStockUp ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {isStockUp ? '+' : ''}
                      {stock.changePercent ? stock.changePercent.toFixed(2) : '0.00'}%
                    </span>
                    <Link
                      href={`/trading?symbol=${stock.symbol}`}
                      className="text-[11px] text-emerald-800 font-bold hover:underline inline-block mt-1"
                    >
                      Trade Stock
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
