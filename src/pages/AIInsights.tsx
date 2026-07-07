import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Percent,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Cpu,
  RefreshCw,
  Zap,
  Check
} from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import { AIInsight } from "../types";

export default function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executedActions, setExecutedActions] = useState<string[]>([]);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleActionClick = (insightId: string, actionText: string) => {
    if (executedActions.includes(insightId)) return;
    setExecutedActions(prev => [...prev, insightId]);
    alert(`Action executed: "${actionText}". Your priority digital advisor is processing the fund allocation on the IDBI mainframe.`);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "budget": return "from-amber-600 to-amber-400";
      case "saving": return "from-blue-600 to-cyan-400";
      case "investment": return "from-emerald-600 to-teal-400";
      case "alert": return "from-rose-600 to-orange-400";
      default: return "from-slate-600 to-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
              NEURAL ANALYTICS HUB
            </span>
            <h1 className="text-3xl font-extrabold font-sans text-white mt-3">
              AI Wealth Insights
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Automated continuous scanning of active portfolios, expenses, interest indices, and retirement paces.
            </p>
          </div>

          <button
            onClick={fetchInsights}
            disabled={isLoading}
            className="self-start sm:self-center px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-mono text-slate-300 rounded-xl flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Force Re-Scan</span>
          </button>
        </div>

        {/* Dynamic insights cards list */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 animate-pulse space-y-4">
                <div className="h-6 bg-slate-800 rounded w-1/4" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((ins, idx) => {
              const isExecuted = executedActions.includes(ins.id);
              return (
                <motion.div
                  key={ins.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-4 relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300 shadow-xl"
                >
                  {/* Category Glow Line top */}
                  <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${getCategoryColor(ins.category)}`} />

                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-slate-950/60 rounded-xl text-cyan-400">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">{ins.category} scan</span>
                        <h4 className="font-sans font-extrabold text-lg text-white">
                          {ins.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Confidence</span>
                      <span className="text-cyan-400 font-mono font-bold text-xs">{ins.confidence}%</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-200 font-sans leading-relaxed">
                    {ins.description}
                  </p>

                  {/* Reason & Explanation detail */}
                  <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl text-xs text-slate-400 space-y-1.5 font-sans">
                    <span className="font-bold text-slate-300 block">AI Neural Breakdown:</span>
                    <p className="leading-relaxed">{ins.reason}</p>
                  </div>

                  {/* Call to action action execution button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
                    <p className="text-xs text-slate-400 italic">
                      Executing this item immediately allocates relevant portfolio balances.
                    </p>
                    
                    <button
                      onClick={() => handleActionClick(ins.id, ins.suggestedAction)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                        isExecuted
                          ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                          : "bg-cyan-400 hover:bg-cyan-500 text-slate-950 shadow-md shadow-cyan-400/10"
                      }`}
                      disabled={isExecuted}
                    >
                      {isExecuted ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Action Executed</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>Execute: {ins.suggestedAction.split("Transfer ")[1] || ins.suggestedAction}</span>
                        </>
                      )}
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
