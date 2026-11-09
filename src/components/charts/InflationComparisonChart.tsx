'use client';

import React from 'react';

interface YearData {
  year: number;
  cashPurchasingPower: number;
  bankSavingsValue: number;
  stockMarketValue: number;
  inflationAdjustedNeed: number;
}

interface InflationComparisonChartProps {
  data: YearData[];
  initialAmount: number;
}

export const InflationComparisonChart: React.FC<InflationComparisonChartProps> = ({
  data,
  initialAmount,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        Enter calculation inputs to see comparison chart.
      </div>
    );
  }

  // Calculate scales for SVG rendering
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.stockMarketValue, d.inflationAdjustedNeed, d.bankSavingsValue)),
    initialAmount * 1.5
  );

  const width = 600;
  const height = 300;
  const padding = 45;

  const getX = (index: number) => {
    return padding + (index / (data.length - 1 || 1)) * (width - padding * 2);
  };

  const getY = (val: number) => {
    return height - padding - (val / maxVal) * (height - padding * 2);
  };

  // Build SVG path strings
  const stockPoints = data.map((d, i) => `${getX(i)},${getY(d.stockMarketValue)}`).join(' ');
  const bankPoints = data.map((d, i) => `${getX(i)},${getY(d.bankSavingsValue)}`).join(' ');
  const cashPoints = data.map((d, i) => `${getX(i)},${getY(d.cashPurchasingPower)}`).join(' ');

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-end gap-5 mb-4 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600" />
          <span className="text-slate-700">Stock Market (PSX ~16%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-slate-700">Bank Savings (~10%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-slate-700">Cash (Purchasing Power)</span>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full aspect-[2/1] min-h-[260px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - padding - pct * (height - padding * 2);
            const val = Math.round(maxVal * pct);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={padding - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <polyline fill="none" stroke="#10b981" strokeWidth="3" points={stockPoints} strokeLinecap="round" />
          <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="4 4" points={bankPoints} />
          <polyline fill="none" stroke="#ef4444" strokeWidth="2.5" points={cashPoints} />

          {/* Dots and Labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const stockY = getY(d.stockMarketValue);
            const cashY = getY(d.cashPurchasingPower);
            const bankY = getY(d.bankSavingsValue);

            return (
              <g key={i}>
                {/* Year Label on X Axis */}
                <text x={x} y={height - padding + 18} textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
                  {d.year} yr
                </text>

                {/* Stock Dot */}
                <circle cx={x} cy={stockY} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                {/* Bank Dot */}
                <circle cx={x} cy={bankY} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                {/* Cash Dot */}
                <circle cx={x} cy={cashY} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default InflationComparisonChart;
