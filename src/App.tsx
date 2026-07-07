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

  // Add new savings goal and sync with backend
  const handleAddGoal = async (newGoal: {
    name: string;
    targetAmount: number;
    targetDate: string;
    monthlyContribution: number;
    category: 'House' | 'Car' | 'Education' | 'Vacation' | 'Retirement' | 'General';
  }) => {
    if (!userData) return;
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newGoal),
      });
      const data = await res.json();
      if (data.success && userData) {
        setUserData({
          ...userData,
          goals: data.goals,
        });
      }
    } catch (error) {
      console.error("Add goal error:", error);
    }
  };

  // Allocate cash from liquid surplus to a targeted goal
  const handleInvestInGoal = async (goalId: string, amount: number) => {
    if (!userData) return;
    
    // Check liquidity limits first
    if (amount > userData.summary.liquidBalance) {
      alert("Insufficient liquid balance.");
      return;
    }

    try {
      const res = await fetch("/api/goals/invest", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ goalId, amount }),
      });
      const data = await res.json();
      if (data.success && userData) {
        setUserData({
          ...userData,
          goals: data.goals,
          summary: {
            ...userData.summary,
            liquidBalance: userData.summary.liquidBalance - amount,
          },
        });
      }
    } catch (error) {
      console.error("Fund allocation error:", error);
    }
  };

  // Sync profile details updated inside settings
  const handleUpdateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!userData) return;
    setUserData({
      ...userData,
      profile: {
        ...userData.profile,
        ...updatedProfile,
      } as UserProfile,
      summary: {
        ...userData.summary,
        monthlyIncome: updatedProfile.monthlyIncome ?? userData.summary.monthlyIncome,
      },
    });

    try {
      await fetch("/api/update-profile", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(updatedProfile),
      });
    } catch (error) {
      console.error("Failed to sync profile updates on backend:", error);
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
                  <Dashboard userData={userData} onInvestInGoal={handleInvestInGoal} />
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
                  <SpendingAnalytics transactions={userData.transactions} monthlyIncome={userData.summary.monthlyIncome} />
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
                  <PortfolioPage portfolio={userData.portfolio} />
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
