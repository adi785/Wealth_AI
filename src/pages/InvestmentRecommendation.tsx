import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Percent,
  CheckCircle,
  AlertTriangle,
  Info,
  Sliders,
  Shield,
  HelpCircle,
  Compass,
  Zap,
  ArrowRight
} from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import { InvestmentRecommendation, UserProfile } from "../types";

interface InvestmentRecommendationProps {
  currentRiskAppetite: "Conservative" | "Moderate" | "Aggressive";
  onUpdateRiskAppetite: (newRisk: "Conservative" | "Moderate" | "Aggressive") => void;
}

export default function InvestmentRecommendationPage({
  currentRiskAppetite,
  onUpdateRiskAppetite
}: InvestmentRecommendationProps) {
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch recommendations from API on mount and when risk appetite changes
  useEffect(() => {
    const fetchRecs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/investment-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ riskAppetite: currentRiskAppetite })
        });
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecs();
  }, [currentRiskAppetite]);

  const currencyFormatter = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const riskOptions = [
    {
      level: "Conservative" as const,
      desc: "Capital preservation is paramount. Yields are highly stable with zero exposure to high-volatility equities.",
      returns: "6.5% - 8.2% p.a.",
      volatility: "Ultra-Low"
    },
    {
      level: "Moderate" as const,
      desc: "Balanced capital growth. Combined blue-chip indices with fixed debt tools to handle brief market fluctuations.",
      returns: "11.5% - 14.5% p.a.",
      volatility: "Moderate"
    },
    {
      level: "Aggressive" as const,
      desc: "Maximizing long-term compound yields. Includes higher exposures to mid-cap funds, active stocks, and foreign indexes.",
      returns: "15% - 18.5% p.a.",
      volatility: "High"
    }
  ];

  return (
    <div className="pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative overflow-hidden bg-transparent">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
            REAL-TIME PORTFOLIO OPTIMIZATION
          </span>
          <h1 className="text-3xl font-extrabold font-sans text-white mt-3">
            AI Wealth Recommendations
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Dynamic asset profiling mapped to your personal earnings, financial safety cushion, and risk appetite indices.
          </p>
        </div>

        {/* Risk Selection Slices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Profile assessment / Risk Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatedCard title="Configure Risk Appetite" subtitle="Determine your investment behavior and volatility profile">
              <div className="space-y-4">
                {riskOptions.map((opt) => {
                  const isSelected = currentRiskAppetite === opt.level;
                  return (
                    <button
                      key={opt.level}
                      onClick={() => onUpdateRiskAppetite(opt.level)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all flex flex-col space-y-2.5 ${
                        isSelected
                          ? "bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-sans font-bold text-base ${isSelected ? "text-cyan-400" : "text-white"}`}>
                          {opt.level}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-lg">
                            ACTIVE INDEX
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-white/10 text-xs font-mono w-full">
                        <div>
                          <span className="text-slate-500 block uppercase text-[10px] tracking-wider">Historical Returns</span>
                          <span className="text-slate-200 font-bold">{opt.returns}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase text-[10px] tracking-wider">Volatility Grade</span>
                          <span className="text-slate-200 font-bold">{opt.volatility}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </AnimatedCard>

            {/* Risk Index Meter Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center space-x-3.5 mb-4">
                <Sliders className="h-5 w-5 text-cyan-400" />
                <h4 className="font-sans font-bold text-white text-sm">Diversification Scoring Matrix</h4>
              </div>
              
              <div className="space-y-4">
                {/* Diversification scoring gauge */}
                <div className="space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Diversification Score</span>
                    <span className="text-cyan-400 font-bold font-mono">92/100</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Volatility Exposure</span>
                    <span className="text-blue-400 font-bold font-mono">Moderate</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "55%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment recommendations results list (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-sans font-bold text-lg text-white">AI-Optimized Asset Recommendations</h3>
                <span className="text-xs font-mono text-slate-400">{recommendations.length} SUGGESTIONS GENERATED</span>
              </div>

              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 animate-pulse space-y-4">
                      <div className="h-5 bg-slate-800 rounded w-1/3" />
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-4 bg-slate-800 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {recommendations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5 hover:border-white/20 transition duration-300 backdrop-blur-xl"
                    >
                      {/* Title and Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/10">
                        <div>
                          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                            {rec.assetClass}
                          </span>
                          <h4 className="font-sans font-extrabold text-xl text-white mt-1">
                            {rec.name}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500 block uppercase font-mono">Expected Returns</span>
                          <span className="text-emerald-400 font-extrabold font-mono text-sm">
                            {rec.expectedReturn}
                          </span>
                        </div>
                      </div>

                      {/* Suitability */}
                      <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-xs text-slate-300 font-sans leading-relaxed flex items-start space-x-2.5 backdrop-blur-md">
                        <Compass className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white">Suitability Check:</span> {rec.suitability}
                        </div>
                      </div>

                      {/* Why recommend */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Investment Strategy</h5>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{rec.why}</p>
                      </div>

                      {/* Benefits & Disclosures */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs font-sans">
                        <div className="space-y-2">
                          <h5 className="font-mono uppercase text-slate-400 tracking-wider text-[10px]">Strategic Advantages</h5>
                          <ul className="space-y-1.5">
                            {rec.benefits.map((b, i) => (
                              <li key={i} className="flex items-center space-x-1.5 text-slate-300">
                                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-mono uppercase text-slate-400 tracking-wider text-[10px]">Risk Disclosures</h5>
                          <div className="flex items-start space-x-1.5 text-slate-400 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{rec.risks}</span>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
