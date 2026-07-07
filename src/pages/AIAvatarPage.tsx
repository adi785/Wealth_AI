import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send, Sparkles, Volume2, VolumeX, Mic, ArrowUpRight, HelpCircle } from "lucide-react";
import AIAvatar from "../components/AIAvatar";
import { Message, UserProfile } from "../types";

interface AIAvatarPageProps {
  profile: UserProfile;
}

export default function AIAvatarPage({ profile }: AIAvatarPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [avatarStatus, setAvatarStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("speaking");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [micPermission, setMicPermission] = useState(true);
  const [captionText, setCaptionText] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechObj = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechObj) {
      const rec = new SpeechObj();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN"; // Set to Indian English for realistic banking accents

      rec.onstart = () => {
        setAvatarStatus("listening");
        setCaptionText("I am listening... Please speak clearly.");
        setMicActive(true);
      };

      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        if (e.error === "not-allowed") {
          setMicPermission(false);
        }
        setAvatarStatus("idle");
        setMicActive(false);
      };

      rec.onend = () => {
        setMicActive(false);
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognitionRef.current = rec;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }, []);

  // Initial welcome message from avatar
  useEffect(() => {
    const welcomeText = `Hello ${profile.name}. Welcome back to IDBI WealthAI. I noticed you spent ₹8,000 more on shopping this month. Would you like my recommendations to optimize your savings and allocate this surplus to a high-yield SIP?`;
    
    setMessages([
      {
        id: "msg-welcome",
        sender: "ai",
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedPrompts: [
          "Show shopping spending breakdown",
          "Where should I invest the surplus?",
          "Check my financial health score",
        ],
      },
    ]);
    speakText(welcomeText);
  }, []);

  // Speak text helper using Web Speech Synthesis
  const speakText = (text: string) => {
    setCaptionText(text);
    if (!voiceEnabled) {
      setAvatarStatus("idle");
      return;
    }

    // Cancel active synthesis first
    window.speechSynthesis.cancel();

    // Clean text of markdown accents for speech
    const cleanText = text.replace(/₹/g, "Rupees ").replace(/\*/g, "").replace(/\-/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN"; // Set voice to beautiful English Indian accent if available
    
    // Find suitable Indian voice if present
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(v => v.lang.includes("IN") || v.name.toLowerCase().includes("india"));
    if (indVoice) utterance.voice = indVoice;

    utterance.onstart = () => {
      setAvatarStatus("speaking");
    };

    utterance.onend = () => {
      setAvatarStatus("idle");
    };

    utterance.onerror = () => {
      setAvatarStatus("idle");
    };

    window.speechSynthesis.speak(utterance);
  };

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message sending (Text or voice)
  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    setInputValue("");
    setAvatarStatus("thinking");
    setCaptionText("Analyzing your cash flows...");

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          voiceMode: voiceEnabled,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: Message = {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedPrompts: [
            "What is my retirement gap?",
            "Suggest tax saving options",
            "What is my emergency fund goal?",
          ],
        };

        setMessages(prev => [...prev, aiMsg]);
        speakText(data.text);
      } else {
        throw new Error("Chat response not OK");
      }
    } catch (e) {
      console.warn("Chat API failed, generating client-side fallback reply:", e);
      
      const lastUserMsg = text.toLowerCase();
      let responseText = `I am currently operating in IDBI localized digital backup mode. `;
      
      if (lastUserMsg.includes("spend") || lastUserMsg.includes("budget") || lastUserMsg.includes("shop")) {
        responseText += `Analyzing your ledger, I see shopping expenses of ₹12,500. To balance this discretionary outflow, we should allocate ₹10,000 from your liquid balance into your Nippon Small Cap SIP.`;
      } else if (lastUserMsg.includes("invest") || lastUserMsg.includes("risk") || lastUserMsg.includes("mutual fund") || lastUserMsg.includes("equity")) {
        responseText += `Given your moderate risk appetite, I recommend a robust split: 50% in IDBI Equity Mutual Funds, 30% in high-grade corporate bonds, and 20% in sovereign gold indices for tax-free compounding.`;
      } else if (lastUserMsg.includes("goal") || lastUserMsg.includes("house") || lastUserMsg.includes("edu") || lastUserMsg.includes("vacation")) {
        responseText += `Your Dream House target is currently lagging by ₹12.5L. Stepping up your Monthly contribution by ₹8,000 will easily bring your compound interest curve back on track.`;
      } else if (lastUserMsg.includes("retirement") || lastUserMsg.includes("age") || lastUserMsg.includes("plan")) {
        responseText += `Assuming retirement at age 60 with standard 6% inflation, your future monthly expense will be ₹2,56,000. You need a total corpus of ₹7.5 Crore. A monthly SIP of ₹32,000 will hit this target.`;
      } else if (lastUserMsg.includes("tax") || lastUserMsg.includes("save") || lastUserMsg.includes("regime")) {
        responseText += `To optimize taxes, you should exhaust the Section 80C limit (₹1.5 Lakhs) using ELSS mutual funds. This combines sovereign tax breaks with equity growth compound factors.`;
      } else if (lastUserMsg.includes("score") || lastUserMsg.includes("health")) {
        responseText += `Your financial health score is 84/100, which is exceptional! To cross the 90 threshold, let's lock in ₹3 Lakhs of your idle liquid savings in a 7.4% High Yield Deposit.`;
      } else {
        responseText += `I am active and scanning your portfolios. You currently have ₹4,50,000 in idle liquid bank cash. We can park ₹3,00,000 in an IDBI high-yield deposit earning 7.4% annually. Would you like to proceed?`;
      }

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedPrompts: [
          "Where should I invest the surplus?",
          "Check my financial health score",
          "Suggest tax saving options",
        ],
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(responseText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  const toggleMic = () => {
    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      setAvatarStatus("idle");
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error("Recognition start fail:", error);
        }
      } else {
        alert("Web Speech recognition is not supported or was blocked. Please type your queries below.");
      }
    }
  };

  return (
    <div className="pb-24 px-4 sm:px-6 lg:px-8 pt-8 relative overflow-hidden bg-transparent">
      {/* Background visual graphics */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Big Animated Avatar Panel */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="text-center lg:text-left">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Priority Private Wealth Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-sans">
              Conversational Relationship Lounge
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Talk or chat with your AI Digital RM. Fully voice synthesis-enabled.
            </p>
          </div>

          <AIAvatar
            status={avatarStatus}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
            micPermission={micPermission}
            micActive={micActive}
            onToggleMic={toggleMic}
            captionText={captionText}
          />

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3 text-xs text-slate-400 backdrop-blur-xl">
            <h4 className="font-bold text-slate-200 flex items-center space-x-1.5 font-sans">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <span>Voice Lounge Guidelines</span>
            </h4>
            <p className="leading-relaxed">
              Activate your microphone by clicking the mic icon. Ask questions like <span className="text-cyan-400 italic">"Can you show me my goals progress?"</span> or <span className="text-cyan-400 italic">"Why is my shopping spending high?"</span>. The advisor responds in real-time.
            </p>
          </div>
        </div>

        {/* Right Column - Conversational Chat Feed & Input */}
        <div className="lg:col-span-7 flex flex-col h-[650px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl shadow-cyan-500/5">
          {/* Feed Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-sans font-bold text-white">IDBI Digital RM Session</span>
            </div>
            <span className="text-xs font-mono text-slate-400">SECURE SSL ENCRYPTED</span>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6" id="chat-messages-viewport">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-none"
                      : "bg-white/10 border border-white/10 text-slate-100 rounded-bl-none backdrop-blur-md"
                  }`}
                >
                  {/* Message body with basic newlines supporting */}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                <span className="text-[10px] text-slate-500 font-mono mt-1.5 px-1">{msg.timestamp}</span>

                {/* Suggested prompts chips (only for AI messages) */}
                {msg.sender === "ai" && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3.5 max-w-[90%]">
                    {msg.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(p)}
                        className="text-xs bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-xl hover:bg-cyan-500/10 transition flex items-center space-x-1 font-medium font-sans"
                      >
                        <span>{p}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Bar */}
          <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-4 pr-16 py-4 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded-2xl text-sm font-medium focus:ring-1 focus:ring-cyan-500/20 outline-none transition text-white backdrop-blur-md"
                placeholder="Ask IDBI WealthAI about your budget, SIP options, portfolio returns..."
              />
              <div className="absolute right-2.5 flex items-center space-x-1">
                {/* Visual mic status */}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 rounded-xl transition ${
                    micActive ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Click to Speak"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white disabled:opacity-40 transition-all shadow-md"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
