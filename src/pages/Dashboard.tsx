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
  Newspaper
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
}

export default function Dashboard({ userData, onInvestInGoal }: DashboardProps) {
  const [tickerAnimate, setTickerAnimate] = useState(false);
  const [news, setNews] = useState<FinancialNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsFilter, setNewsFilter] = useState<'All' | 'Market' | 'Banking' | 'Policy' | 'Global' | 'Tech'>('All');
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setNews(data);
        setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error("Error fetching news: ", err);
    } finally {
      setNewsLoading(false);
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

                  <span className={`font-mono font-extrabold text-sm ${
                    tx.type === "credit" ? "text-emerald-400" : "text-slate-200"
                  }`}>
                    {tx.type === "credit" ? "+" : "-"}{currencyFormatter(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedCard>

        </div>

      </div>
    </div>
  );
}
