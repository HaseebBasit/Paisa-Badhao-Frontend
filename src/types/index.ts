export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Wallet {
  balance: number;
  currency: 'TROIX';
  initialCreditClaimed?: boolean;
}

export interface Stock {
  _id?: string;
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number | null;
  isIndex?: boolean;
}

export interface Candle {
  time: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number | null;
}

export interface Order {
  _id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  executionTime: string;
  createdAt: string;
}

export interface Trade {
  _id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  executionPrice: number;
  totalAmount: number;
  fee: number;
  realizedPnL?: number;
  timestamp: string;
}

export interface PortfolioHolding {
  _id: string;
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  totalCost: number;
  currentPrice: number;
  currentMarketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalCurrentValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  holdingsCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  keyTakeaways: string[];
  order: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LearningModule {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  icon: string;
  estimatedTime: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
  progress?: {
    completedLessons: string[];
    isCompleted: boolean;
    quizScore: number | null;
    progressPercent: number;
  };
}

export interface Expert {
  _id: string;
  name: string;
  designation: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  feePerSession: number;
  feeCurrency: string;
  specialties: string[];
  bio: string;
  isVerified: boolean;
  avatarUrl: string;
  availableDays: string[];
  availableTimeSlots: string[];
}

export interface ExpertBooking {
  _id: string;
  expert: Expert;
  date: string;
  timeSlot: string;
  topic: string;
  notes: string;
  feePaid: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface DailyEvaluation {
  _id: string;
  date: string;
  score: number;
  grade: string;
  tradingDiscipline: number;
  riskManagement: number;
  portfolioDiversification: number;
  indicators: string[];
  aiFeedback: string;
  tradeCount: number;
  quizCompleted: boolean;
  quizScore: number;
}

export interface InflationCalculationResult {
  title: string;
  initialAmount: number;
  inflationRate: number;
  years: number;
  futureValueNeeded: number;
  purchasingPowerLossPercent: number;
  currentPurchasingPower: number;
  yearByYear: {
    year: number;
    cashPurchasingPower: number;
    bankSavingsValue: number;
    stockMarketValue: number;
    inflationAdjustedNeed: number;
  }[];
}

export interface AIMessage {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AIConversation {
  _id: string;
  title: string;
  lastMessageAt: string;
}
