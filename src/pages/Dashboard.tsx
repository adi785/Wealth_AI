import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Compass,
  ArrowUpRight,
  Sparkles,
  Wallet,
  Activity,
  Plus,
  Zap,
  CheckCircle,
  Clock,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Newspaper,
  User,
  Trash2,
  Database,
  Save
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import AnimatedCard from "../components/AnimatedCard";
import { Transaction, Goal, Portfolio, UserProfile, FinancialNewsItem } from "../types";

interface DashboardProps {
  userData: {
    profile: UserProfile;
    goals: Goal[];
    portfolio: Portfolio;
    transactions: Transaction[];
    summary: {
      liquidBalance: number;
      monthlyIncome: number;
      monthlySpending: number;
      netSavings: number;
      financialHealthScore: number;
    };
  } | null;
  onInvestInGoal?: (goalId: string, amount: number) => void;
  onClearSampleData?: () => void;
  onRestoreDemoData?: () => void;
  onAddTransaction?: (newTx: Omit<Transaction, "id">) => void;
  onDeleteTransaction?: (txId: string) => void;
}

const fallbackNews: FinancialNewsItem[] = [
  {
    id: "news-1",
    title: "RBI Keeps Repo Rate Unchanged at 6.50% Amid Robust GDP Growth Outlook",
    source: "Reserve Bank Bulletins",
    timeAgo: "2 mins ago",
    category: "Policy",
    sentiment: "neutral",
    impactScore: 8,
    summary: "The Monetary Policy Committee has decided by a 5:1 majority to remain focused on withdrawal of accommodation to ensure that inflation progressively aligns with the target of 4.0%."
  },
  {
    id: "news-2",
    title: "IDBI Bank Expands Digital Infrastructure; Launches Omnichannel Retail Wealth Desk",
    source: "Banking Ledger India",
    timeAgo: "12 mins ago",
    category: "Banking",
    sentiment: "bullish",
    impactScore: 9,
    summary: "In a move to capture the growing affluent middle-class savings pool, IDBI Bank unveiled an integrated AI-driven personal ledger workspace for retail account holders."
  },
  {
    id: "news-3",
    title: "Nifty 50 Extends Rallies to Landmark Highs; IT and Financial Stocks Fuel Momentum",
    source: "Dalal Street Wire",
    timeAgo: "45 mins ago",
    category: "Market",
    sentiment: "bullish",
    impactScore: 7,
    summary: "Robust institutional buying combined with positive domestic retail participation pushed key benchmark indices past crucial psychological resistances, supported by strong sector rotation."
  },
  {
    id: "news-4",
    title: "Indian Tech Sector Registers 18% Year-on-Year Export Surge in Cloud AI Services",
    source: "NASSCOM Insights",
    timeAgo: "1 hour ago",
    category: "Tech",
    sentiment: "bullish",
    impactScore: 6,
    summary: "Software export receipts rose sharply as enterprise clients in the US and Europe ramped up custom integration pipelines for sovereign language models and real-time processing nodes."
  },
  {
    id: "news-5",
    title: "Federal Reserve Signals Slower Rate Cut Trajectory Citing Resilient US Labor Market",
    source: "Bloomberg International",
    timeAgo: "2 hours ago",
    category: "Global",
    sentiment: "bearish",
    impactScore: 8,
    summary: "FOMC minutes indicate policymakers are in no rush to aggressively drop interest rates, preferring a cautious, data-dependent stance that could keep domestic bond yields elevated."
  },
  {
    id: "news-6",
    title: "Global Crude Oil Prices Moderate to $74/Barrel as Middle East Supply Apprehensions Ease",
    source: "Commodity Desk",
    timeAgo: "4 hours ago",
    category: "Global",
    sentiment: "bullish",
    impactScore: 7,
    summary: "A cooling energy market offers substantial fiscal relief to major oil-importing economies like India, directly tempering fuel inflation and reducing current account deficits."
  }
];

export default function Dashboard({
  userData,
  onInvestInGoal,
  onClearSampleData,
  onRestoreDemoData,
  onAddTransaction,
  onDeleteTransaction
}: DashboardProps) {
  const [tickerAnimate, setTickerAnimate] = useState(false);
  const [news, setNews] = useState<FinancialNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsFilter, setNewsFilter] = useState<'All' | 'Market' | 'Banking' | 'Policy' | 'Global' | 'Tech'>('All');
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const [activeFeedTab, setActiveFeedTab] = useState<"transaction" | "profile" | "starting">("transaction");

  // Transaction form state
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState<'Food' | 'Travel' | 'Shopping' | 'Utilities' | 'Entertainment' | 'Healthcare' | 'Bills' | 'EMI' | 'Investment' | 'Income'>("Shopping");
  const [txType, setTxType] = useState<"credit" | "debit">("debit");
  const [txDesc, setTxDesc] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);

  // Profile form state
  const [profName, setProfName] = useState("");
  const [profIncome, setProfIncome] = useState("");
  const [profOcc, setProfOcc] = useState("");
  const [profAge, setProfAge] = useState("");

  // Starting cash balance
  const [startingBal, setStartingBal] = useState("");

  useEffect(() => {
    if (userData?.profile) {
      setProfName(userData.profile.name);
      setProfIncome(String(userData.profile.monthlyIncome));
      setProfOcc(userData.profile.occupation);
      setProfAge(String(userData.profile.age));
      setStartingBal(localStorage.getItem("idbi_starting_balance") || "450000");
    }
  }, [userData]);

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      } else {
        console.warn("API returned error, using client-side fallback financial news feed.");
        setNews(fallbackNews);
      }
    } catch (err) {
      console.warn("Could not connect to backend, activating client-side fallback financial news feed:", err);
      setNews(fallbackNews);
    } finally {
      setNewsLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  };

  useEffect(() => {
    // Spark dynamic entry count animators
    setTickerAnimate(true);
    fetchNews();
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm tracking-widest text-cyan-400">CONNECTING TO SECURE IDBI LEDGER...</p>
        </div>
      </div>
    );
  }

  const { profile, goals, portfolio, transactions, summary } = userData;

  // Filter transactions to show top 5 recent
  const recentTx = transactions.slice(0, 5);

  // Pie chart data derived from portfolio asset allocation
  const pieData = portfolio.assets.map(a => ({
    name: a.category,
    value: a.amount,
    color: a.color
  }));

  const currencyFormatter = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative overflow-hidden bg-transparent">
      {/* Dynamic blurred environment glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dynamic Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
                IDBI HACKATHON PROTO WORKSPACE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold font-sans text-white mt-3">
              Namaste, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{profile.name}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Your relationship engine is active and analyzing 90-day cash flow indices.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/advisor"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-cyan-500/15 transition-all transform hover:scale-[1.02]"
            >
              <Cpu className="h-4.5 w-4.5 animate-pulse" />
              <span>Voice AI Advisor</span>
            </Link>
          </div>
        </div>

        {/* Custom Data Feed Center */}
        <div id="data-feed-console" className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/10 mb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-cyan-500/15 text-cyan-400">
                  <Database className="h-4 w-4" />
                </span>
                <h2 className="text-xl font-extrabold text-white font-sans">
                  Custom Ledger Config Console
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                You can feed custom data according to you. Reset to clean slate, or insert specific transactions!
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-clear-mock-data"
                onClick={onClearSampleData}
                className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Sample Data (Start Fresh)</span>
              </button>
              
              <button
                id="btn-restore-sample"
                onClick={onRestoreDemoData}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Restore IDBI Demo Ledger</span>
              </button>
            </div>
          </div>

          {/* Form Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Tab selection sidebar */}
            <div className="md:col-span-3 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                id="tab-btn-tx"
                type="button"
                onClick={() => setActiveFeedTab("transaction")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all border cursor-pointer ${
                  activeFeedTab === "transaction"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Log Transaction</span>
              </button>

              <button
                id="tab-btn-prof"
                type="button"
                onClick={() => setActiveFeedTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all border cursor-pointer ${
                  activeFeedTab === "profile"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <User className="h-4 w-4" />
                <span>My Profile Metrics</span>
              </button>

              <button
                id="tab-btn-starting"
                type="button"
                onClick={() => setActiveFeedTab("starting")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all border cursor-pointer ${
                  activeFeedTab === "starting"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Wallet className="h-4 w-4" />
                <span>Configure Balances</span>
              </button>
            </div>

            {/* Tab views */}
            <div className="md:col-span-9 bg-black/20 border border-white/5 rounded-2xl p-5">
              {activeFeedTab === "transaction" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!txAmount || !txDesc) {
                      alert("Please provide transaction amount and description.");
                      return;
                    }
                    onAddTransaction?.({
                      amount: Number(txAmount),
                      description: txDesc,
                      category: txCategory,
                      type: txType,
                      date: txDate,
                      status: "completed"
                    });
                    setTxAmount("");
                    setTxDesc("");
                    alert("Transaction logged successfully! Liquid cash balances adjusted.");
                  }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-1">
                    <span>Add Custom Ledger Entry</span>
                    <span className="text-[10px] text-slate-500 font-normal">(Updates cash balance instantly)</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                      <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                        <button
                          type="button"
                          onClick={() => setTxType("debit")}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            txType === "debit" ? "bg-red-500/25 text-red-400" : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Debit (Outflow)
                        </button>
                        <button
                          type="button"
                          onClick={() => setTxType("credit")}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            txType === "credit" ? "bg-emerald-500/25 text-emerald-400" : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Credit (Inflow)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                      <input
                        type="number"
                        value={txAmount}
                        onChange={(e) => setTxAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white"
                        placeholder="e.g. 5000"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                      <select
                        value={txCategory}
                        onChange={(e) => setTxCategory(e.target.value as any)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white cursor-pointer"
                      >
                        <option value="Food">Food & Dining</option>
                        <option value="Travel">Travel & Transit</option>
                        <option value="Shopping">Shopping & Lifestyle</option>
                        <option value="Utilities">Utilities & WiFi</option>
                        <option value="Entertainment">Subscriptions & Fun</option>
                        <option value="Healthcare">Medicines & Healthcare</option>
                        <option value="Bills">Fixed Monthly Bills</option>
                        <option value="EMI">EMI & Loans</option>
                        <option value="Investment">Mutual Fund / Investment</option>
                        <option value="Income">Salary / Income</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Ledger Date</label>
                      <input
                        type="date"
                        value={txDate}
                        onChange={(e) => setTxDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                    <input
                      type="text"
                      value={txDesc}
                      onChange={(e) => setTxDesc(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white"
                      placeholder="e.g. Starbucks Latte, Rent, Salary Deposit"
                      required
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Insert Ledger Record</span>
                    </button>
                  </div>
                </form>
              )}

              {activeFeedTab === "profile" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!profName || !profIncome) {
                      alert("Please provide name and monthly income.");
                      return;
                    }
                    if (userData?.profile) {
                      userData.profile.name = profName;
                      userData.profile.monthlyIncome = Number(profIncome);
                      userData.profile.occupation = profOcc;
                      userData.profile.age = Number(profAge);
                      
                      // Trigger state change
                      onAddTransaction?.({
                        date: new Date().toISOString().split("T")[0],
                        category: "Income",
                        description: "Profile sync refresh",
                        amount: 0.01,
                        type: "credit",
                        status: "completed"
                      });
                    }
                    alert("Profile metrics successfully saved and synchronized!");
                  }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-1">
                    <span>Customize Profile Metrics</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Monthly Income (₹)</label>
                      <input
                        type="number"
                        value={profIncome}
                        onChange={(e) => setProfIncome(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Occupation</label>
                      <input
                        type="text"
                        value={profOcc}
                        onChange={(e) => setProfOcc(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Age</label>
                      <input
                        type="number"
                        value={profAge}
                        onChange={(e) => setProfAge(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Profile Details</span>
                    </button>
                  </div>
                </form>
              )}

              {activeFeedTab === "starting" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white mb-2">
                    <span>Configure Base Vault Balances</span>
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Set your initial liquid starting capital base. Standard credit and debit transactions logged will offset dynamically from this number to yield your total liquid assets.
                  </p>

                  <div className="flex gap-4 items-end max-w-md">
                    <div className="flex-grow">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Base Starting Cash (₹)</label>
                      <input
                        type="number"
                        value={startingBal}
                        onChange={(e) => setStartingBal(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500/40 text-white"
                        placeholder="e.g. 500000"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (!startingBal || Number(startingBal) < 0) {
                          alert("Please enter a valid starting balance.");
                          return;
                        }
                        localStorage.setItem("idbi_starting_balance", startingBal);
                        onAddTransaction?.({
                          date: new Date().toISOString().split("T")[0],
                          category: "Income",
                          description: "Starting cash updated",
                          amount: 0.01,
                          type: "credit",
                          status: "completed"
                        });
                        alert("Starting liquid balance updated successfully!");
                      }}
                      className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 h-[38px] cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>Apply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Dashboard Key Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Liquid Balances */}
          <AnimatedCard hoverScale delay={0.05} highlightBorder>
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Liquid Ledger Cash</p>
                <h3 className="text-3xl font-extrabold text-white">
                  {currencyFormatter(summary.liquidBalance)}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span>IDBI Savings Vault</span>
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>

          {/* Monthly Income */}
          <AnimatedCard hoverScale delay={0.1}>
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Monthly Income</p>
                <h3 className="text-3xl font-extrabold text-white">
                  {currencyFormatter(summary.monthlyIncome)}
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center space-x-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Verified Corporate Direct</span>
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>

          {/* Monthly Spending */}
          <AnimatedCard hoverScale delay={0.15}>
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Average Spending Outflow</p>
                <h3 className="text-3xl font-extrabold text-white">
                  {currencyFormatter(summary.monthlySpending)}
                </h3>
                <p className="text-[11px] text-amber-400 flex items-center space-x-1">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Shopping spiked 17%</span>
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>

          {/* Net Monthly Savings */}
          <AnimatedCard hoverScale delay={0.2}>
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Net Monthly Surplus</p>
                <h3 className="text-3xl font-extrabold text-white">
                  {currencyFormatter(summary.netSavings)}
                </h3>
                <p className="text-[11px] text-cyan-400 flex items-center space-x-1">
                  <Percent className="h-3.5 w-3.5" />
                  <span>Savings rate at 42%</span>
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400">
                <Percent className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Middle Core Grid: Health Score, Charts, Asset allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* AI Financial Health Indicator (3 Cols) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <AnimatedCard title="AI Financial Health" className="flex-grow flex flex-col justify-between" highlightBorder>
              <div className="flex flex-col items-center py-6">
                {/* Radial gauge representation */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      className="stroke-slate-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="68"
                      className="stroke-cyan-400"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={427}
                      initial={{ strokeDashoffset: 427 }}
                      animate={{ strokeDashoffset: 427 - (427 * summary.financialHealthScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-white font-mono">{summary.financialHealthScore}</span>
                    <span className="text-[10px] text-cyan-400 uppercase font-bold font-mono tracking-widest mt-0.5">EXCELLENT</span>
                  </div>
                </div>

                <div className="text-center px-4 space-y-2">
                  <h4 className="font-sans font-bold text-white text-sm">Compound Index Factor: Strong</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    You scored above 85% of peers in your income band. Strength points awarded for secure debt-to-savings ratios and automated SIP discipline.
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-start space-x-2.5">
                  <Sparkles className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white">AI Advice: Park Idle Cash</h5>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Your liquidity account registers ₹4,50,000 idle. Map ₹2.5L to an IDBI Short-Term Multi-Option FD to secure up to 7.4% compounding returns.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Portfolio Performance Graph & Allocation (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <AnimatedCard
              title="Portfolio Asset Valuation"
              subtitle="Historical performance versus standard benchmark portfolio indices"
              headerAction={
                <Link to="/portfolio" className="text-xs text-cyan-400 flex items-center space-x-1 hover:underline">
                  <span>Full Portfolio</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              }
              className="flex-grow flex flex-col"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Visual Chart */}
                <div className="md:col-span-8 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolio.growthHistory}>
                      <defs>
                        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${v / 100000}L`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }}
                        formatter={(value: any) => [currencyFormatter(Number(value)), "Asset Value"]}
                      />
                      <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
                      <Area type="monotone" dataKey="benchmark" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend List */}
                <div className="md:col-span-4 space-y-3.5">
                  <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Asset Distribution</h4>
                  <div className="space-y-2.5">
                    {portfolio.assets.map((asset, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                          <span className="text-slate-300 font-sans">{asset.category}</span>
                        </div>
                        <span className="font-mono text-white font-bold">{asset.percentage}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-800">
                    <p className="text-[11px] text-slate-400 italic">YTD portfolio yield averages <span className="text-emerald-400 font-bold font-mono">+{portfolio.ytdReturnsPercentage}%</span></p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>

        </div>

        {/* Real-time Financial News Section */}
        <AnimatedCard
          title="Real-Time Financial News Intelligence"
          subtitle="Simulated real-time institutional wire feed tracking market developments and bank-level sentiment indicators"
          headerAction={
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-slate-400 font-mono">
                {lastRefreshed ? `Refreshed: ${lastRefreshed}` : "Live Feed Active"}
              </span>
              <button
                onClick={fetchNews}
                disabled={newsLoading}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${newsLoading ? "animate-spin" : ""}`} />
                <span className="font-medium">Refresh Feed</span>
              </button>
            </div>
          }
        >
          {/* Tab Filters */}
          <div className="flex flex-wrap gap-2 pb-5 border-b border-white/10 mb-5">
            {(['All', 'Market', 'Banking', 'Policy', 'Global', 'Tech'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setNewsFilter(filter)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium font-sans border transition-all ${
                  newsFilter === filter
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold"
                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"
                }`}
              >
                {filter === "All" ? "🔥 All Headlines" : filter}
              </button>
            ))}
          </div>

          {/* Headlines grid */}
          {newsLoading && news.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3.5">
                  <div className="h-4 bg-slate-800 rounded w-1/4" />
                  <div className="h-6 bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-800 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news
                .filter(item => newsFilter === 'All' || item.category === newsFilter)
                .map((item) => {
                  const sentimentColors = {
                    bullish: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                    bearish: "bg-red-500/10 border-red-500/20 text-red-400",
                    neutral: "bg-slate-500/10 border-slate-500/20 text-slate-400"
                  };

                  return (
                    <div
                      key={item.id}
                      className="group bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        {/* Meta Category & Source & Sentiment */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded text-cyan-400 font-bold">
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-mono uppercase border px-2 py-0.5 rounded font-bold ${sentimentColors[item.sentiment]}`}>
                            {item.sentiment}
                          </span>
                        </div>

                        {/* News Title */}
                        <h4 className="font-sans font-bold text-white text-sm leading-snug group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>

                        {/* Summary */}
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      {/* Footer Details */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{item.timeAgo}</span>
                        </div>
                        <div className="flex items-center space-x-1" title={`Market Impact Score: ${item.impactScore}/10`}>
                          <Zap className={`h-3 w-3 ${item.impactScore >= 8 ? "text-amber-400" : "text-slate-400"}`} />
                          <span className="font-bold">Impact {item.impactScore}/10</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {news.filter(item => newsFilter === 'All' || item.category === newsFilter).length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-slate-400 font-medium">No live headlines found matching "{newsFilter}"</p>
                  <p className="text-xs text-slate-500">Wait for next update cycle or choose another tab.</p>
                </div>
              )}
            </div>
          )}
        </AnimatedCard>

        {/* Lower Grid: Goals Progress & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Target Financial Goals */}
          <AnimatedCard
            title="Target Life Milestones"
            subtitle="Compound progress indicators mapping savings against future financial goals"
            headerAction={
              <Link to="/goals" className="text-xs text-cyan-400 flex items-center space-x-1 hover:underline">
                <span>Configure Goals</span>
                <Plus className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <div className="space-y-5">
              {goals.map((goal, i) => {
                const progressPercent = Math.min(100, Math.round((goal.currentSavings / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-sans font-bold text-white">{goal.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase">
                          {goal.category}
                        </span>
                      </div>
                      <span className="font-mono text-cyan-400 font-bold text-xs">{progressPercent}%</span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1 }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Saved: {currencyFormatter(goal.currentSavings)}</span>
                      <span>Target: {currencyFormatter(goal.targetAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedCard>

          {/* Recent Ledger Activity */}
          <AnimatedCard
            title="Recent Ledger Transactions"
            subtitle="Most recent completed electronic transactions and transfers"
            headerAction={
              <Link to="/analytics" className="text-xs text-cyan-400 flex items-center space-x-1 hover:underline">
                <span>View Analytics</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <div className="divide-y divide-slate-800/60 space-y-3.5">
              {recentTx.map((tx, idx) => (
                <div key={tx.id} className="flex items-center justify-between pt-3.5 first:pt-0">
                  <div className="flex items-center space-x-3">
                    {/* Category color indicator */}
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      tx.type === "credit" ? "bg-emerald-500" : tx.status === "flagged" ? "bg-red-500 animate-pulse" : "bg-cyan-500"
                    }`} />
                    <div>
                      <p className={`font-sans font-bold text-sm ${tx.status === "flagged" ? "text-red-400" : "text-white"}`}>
                        {tx.description}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5 font-mono">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{tx.category}</span>
                        {tx.status === "flagged" && (
                          <span className="text-[10px] text-red-400 font-bold bg-red-950/40 border border-red-500/20 px-1.5 py-0.2 rounded-md uppercase">
                            FLAGGED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`font-mono font-extrabold text-sm ${
                      tx.type === "credit" ? "text-emerald-400" : "text-slate-200"
                    }`}>
                      {tx.type === "credit" ? "+" : "-"}{currencyFormatter(tx.amount)}
                    </span>
                    <button
                      id={`btn-del-tx-${tx.id}`}
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${tx.description}"?`)) {
                          onDeleteTransaction?.(tx.id);
                        }
                      }}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

        </div>

      </div>
    </div>
  );
}
