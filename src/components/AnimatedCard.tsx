import { motion } from "motion/react";
import React from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  headerAction?: React.ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: boolean;
  highlightBorder?: boolean;
  id?: string;
}

export default function AnimatedCard({
  children,
  title,
  subtitle,
  icon: Icon,
  headerAction,
  className = "",
  delay = 0,
  hoverScale = true,
  highlightBorder = false,
  id,
}: AnimatedCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={hoverScale ? { y: -4, scale: 1.005 } : undefined}
      className={`relative rounded-3xl bg-white/5 backdrop-blur-xl border ${
        highlightBorder
          ? "border-white/20 shadow-lg shadow-cyan-500/5 bg-gradient-to-b from-blue-600/20 to-cyan-600/5"
          : "border-white/10 hover:border-white/20 shadow-md"
      } p-6 overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Visual background gradient accent */}
      {highlightBorder && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Card Header */}
      {(title || Icon || headerAction) && (
        <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`p-2.5 rounded-xl ${highlightBorder ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 border border-white/10 text-slate-300"}`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              {title && <h3 className="font-sans font-bold text-lg text-white leading-none">{title}</h3>}
              {subtitle && <p className="text-xs font-sans text-slate-400 mt-1">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="flex items-center">{headerAction}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
