import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Plus,
  HelpCircle,
  TrendingUp,
  Percent,
  Calendar,
  CheckCircle,
  Calculator,
  ChevronDown,
  Compass,
  DollarSign,
  Briefcase,
  Trash2
} from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import { Goal } from "../types";

interface FinancialGoalsProps {
  goals: Goal[];
  onAddGoal: (goal: {
    name: string;
    targetAmount: number;
    targetDate: string;
    monthlyContribution: number;
    category: 'House' | 'Car' | 'Education' | 'Vacation' | 'Retirement' | 'General';
  }) => void;
  onInvestInGoal: (goalId: string, amount: number) => void;
  onDeleteGoal?: (goalId: string) => void;
  liquidBalance: number;
}

export default function FinancialGoals({ goals, onAddGoal, onInvestInGoal, onDeleteGoal, liquidBalance }: FinancialGoalsProps) {
  // Add Goal Form State
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("2031-12-31");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [category, setCategory] = useState<'House' | 'Car' | 'Education' | 'Vacation' | 'Retirement' | 'General'>("House");

  // Allocate funds modal/state
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [investAmount, setInvestAmount] = useState("");

  // Inflation Calculator State
  const [baseCost, setBaseCost] = useState("5000000"); // 50 Lakhs default
  const [inflationRate, setInflationRate] = useState("6"); // 6% average
  const [years, setYears] = useState("7"); // 7 years

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !monthlyContribution) {
      alert("Please complete all goal parameters.");
      return;
    }
    onAddGoal({
      name,
      targetAmount: Number(targetAmount),
      targetDate,
      monthlyContribution: Number(monthlyContribution),
      category
    });
    setName("");
    setTargetAmount("");
    setMonthlyContribution("");
  };

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !investAmount) return;
    if (Number(investAmount) > liquidBalance) {
      alert("Insufficient liquid balance in your IDBI ledger accounts.");
      return;
    }
    onInvestInGoal(selectedGoalId, Number(investAmount));
    setInvestAmount("");
    setSelectedGoalId("");
    alert("Capital successfully allocated and mapped towards goal!");
  };

  const currencyFormatter = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Inflation calculations
  const parsedBase = Number(baseCost) || 0;
  const parsedInflation = Number(inflationRate) || 0;
  const parsedYears = Number(years) || 0;
  
  const futureCost = parsedBase * Math.pow(1 + parsedInflation / 100, parsedYears);
  
  // Necessary Monthly SIP (simple compound interest factor assuming 12% equity growth)
  const rateOfReturn = 12 / 100;
  const monthlyRate = rateOfReturn / 12;
  const totalMonths = parsedYears * 12;
  const monthlySavingsNeeded = totalMonths > 0 ? (futureCost * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1) : 0;

  return (
    <div className="pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative overflow-hidden bg-transparent">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
            MILESTONE ENGINE
          </span>
          <h1 className="text-3xl font-extrabold font-sans text-white mt-3">
            Financial Goal Planner
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Map out life milestones, test inflation parameters, and securely allocate liquid assets toward target goals.
          </p>
        </div>

        {/* Goals Progress list & Form Add Goal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Goals list and Allocator (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatedCard title="Active Life Milestones" subtitle="Monitor current balances and compounding timelines of your mapped goals">
              <div className="space-y-6">
                {goals.map((goal, i) => {
                  const progressPercent = Math.min(100, Math.round((goal.currentSavings / goal.targetAmount) * 100));
                  return (
                    <div key={goal.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-sans font-extrabold text-white text-base">{goal.name}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-cyan-400 uppercase tracking-widest border border-white/10">
                            {goal.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-cyan-400 font-bold">{progressPercent}%</span>
                          <button
                            id={`btn-del-goal-${goal.id}`}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete goal "${goal.name}"?`)) {
                                onDeleteGoal?.(goal.id);
                              }
                            }}
                            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                            title="Delete goal"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs font-sans text-slate-400 pt-1">
                        <div>
                          <span className="block text-[10px] uppercase font-mono text-slate-500">Accumulated</span>
                          <span className="text-slate-200 font-bold font-mono">{currencyFormatter(goal.currentSavings)}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-mono text-slate-500">Target Cost</span>
                          <span className="text-slate-200 font-bold font-mono">{currencyFormatter(goal.targetAmount)}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-mono text-slate-500">Target Year</span>
                          <span className="text-slate-300 font-bold font-mono">{goal.targetDate.split("-")[0]}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                        <span className="text-slate-500 font-mono">SIP contribution: {currencyFormatter(goal.monthlyContribution)}/month</span>
                        <button
                          onClick={() => setSelectedGoalId(goal.id)}
                          className="text-cyan-400 font-bold hover:underline"
                        >
                          Allocate Cash
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedCard>

            {/* Micro Fund Allocator Modal-esque Card */}
            {selectedGoalId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-sans font-bold text-white text-sm">Direct Liquid Cash Allocation</h4>
                  <button onClick={() => setSelectedGoalId("")} className="text-xs text-slate-400 hover:text-white">
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Transfer idle liquidity directly towards this milestone. Your IDBI ledger available liquidity is: <span className="text-cyan-400 font-bold font-mono">{currencyFormatter(liquidBalance)}</span>.
                </p>

                <form onSubmit={handleAllocateSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder="Allocation Amount (₹)"
                    className="block w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-xl text-xs font-mono outline-none text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl text-xs hover:from-blue-700 hover:to-cyan-600 transition"
                  >
                    Confirm Allocation
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Goal Creator Form Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatedCard title="Create Life Milestone" subtitle="Construct a new targeted financial objective to monitor">
              <form onSubmit={handleAddGoalSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pune City Apartment"
                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-2xl text-xs outline-none text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Target Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="e.g. 7500000"
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-2xl text-xs font-mono outline-none text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-sans outline-none text-slate-300"
                    >
                      <option value="House">House</option>
                      <option value="Car">Car</option>
                      <option value="Education">Education</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Retirement">Retirement</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono outline-none text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Monthly SIP Target (₹)
                    </label>
                    <input
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      placeholder="e.g. 45000"
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-2xl text-xs font-mono outline-none text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 font-bold rounded-2xl text-xs text-white shadow-md shadow-cyan-500/10 transition"
                >
                  Create Goal and Activate Tracking
                </button>
              </form>
            </AnimatedCard>
          </div>

        </div>

        {/* Inflation-Adjusted Compound Saving Calculator */}
        <div className="p-8 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <Calculator className="h-6 w-6 text-cyan-400" />
            <div>
              <h3 className="font-sans font-extrabold text-lg text-white">Compound Inflation Optimizer</h3>
              <p className="text-xs text-slate-400">Illustrate actual future costs of life milestones and calculate SIP multipliers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input params (6 Cols) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Base Capital Cost (₹)</label>
                <input
                  type="number"
                  value={baseCost}
                  onChange={(e) => setBaseCost(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-xl text-xs font-mono outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Avg Inflation (%)</label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-xl text-xs font-mono outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Target Horizon (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-xl text-xs font-mono outline-none text-white"
                />
              </div>
            </div>

            {/* Results Panel (6 Cols) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Inflated Target Cost</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono block mt-1">
                  {currencyFormatter(futureCost)}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Cost value increased by {Math.round(((futureCost - parsedBase) / Math.max(1, parsedBase)) * 100)}% over {years} years.</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Compound Monthly SIP (12% CAGR)</span>
                <span className="text-xl font-extrabold text-cyan-400 font-mono block mt-1">
                  {currencyFormatter(monthlySavingsNeeded)}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Assumes standard long-term index hybrid returns pacing.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
