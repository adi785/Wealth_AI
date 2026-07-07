import { useState } from "react";
import { motion } from "motion/react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import {
  TrendingUp,
  Percent,
  CheckCircle,
  Activity,
  Award,
  ShieldAlert,
  Sliders,
  DollarSign,
  Compass,
  ArrowUpRight
} from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import { Portfolio } from "../types";

interface PortfolioPageProps {
  portfolio: Portfolio;
}

export default function PortfolioPage({ portfolio }: PortfolioPageProps) {
  const [projectionRate, setProjectionRate] = useState<number>(12); // Default 12% growth rate
  const [projectionYears, setProjectionYears] = useState<number>(15); // Default 15 years target

  const currencyFormatter = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#6366f1"];

  // Deriving Pie Chart Data
  const pieData = portfolio.assets.map((asset, i) => ({
    name: asset.category,
    value: asset.amount,
    color: asset.color
  }));

  // Generating Compounding Future Projection Curve
  // Future Value = Current Portfolio * (1 + r/100)^year
  const projectionData = [];
  let currentVal = portfolio.totalValue;
  for (let year = 0; year <= projectionYears; year++) {
    const value = Math.round(portfolio.totalValue * Math.pow(1 + projectionRate / 100, year));
    const conservativeValue = Math.round(portfolio.totalValue * Math.pow(1 + 6.5 / 100, year)); // Base benchmark (FD)
    projectionData.push({
      year: `Year ${year}`,
      Projected: value,
      FD_Baseline: conservativeValue
    });
  }

  return (
    <div className="pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative overflow-hidden bg-transparent">
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
            PRIORITY CAPITAL ACCESS
          </span>
          <h1 className="text-3xl font-extrabold font-sans text-white mt-3">
            Priority Wealth Portfolio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Dynamic asset inventory tracking compound yields, active mutual funds, and future growth milestones.
          </p>
        </div>

        {/* Top Summary Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Net Portfolio Asset valuation</p>
            <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 mt-2 font-mono">
              {currencyFormatter(portfolio.totalValue)}
            </h3>
            <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Priority Bank Vault Status Verified</span>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Aggregated Total Earnings</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
              +{currencyFormatter(portfolio.totalReturns)}
            </h3>
            <p className="text-xs text-slate-400 mt-2">All-time passive index compound yields accrued</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Compound Annualized Yield (YTD)</p>
            <h3 className="text-3xl font-extrabold text-cyan-400 mt-2 font-mono">
              {portfolio.ytdReturnsPercentage}%
            </h3>
            <p className="text-xs text-slate-400 mt-2">Outpacing average country inflation indexes by 6.8%</p>
          </div>
        </div>

        {/* Main Grid: Allocation Tabular & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Tabular details (7 Cols) */}
          <div className="lg:col-span-7">
            <AnimatedCard title="Asset Class Allocations" subtitle="Fully-audited list of your dynamic portfolio shares">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider font-mono text-slate-500">
                      <th className="py-2 pb-3">Asset Class</th>
                      <th className="py-2 pb-3">Allocation Balance</th>
                      <th className="py-2 pb-3 font-mono">Allocation Ratio</th>
                      <th className="py-2 pb-3 font-mono">Compound YTD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {portfolio.assets.map((asset, i) => (
                      <tr key={i} className="hover:bg-white/5 transition">
                        <td className="py-4 flex items-center space-x-2.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                          <div>
                            <span className="font-sans font-bold text-sm text-white block">{asset.category}</span>
                            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Risk: {asset.riskProfile}</span>
                          </div>
                        </td>
                        <td className="py-4 font-mono font-bold text-sm text-slate-200">
                          {currencyFormatter(asset.amount)}
                        </td>
                        <td className="py-4 font-mono font-bold text-xs text-slate-400">
                          {asset.percentage}%
                        </td>
                        <td className="py-4 font-mono font-extrabold text-sm text-emerald-400">
                          +{asset.returnsYTD}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimatedCard>
          </div>

          {/* Allocation Pie Chart (5 Cols) */}
          <div className="lg:col-span-5">
            <AnimatedCard title="Visual Portfolio Breakout" subtitle="Structural breakdown of assets under priority management">
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
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

              <div className="space-y-2 mt-4 text-xs font-sans text-slate-400">
                <p className="flex items-center space-x-1.5 justify-center">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  <span>Diversification ratio holds at exceptional levels.</span>
                </p>
              </div>
            </AnimatedCard>
          </div>

        </div>

        {/* Future Valuation Projection Compounding Area Chart */}
        <AnimatedCard
          title="Compound Future Valuation Projection"
          subtitle="Project future worth of your portfolio across life milestones based on growth factors"
          headerAction={
            <div className="flex items-center space-x-4 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
              
              {/* Toggle Projected Growth */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono">Assumed Rate:</span>
                <select
                  value={projectionRate}
                  onChange={(e) => setProjectionRate(Number(e.target.value))}
                  className="bg-transparent text-xs text-cyan-400 font-mono font-bold focus:outline-none cursor-pointer"
                >
                  <option value={8} className="bg-slate-900 text-white">8% (FD Plus)</option>
                  <option value={12} className="bg-slate-900 text-white">12% (Moderate Index)</option>
                  <option value={15} className="bg-slate-900 text-white">15% (Equity Aggressive)</option>
                </select>
              </div>

              <span className="text-slate-700">|</span>

              {/* Years horizon */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono">Horizon:</span>
                <select
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(Number(e.target.value))}
                  className="bg-transparent text-xs text-cyan-400 font-mono font-bold focus:outline-none cursor-pointer"
                >
                  <option value={10} className="bg-slate-900 text-white">10 Years</option>
                  <option value={15} className="bg-slate-900 text-white">15 Years</option>
                  <option value={20} className="bg-slate-900 text-white">20 Years</option>
                  <option value={30} className="bg-slate-900 text-white">30 Years</option>
                </select>
              </div>

            </div>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${Math.round(v/100000)}L`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}
                  formatter={(value: any) => [currencyFormatter(Number(value)), "Asset Valuation"]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Projected" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#projGrad)" name={`Projected Portfolio (${projectionRate}% Yield)`} />
                <Area type="monotone" dataKey="FD_Baseline" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" name="Fixed Savings Baseline (6.5% FD)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

      </div>
    </div>
  );
}
