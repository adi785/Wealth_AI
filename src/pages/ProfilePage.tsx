import React, { useState } from "react";
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
  Cpu
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

      </div>
    </div>
  );
}
