import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, User, LogOut, Menu, X, Landmark, TrendingUp, PieChart, ShieldAlert, Cpu } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  userName?: string;
  onLogout?: () => void;
  isLoggedIn: boolean;
}

export default function Navbar({ userName = "Rahul Sharma", onLogout, isLoggedIn }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Landmark },
    { name: "AI Advisor", path: "/advisor", icon: Cpu },
    { name: "Portfolio", path: "/portfolio", icon: TrendingUp },
    { name: "Spending", path: "/analytics", icon: PieChart },
    { name: "Goals", path: "/goals", icon: Sparkles },
    { name: "AI Insights", path: "/insights", icon: ShieldAlert },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2" id="brand-logo">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-xl tracking-tight text-white">
                IDBI <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">WealthAI</span>
              </span>
              <p className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase leading-none">Premium Wealth</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white/10 text-cyan-400 border border-white/10"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-slate-400 text-sm">IDBI Retail Banking Partner</span>
            </div>
          )}

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition border border-white/10 text-sm font-medium text-slate-200 backdrop-blur-md"
                >
                  <User className="h-4 w-4 text-cyan-400" />
                  <span>{userName}</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/10 transition-all transform hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-2 pt-2 pb-4 space-y-1">
          {isLoggedIn ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium ${
                      isActive
                        ? "bg-white/10 text-cyan-400 border border-white/10"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-cyan-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 pb-2 border-t border-white/10 mt-2">
                <div className="flex items-center px-4 py-2 space-x-3">
                  <User className="h-5 w-5 text-cyan-400" />
                  <span className="text-slate-200 font-medium">{userName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 px-4">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm font-medium text-slate-300 backdrop-blur-md"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogoutClick();
                    }}
                    className="flex justify-center items-center py-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-sm font-medium text-red-400"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2 p-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white backdrop-blur-md"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
