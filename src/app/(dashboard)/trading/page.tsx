'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Search,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  BarChart2,
  LineChart as LineChartIcon,
  RefreshCw,
  PieChart,
} from 'lucide-react';
import MarketTicker from '@/components/navigation/MarketTicker';
import LightweightTradingChart from '@/components/charts/LightweightTradingChart';
import { useAuthStore } from '@/store/authStore';
import { useMarketStore } from '@/store/marketStore';
import { api } from '@/utils/api';
import { Stock, PortfolioHolding, Order, Trade } from '@/types';

export default function TradingTerminalPage() {
  const router = useRouter();
  const { user, wallet, loadSession, updateWalletBalance } = useAuthStore();
  const {
    stocks,
    selectedSymbol,
    candles,
    chartType,
    timeframe,
    simulation,
    fetchStocks,
    fetchCandles,
    selectStock,
    setChartType,
    setTimeframe,
    initSocketListeners,
    playSimulation,
    pauseSimulation,
    setSpeed,
    seekSimulation,
    resetSimulation,
  } = useMarketStore();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Bottom Tabs
  const [activeBottomTab, setActiveBottomTab] = useState<'holdings' | 'trades'>('holdings');
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalInvested: 0,
    totalCurrentValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    realizedPnL: 0,
  });

  useEffect(() => {
    loadSession();
    fetchStocks();
    fetchCandles(selectedSymbol);
    initSocketListeners();
    loadUserData();
  }, [selectedSymbol]);

  const loadUserData = async () => {
    try {
      const pRes: any = await api.get('/portfolio');
      if (pRes?.data) {
        setHoldings(pRes.data.holdings || []);
        if (pRes.data.summary) {
          setPortfolioSummary({
            totalInvested: pRes.data.summary.totalInvested || 0,
            totalCurrentValue: pRes.data.summary.totalCurrentValue || 0,
            totalPnL: pRes.data.summary.totalPnL || 0,
            totalPnLPercent: pRes.data.summary.totalPnLPercent || 0,
            realizedPnL: pRes.data.summary.realizedPnL || 0,
          });
        }
      }

      const tRes: any = await api.get('/trading/trades?limit=20');
      setTrades(tRes?.data || []);
    } catch (err) {
      console.warn('Failed to fetch user trading data:', err);
    }
  };

  const selectedStock: Stock = stocks.find((s) => s.symbol === selectedSymbol) || {
    symbol: selectedSymbol,
    name:
      selectedSymbol === 'MEBL'
        ? 'Meezan Bank Limited'
        : selectedSymbol === 'LUCK'
        ? 'Lucky Cement Limited'
        : selectedSymbol === 'FFC'
        ? 'Fauji Fertilizer Company'
        : selectedSymbol === 'SAZEW'
        ? 'Sazgar Engineering Works'
        : selectedSymbol === 'PSO'
        ? 'Pakistan State Oil'
        : 'Meezan Bank Limited',
    sector: 'Commercial Banks',
    currentPrice: 295.5,
    previousClose: 292.0,
    change: 2.87,
    changePercent: 0.98,
    high24h: 297.84,
    low24h: 290.87,
    volume: 552752,
    isIndex: false,
  };

  const currentPrice = selectedStock.currentPrice || 295.5;
  const previousClose = selectedStock.previousClose || currentPrice;
  const openPrice = candles.length > 0 ? candles[candles.length - 1].open : currentPrice;
  const highPrice = selectedStock.high24h || currentPrice;
  const lowPrice = selectedStock.low24h || currentPrice;
  const volume = selectedStock.volume || 552752;
  const change = selectedStock.change || Number((currentPrice - previousClose).toFixed(2));
  const changePercent = selectedStock.changePercent || Number(((change / previousClose) * 100).toFixed(2));
  const lastUpdated = simulation.currentDate || 'August 2026 Session';

  const totalCost = Number((quantity * currentPrice).toFixed(2));
  const userBalance = wallet?.balance ?? 100000;
  const totalNetWorth = userBalance + portfolioSummary.totalCurrentValue;

  const existingHolding = holdings.find((h) => h.symbol === selectedSymbol);
  const ownedQuantity = existingHolding?.quantity || 0;
  const avgBuyPrice = existingHolding?.averageBuyPrice || 0;
  const unrealizedPnL = existingHolding?.unrealizedPnL || 0;

  const handleExecuteTrade = async () => {
    setFeedback(null);
    if (!user) {
      router.push('/login');
      return;
    }

    if (quantity <= 0) {
      setFeedback({ type: 'error', message: 'Quantity must be at least 1 share.' });
      return;
    }

    if (tradeType === 'BUY' && totalCost > userBalance) {
      setFeedback({
        type: 'error',
        message: `Insufficient TROIX balance. Order requires ${totalCost.toLocaleString()} TROIX, but your available balance is ${userBalance.toLocaleString()} TROIX.`,
      });
      return;
    }

    if (tradeType === 'SELL' && quantity > ownedQuantity) {
      setFeedback({
        type: 'error',
        message: `Insufficient holdings. You own ${ownedQuantity} shares of ${selectedSymbol}, but attempted to sell ${quantity} shares.`,
      });
      return;
    }

    setIsExecuting(true);
    try {
      const endpoint = tradeType === 'BUY' ? '/trading/buy' : '/trading/sell';
      const res: any = await api.post(endpoint, {
        symbol: selectedSymbol,
        quantity,
      });

      if (res?.data?.remainingBalance !== undefined) {
        updateWalletBalance(res.data.remainingBalance);
      }

      setFeedback({
        type: 'success',
        message: `Order Executed! ${tradeType === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${selectedSymbol} @ ${currentPrice.toFixed(2)} PKR for ${totalCost.toLocaleString()} TROIX.`,
      });

      // Celebration confetti for successful trade
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (cErr) {}

      await loadUserData();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Trade execution failed on the server.',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleQuantityPreset = (val: number) => {
    setQuantity(val);
  };

  const handleQuantityMax = () => {
    if (tradeType === 'BUY') {
      const maxShares = Math.max(1, Math.floor(userBalance / currentPrice));
      setQuantity(maxShares);
    } else {
      setQuantity(Math.max(1, ownedQuantity));
    }
  };

  const filteredStocks = stocks.filter(
    (s) =>
      !s.isIndex &&
      (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-full bg-[#070C0A] text-slate-200">
      {/* 1. TOP DUAL MARKET TICKER */}
      <MarketTicker position="top" />

      {/* Main Terminal Container */}
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 max-w-[1700px] w-full mx-auto">
        {/* Simulation Notice & Continuous Playback Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#0E1814] border border-emerald-900/40 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-wider uppercase font-mono">
              HISTORICAL SIMULATION
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden md:inline">
              August 2026 PSX Sequential Dataset (MEBL, LUCK, FFC, SAZEW, PSO)
            </span>
            {simulation.currentDate && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-800/40">
                Session: {simulation.currentDate} ({simulation.currentIndex + 1}/{simulation.totalTicks})
              </span>
            )}
          </div>

          {/* Interactive Playback Engine Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={simulation.isPlaying ? pauseSimulation : playSimulation}
              title={simulation.isPlaying ? 'Pause Playback' : 'Play Simulation'}
              className="px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-700/40 shadow-xs"
            >
              {simulation.isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={resetSimulation}
              title="Rewind / Restart Simulation from Day 1"
              className="px-2.5 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-300 hover:text-white border border-emerald-900/40 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {/* Speed Multipliers */}
            <div className="flex items-center gap-1 bg-forest-950 p-1 rounded-xl border border-emerald-900/40">
              {[1, 2, 5, 10].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                    simulation.speed === spd
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Column Core Trading Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* COLUMN 1: Stock Selector & Search (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl bg-[#0D1512] border border-emerald-900/30 p-4 space-y-3 flex flex-col justify-between h-[640px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  PSX Listed Equities
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">5 Active</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search symbol or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-forest-950 border border-emerald-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Stock List Items */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredStocks.map((stock) => {
                const isSelected = stock.symbol === selectedSymbol;
                const isUp = (stock.change || 0) >= 0;

                return (
                  <button
                    key={stock.symbol}
                    onClick={() => selectStock(stock.symbol)}
                    className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm'
                        : 'bg-[#101A16] border-emerald-950/40 hover:bg-[#14221D] text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-white">{stock.symbol}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{stock.name}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-xs text-white">
                        {stock.currentPrice ? stock.currentPrice.toFixed(2) : '--'}{' '}
                        <span className="text-[9px] text-slate-400">PKR</span>
                      </p>
                      <p
                        className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                          isUp ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {stock.changePercent ? stock.changePercent.toFixed(2) : '0.00'}%
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Market Dataset Footer */}
            <div className="pt-2 border-t border-emerald-900/20 text-[10px] text-slate-500 font-mono text-center">
              Historical August 2026 PSX Sequential Stream
            </div>
          </div>

          {/* COLUMN 2: Interactive Dynamic Trading Chart (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0D1512] border border-emerald-900/30 p-4 space-y-3 flex flex-col justify-between h-[640px]">
            {/* Header info bar with Chart Mode & Timeframe toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-emerald-900/20">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono font-bold text-lg text-white">{selectedStock.symbol}</h2>
                  <span className="text-xs text-slate-300 font-medium">— {selectedStock.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                  <span className="text-white font-bold">{currentPrice.toFixed(2)} PKR</span>
                  <span className={`font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {change >= 0 ? '+' : ''}
                    {change.toFixed(2)} ({change >= 0 ? '+' : ''}
                    {changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Chart Controls: Candlestick/Line toggle & Timeframe selectors */}
              <div className="flex items-center gap-2">
                {/* Chart Type Toggle */}
                <div className="flex items-center gap-1 bg-forest-950 p-1 rounded-xl border border-emerald-900/30">
                  <button
                    onClick={() => setChartType('candlestick')}
                    title="Candlestick Chart"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      chartType === 'candlestick'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    title="Line Chart"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      chartType === 'line'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LineChartIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Timeframe Selectors */}
                <div className="flex items-center gap-1 bg-forest-950 p-1 rounded-xl border border-emerald-900/30">
                  {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        timeframe === tf
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Lightweight Trading Chart with live HUD */}
            <div className="flex-1 w-full min-h-[440px]">
              <LightweightTradingChart
                candles={candles}
                symbol={selectedSymbol}
                chartType={chartType}
                height={450}
              />
            </div>

            {/* Interactive Timeline Scrubber */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono">03 Aug</span>
              <input
                type="range"
                min="0"
                max={Math.max(0, simulation.totalTicks - 1)}
                value={simulation.currentIndex}
                onChange={(e) => seekSimulation(parseInt(e.target.value, 10))}
                className="flex-1 accent-emerald-500 cursor-pointer h-1.5 bg-forest-900 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 font-mono">31 Aug</span>
            </div>
          </div>

          {/* COLUMN 3: Right-Side Trading Panel & User Financial Summary (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl bg-[#0D1512] border border-emerald-900/30 p-4 space-y-4 flex flex-col justify-between h-[640px] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {/* Selected Stock Live Price & OHLC Card */}
              <div className="p-3.5 rounded-2xl bg-[#101A16] border border-emerald-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Market Price (PKR)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{lastUpdated}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-black text-white">
                    {currentPrice.toFixed(2)}{' '}
                    <span className="text-xs font-semibold text-emerald-400 font-sans">PKR</span>
                  </span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {change >= 0 ? '+' : ''}
                    {change.toFixed(2)} ({changePercent.toFixed(2)}%)
                  </span>
                </div>

                {/* 6-Grid OHLC & Volume metrics (never undefined/empty) */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-emerald-950/60 text-[10px] font-mono">
                  <div className="p-1.5 rounded-lg bg-forest-950">
                    <span className="text-slate-500 block">Prev Close</span>
                    <span className="text-slate-200 font-bold">{previousClose.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-forest-950">
                    <span className="text-slate-500 block">Open</span>
                    <span className="text-slate-200 font-bold">{openPrice.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-forest-950">
                    <span className="text-slate-500 block">High</span>
                    <span className="text-emerald-400 font-bold">{highPrice.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-forest-950">
                    <span className="text-slate-500 block">Low</span>
                    <span className="text-rose-400 font-bold">{lowPrice.toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-forest-950 col-span-2">
                    <span className="text-slate-500 block">Volume</span>
                    <span className="text-slate-200 font-bold">{volume.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Logged-in User Portfolio Valuation Card */}
              <div className="p-3.5 rounded-2xl bg-forest-950/70 border border-emerald-900/30 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block pb-1 border-b border-emerald-950">
                  User Financial Summary (TROIX)
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Cash:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {userBalance.toLocaleString()} TROIX
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Net Worth:</span>
                  <span className="font-mono font-bold text-white">
                    {totalNetWorth.toLocaleString()} TROIX
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invested Amount:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {portfolioSummary.totalInvested.toLocaleString()} TROIX
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Owned Shares:</span>
                  <span className="font-mono font-bold text-white">
                    {ownedQuantity} shares ({selectedSymbol})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unrealized P&L:</span>
                  <span
                    className={`font-mono font-bold ${
                      unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {unrealizedPnL >= 0 ? '+' : ''}
                    {unrealizedPnL.toLocaleString()} TROIX
                  </span>
                </div>
              </div>

              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-forest-950 border border-emerald-900/40">
                <button
                  onClick={() => setTradeType('BUY')}
                  className={`py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    tradeType === 'BUY'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('SELL')}
                  className={`py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    tradeType === 'SELL'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Quantity Input + Preset Buttons */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Quantity (Shares)</span>
                  <span className="text-emerald-400">Owned: {ownedQuantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 50))}
                    className="w-8 h-8 rounded-lg bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm border border-emerald-900/40 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="flex-1 min-w-0 text-center py-2 rounded-lg bg-white border border-emerald-700 font-mono font-bold text-forest-950 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 50)}
                    className="w-8 h-8 rounded-lg bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm border border-emerald-900/40 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[10, 50, 100].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleQuantityPreset(val)}
                      className="py-1 rounded-md bg-forest-950 hover:bg-forest-900 text-[10px] font-mono text-slate-300 border border-emerald-900/30 transition-colors cursor-pointer"
                    >
                      {val}
                    </button>
                  ))}
                  <button
                    onClick={handleQuantityMax}
                    className="py-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-700/40 transition-colors cursor-pointer"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Estimated Total Order Cost */}
              <div className="p-3 rounded-xl bg-forest-950/80 border border-emerald-900/40 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Estimated Total:</span>
                <span className="font-bold text-white text-sm">
                  {totalCost.toLocaleString()}{' '}
                  <span className="text-[10px] text-emerald-400 font-sans">TROIX</span>
                </span>
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="leading-snug">{feedback.message}</span>
                </div>
              )}
            </div>

            {/* Execute Order CTA */}
            <button
              onClick={handleExecuteTrade}
              disabled={isExecuting}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 ${
                tradeType === 'BUY'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {isExecuting
                ? 'Processing on Server...'
                : `${tradeType === 'BUY' ? 'Buy' : 'Sell'} ${quantity} ${selectedSymbol}`}
            </button>
          </div>
        </div>

        {/* BOTTOM TABS: Portfolio Holdings & Complete Transaction Ledger */}
        <div className="rounded-2xl bg-[#0D1512] border border-emerald-900/30 p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-900/30">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveBottomTab('holdings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeBottomTab === 'holdings'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Portfolio Holdings ({holdings.length})
              </button>
              <button
                onClick={() => setActiveBottomTab('trades')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeBottomTab === 'trades'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Order History & Ledger ({trades.length})
              </button>
            </div>

            <button
              onClick={loadUserData}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Ledger</span>
            </button>
          </div>

          {activeBottomTab === 'holdings' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-emerald-950/80 font-sans font-semibold">
                    <th className="pb-3">Symbol</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Shares</th>
                    <th className="pb-3">Avg Buy (PKR)</th>
                    <th className="pb-3">Current (PKR)</th>
                    <th className="pb-3">Market Value (TROIX)</th>
                    <th className="pb-3 text-right">Unrealized P&L</th>
                    <th className="pb-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/40">
                  {holdings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                        No equity holdings in your virtual portfolio. Use the order panel above to purchase PSX stocks.
                      </td>
                    </tr>
                  ) : (
                    holdings.map((h) => {
                      const isUp = (h.unrealizedPnL || 0) >= 0;
                      return (
                        <tr key={h._id} className="hover:bg-emerald-950/20 transition-colors">
                          <td className="py-3 font-bold text-white font-sans">{h.symbol}</td>
                          <td className="py-3 text-slate-400 font-sans">{h.name}</td>
                          <td className="py-3 text-white">{h.quantity}</td>
                          <td className="py-3 text-slate-300">{h.averageBuyPrice.toFixed(2)}</td>
                          <td className="py-3 text-slate-300">{h.currentPrice.toFixed(2)}</td>
                          <td className="py-3 text-white font-bold">{h.currentMarketValue.toLocaleString()}</td>
                          <td
                            className={`py-3 text-right font-bold ${
                              isUp ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isUp ? '+' : ''}
                            {h.unrealizedPnL.toLocaleString()} ({h.unrealizedPnLPercent}%)
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                selectStock(h.symbol);
                                setTradeType('SELL');
                              }}
                              className="px-2.5 py-1 rounded bg-forest-900 hover:bg-forest-800 text-emerald-400 font-sans font-semibold text-[11px] transition-colors cursor-pointer"
                            >
                              Sell
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeBottomTab === 'trades' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-emerald-950/80 font-sans font-semibold">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Symbol</th>
                    <th className="pb-3">Shares</th>
                    <th className="pb-3">Exec Price (PKR)</th>
                    <th className="pb-3">Total Amount (TROIX)</th>
                    <th className="pb-3 text-right">Realized P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/40">
                  {trades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                        No transactions recorded yet. Practice your first trade above.
                      </td>
                    </tr>
                  ) : (
                    trades.map((t) => (
                      <tr key={t._id} className="hover:bg-emerald-950/20 transition-colors">
                        <td className="py-2.5 text-slate-400">
                          {new Date(t.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider ${
                              t.type === 'BUY'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                            }`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-white font-bold font-sans">{t.symbol}</td>
                        <td className="py-2.5 text-white">{t.quantity}</td>
                        <td className="py-2.5 text-slate-300">{t.executionPrice.toFixed(2)}</td>
                        <td className="py-2.5 text-white font-bold">{t.totalAmount.toLocaleString()}</td>
                        <td
                          className={`py-2.5 text-right font-bold ${
                            (t.realizedPnL || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {t.type === 'SELL' ? `${(t.realizedPnL || 0) >= 0 ? '+' : ''}${t.realizedPnL} TROIX` : '--'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 2. BOTTOM DUAL MARKET TICKER */}
      <MarketTicker position="bottom" />
    </div>
  );
}
