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

const fallbackRecsMap: Record<string, InvestmentRecommendation[]> = {
  Conservative: [
    {
      id: "rec-con-1",
      assetClass: "Fixed Deposit",
      name: "IDBI Suvidha Tax Saving FD",
      expectedReturn: "7.25% p.a.",
      suitability: "Ideal for securing 100% principal preservation with zero market risk exposure.",
      why: "Provides stable, sovereign-backed interest returns with complete tax deductions under Section 80C.",
      benefits: ["100% capital safety", "Sovereign banking grade security", "Section 80C tax deduction benefits"],
      risks: "Fixed interest does not protect against hyper-inflation. Lock-in period of 5 years."
    },
    {
      id: "rec-con-2",
      assetClass: "Government Bonds",
      name: "Sovereign Gold Bonds (SGB)",
      expectedReturn: "9.5% p.a. (Gold compound + 2.5% fixed)",
      suitability: "Best for low-risk hedging against physical currency inflation.",
      why: "Guaranteed by the Government of India, offering 2.5% direct passive payouts plus appreciation of physical gold value.",
      benefits: ["No capital gains tax on maturity", "Direct interest payout bi-annually", "High inflation hedge factor"],
      risks: "8-year maturity duration with limited secondary market liquidity before 5 years."
    },
    {
      id: "rec-con-3",
      assetClass: "Emergency Fund",
      name: "IDBI Liquid Debt Mutual Fund",
      expectedReturn: "6.8% p.a.",
      suitability: "Highly suitable for immediate capital liquidity with robust stability.",
      why: "Invests only in short-term overnight commercial bills, preventing any structural equity volatility.",
      benefits: ["T+1 instant redemption", "Zero entry or exit loads", "Outperforms savings bank rates"],
      risks: "Yields drop during central bank repo rate cut cycles."
    },
    {
      id: "rec-con-4",
      assetClass: "SIP",
      name: "IDBI Low-Volatility Large Cap SIP",
      expectedReturn: "10.2% p.a.",
      suitability: "For conservative investors wishing to add subtle, safe equity growth factors.",
      why: "Targets index leaders like Reliance, TCS, and HDFC Bank, ensuring robust corporate fundamentals.",
      benefits: ["Rupee cost averaging benefits", "High dividend payout yields", "Stable market leader tracking"],
      risks: "Vulnerable to macro equity index downturns."
    }
  ],
  Moderate: [
    {
      id: "rec-1",
      assetClass: "Mutual Funds",
      name: "IDBI Equity Hybrid Fund (Growth)",
      expectedReturn: "12.5% - 14% p.a.",
      suitability: "Perfect for Moderate investors seeking capital gains with balanced downside protection.",
      why: "Invests in 65% blue-chip equities and 35% high-quality debt papers, ensuring stable growth.",
      benefits: ["Professional capital management", "Automatic rebalancing", "Tax-efficient compounding"],
      risks: "Subject to stock market corrections and interest rate movements."
    },
    {
      id: "rec-2",
      assetClass: "SIP",
      name: "IDBI Flexi-Cap Index SIP",
      expectedReturn: "15.2% p.a.",
      suitability: "Highly suitable for long-term compounding over a 5 to 7 year horizon.",
      why: "Provides broad equity exposure spanning large, mid, and small-cap industries without human fund manager bias.",
      benefits: ["Rupee cost averaging", "Lowest expense ratios", "Participates in India's technology boom"],
      risks: "High short-term volatility; recommended only for horizons greater than 5 years."
    },
    {
      id: "rec-3",
      assetClass: "Fixed Deposit",
      name: "IDBI High-Yield MOD FD",
      expectedReturn: "7.4% p.a.",
      suitability: "Ideal for securing tax-exempt returns with full emergency liquid withdrawal options.",
      why: "Guarantees 100% capital preservation and stable passive income payouts with sweeping liquidity.",
      benefits: ["Sovereign banking grade safety", "Sweeps cash automatically to FD", "Flexible interest payouts"],
      risks: "Interest rate drops slightly if funds are withdrawn prematurely."
    },
    {
      id: "rec-4",
      assetClass: "Gold",
      name: "IDBI Sovereign Gold Bond Tracker (SGB)",
      expectedReturn: "11.2% (Gold growth + 2.5% fixed interest)",
      suitability: "Essential hedge to secure inflation-beating diversification.",
      why: "Sovereign guaranteed physical gold certificate that yields extra 2.5% cash annually.",
      benefits: ["Sovereign security backing", "Zero capital gains tax on maturity", "Bi-annual cash dividends"],
      risks: "8-year maturity duration with liquidity window opening after year 5."
    }
  ],
  Aggressive: [
    {
      id: "rec-agg-1",
      assetClass: "Mutual Funds",
      name: "IDBI Focused Small & Mid-Cap Index Fund",
      expectedReturn: "18.5% p.a.",
      suitability: "For aggressive wealth seekers targeting rapid capital compounding over a decade.",
      why: "Targets emerging high-growth manufacturing, digital services, and space-tech innovators in India.",
      benefits: ["Exponential return potential", "Monitors micro-cap index cycles", "Highly agile sector weightage"],
      risks: "Extreme short-term volatility. Bear market cycles can cause 20-30% transient drawdowns."
    },
    {
      id: "rec-agg-2",
      assetClass: "ETF",
      name: "IDBI US Nasdaq-100 Tech ETF",
      expectedReturn: "16.8% p.a.",
      suitability: "Perfect for diversifying into global technology giants like Nvidia, Apple, and Google.",
      why: "Offers currency arbitrage protection (Rupee vs US Dollar) coupled with international generative AI exposure.",
      benefits: ["Foreign stock hedges", "Direct technology focus", "Protects against INR depreciation"],
      risks: "Vulnerable to US macro interest rates and international policy modifications."
    },
    {
      id: "rec-agg-3",
      assetClass: "SIP",
      name: "IDBI Dynamic Small-Cap SIP",
      expectedReturn: "19.2% p.a.",
      suitability: "Best for highly active investors pursuing rapid capital accumulation.",
      why: "Invests in high-beta enterprise stocks utilizing structured compounding entry points.",
      benefits: ["Outperforms broad domestic indexes", "Leverages small business scale", "High liquidity options"],
      risks: "Highest volatility class. Demands a holding tenure of at least 7 years."
    },
    {
      id: "rec-agg-4",
      assetClass: "Gold",
      name: "IDBI Digital Gold Accumulator Plan",
      expectedReturn: "11.5% p.a.",
      suitability: "For maintaining high-liquid inflation insurance assets alongside high-risk equities.",
      why: "Allows purchasing physical gold decimals digitally, matching market spot rates exactly.",
      benefits: ["Instant 24K gold backing", "Zero storage or vaulting fees", "Instantly tradeable/liquid"],
      risks: "Gold price moves are cyclic and heavily dependent on global currency tensions."
    }
  ]
};

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
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data);
        } else {
          console.warn("API returned error, using client-side fallback recommendations.");
          setRecommendations(fallbackRecsMap[currentRiskAppetite] || fallbackRecsMap.Moderate);
        }
      } catch (error) {
        console.warn("Failed to load recommendations, activating client-side fallbacks:", error);
        setRecommendations(fallbackRecsMap[currentRiskAppetite] || fallbackRecsMap.Moderate);
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
