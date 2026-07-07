import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User,
  Sliders,
  Mail,
  SlidersHorizontal,
  Bell,
  Languages,
  CheckCircle,
  Save,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Database,
  Cable,
  Key,
  ArrowRight,
  AlertCircle,
  Check
} from "lucide-react";
import AnimatedCard from "../components/AnimatedCard";
import { UserProfile } from "../types";

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
}

export default function ProfilePage({ profile, onUpdateProfile }: ProfilePageProps) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [occupation, setOccupation] = useState(profile.occupation);
  const [monthlyIncome, setMonthlyIncome] = useState(profile.monthlyIncome);
  const [riskAppetite, setRiskAppetite] = useState(profile.riskAppetite);
  const [language, setLanguage] = useState(profile.language);
  const [theme, setTheme] = useState(profile.theme);

  const [dbStatus, setDbStatus] = useState<{
    provider: "supabase" | "cloudsql";
    supabaseConfigured: boolean;
    supabaseClientActive: boolean;
    dbUrlSet: boolean;
    cloudSqlActive: boolean;
  } | null>(null);
  const [dbLoading, setDbLoading] = useState(true);

  const fetchDbStatus = async () => {
    setDbLoading(true);
    try {
      const res = await fetch("/api/db-status");
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch database integration status:", err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  // Checkboxes for preferences
  const preferencesList = ["Mutual Funds", "Equity", "Fixed Deposits (FD)", "Sovereign Gold Bonds", "Digital Assets", "Real Estate Bonds"];
  const [preferences, setPreferences] = useState<string[]>(profile.investmentPreference);

  // Checkboxes for notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyAudit, setWeeklyAudit] = useState(true);
  const [whatsappRM, setWhatsappRM] = useState(false);

  const handlePreferenceChange = (pref: string) => {
    setPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: Number(age),
          occupation,
          monthlyIncome: Number(monthlyIncome),
          riskAppetite,
        })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateProfile({
          name,
          age: Number(age),
          occupation,
          monthlyIncome: Number(monthlyIncome),
          riskAppetite,
          investmentPreference: preferences,
          language,
          theme
        });
        alert("IDBI WealthAI Customer Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative overflow-hidden bg-transparent">
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
            CUSTOMER CONFIGURATION
          </span>
          <h1 className="text-3xl font-extrabold font-sans text-white mt-3">
            Priority Member Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Customize personal risk levels, notification triggers, language preferences, and dark/light portal theme templates.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Personal details (7 Cols) */}
          <div className="md:col-span-7 space-y-6">
            <AnimatedCard title="Personal Credentials" subtitle="Verify and edit account metrics mapped to neural calculators">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-xl text-xs outline-none text-white font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Current Age (Years)
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-xl text-xs outline-none text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Occupation Category
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-xl text-xs outline-none text-white font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Monthly Income (₹)
                    </label>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-xl text-xs outline-none text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Risk Appetite Index
                    </label>
                    <select
                      value={riskAppetite}
                      onChange={(e: any) => setRiskAppetite(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-sans outline-none text-slate-200 cursor-pointer"
                    >
                      <option value="Conservative">Conservative</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Aggressive">Aggressive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Communications Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-sans outline-none text-slate-200 cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-md shadow-cyan-500/10"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Priority Credentials</span>
                  </button>
                </div>
              </div>
            </AnimatedCard>

            {/* Notification settings */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="h-5 w-5 text-cyan-400" />
                <h4 className="font-sans font-bold text-white text-sm">Advisor Alerts Channels</h4>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="mt-0.5 rounded border-white/10 text-cyan-500 focus:ring-cyan-500 bg-white/5"
                  />
                  <div>
                    <span className="text-slate-200 font-bold block">Transactional Email Alerts</span>
                    <span className="text-slate-400">Receive immediate notifications on high-value transfers or flag spikes.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyAudit}
                    onChange={(e) => setWeeklyAudit(e.target.checked)}
                    className="mt-0.5 rounded border-white/10 text-cyan-500 focus:ring-cyan-500 bg-white/5"
                  />
                  <div>
                    <span className="text-slate-200 font-bold block">Weekly AI Spending Audits</span>
                    <span className="text-slate-400">Our neural auditor sends weekend digests on shopping anomalies.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappRM}
                    onChange={(e) => setWhatsappRM(e.target.checked)}
                    className="mt-0.5 rounded border-white/10 text-cyan-500 focus:ring-cyan-500 bg-white/5"
                  />
                  <div>
                    <span className="text-slate-200 font-bold block">WhatsApp RM Bridge</span>
                    <span className="text-slate-400">Secure automated link with your dedicated virtual avatar advisor.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences checkboxes (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            <AnimatedCard title="Investment Preferences" subtitle="Check favorite asset classes to tailor fund advice pools">
              <div className="space-y-3">
                {preferencesList.map((pref) => {
                  const isChecked = preferences.includes(pref);
                  return (
                    <button
                      type="button"
                      key={pref}
                      onClick={() => handlePreferenceChange(pref)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between text-xs font-sans ${
                        isChecked
                          ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400 font-bold"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span>{pref}</span>
                      {isChecked && <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </AnimatedCard>

            {/* Portal preferences (Theme selection) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-4">
                <SlidersHorizontal className="h-5 w-5 text-cyan-400" />
                <h4 className="font-sans font-bold text-white text-sm">Theme Selection</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setTheme("dark");
                    alert("IDBI Priority UI leverages Dark Glassmorphism to reduce optical stress during analysis.");
                  }}
                  className={`py-3 rounded-xl border transition ${
                    theme === "dark"
                      ? "bg-white/10 text-white border-cyan-500/30"
                      : "bg-white/5 text-slate-500 border-white/10"
                  }`}
                >
                  Cosmic Dark
                </button>
                <button
                  type="button"
                  onClick={() => alert("Light Theme is locked in this hackathon prototype. Standard priority dark modes hold active.")}
                  className="py-3 rounded-xl border bg-white/5 text-slate-600 border-white/10 cursor-not-allowed"
                >
                  Luminous Light
                </button>
              </div>
            </div>
          </div>

        </form>

        {/* Supabase Developer Integration Panel */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-white text-base">Supabase Integration Engine</h3>
                <p className="text-slate-400 text-xs">Direct PostgreSQL connection & Supabase Client SDK environment status</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchDbStatus}
              disabled={dbLoading}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/25 hover:bg-cyan-900/40 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              <Cable className={`h-3.5 w-3.5 ${dbLoading ? "animate-spin" : ""}`} />
              <span>Verify Connections</span>
            </button>
          </div>

          {/* Connection Status Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status 1: Direct DB */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  Drizzle Pool Connection
                </span>
                <span className="text-white font-bold text-sm block">
                  {dbStatus?.provider === "supabase" ? "Supabase PostgreSQL" : "Cloud SQL PostgreSQL"}
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold border bg-black/40">
                {dbStatus?.provider === "supabase" ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-400 font-bold uppercase">Supabase Active</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                    <span className="text-cyan-400 font-bold uppercase">Cloud SQL Fallback</span>
                  </>
                )}
              </div>
            </div>

            {/* Status 2: Client SDK */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  Client SDK Initialization
                </span>
                <span className="text-white font-bold text-sm block">
                  {dbStatus?.supabaseClientActive ? "Supabase Client JS" : "Demo Simulation Client"}
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold border bg-black/40">
                {dbStatus?.supabaseClientActive ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-400 font-bold uppercase">Active</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-amber-400 font-bold uppercase">Demo Mode</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2.5 text-amber-400/90 text-xs font-sans font-semibold">
              <AlertCircle className="h-4 w-4" />
              <span>Connect Your Personal Supabase Workspace</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Drizzle ORM is pre-configured to detect your connection automatically. By adding your credentials to the environment, you will override the Cloud SQL database and read/write directly to your Supabase PostgreSQL cluster.
            </p>

            <div className="space-y-3 pt-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Required Environment Secrets (Add via Settings Panel):
              </span>
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-[11px] text-slate-300 space-y-2 select-all leading-relaxed break-all">
                <div>
                  <span className="text-emerald-400">SUPABASE_DB_URL</span>
                  <span className="text-white">="postgresql://postgres.[PROJ-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"</span>
                </div>
                <div>
                  <span className="text-emerald-400">VITE_SUPABASE_URL</span>
                  <span className="text-white">="https://[YOUR-PROJECT].supabase.co"</span>
                </div>
                <div>
                  <span className="text-emerald-400">VITE_SUPABASE_ANON_KEY</span>
                  <span className="text-white">="VITE_SUPABASE_ANON_KEY_VALUE"</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center space-x-2 font-sans">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Drizzle Schema migrations auto-route using Drizzle Kit. No manual database creation needed!</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
