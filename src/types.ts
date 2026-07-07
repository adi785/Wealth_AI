export interface Transaction {
  id: string;
  date: string;
  category: 'Food' | 'Travel' | 'Shopping' | 'Utilities' | 'Entertainment' | 'Healthcare' | 'Bills' | 'EMI' | 'Investment' | 'Income';
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'completed' | 'pending' | 'flagged';
  flagReason?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentSavings: number;
  targetDate: string;
  monthlyContribution: number;
  category: 'House' | 'Car' | 'Education' | 'Vacation' | 'Retirement' | 'General';
}

export interface Asset {
  category: string;
  amount: number;
  percentage: number;
  returnsYTD: number;
  riskProfile: 'Low' | 'Medium' | 'High';
  color: string;
}

export interface Portfolio {
  totalValue: number;
  assets: Asset[];
  totalReturns: number;
  ytdReturnsPercentage: number;
  growthHistory: { month: string; value: number; benchmark: number }[];
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
  investmentPreference: string[];
  language: string;
  theme: 'light' | 'dark';
}

export interface AIInsight {
  id: string;
  title: string;
  category: 'budget' | 'saving' | 'investment' | 'alert' | 'general';
  description: string;
  reason: string;
  confidence: number; // percentage (e.g. 95)
  suggestedAction: string;
}

export interface InvestmentRecommendation {
  id: string;
  assetClass: 'Mutual Funds' | 'Fixed Deposit' | 'Gold' | 'ETF' | 'Government Bonds' | 'SIP' | 'Emergency Fund';
  name: string;
  expectedReturn: string;
  suitability: string;
  why: string;
  benefits: string[];
  risks: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface FinancialNewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'Market' | 'Banking' | 'Policy' | 'Global' | 'Tech';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impactScore: number;
  summary: string;
}

