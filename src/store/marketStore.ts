import { create } from 'zustand';
import { api } from '@/utils/api';
import { getSocket } from '@/utils/socket';
import { Stock, Candle } from '@/types';

interface MarketState {
  stocks: Stock[];
  selectedSymbol: string;
  candles: Candle[];
  chartType: 'candlestick' | 'line';
  timeframe: '1D' | '1W' | '1M' | '1Y';
  tickers: {
    topTicker: Stock[];
    bottomTicker: Stock[];
  };
  simulation: {
    isPlaying: boolean;
    speed: number;
    currentDate: string | null;
    currentIndex: number;
    totalTicks: number;
    isEnded: boolean;
  };
  isLoadingCandles: boolean;
  fetchStocks: () => Promise<void>;
  fetchCandles: (symbol: string) => Promise<void>;
  fetchTickers: () => Promise<void>;
  selectStock: (symbol: string) => void;
  setChartType: (type: 'candlestick' | 'line') => void;
  setTimeframe: (tf: '1D' | '1W' | '1M' | '1Y') => void;
  initSocketListeners: () => void;
  playSimulation: () => void;
  pauseSimulation: () => void;
  setSpeed: (speed: number) => void;
  seekSimulation: (index: number) => void;
  resetSimulation: () => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  stocks: [],
  selectedSymbol: 'MEBL',
  candles: [],
  chartType: 'candlestick',
  timeframe: '1M',
  tickers: {
    topTicker: [],
    bottomTicker: [],
  },
  simulation: {
    isPlaying: true,
    speed: 1,
    currentDate: null,
    currentIndex: 0,
    totalTicks: 21,
    isEnded: false,
  },
  isLoadingCandles: false,

  fetchStocks: async () => {
    try {
      const res: any = await api.get('/market/stocks');
      if (res?.data) {
        set({
          stocks: res.data,
          tickers: {
            topTicker: res.data,
            bottomTicker: res.data.slice().reverse(),
          },
        });
      }
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
    }
  },

  fetchCandles: async (symbol: string) => {
    set({ isLoadingCandles: true });
    try {
      const res: any = await api.get(`/market/history/${symbol}`);
      if (res?.data) {
        // Sort strictly ascending by date
        const sorted = (res.data as Candle[]).sort((a, b) => (a.time > b.time ? 1 : -1));
        set({ candles: sorted, isLoadingCandles: false });
      }
    } catch (err) {
      console.error('Failed to fetch historical candles:', err);
      set({ isLoadingCandles: false });
    }
  },

  fetchTickers: async () => {
    try {
      const res: any = await api.get('/market/tickers');
      if (res?.data) {
        set({ tickers: res.data });
      }
    } catch (err) {
      console.error('Failed to fetch tickers:', err);
    }
  },

  selectStock: (symbol: string) => {
    set({ selectedSymbol: symbol });
    get().fetchCandles(symbol);
  },

  setChartType: (type: 'candlestick' | 'line') => {
    set({ chartType: type });
  },

  setTimeframe: (tf: '1D' | '1W' | '1M' | '1Y') => {
    set({ timeframe: tf });
  },

  initSocketListeners: () => {
    if (typeof window === 'undefined') return;
    const socket = getSocket();

    socket.off('simulation:init');
    socket.off('simulation:status');
    socket.off('simulation:loop');
    socket.off('market:tick');

    socket.on('simulation:init', (data: any) => {
      set((state) => ({
        simulation: {
          ...state.simulation,
          isPlaying: data.isPlaying,
          speed: data.playbackSpeed,
          currentDate: data.currentDate,
          currentIndex: data.currentIndex,
          totalTicks: data.totalTicks,
        },
      }));
    });

    socket.on('simulation:status', (data: any) => {
      set((state) => ({
        simulation: {
          ...state.simulation,
          isPlaying: data.isPlaying,
          speed: data.playbackSpeed,
          currentDate: data.currentDate,
          currentIndex: data.currentIndex !== undefined ? data.currentIndex : state.simulation.currentIndex,
        },
      }));
    });

    socket.on('simulation:loop', (data: any) => {
      set((state) => ({
        simulation: {
          ...state.simulation,
          currentIndex: 0,
          currentDate: data.currentDate,
        },
      }));
    });

    // Real-time market tick handler: updates stock prices, tickers, and chart candles
    socket.on('market:tick', (payload: any) => {
      const { date, index, total, ticks } = payload;

      set((state) => {
        // 1. Update stock prices in stock list
        const updatedStocks = state.stocks.map((stock) => {
          const match = ticks.find((t: any) => t.symbol === stock.symbol);
          if (match) {
            return {
              ...stock,
              currentPrice: match.close,
              previousClose: match.open,
              change: match.change,
              changePercent: match.changePercent,
              high24h: match.high,
              low24h: match.low,
              volume: match.volume,
            };
          }
          return stock;
        });

        // 2. Synchronize Dual Tickers
        const updatedTickers = {
          topTicker: updatedStocks,
          bottomTicker: updatedStocks.slice().reverse(),
        };

        // 3. Update or Append Candle for Currently Selected Stock
        const currentSelectedTick = ticks.find((t: any) => t.symbol === state.selectedSymbol);
        let updatedCandles = [...state.candles];

        if (currentSelectedTick) {
          const newCandle: Candle = {
            time: currentSelectedTick.date,
            open: currentSelectedTick.open,
            high: currentSelectedTick.high,
            low: currentSelectedTick.low,
            close: currentSelectedTick.close,
            volume: currentSelectedTick.volume,
          };

          const existingIdx = updatedCandles.findIndex((c) => c.time === currentSelectedTick.date);
          if (existingIdx !== -1) {
            updatedCandles[existingIdx] = newCandle;
          } else {
            updatedCandles.push(newCandle);
          }

          // Ensure strictly ascending order for chart
          updatedCandles.sort((a, b) => (a.time > b.time ? 1 : -1));
        }

        return {
          stocks: updatedStocks,
          tickers: updatedTickers,
          candles: updatedCandles,
          simulation: {
            ...state.simulation,
            currentDate: date,
            currentIndex: index,
            totalTicks: total,
            isEnded: false,
          },
        };
      });
    });
  },

  playSimulation: () => {
    const socket = getSocket();
    socket.emit('simulation:play');
    set((state) => ({ simulation: { ...state.simulation, isPlaying: true } }));
  },

  pauseSimulation: () => {
    const socket = getSocket();
    socket.emit('simulation:pause');
    set((state) => ({ simulation: { ...state.simulation, isPlaying: false } }));
  },

  setSpeed: (speed: number) => {
    const socket = getSocket();
    socket.emit('simulation:set_speed', speed);
    set((state) => ({ simulation: { ...state.simulation, speed } }));
  },

  seekSimulation: (index: number) => {
    const socket = getSocket();
    socket.emit('simulation:seek', index);
  },

  resetSimulation: () => {
    const socket = getSocket();
    socket.emit('simulation:reset');
    set((state) => ({
      simulation: {
        ...state.simulation,
        isPlaying: true,
        currentIndex: 0,
        isEnded: false,
      },
    }));
    get().fetchCandles(get().selectedSymbol);
  },
}));
