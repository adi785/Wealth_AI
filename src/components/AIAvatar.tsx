import { motion } from "motion/react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, Landmark } from "lucide-react";

interface AIAvatarProps {
  status: "idle" | "listening" | "thinking" | "speaking";
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  micPermission: boolean;
  micActive: boolean;
  onToggleMic: () => void;
  captionText?: string;
}

export default function AIAvatar({
  status,
  voiceEnabled,
  onToggleVoice,
  micPermission,
  micActive,
  onToggleMic,
  captionText = "I am ready to help you manage your wealth.",
}: AIAvatarProps) {
  // Orb pulse variants based on state
  const orbVariants = {
    idle: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 20px 2px rgba(6, 182, 212, 0.2)",
        "0 0 30px 6px rgba(59, 130, 246, 0.3)",
        "0 0 20px 2px rgba(6, 182, 212, 0.2)",
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    listening: {
      scale: [1, 1.15, 1, 1.12, 1],
      boxShadow: [
        "0 0 30px 4px rgba(6, 182, 212, 0.4)",
        "0 0 50px 15px rgba(6, 182, 212, 0.6)",
        "0 0 30px 4px rgba(6, 182, 212, 0.4)",
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
    thinking: {
      rotate: 360,
      scale: [1, 0.95, 1.05, 1],
      boxShadow: [
        "0 0 25px 4px rgba(168, 85, 247, 0.3)",
        "0 0 40px 10px rgba(99, 102, 241, 0.5)",
        "0 0 25px 4px rgba(168, 85, 247, 0.3)",
      ],
      transition: {
        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
        scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
      },
    },
    speaking: {
      scale: [1, 1.1, 0.95, 1.15, 1],
      boxShadow: [
        "0 0 30px 4px rgba(6, 182, 212, 0.3)",
        "0 0 45px 12px rgba(59, 130, 246, 0.5)",
        "0 0 30px 4px rgba(6, 182, 212, 0.3)",
      ],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const ring1Variants = {
    idle: { rotate: 360, transition: { duration: 15, repeat: Infinity, ease: "linear" } },
    listening: { scale: [1, 1.2, 1], rotate: 360, transition: { duration: 6, repeat: Infinity, ease: "linear" } },
    thinking: { scale: 1.1, rotate: -360, transition: { duration: 2, repeat: Infinity, ease: "linear" } },
    speaking: { scale: [1, 1.3, 0.9], rotate: 180, transition: { duration: 4, repeat: Infinity, ease: "linear" } },
  };

  const ring2Variants = {
    idle: { rotate: -360, transition: { duration: 20, repeat: Infinity, ease: "linear" } },
    listening: { scale: [1, 1.3, 1], rotate: -360, transition: { duration: 8, repeat: Infinity, ease: "linear" } },
    thinking: { scale: 0.9, rotate: 360, transition: { duration: 1.5, repeat: Infinity, ease: "linear" } },
    speaking: { scale: [1, 1.2, 1], rotate: -360, transition: { duration: 5, repeat: Infinity, ease: "linear" } },
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl border border-cyan-500/10 rounded-3xl" id="ai-avatar-container">
      {/* Visual Avatar Portal */}
      <div className="relative w-72 h-72 flex items-center justify-center mb-6">
        {/* Particle Ring 1 (Cyan orbital track) */}
        <motion.div
          animate={status}
          variants={ring1Variants}
          className="absolute w-64 h-64 border border-dashed border-cyan-400/20 rounded-full"
        />

        {/* Particle Ring 2 (Blue orbital track) */}
        <motion.div
          animate={status}
          variants={ring2Variants}
          className="absolute w-52 h-52 border border-dotted border-blue-500/30 rounded-full"
        />

        {/* Echoing background pulse */}
        {status === "listening" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-44 h-44 bg-cyan-500/10 rounded-full"
          />
        )}
        {status === "speaking" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.4 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-44 h-44 bg-blue-500/10 rounded-full"
          />
        )}

        {/* Main core orb */}
        <motion.div
          animate={status}
          variants={orbVariants}
          className={`w-40 h-40 rounded-full flex flex-col items-center justify-center relative cursor-pointer overflow-hidden ${
            status === "idle"
              ? "bg-gradient-to-tr from-blue-900/80 to-cyan-500/80"
              : status === "listening"
              ? "bg-gradient-to-tr from-cyan-600/90 to-blue-400/90"
              : status === "thinking"
              ? "bg-gradient-to-tr from-purple-800/80 to-indigo-600/80"
              : "bg-gradient-to-tr from-cyan-500/90 to-indigo-600/90"
          }`}
        >
          {/* Inner futuristic digital pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/20 to-slate-900/40" />

          {/* Core glow */}
          <div className="w-16 h-16 rounded-full bg-white/10 blur-xl absolute" />

          {/* Central status icon/graphic */}
          <div className="z-10 text-white flex flex-col items-center justify-center">
            {status === "idle" && (
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Landmark className="h-10 w-10 text-cyan-200" />
              </motion.div>
            )}
            {status === "listening" && (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <Mic className="h-12 w-12 text-white animate-pulse" />
              </motion.div>
            )}
            {status === "thinking" && (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                <Sparkles className="h-10 w-10 text-purple-200" />
              </motion.div>
            )}
            {status === "speaking" && (
              <div className="flex items-end justify-center space-x-1.5 h-8">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, Math.random() * 28 + 12, 8] }}
                    transition={{ duration: 0.4 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1.5 bg-white rounded-full"
                    style={{ height: "10px" }}
                  />
                ))}
              </div>
            )}
            <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-100 font-bold mt-2">
              {status}
            </span>
          </div>
        </motion.div>

        {/* Orbiting core particles */}
        {status === "thinking" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(6)].map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  x: [
                    Math.cos(idx * 60 * Math.PI / 180) * 110,
                    Math.cos((idx * 60 + 120) * Math.PI / 180) * 110,
                    Math.cos((idx * 60 + 240) * Math.PI / 180) * 110,
                    Math.cos(idx * 60 * Math.PI / 180) * 110,
                  ],
                  y: [
                    Math.sin(idx * 60 * Math.PI / 180) * 110,
                    Math.sin((idx * 60 + 120) * Math.PI / 180) * 110,
                    Math.sin((idx * 60 + 240) * Math.PI / 180) * 110,
                    Math.sin(idx * 60 * Math.PI / 180) * 110,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-500"
              />
            ))}
          </div>
        )}
      </div>

      {/* Spoken/Caption text banner */}
      <div className="w-full text-center px-4 max-w-md h-16 flex items-center justify-center">
        <motion.p
          key={captionText}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-sans font-medium text-slate-200 leading-relaxed italic"
        >
          &ldquo;{captionText}&rdquo;
        </motion.p>
      </div>

      {/* Control Buttons (Mic/Audio options) */}
      <div className="flex items-center space-x-4 mt-4 border-t border-slate-800 pt-4 w-full justify-center">
        {/* Mic toggle */}
        <button
          onClick={onToggleMic}
          className={`p-3.5 rounded-full border transition-all ${
            micActive
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
              : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200"
          }`}
          title={micActive ? "Mute Microphone" : "Unmute Microphone"}
        >
          {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        {/* Text to Speech toggle */}
        <button
          onClick={onToggleVoice}
          className={`p-3.5 rounded-full border transition-all ${
            voiceEnabled
              ? "bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-lg shadow-blue-500/10"
              : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200"
          }`}
          title={voiceEnabled ? "Mute Voice Response" : "Unmute Voice Response"}
        >
          {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      {/* No mic permission warning */}
      {!micPermission && micActive && (
        <div className="flex items-center space-x-1.5 mt-4 text-[11px] text-amber-400 bg-amber-950/20 border border-amber-500/20 px-3 py-1.5 rounded-xl">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Microphone access is blocked. Please allow mic in browser settings.</span>
        </div>
      )}
    </div>
  );
}
