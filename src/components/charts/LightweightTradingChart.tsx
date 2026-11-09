'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  HistogramData,
  CrosshairMode,
} from 'lightweight-charts';
import { Candle } from '@/types';

interface LightweightTradingChartProps {
  candles: Candle[];
  symbol: string;
  chartType?: 'candlestick' | 'line';
  height?: number;
}

export const LightweightTradingChart: React.FC<LightweightTradingChartProps> = ({
  candles,
  symbol,
  chartType = 'candlestick',
  height = 420,
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  // Active Hover HUD data for crosshair
  const [hoverData, setHoverData] = useState<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
    changePercent: number;
  } | null>(null);

  // 1. Initialize Chart Container
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: '#0B1310' },
        textColor: '#94A3B8',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#16231E' },
        horzLines: { color: '#16231E' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#10B981',
          width: 1,
          style: 3,
          labelBackgroundColor: '#064E3B',
        },
        horzLine: {
          color: '#10B981',
          width: 1,
          style: 3,
          labelBackgroundColor: '#064E3B',
        },
      },
      rightPriceScale: {
        borderColor: '#1E2E28',
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: '#1E2E28',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Candlestick Series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    // Line Series (for line chart mode)
    const lineSeries = chart.addLineSeries({
      color: '#10B981',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#059669',
      crosshairMarkerBackgroundColor: '#10B981',
    });

    // Volume Histogram Series
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // overlay inside chart
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candleSeries;
    lineSeriesRef.current = lineSeries;
    volumeSeriesRef.current = volumeSeries;

    // Crosshair movement listener to update live HUD
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setHoverData(null);
        return;
      }

      const candleData = param.seriesData.get(candleSeries) as any;
      const volData = param.seriesData.get(volumeSeries) as any;

      if (candleData && candleData.open !== undefined) {
        const change = Number((candleData.close - candleData.open).toFixed(2));
        const changePercent = Number(((change / candleData.open) * 100).toFixed(2));
        setHoverData({
          time: String(param.time),
          open: candleData.open,
          high: candleData.high,
          low: candleData.low,
          close: candleData.close,
          volume: volData ? volData.value : 0,
          change,
          changePercent,
        });
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  // 2. Synchronize Data & Toggle Candlestick vs Line series visibility
  useEffect(() => {
    if (!chartRef.current || !candles || candles.length === 0) return;

    // Deduplicate and sort strictly ascending by date
    const sorted = [...candles].sort((a, b) => (a.time > b.time ? 1 : -1));
    const uniqueMap = new Map<string, Candle>();
    sorted.forEach((c) => uniqueMap.set(c.time, c));
    const cleanCandles = Array.from(uniqueMap.values());

    const candleData: CandlestickData[] = cleanCandles.map((c) => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const lineData: LineData[] = cleanCandles.map((c) => ({
      time: c.time as any,
      value: c.close,
    }));

    const volumeData: HistogramData[] = cleanCandles.map((c) => ({
      time: c.time as any,
      value: c.volume || 0,
      color: c.close >= c.open ? '#10B98144' : '#EF444444',
    }));

    if (candlestickSeriesRef.current && lineSeriesRef.current && volumeSeriesRef.current) {
      if (chartType === 'candlestick') {
        candlestickSeriesRef.current.applyOptions({ visible: true });
        lineSeriesRef.current.applyOptions({ visible: false });
        candlestickSeriesRef.current.setData(candleData);
      } else {
        candlestickSeriesRef.current.applyOptions({ visible: false });
        lineSeriesRef.current.applyOptions({ visible: true });
        lineSeriesRef.current.setData(lineData);
      }
      volumeSeriesRef.current.setData(volumeData);
    }

    // Auto-fit timeline if new symbol loaded
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [candles, chartType, symbol]);

  const lastCandle = candles.length > 0 ? candles[candles.length - 1] : null;
  const displayHUD = hoverData || (lastCandle ? {
    time: lastCandle.time,
    open: lastCandle.open,
    high: lastCandle.high,
    low: lastCandle.low,
    close: lastCandle.close,
    volume: lastCandle.volume || 0,
    change: Number((lastCandle.close - lastCandle.open).toFixed(2)),
    changePercent: Number((((lastCandle.close - lastCandle.open) / lastCandle.open) * 100).toFixed(2)),
  } : null);

  const isUp = (displayHUD?.change || 0) >= 0;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-950/40 bg-[#0B1310] shadow-inner flex flex-col justify-between">
      {/* Dynamic Floating HUD: Shows OHLCV in real time during hover or playback */}
      <div className="absolute top-2.5 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 bg-[#0E1814]/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-emerald-900/40 text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm tracking-wider">{symbol}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
            {chartType === 'candlestick' ? 'Candles' : 'Line'}
          </span>
          {displayHUD && (
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Session: <strong className="text-slate-200">{displayHUD.time}</strong>
            </span>
          )}
        </div>

        {displayHUD ? (
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="text-slate-400">
              O: <strong className="text-white">{displayHUD.open.toFixed(2)}</strong>
            </span>
            <span className="text-slate-400">
              H: <strong className="text-emerald-400">{displayHUD.high.toFixed(2)}</strong>
            </span>
            <span className="text-slate-400">
              L: <strong className="text-rose-400">{displayHUD.low.toFixed(2)}</strong>
            </span>
            <span className="text-slate-400">
              C:{' '}
              <strong className={isUp ? 'text-emerald-400' : 'text-rose-400'}>
                {displayHUD.close.toFixed(2)}
              </strong>
            </span>
            <span className={`font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isUp ? '+' : ''}
              {displayHUD.change.toFixed(2)} ({isUp ? '+' : ''}
              {displayHUD.changePercent.toFixed(2)}%)
            </span>
            <span className="text-slate-400 hidden md:inline">
              Vol: <strong className="text-slate-200">{displayHUD.volume.toLocaleString()}</strong>
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">Hover over chart to inspect historical OHLCV</span>
        )}
      </div>

      {/* Lightweight Chart Render Canvas */}
      <div ref={chartContainerRef} className="w-full pt-8" style={{ height }} />
    </div>
  );
};

export default LightweightTradingChart;
