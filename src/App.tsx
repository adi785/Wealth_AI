import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AIAvatarPage from "./pages/AIAvatarPage";
import SpendingAnalytics from "./pages/SpendingAnalytics";
import InvestmentRecommendationPage from "./pages/InvestmentRecommendation";
import FinancialGoals from "./pages/FinancialGoals";
import AIInsights from "./pages/AIInsights";
import PortfolioPage from "./pages/PortfolioPage";
import ProfilePage from "./pages/ProfilePage";
import { Transaction, Goal, Portfolio, UserProfile } from "./types";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

const fallbackUserData = {
  profile: {
    name: "Rahul Sharma",
    email: "rahul.sharma@idbi.com",
    age: 32,
    occupation: "Senior Software Engineer",
    monthlyIncome: 145000,
    riskAppetite: "Moderate" as const,
    investmentPreference: ["Mutual Funds", "Equity", "SIP"],
    language: "English",
    theme: "dark" as const
  },
  goals: [
    {
      id: "g-2000",
      name: "Buy Dream House",
      targetAmount: 7500000,
      currentSavings: 2800000,
      targetDate: "2030-12-31",
      monthlyContribution: 45000,
      category: "House" as const
    },
    {
      id: "g-2001",
      name: "Children's Education Fund",
      targetAmount: 2500000,
      currentSavings: 850000,
      targetDate: "2035-06-30",
      monthlyContribution: 15000,
      category: "Education" as const
    },
    {
      id: "g-2002",
      name: "Europe Vacation 2027",
      targetAmount: 600000,
      currentSavings: 240000,
      targetDate: "2027-05-15",
      monthlyContribution: 10000,
      category: "Vacation" as const
    }
  ],
  portfolio: {
    totalValue: 3850000,
    assets: [
      { category: "Equity Mutual Funds", amount: 1540000, percentage: 40, returnsYTD: 15.4, riskProfile: "High" as const, color: "#06b6d4" },
      { category: "Debt Funds & Bonds", amount: 962500, percentage: 25, returnsYTD: 8.2, riskProfile: "Medium" as const, color: "#3b82f6" },
      { category: "Fixed Deposit (FD)", amount: 577500, percentage: 15, returnsYTD: 7.1, riskProfile: "Low" as const, color: "#10b981" },
      { category: "Digital Gold", amount: 385000, percentage: 10, returnsYTD: 11.4, riskProfile: "Low" as const, color: "#f59e0b" },
      { category: "Government Bonds", amount: 385000, percentage: 10, returnsYTD: 6.8, riskProfile: "Low" as const, color: "#6366f1" }
    ],
    totalReturns: 540000,
    ytdReturnsPercentage: 12.8,
    growthHistory: [
      { month: "Jan", value: 3200000, benchmark: 3150000 },
      { month: "Feb", value: 3350000, benchmark: 3200000 },
      { month: "Mar", value: 3420000, benchmark: 3300000 },
      { month: "Apr", value: 3580000, benchmark: 3450000 },
      { month: "May", value: 3710000, benchmark: 3520000 },
      { month: "Jun", value: 3850000, benchmark: 3650000 }
    ]
  },
  transactions: [
    {
      id: "tx-3000",
      date: "2026-06-01",
      category: "Income" as const,
      description: "IDBI BANK Corporate Salary Credited",
      amount: 145000,
      type: "credit" as const,
      status: "completed" as const
    },
    {
      id: "tx-3001",
      date: "2026-06-05",
      category: "EMI" as const,
      description: "HDFC Home Loan EMI",
      amount: 32000,
      type: "debit" as const,
      status: "completed" as const
    },
    {
      id: "tx-3002",
      date: "2026-06-05",
      category: "Investment" as const,
      description: "Nippon India Small Cap SIP",
      amount: 15000,
      type: "debit" as const,
      status: "completed" as const
    }
  ],
  summary: {
    liquidBalance: 450000,
    monthlyIncome: 145000,
    monthlySpending: 84300,
    netSavings: 60700,
    financialHealthScore: 84
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
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
  } | null>(null);

  useEffect(() => {
    // Prefer Supabase Auth listener if configured
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          setToken(session.access_token);
          setIsLoggedIn(true);
        } else {
          setToken(null);
          setIsLoggedIn(false);
          setUserData(null);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }

    // Fallback to Firebase Auth listener if Supabase is not configured
    let unsubscribe: (() => void) | undefined;
    const initAuth = async () => {
      try {
        const { auth } = await import("./lib/firebase");
        unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            const userToken = await user.getIdToken();
            setToken(userToken);
            setIsLoggedIn(true);
          }
        });
      } catch (err) {
        console.error("Firebase Auth listener setup failed:", err);
      }
    };
    
    initAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const getHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch full financial data on session activation
  const fetchUserData = async () => {
    // 1. Prefer user's customized localStorage dataset if it exists
    const localCustom = localStorage.getItem("idbi_user_data_custom");
    if (localCustom) {
      try {
        setUserData(JSON.parse(localCustom));
        return;
      } catch (e) {
        console.error("Failed to parse custom local ledger data:", e);
      }
    }

    try {
      const res = await fetch("/api/user-data", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        console.warn(`Failed to fetch user-data (status: ${res.status}). Activating client-side fallback ledger.`);
        setUserData(fallbackUserData);
      }
    } catch (e) {
      console.warn("Direct network connection to backend failed. Activating client-side fallback ledger:", e);
      setUserData(fallbackUserData);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchUserData();
    }
  }, [isLoggedIn, token]);

  // Save customized data to localStorage whenever userData changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem("idbi_user_data_custom", JSON.stringify(userData));
    }
  }, [userData]);

  // Handle mock and real logouts
  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      } else {
        const { auth } = await import("./lib/firebase");
        await auth.signOut();
      }
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
    // Optional: Keep custom data or clear on logout. Let's keep it to prevent losing work.
    setIsLoggedIn(false);
    setUserData(null);
    setToken(null);
  };

  // On Login success
  const handleLoginSuccess = (email: string) => {
    setIsLoggedIn(true);
    if (!token) {
      setToken("mock-token-rahul");
    }
  };

  // Recalculates summaries and financial health dynamically based on portfolio and transaction logs
  const getRecalculatedSummary = (
    profile: UserProfile,
    goals: Goal[],
    portfolio: Portfolio,
    transactions: Transaction[]
  ) => {
    const totalCredits = transactions.filter(t => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = transactions.filter(t => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);
    
    const startingBalance = Number(localStorage.getItem("idbi_starting_balance") || "450000");
    const liquidBalance = Math.max(0, startingBalance + totalCredits - totalDebits);
    
    const monthlyIncome = profile.monthlyIncome || 120000;
    const monthlySpending = transactions
      .filter(t => t.type === "debit" && t.category !== "Investment")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netSavings = Math.max(0, monthlyIncome - monthlySpending);
    const savingsRatio = monthlyIncome > 0 ? (netSavings / monthlyIncome) : 0;
    let score = 50 + Math.round(savingsRatio * 50);
    if (score > 100) score = 100;
    if (score < 30) score = 30;

    return {
      liquidBalance,
      monthlyIncome,
      monthlySpending,
      netSavings,
      financialHealthScore: score
    };
  };

  // Add new savings goal
  const handleAddGoal = async (newGoal: {
    name: string;
    targetAmount: number;
    targetDate: string;
    monthlyContribution: number;
    category: 'House' | 'Car' | 'Education' | 'Vacation' | 'Retirement' | 'General';
  }) => {
    if (!userData) return;
    const goalId = `g-custom-${Date.now()}`;
    const goalObj: Goal = {
      ...newGoal,
      id: goalId,
      currentSavings: 0
    };

    const updatedGoals = [...userData.goals, goalObj];
    setUserData({
      ...userData,
      goals: updatedGoals
    });

    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newGoal),
      });
    } catch (error) {
      console.warn("Backend unavailable, goal saved in offline-mode.");
    }
  };

  // Delete an existing goal
  const handleDeleteGoal = (goalId: string) => {
    if (!userData) return;
    const updatedGoals = userData.goals.filter(g => g.id !== goalId);
    setUserData({
      ...userData,
      goals: updatedGoals
    });
  };

  // Allocate cash from liquid surplus to a targeted goal
  const handleInvestInGoal = async (goalId: string, amount: number) => {
    if (!userData) return;
    
    // Check liquidity limits first
    if (amount > userData.summary.liquidBalance) {
      alert("Insufficient liquid balance.");
      return;
    }

    const updatedGoals = userData.goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          currentSavings: g.currentSavings + amount
        };
      }
      return g;
    });

    // To deduct this investment from liquid cash, we log a corresponding Debit Transaction!
    const targetGoalName = userData.goals.find(g => g.id === goalId)?.name || "Goal Allocation";
    const goalDebitTx: Transaction = {
      id: `tx-invest-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      category: "Investment",
      description: `Allocated funds to: ${targetGoalName}`,
      amount: amount,
      type: "debit",
      status: "completed"
    };

    const updatedTransactions = [goalDebitTx, ...userData.transactions];
    const newSummary = getRecalculatedSummary(userData.profile, updatedGoals, userData.portfolio, updatedTransactions);

    setUserData({
      ...userData,
      goals: updatedGoals,
      transactions: updatedTransactions,
      summary: newSummary
    });

    try {
      await fetch("/api/goals/invest", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ goalId, amount }),
      });
    } catch (error) {
      console.warn("Backend unavailable, investment logged in offline-mode.");
    }
  };

  // Add a brand-new custom transaction
  const handleAddTransaction = (newTx: Omit<Transaction, "id">) => {
    if (!userData) return;
    const txId = `tx-custom-${Date.now()}`;
    const txObj: Transaction = {
      ...newTx,
      id: txId,
      status: "completed"
    };

    const updatedTransactions = [txObj, ...userData.transactions];
    const newSummary = getRecalculatedSummary(userData.profile, userData.goals, userData.portfolio, updatedTransactions);

    setUserData({
      ...userData,
      transactions: updatedTransactions,
      summary: newSummary
    });
  };

  // Delete a transaction from registry
  const handleDeleteTransaction = (txId: string) => {
    if (!userData) return;
    const updatedTransactions = userData.transactions.filter(t => t.id !== txId);
    const newSummary = getRecalculatedSummary(userData.profile, userData.goals, userData.portfolio, updatedTransactions);

    setUserData({
      ...userData,
      transactions: updatedTransactions,
      summary: newSummary
    });
  };

  // Edit custom portfolio asset weights
  const handleUpdatePortfolioAssets = (updatedAssets: typeof userData.portfolio.assets) => {
    if (!userData) return;
    const totalValue = updatedAssets.reduce((sum, a) => sum + a.amount, 0);
    const finalAssets = updatedAssets.map(a => ({
      ...a,
      percentage: totalValue > 0 ? Math.round((a.amount / totalValue) * 100) : 0
    }));

    // Weighted returns percentage
    const totalWeightedReturns = finalAssets.reduce((sum, a) => sum + (a.returnsYTD * a.amount), 0);
    const ytdReturnsPercentage = totalValue > 0 ? Number((totalWeightedReturns / totalValue).toFixed(1)) : 0;
    const totalReturns = Math.round(totalValue * 0.14); // estimate 14% historical compounding returns

    const updatedPortfolio = {
      ...userData.portfolio,
      assets: finalAssets,
      totalValue,
      totalReturns,
      ytdReturnsPercentage
    };

    setUserData({
      ...userData,
      portfolio: updatedPortfolio
    });
  };

  // Clean Slate: Clear all sample data
  const handleClearSampleData = () => {
    const cleanFreshUserData = {
      profile: {
        name: "My Name",
        email: "client@idbi.com",
        age: 30,
        occupation: "Private Sector Executive",
        monthlyIncome: 120000,
        riskAppetite: "Moderate" as const,
        investmentPreference: ["Mutual Funds"],
        language: "English",
        theme: "dark" as const
      },
      goals: [],
      portfolio: {
        totalValue: 0,
        assets: [],
        totalReturns: 0,
        ytdReturnsPercentage: 0,
        growthHistory: [
          { month: "Jan", value: 0, benchmark: 0 },
          { month: "Feb", value: 0, benchmark: 0 },
          { month: "Mar", value: 0, benchmark: 0 },
          { month: "Apr", value: 0, benchmark: 0 },
          { month: "May", value: 0, benchmark: 0 },
          { month: "Jun", value: 0, benchmark: 0 }
        ]
      },
      transactions: [],
      summary: {
        liquidBalance: 200000, // Initialize with custom starting credit
        monthlyIncome: 120000,
        monthlySpending: 0,
        netSavings: 120000,
        financialHealthScore: 100
      }
    };
    localStorage.setItem("idbi_starting_balance", "200000");
    setUserData(cleanFreshUserData);
    alert("Sample data successfully cleared! Feed your own name, custom profile, assets, and transactions.");
  };

  // Restore the pre-filled IDBI demo ledger
  const handleRestoreDemoData = () => {
    localStorage.removeItem("idbi_user_data_custom");
    localStorage.removeItem("idbi_starting_balance");
    setUserData(fallbackUserData);
    alert("Pre-filled IDBI demonstration ledger restored successfully.");
  };

  // Sync profile details updated inside settings
  const handleUpdateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!userData) return;
    const nextProfile = {
      ...userData.profile,
      ...updatedProfile,
    } as UserProfile;

    const newSummary = getRecalculatedSummary(nextProfile, userData.goals, userData.portfolio, userData.transactions);

    setUserData({
      ...userData,
      profile: nextProfile,
      summary: newSummary,
    });

    try {
      await fetch("/api/update-profile", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(updatedProfile),
      });
    } catch (error) {
      console.warn("Failed to sync profile updates on backend, updated offline.");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
        {/* Background Mesh Gradients (Static) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Nav Header Shell */}
        <Navbar
          isLoggedIn={isLoggedIn}
          userName={userData?.profile?.name || "Rahul Sharma"}
          onLogout={handleLogout}
        />

        {/* Content Portals */}
        <div className="flex-grow">
          <Routes>
            {/* Landing home page route */}
            <Route
              path="/"
              element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />}
            />

            {/* Login router */}
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
            />

            {/* Private Portfolio dashboard routers */}
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <Dashboard
                    userData={userData}
                    onInvestInGoal={handleInvestInGoal}
                    onClearSampleData={handleClearSampleData}
                    onRestoreDemoData={handleRestoreDemoData}
                    onAddTransaction={handleAddTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/advisor"
              element={
                isLoggedIn && userData ? (
                  <AIAvatarPage profile={userData.profile} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/analytics"
              element={
                isLoggedIn && userData ? (
                  <SpendingAnalytics
                    transactions={userData.transactions}
                    monthlyIncome={userData.summary.monthlyIncome}
                    onAddTransaction={handleAddTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/recommendations"
              element={
                isLoggedIn && userData ? (
                  <InvestmentRecommendationPage
                    currentRiskAppetite={userData.profile.riskAppetite}
                    onUpdateRiskAppetite={(newRisk) => {
                      handleUpdateProfile({ riskAppetite: newRisk });
                    }}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/goals"
              element={
                isLoggedIn && userData ? (
                  <FinancialGoals
                    goals={userData.goals}
                    onAddGoal={handleAddGoal}
                    onInvestInGoal={handleInvestInGoal}
                    onDeleteGoal={handleDeleteGoal}
                    liquidBalance={userData.summary.liquidBalance}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/insights"
              element={
                isLoggedIn ? (
                  <AIInsights />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/portfolio"
              element={
                isLoggedIn && userData ? (
                  <PortfolioPage
                    portfolio={userData.portfolio}
                    onUpdatePortfolioAssets={handleUpdatePortfolioAssets}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/profile"
              element={
                isLoggedIn && userData ? (
                  <ProfilePage profile={userData.profile} onUpdateProfile={handleUpdateProfile} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Fallback routing redirects */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer Status Bar */}
        <footer className="h-10 px-8 flex items-center justify-between text-[10px] text-slate-500 bg-black/20 border-t border-white/5 z-10">
          <div className="flex gap-6">
            <span>Market Index: <span className="text-emerald-400 font-bold">NIFTY 50 22,450 (+0.8%)</span></span>
            <span>AI Model: <span className="text-slate-300">Wealthv4.2-Pro</span></span>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Secure Connection</span>
            <span>Last Sync: 2 mins ago</span>
          </div>
        </footer>

      </div>
    </Router>
  );
}
