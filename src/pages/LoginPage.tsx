import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { Landmark, Mail, Lock, ShieldAlert, ArrowRight, UserCheck } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("rahul.sharma@idbi.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please complete all fields to sign in.");
      return;
    }

    setIsLoading(true);

    // Simulate authentication lag
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
      navigate("/dashboard");
    }, 1200);
  };

  const triggerGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess("rahul.sharma@idbi.com");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center bg-transparent text-white relative overflow-hidden px-4 py-12">
      {/* Animated Glowing Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 relative z-10 shadow-2xl shadow-cyan-500/5"
      >
        {/* IDBI Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-tr from-blue-600 to-cyan-400 p-3.5 rounded-2xl text-white shadow-lg shadow-cyan-500/10 mb-4">
            <Landmark className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight">
            IDBI <span className="text-cyan-400">WealthAI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-widest">
            Conversational Wealth Portal
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center space-x-2 bg-red-950/20 border border-red-500/20 px-4 py-3 rounded-2xl text-xs text-red-400">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Corporate Account Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-2xl text-sm font-medium focus:ring-1 focus:ring-cyan-500/20 outline-none transition text-white"
                placeholder="email@idbi.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => alert("Simulated password retrieval: In a secure IDBI vault environment, password links are routed through corporate OTP queues.")}
                className="text-xs font-sans text-cyan-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-2xl text-sm font-medium focus:ring-1 focus:ring-cyan-500/20 outline-none transition text-white"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 font-bold rounded-2xl text-sm text-white shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-xs text-slate-500 uppercase font-mono tracking-widest">
            or use SSO credentials
          </span>
        </div>

        {/* Google SSO Login */}
        <button
          type="button"
          onClick={triggerGoogleLogin}
          className="w-full py-3 px-4 border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 rounded-2xl text-sm font-medium text-slate-200 transition flex items-center justify-center space-x-2"
        >
          {/* Custom vector representation of Google G */}
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.6 5.6 0 0 1 8.36 13a5.6 5.6 0 0 1 5.63-5.6c1.478 0 2.8.542 3.82 1.442l3.15-3.15C18.98 3.864 16.66 3 14 3a10 10 0 0 0-10 10 10 10 0 0 0 10 10c5.3 0 9.85-3.818 9.85-9.85 0-.58-.05-1.15-.15-1.715h-9.46Z"
            />
          </svg>
          <span>Sign In with IDBI Key Account</span>
        </button>

        {/* Helper sandbox logins */}
        <div className="mt-6 text-center text-xs text-slate-500 font-sans">
          <p className="flex items-center justify-center space-x-1">
            <UserCheck className="h-3.5 w-3.5 text-cyan-500" />
            <span>Prototype bypass: default login loaded for review.</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
