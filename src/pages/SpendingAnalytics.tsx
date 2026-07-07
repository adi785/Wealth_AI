import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  Info,
  Calendar,
  Filter,
  ArrowUpDown,
  Compass,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Trash2
} from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import { Transaction } from "../types";

interface SpendingAnalyticsProps {
  transactions: Transaction[];
  monthlyIncome: number;
  onAddTransaction?: (newTx: Omit<Transaction, "id">) => void;
  onDeleteTransaction?: (txId: string) => void;
}

export default function SpendingAnalytics({
  transactions,
  monthlyIncome,
  onAddTransaction,
  onDeleteTransaction
}: SpendingAnalyticsProps) {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Colors mapping for category pie
  const COLORS: { [key: string]: string } = {
    Food: "#f59e0b",
    Travel: "#06b6d4",
    Shopping: "#f43f5e",
    Utilities: "#10b981",
    Entertainment: "#8b5cf6",
    Healthcare: "#ef4444",
    Bills: "#3b82f6",
    EMI: "#ec4899",
    Investment: "#6366f1",
  };

  const currencyFormatter = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Group transactions for Pie Chart (ignore income type)
  const expenses = transactions.filter(t => t.type === "debit");
  const totalDebits = expenses.reduce((acc, t) => acc + t.amount, 0);

  const categoryGrouping = expenses.reduce((acc: { [key: string]: number }, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.keys(categoryGrouping).map(cat => ({
    name: cat,
    value: categoryGrouping[cat],
    color: COLORS[cat] || "#64748b"
  })).sort((a, b) => b.value - a.value);

  // Hardcoded 3-month comparison data
  const compareTrend = [
    { month: "April", Income: 145000, Spending: 72000, Savings: 73000 },
    { month: "May", Income: 145000, Spending: 78500, Savings: 66500 },
    { month: "June", Income: 145000, Spending: 84300, Savings: 60700 },
  ];

  // Table filtering and sorting
  const categoriesList = ["All", "Food", "Travel", "Shopping", "Utilities", "Entertainment", "Healthcare", "Bills", "EMI", "Investment"];
  
  const filteredTx = transactions
    .filter(t => filterCategory === "All" || t.category === filterCategory)
    .sort((a, b) => {
      if (sortOrder === "desc") {
        return b.date.localeCompare(a.date);
      } else {
        return a.date.localeCompare(b.date);
      }
    });

  const toggleSort = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  return (
    <div className="pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative overflow-hidden bg-transparent">
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
            REAL-TIME DEBIT AUDITING
          </span>
          <h1 className="text-3xl font-extrabold font-sans text-white mt-3">
            AI Spending Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Visualizing cash outflows, utility recurring bills, and micro transactional leakages.
          </p>
        </div>

        {/* Top summary row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Debits Audited (90 Days)</p>
            <h3 className="text-2xl font-extrabold text-white mt-2">{currencyFormatter(totalDebits)}</h3>
            <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1.5">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span>April 1, 2026 - July 7, 2026</span>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Top Expenditure category</p>
            <h3 className="text-2xl font-extrabold text-red-400 mt-2">
              {pieData[0]?.name || "EMI"} ({currencyFormatter(pieData[0]?.value || 0)})
            </h3>
            <p className="text-xs text-slate-400 mt-2">Accounted for {Math.round(((pieData[0]?.value || 0) / totalDebits) * 100)}% of total cash outflows</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">AI Outflow Leakage Indicator</p>
            <div className="flex items-center space-x-2.5 mt-2">
              <span className="text-2xl font-extrabold text-amber-400">Moderate Leak</span>
              <span className="text-xs bg-amber-950/40 text-amber-400 px-2.5 py-0.5 rounded-lg font-bold border border-amber-500/20">
                17% Spike
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">High density of non-essential Zomato/Amazon deliveries detected.</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Pie Chart: Category Distribution (5 Cols) */}
          <div className="lg:col-span-5">
            <AnimatedCard title="Category Distribution" subtitle="Normalized allocation of your discretionary and fixed monthly bills">
              <div className="h-64 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => currencyFormatter(Number(v))} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              {/* Categorical Breakdown Legends */}
              <div className="grid grid-cols-2 gap-3.5 mt-4">
                {pieData.slice(0, 6).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-sans">{item.name}</span>
                    </div>
                    <span className="font-mono text-white font-bold">{Math.round((item.value / totalDebits) * 100)}%</span>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>

          {/* Bar Chart: Monthly Income vs Expenses Trend (7 Cols) */}
          <div className="lg:col-span-7">
            <AnimatedCard title="Income vs Outflow Trend" subtitle="Dynamic 3-month tracking of overall cash flow ratios">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compareTrend}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}K`} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }} formatter={(v: any) => currencyFormatter(Number(v))} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="Spending" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="Savings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </div>

        </div>

        {/* AI Insight Advisory Block */}
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl">
                <Info className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-extrabold text-white text-base">AI Spent-Audit: Discretionary Subscriptions</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  Our neural audit identified **₹8,450** of redundant monthly subscriptions and premium food ordering costs inside your Food & Entertainment ledger. Consolidating these leakages and transferring them to a Monthly Mutual Fund SIP can result in ₹1.5L extra savings by year-end.
                </p>
              </div>
            </div>
            <Link
              to="/advisor"
              className="text-xs text-cyan-400 border border-cyan-500/20 px-4 py-2.5 rounded-xl hover:bg-cyan-500/10 transition font-bold flex items-center space-x-1"
            >
              <span>Verify with AI Avatar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Detailed Transactions List Table */}
        <AnimatedCard
          title="Electronic Ledger Registry"
          subtitle="Real-time transaction log mapping every direct deposit and debit activity"
          headerAction={
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category selector */}
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-transparent text-xs font-sans text-slate-300 focus:outline-none cursor-pointer"
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Toggle */}
              <button
                onClick={toggleSort}
                className="flex items-center space-x-1 bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-300"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span>Date {sortOrder === "desc" ? "Newest" : "Oldest"}</span>
              </button>
            </div>
          }
        >
          {/* Custom table scroll wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider font-mono text-slate-400">
                  <th className="py-3 px-4">Transaction Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Ledger Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition">
                    <td className="py-4 px-4 flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        tx.type === "credit" ? "bg-emerald-500" : tx.status === "flagged" ? "bg-red-500 animate-pulse" : "bg-cyan-500"
                      }`} />
                      <div>
                        <span className={`font-sans font-bold text-sm ${tx.status === "flagged" ? "text-red-400" : "text-white"}`}>
                          {tx.description}
                        </span>
                        {tx.status === "flagged" && (
                          <div className="flex items-start mt-1.5 space-x-1 bg-red-950/20 border border-red-500/10 p-2 rounded-xl text-[10px] text-red-300">
                            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                            <span>Suspicious: {tx.flagReason}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-400">
                      {tx.date}
                    </td>
                    <td className={`py-4 px-4 text-right font-mono font-bold text-sm ${
                      tx.type === "credit" ? "text-emerald-400" : "text-slate-200"
                    }`}>
                      {tx.type === "credit" ? "+" : "-"}{currencyFormatter(tx.amount)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${tx.description}"?`)) {
                            onDeleteTransaction?.(tx.id);
                          }
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-white/5 transition cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>

      </div>
    </div>
  );
}
