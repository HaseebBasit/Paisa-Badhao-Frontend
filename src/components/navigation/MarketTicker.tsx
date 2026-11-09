'use client';

import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketStore } from '@/store/marketStore';

interface MarketTickerProps {
  position?: 'top' | 'bottom' | 'hero';
  className?: string;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({
  position = 'top',
  className = '',
}) => {
  const { tickers, fetchTickers, initSocketListeners } = useMarketStore();

  useEffect(() => {
    fetchTickers();
    initSocketListeners();
  }, [fetchTickers, initSocketListeners]);

  const items = position === 'bottom' ? tickers.bottomTicker : tickers.topTicker;

  // Fallback items while loading
  const displayItems =
    items && items.length > 0
      ? items
      : [
          { symbol: 'KSE100', name: 'KSE 100 Index', sector: 'Index', currentPrice: 79452.21, previousClose: 79000, change: 978.4, changePercent: 1.24, high24h: 80000, low24h: 79000, volume: 0 },
          { symbol: 'MEBL', name: 'Meezan Bank', sector: 'Banks', currentPrice: 295.5, previousClose: 292, change: 2.87, changePercent: 0.98, high24h: 297, low24h: 291, volume: 500000 },
          { symbol: 'LUCK', name: 'Lucky Cement', sector: 'Cement', currentPrice: 829.0, previousClose: 835, change: -1.74, changePercent: -0.21, high24h: 840, low24h: 825, volume: 600000 },
          { symbol: 'FFC', name: 'Fauji Fertilizer', sector: 'Fertilizer', currentPrice: 415.78, previousClose: 410, change: 5.42, changePercent: 1.32, high24h: 420, low24h: 412, volume: 400000 },
          { symbol: 'SAZEW', name: 'Sazgar Eng', sector: 'Automobile', currentPrice: 327.2, previousClose: 324, change: 2.31, changePercent: 0.71, high24h: 330, low24h: 322, volume: 800000 },
          { symbol: 'PSO', name: 'Pakistan State Oil', sector: 'Oil & Gas', currentPrice: 246.3, previousClose: 247, change: -0.52, changePercent: -0.21, high24h: 249, low24h: 244, volume: 700000 },
        ];

  // Duplicate items for seamless infinite scroll
  const repeatedItems = [...displayItems, ...displayItems, ...displayItems];

  const animClass = position === 'bottom' ? 'animate-ticker-reverse' : 'animate-ticker-scroll';

  return (
    <div
      className={`relative w-full overflow-hidden bg-forest-900 border-y border-emerald-800/40 py-2.5 flex items-center select-none ${className}`}
    >
      {/* Historical Simulation Badge Pill */}
      <div className="absolute left-0 z-20 h-full flex items-center pl-3 pr-4 bg-gradient-to-r from-forest-900 via-forest-900/90 to-transparent">
        <span className="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
          PSX SIMULATION
        </span>
      </div>

      {/* Infinite Scrolling Track */}
      <div className={`flex items-center gap-8 whitespace-nowrap ${animClass}`}>
        {repeatedItems.map((item, idx) => {
          const isUp = (item.change ?? 0) >= 0;
          const displayPrice = (item as any).currentPrice ?? (item as any).price ?? 0;

          return (
            <div key={`${item.symbol}-${idx}`} className="inline-flex items-center gap-2.5 text-xs">
              <span className="font-bold text-slate-100 tracking-wide">{item.symbol}</span>
              <span className="font-mono text-slate-300 font-medium">
                {typeof displayPrice === 'number'
                  ? displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : displayPrice}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 font-semibold text-[11px] ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isUp ? '+' : ''}
                {item.changePercent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketTicker;
