import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Sparkles, Cpu, Shield, ArrowRight, TrendingUp, Users, Award, HelpCircle } from "lucide-react";

export default function LandingPage() {
  const stats = [
    { value: "₹4.5B+", label: "Assets Under Advisory" },
    { value: "98.4%", label: "Client Retainment" },
    { value: "12.8%", label: "Average Portfolio Yield" },
    { value: "1M+", label: "Active Investors" },
  ];

  const features = [
    {
      icon: Cpu,
      title: "Interactive AI Avatar Advisor",
      desc: "Speak naturally with our 3D visual relationship avatar. It analyzes your spending, explains recommendations, and auto-tunes your goals.",
    },
    {
      icon: TrendingUp,
      title: "Hyper-Personalized SIP & Portfolios",
      desc: "No more generic mutual fund suggestions. Get smart dynamic allocations mapped precisely to your personal risk index and future life milestones.",
    },
    {
      icon: Shield,
      title: "AI Security & Fraud Shield",
      desc: "Continuous neural network auditing. Protect your deposits, screen unusual merchants, and flag potential risk spikes before they settle.",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-cyan-500 selection:text-slate-950 overflow-hidden">
      {/* Hero Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-cyan-400 text-xs font-mono uppercase tracking-wider"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Private Wealth Engine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold font-sans leading-tight text-white tracking-tight"
            >
              The Future of Wealth is <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Completely Conversational
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Meet **IDBI WealthAI**—your proactive 3D digital relationship manager. We combine real-time transactional spending audits, neural risk modeling, and instant conversational execution into a premium banking portal.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-2xl font-bold flex items-center justify-center space-x-2 text-white shadow-xl shadow-cyan-500/15 transition-all transform hover:scale-[1.02]"
              >
                <span>Launch Digital Advisor</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-2xl font-bold flex items-center justify-center space-x-2 text-slate-300 transition"
              >
                <span>Explore Features</span>
              </a>
            </motion.div>
          </div>

          {/* Hero Graphic Right (Interactive Miniature Avatar Visualizer) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl"
            >
              {/* Outer halo rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-72 h-72 border border-cyan-400/10 rounded-full border-dashed"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-60 h-60 border border-blue-500/20 rounded-full border-dotted"
              />

              {/* Central floating core */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 p-1 flex items-center justify-center shadow-2xl shadow-cyan-500/20 relative"
              >
                <div className="absolute inset-0 rounded-full bg-cyan-400 blur-2xl opacity-40 animate-pulse" />
                <div className="w-full h-full bg-white/5 rounded-full flex flex-col items-center justify-center z-10 border border-white/10 backdrop-blur-xl">
                  <Cpu className="h-10 w-10 text-cyan-400" />
                  <span className="text-[9px] uppercase tracking-widest font-mono text-cyan-400 font-bold mt-2">
                    IDBI ADVISOR
                  </span>
                  <div className="flex space-x-1.5 mt-2 h-4 items-end">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 16, 4] }}
                        transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                        className="w-1 bg-cyan-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating micro indicators */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-10 left-8 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center space-x-2 shadow-xl"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Risk Ratio Safe</span>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-12 right-6 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center space-x-2 shadow-xl"
              >
                <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                <span>+12.8% Returns</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Statistics Ribbon */}
      <div className="bg-white/5 backdrop-blur-md border-y border-white/10 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-sans">
            Tailored Core Features Designed <br />
            <span className="text-cyan-400">For Compound Growth</span>
          </h2>
          <p className="text-slate-400 mt-4 font-sans text-sm sm:text-base">
            We bypass outdated paper forms and complex advisor hierarchies to connect your bank assets directly with secure neural advice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-3 rounded-2xl w-12 h-12 flex items-center justify-center text-white mb-6">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-sans">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-slate-900/20 py-24 border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-sans font-bold">Onboarding Journey</h2>
            <p className="text-slate-400 mt-2 text-sm">Three basic steps to completely automate your personal wealth engine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="text-5xl font-mono font-black text-cyan-500/30">01</div>
              <h3 className="text-xl font-sans font-bold">Connect Vault Securely</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Authenticate using Firebase. Your current deposits and active balances sync safely to create a transaction footprint.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="text-5xl font-mono font-black text-blue-500/30">02</div>
              <h3 className="text-xl font-sans font-bold">Converse with AI Avatar</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Open the digital interface, select your preferred speech setting, and outline your target goals (e.g. Dream house, car).
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="text-5xl font-mono font-black text-purple-500/30">03</div>
              <h3 className="text-xl font-sans font-bold">Compound & Monitor</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Receive customized mutual fund advice, SIP triggers, and budget warnings directly inside your dashboard portal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-sans">Endorsed by Top Investors</h2>
          <p className="text-slate-400 mt-2 text-sm">See how modern savers compound wealth securely with IDBI WealthAI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-300">
            <p className="italic font-sans text-sm leading-relaxed">
              "Being an IT manager, keeping track of separate SIPs and home EMIs was messy. The IDBI conversational avatar mapped all my savings, identified ₹8,000 of leaky subscriptions, and auto-routed them directly into tax saver mutual funds. Fantastic tool!"
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-slate-950 font-mono">
                AM
              </div>
              <div>
                <h4 className="font-sans font-bold text-white text-sm">Anuj Mishra</h4>
                <p className="text-xs text-slate-400">Technical Director, Hyderabad</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-300">
            <p className="italic font-sans text-sm leading-relaxed">
              "I wanted to buy a house in Pune in 7 years. The AI Goal Planner calculated exact inflation impacts and SIP requirements in seconds. I speak to the virtual relationship avatar every weekend for regular feedback."
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-slate-950 font-mono">
                SK
              </div>
              <div>
                <h4 className="font-sans font-bold text-white text-sm">Shreya Kulkarni</h4>
                <p className="text-xs text-slate-400">Product Manager, Pune</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Call to Action */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="p-12 rounded-[40px] bg-gradient-to-r from-blue-900/60 via-cyan-950/40 to-slate-900/80 border border-cyan-500/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-white mb-4">
            Maximize Your Financial Growth Potentials Today
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-sm">
            Onboard as an IDBI Bank priority client. Complete a simple diagnostic questionnaire, interact with your AI Relationship Manager, and secure compound returns.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-cyan-400/20 transition-all transform hover:scale-105"
          >
            <span>Onboard IDBI WealthAI Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400 border border-cyan-500/20">
                <Award className="h-5 w-5" />
              </div>
              <span className="font-sans font-extrabold text-lg text-white">
                IDBI <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">WealthAI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-4 md:mt-0">
              © 2026 IDBI WealthAI. All mock portfolio statistics and recommendations are illustrative hackathon simulations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
