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
      }
    } catch (e) {
      console.error("Failed to fetch initial ledger datasets:", e);
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
