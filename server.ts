import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Transaction, Goal, Portfolio, UserProfile, AIInsight, InvestmentRecommendation, FinancialNewsItem } from "./src/types";
import { getOrCreateUser, getUserData, updateUserProfile, createGoal, investInGoal } from "./src/db/users.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY not set. Running in mock Gemini mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper to wrap Gemini calls in a timeout
async function generateContentWithTimeout(ai: GoogleGenAI, params: any, timeoutMs: number = 4000): Promise<any> {
  let timer: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Gemini API call timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    timer.unref?.();
  });

  try {
    const response = await Promise.race([
      ai.models.generateContent(params),
      timeoutPromise
    ]);
    if (timer) clearTimeout(timer);
    return response;
  } catch (error) {
    if (timer) clearTimeout(timer);
    throw error;
  }
}

// ----------------------------------------------------
// DEMO DATASET GENERATOR
// ----------------------------------------------------

const mockProfile: UserProfile = {
  name: "Rahul Sharma",
  email: "rahul.sharma@idbi.com",
  age: 32,
  occupation: "Senior Software Engineer",
  monthlyIncome: 145000,
  riskAppetite: "Moderate",
  investmentPreference: ["Mutual Funds", "Equity", "SIP"],
  language: "English",
  theme: "dark",
};

const mockGoals: Goal[] = [
  {
    id: "g1",
    name: "Buy Dream House",
    targetAmount: 7500000,
    currentSavings: 1800000,
    targetDate: "2031-12-31",
    monthlyContribution: 45000,
    category: "House",
  },
  {
    id: "g2",
    name: "Children's Higher Education",
    targetAmount: 2500000,
    currentSavings: 650000,
    targetDate: "2036-06-30",
    monthlyContribution: 15000,
    category: "Education",
  },
  {
    id: "g3",
    name: "Tesla electric car",
    targetAmount: 4000000,
    currentSavings: 800000,
    targetDate: "2029-03-31",
    monthlyContribution: 25000,
    category: "Car",
  },
  {
    id: "g4",
    name: "Retirement Gold Chest",
    targetAmount: 50000000,
    currentSavings: 2400000,
    targetDate: "2054-07-07",
    monthlyContribution: 30000,
    category: "Retirement",
  },
];

const mockPortfolio: Portfolio = {
  totalValue: 3850000,
  assets: [
    { category: "Mutual Funds", amount: 1540000, percentage: 40, returnsYTD: 14.5, riskProfile: "Medium", color: "#3b82f6" },
    { category: "Equity/ETF", amount: 962500, percentage: 25, returnsYTD: 18.2, riskProfile: "High", color: "#06b6d4" },
    { category: "Fixed Deposit (FD)", amount: 577500, percentage: 15, returnsYTD: 7.1, riskProfile: "Low", color: "#10b981" },
    { category: "Digital Gold", amount: 385000, percentage: 10, returnsYTD: 11.4, riskProfile: "Low", color: "#f59e0b" },
    { category: "Government Bonds", amount: 385000, percentage: 10, returnsYTD: 6.8, riskProfile: "Low", color: "#6366f1" },
  ],
  totalReturns: 540000,
  ytdReturnsPercentage: 12.8,
  growthHistory: [
    { month: "Jan", value: 3200000, benchmark: 3150000 },
    { month: "Feb", value: 3350000, benchmark: 3200000 },
    { month: "Mar", value: 3420000, benchmark: 3300000 },
    { month: "Apr", value: 3580000, benchmark: 3450000 },
    { month: "May", value: 3710000, benchmark: 3520000 },
    { month: "Jun", value: 3850000, benchmark: 3650000 },
  ],
};

// Generate 100 sample transactions spanning the past 3 months
function generateMockTransactions(): Transaction[] {
  const categories: Transaction['category'][] = [
    'Food', 'Travel', 'Shopping', 'Utilities', 'Entertainment', 'Healthcare', 'Bills', 'EMI', 'Investment'
  ];

  const transactionList: Transaction[] = [];

  // Add predictable credits (Salary)
  transactionList.push({
    id: "tx-salary-1",
    date: "2026-06-01",
    category: "Income",
    description: "IDBI BANK Corporate Salary Credited",
    amount: 145000,
    type: "credit",
    status: "completed",
  });
  transactionList.push({
    id: "tx-salary-2",
    date: "2026-05-01",
    category: "Income",
    description: "IDBI BANK Corporate Salary Credited",
    amount: 145000,
    type: "credit",
    status: "completed",
  });
  transactionList.push({
    id: "tx-salary-3",
    date: "2026-04-01",
    category: "Income",
    description: "IDBI BANK Corporate Salary Credited",
    amount: 145000,
    type: "credit",
    status: "completed",
  });

  // Predictable EMIs and Bills
  const recurring = [
    { category: "EMI" as const, desc: "HDFC Home Loan EMI", amount: 32000 },
    { category: "Bills" as const, desc: "Tata Power Electricity Bill", amount: 4800 },
    { category: "Bills" as const, desc: "Airtel Fiber Broadband", amount: 1199 },
    { category: "Investment" as const, desc: "Nippon India Small Cap SIP", amount: 15000 },
    { category: "Investment" as const, desc: "HDFC Index Fund SIP", amount: 10000 },
  ];

  for (let m = 4; m <= 6; m++) {
    const monthStr = m < 10 ? `0${m}` : `${m}`;
    recurring.forEach((item, index) => {
      transactionList.push({
        id: `tx-rec-${m}-${index}`,
        date: `2026-${monthStr}-05`,
        category: item.category,
        description: item.desc,
        amount: item.amount,
        type: "debit",
        status: "completed",
      });
    });
  }

  // Random transactional expenses (approx 80 transactions)
  const randomExpenses = [
    { category: "Food" as const, descs: ["Zomato Food Delivery", "Swiggy Order", "Starbucks Coffee", "Barbeque Nation Dinner", "Local Grocery Store"] },
    { category: "Travel" as const, descs: ["Uber Ride", "Ola Cabs", "HP Petrol Pump", "MakeMyTrip Flight Booking", "Metro Smartcard Recharge"] },
    { category: "Shopping" as const, descs: ["Amazon Shopping", "Myntra Clothing", "Flipkart Retail", "Reliance Digital Electronics", "Zara Store"] },
    { category: "Utilities" as const, descs: ["Indane Gas Cylinder", "Municipal Water Bill", "Airtel Prepaid Mobile"] },
    { category: "Entertainment" as const, descs: ["Netflix Monthly Subscription", "BookMyShow Movie Tickets", "Spotify Premium", "Gaming Console Game purchase"] },
    { category: "Healthcare" as const, descs: ["Apollo Pharmacy Medicines", "Max Healthcare Clinic", "Dental Checkup", "Weekly Multivitamins"] },
  ];

  const dates = [];
  for (let i = 1; i <= 90; i++) {
    const date = new Date("2026-04-01");
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  for (let i = 0; i < 80; i++) {
    const rDate = dates[Math.floor(Math.random() * dates.length)];
    const group = randomExpenses[Math.floor(Math.random() * randomExpenses.length)];
    const desc = group.descs[Math.floor(Math.random() * group.descs.length)];
    let amount = Math.floor(Math.random() * 2500) + 150;

    // Make some flights or electronics expensive
    if (desc.includes("Flight") || desc.includes("Digital") || desc.includes("Zara")) {
      amount = Math.floor(Math.random() * 8000) + 3000;
    }

    // Include some suspicious flag candidate transactions for our prototype AI Fraud feature!
    const isSuspicious = i === 12 || i === 45;
    const finalDesc = isSuspicious ? (i === 12 ? "Unknown Foreign Merchant Moscow" : "Suspicious Online Crypto Gateway") : desc;
    const finalAmount = isSuspicious ? (i === 12 ? 48500 : 92000) : amount;

    transactionList.push({
      id: `tx-rand-${i}`,
      date: rDate,
      category: group.category,
      description: finalDesc,
      amount: finalAmount,
      type: "debit",
      status: isSuspicious ? "flagged" : "completed",
      flagReason: isSuspicious ? (i === 12 ? "Unusual high-value foreign transaction executed from a blacklisted merchant location." : "High velocity transfer to suspicious cryptocurrency escrow wallet.") : undefined,
    });
  }

  // Sort by date descending
  return transactionList.sort((a, b) => b.date.localeCompare(a.date));
}

const mockTransactions = generateMockTransactions();

// A middleware that resolves the user ID in the database, supporting both real Firebase token and mock bypass
const resolveDbUser = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token is provided, fallback to the default seed user (Rahul Sharma) so that the app stays fully functional even before authentication.
    try {
      const user = await getOrCreateUser('mock-user-rahul', 'rahul.sharma@idbi.com', 'Rahul Sharma');
      req.dbUserId = user.id;
      req.dbUserUid = user.uid;
      return next();
    } catch (err) {
      console.error("Resolve default user failed:", err);
      return res.status(500).json({ error: "Failed to initialize default session" });
    }
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (token === 'mock-token-rahul') {
    try {
      const user = await getOrCreateUser('mock-user-rahul', 'rahul.sharma@idbi.com', 'Rahul Sharma');
      req.dbUserId = user.id;
      req.dbUserUid = user.uid;
      return next();
    } catch (err) {
      console.error("Resolve mock token user failed:", err);
      return res.status(500).json({ error: "Failed to initialize mock session" });
    }
  }

  // Real Supabase verification (Preferred)
  if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseServer = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY
      );
      const { data: { user }, error: sErr } = await supabaseServer.auth.getUser(token);
      if (!sErr && user) {
        const dbUser = await getOrCreateUser(
          user.id,
          user.email || "client@idbi.com",
          user.user_metadata?.full_name || "Valued IDBI Client"
        );
        req.dbUserId = dbUser.id;
        req.dbUserUid = dbUser.uid;
        return next();
      }
    } catch (supabaseError) {
      console.warn("Supabase token verification failed/bypassed:", supabaseError);
    }
  }

  // Real Firebase authentication
  try {
    const { adminAuth } = await import("./src/lib/firebase-admin.ts");
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Auto-sync / getOrCreate real user in PostgreSQL
    const user = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || "client@idbi.com",
      decodedToken.name || "Valued IDBI Client"
    );
    
    req.dbUserId = user.id;
    req.dbUserUid = user.uid;
    next();
  } catch (error) {
    console.error('Error verifying token on server:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token session' });
  }
};

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Standard profile and financial metrics (Database-backed)
app.get("/api/user-data", resolveDbUser, async (req: any, res) => {
  try {
    const data = await getUserData(req.dbUserId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile risk appetite or income
app.post("/api/update-profile", resolveDbUser, async (req: any, res) => {
  const { riskAppetite, monthlyIncome, occupation, age, name } = req.body;
  try {
    await updateUserProfile(req.dbUserId, { riskAppetite, monthlyIncome, occupation, age, name });
    const data = await getUserData(req.dbUserId);
    res.json({ success: true, profile: data.profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create/Add Goal
app.post("/api/goals", resolveDbUser, async (req: any, res) => {
  const { name, targetAmount, targetDate, monthlyContribution, category } = req.body;
  try {
    await createGoal(req.dbUserId, { name, targetAmount, targetDate, monthlyContribution, category });
    const data = await getUserData(req.dbUserId);
    res.json({ success: true, goals: data.goals });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Goal progress (Simulate investing cash into goal)
app.post("/api/goals/invest", resolveDbUser, async (req: any, res) => {
  const { goalId, amount } = req.body;
  try {
    await investInGoal(req.dbUserId, goalId, Number(amount));
    const data = await getUserData(req.dbUserId);
    res.json({ success: true, goals: data.goals });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Database Provider Integration Status
app.get("/api/db-status", (req, res) => {
  const hasSupabaseDbUrl = !!(process.env.SUPABASE_DB_URL || process.env.DATABASE_URL);
  const hasSupabaseClientKeys = !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY);
  
  res.json({
    provider: hasSupabaseDbUrl ? "supabase" : "cloudsql",
    supabaseConfigured: hasSupabaseDbUrl,
    supabaseClientActive: hasSupabaseClientKeys,
    dbUrlSet: hasSupabaseDbUrl,
    cloudSqlActive: !hasSupabaseDbUrl
  });
});

// ----------------------------------------------------
// AI ENDPOINTS USING GEMINI
// ----------------------------------------------------

// 1. CHAT CONVERSATION / AI DIGITAL ADVISOR
app.post("/api/chat", async (req, res) => {
  const { messages, voiceMode } = req.body;
  const recentMsgs = messages || [];

  const conversationHistory = recentMsgs.map((m: any) => {
    return `${m.sender === "user" ? "Customer" : "IDBI WealthAI Advisor"}: ${m.text}`;
  }).join("\n");

  const systemPrompt = `You are "IDBI WealthAI Advisor", an advanced, friendly, and elite AI Digital Wealth Relationship Manager at IDBI Bank.
The customer's profile is:
- Name: ${mockProfile.name}
- Age: ${mockProfile.age}
- Monthly Income: ₹${mockProfile.monthlyIncome}
- Current Liquid Balance: ₹4,500,000 (Liquid) + ₹${mockPortfolio.totalValue} (Invested Portfolio)
- Risk Appetite: ${mockProfile.riskAppetite}
- Financial Goals:
${mockGoals.map(g => `  * ${g.name}: Target ₹${g.targetAmount}, Current Saved: ₹${g.currentSavings}, Date: ${g.targetDate}`).join("\n")}

Always answer accurately, authoritatively yet friendly. Use rupee symbol (₹). Keep responses professional, scannable with bullet points, and highly relevant.
${voiceMode ? "Keep your response extremely short, conversational, and direct (max 2-3 sentences) as the customer is listening via voice output." : "Provide thorough explanations with actionable banking suggestions."}

Context of conversation so far:
${conversationHistory}

Produce your next response as the IDBI WealthAI Advisor:`;

  try {
    const ai = getGeminiClient();
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasKey) {
      const response = await generateContentWithTimeout(ai, {
        model: "gemini-3.5-flash",
        contents: systemPrompt,
      });
      res.json({ text: response.text });
    } else {
      // Mock Fallback response
      const lastUserMsg = recentMsgs[recentMsgs.length - 1]?.text || "hello";
      let responseText = `Hello ${mockProfile.name}! As your IDBI Relationship Manager, I am analyzing your portfolio. `;
      if (lastUserMsg.toLowerCase().includes("spend") || lastUserMsg.toLowerCase().includes("budget")) {
        responseText += `Your shopping budget is up by 17% this month. I recommend allocating ₹10,000 more to your SIP in Nippon Mutual Funds to counter this spending.`;
      } else if (lastUserMsg.toLowerCase().includes("invest") || lastUserMsg.toLowerCase().includes("risk")) {
        responseText += `Given your ${mockProfile.riskAppetite} risk appetite, I advise a balanced split: 60% in IDBI Equity Mutual Funds, and 40% in government debt bonds or stable gold ETFs.`;
      } else {
        responseText += `You currently have ₹4,50,000 in idle cash earning 3.5% interest. We can park this in a high-yielding IDBI Floating Rate FD earning up to 7.25% annually. Would you like me to map this?`;
      }
      res.json({ text: responseText });
    }
  } catch (error: any) {
    console.error("Gemini API Chat error:", error);
    res.json({ text: `I am currently running in offline bank advisor backup mode. For your moderate risk level, I highly recommend creating an automated monthly recurring investment of ₹25,000 to maximize compound returns towards your "Buy Dream House" goal.` });
  }
});

// 2. AI FINANCIAL INSIGHTS (JSON SCHEMA API)
app.get("/api/insights", async (req, res) => {
  const prompt = `Analyze this IDBI Bank customer's financial profile and generate exactly 5 distinct, high-impact wealth insights.
Income: ₹${mockProfile.monthlyIncome}/month.
Liquidity: ₹450,000 in bank accounts.
Investment assets: Mutual Funds (₹15.4L), Equity (₹9.6L), FD (₹5.7L), Gold (₹3.8L).
Goals:
1. Buy House: ₹75L, Current: ₹18L.
2. Children Education: ₹25L, Current: ₹6.5L.

Return a JSON array of Insight objects. Every object must strictly fit the following TS structure:
interface AIInsight {
  id: string;
  title: string;
  category: 'budget' | 'saving' | 'investment' | 'alert' | 'general';
  description: string;
  reason: string;
  confidence: number; // confidence score percentage between 75 and 99
  suggestedAction: string;
}

Be creative, hyper-personalized, and focus on maximizing wealth creation for an Indian IT professional. Ensure it matches standard IDBI wealth product naming conventions.`;

  try {
    const ai = getGeminiClient();
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasKey) {
      const response = await generateContentWithTimeout(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING, description: "Must be budget, saving, investment, alert, or general" },
                description: { type: Type.STRING },
                reason: { type: Type.STRING },
                confidence: { type: Type.INTEGER },
                suggestedAction: { type: Type.STRING },
              },
              required: ["id", "title", "category", "description", "reason", "confidence", "suggestedAction"],
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      res.json(data);
    } else {
      throw new Error("Key absent, fallback to mock insights");
    }
  } catch (error) {
    // Elegant fallback insights
    const fallbackInsights: AIInsight[] = [
      {
        id: "in-1",
        title: "Optimize Idle Liquid Cash",
        category: "investment",
        description: "You are holding ₹4,50,000 in your low-interest savings account which yields only 3.5%.",
        reason: "Holding excessive cash in savings reduces purchasing power over time due to inflation.",
        confidence: 96,
        suggestedAction: "Transfer ₹3,00,000 to an IDBI Multi-Option Deposit FD earning 7.4% YTD returns with full liquidity.",
      },
      {
        id: "in-2",
        title: "Discretionary Spending Spike Detected",
        category: "budget",
        description: "Your shopping and lifestyle expenses have increased by 17.4% compared to your 3-month average.",
        reason: "Incremental purchases on high-end electronic items and digital portals created a major pocket outflow.",
        confidence: 88,
        suggestedAction: "Set up a spending sub-limit cap of ₹15,000 on your IDBI Visa Signature Debit Card.",
      },
      {
        id: "in-3",
        title: "Moderate Risk Equity Room Available",
        category: "investment",
        description: "Your current asset allocation consists of 35% low-risk instruments, but your profile allows up to 65% equity exposure.",
        reason: "Historically, Moderate risk investors maximize wealth through higher allocation in large & mid-cap indices.",
        confidence: 92,
        suggestedAction: "Initiate a ₹12,000 monthly SIP in the IDBI Nifty Index Mutual Fund.",
      },
      {
        id: "in-4",
        title: "Emergency Fund Coverage Squeeze",
        category: "alert",
        description: "Your emergency capital cover accounts for only 2 months of operational expenses including housing EMI.",
        reason: "A safe cushion protects high-earning software developers from unexpected economic layoffs or delays.",
        confidence: 95,
        suggestedAction: "Direct ₹2,50,000 to a Liquid debt mutual fund, ensuring 6 months of continuous expenses are hedged.",
      },
      {
        id: "in-5",
        title: "Goal Realization Pace Mismatch",
        category: "saving",
        description: "Your current contribution of ₹45,000/month leaves you ₹12.5L short of your 'Dream House' goal target.",
        reason: "The target year 2031 demands a compound savings factor which is currently lagging behind schedule.",
        confidence: 84,
        suggestedAction: "Step-up your monthly home savings goal contribution by 8% annually.",
      }
    ];
    res.json(fallbackInsights);
  }
});

// 3. AI INVESTMENT ADVISORY OPTIONS (FD, Mutual Funds, Gold, etc.)
app.post("/api/investment-recommendations", async (req, res) => {
  const { riskAppetite } = req.body;
  const userRisk = riskAppetite || mockProfile.riskAppetite;

  const prompt = `Recommend exactly 4 tailored investment recommendations for an investor with a ${userRisk} risk profile, earning ₹1,45,000 monthly.
Return a JSON array of Recommendation objects conforming strictly to:
interface Recommendation {
  id: string;
  assetClass: 'Mutual Funds' | 'Fixed Deposit' | 'Gold' | 'ETF' | 'Government Bonds' | 'SIP' | 'Emergency Fund';
  name: string;
  expectedReturn: string;
  suitability: string;
  why: string;
  benefits: string[];
  risks: string;
}
Return only JSON. Use Indian financial tools and bank instruments where applicable.`;

  try {
    const ai = getGeminiClient();
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasKey) {
      const response = await generateContentWithTimeout(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                assetClass: { type: Type.STRING },
                name: { type: Type.STRING },
                expectedReturn: { type: Type.STRING },
                suitability: { type: Type.STRING },
                why: { type: Type.STRING },
                benefits: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                risks: { type: Type.STRING }
              },
              required: ["id", "assetClass", "name", "expectedReturn", "suitability", "why", "benefits", "risks"],
            }
          }
        }
      });
      const data = JSON.parse(response.text || "[]");
      res.json(data);
    } else {
      throw new Error("Fallback");
    }
  } catch (error) {
    const fallbackRecs: InvestmentRecommendation[] = [
      {
        id: "rec-1",
        assetClass: "Mutual Funds",
        name: "IDBI Equity hybrid Fund (Growth)",
        expectedReturn: "12.5% - 14% p.a.",
        suitability: `Perfect for ${userRisk} investors seeking capital gains with balanced downside protection.`,
        why: "Invests in 65% blue-chip equities and 35% high-quality debt papers, ensuring stable growth.",
        benefits: ["Professional capital management", "Automatic rebalancing", "Tax-efficient compounding"],
        risks: "Subject to stock market corrections and interest rate movements."
      },
      {
        id: "rec-2",
        assetClass: "SIP",
        name: "IDBI Flexi-Cap Index SIP",
        expectedReturn: "15.2% p.a.",
        suitability: "Highly suitable for long-term compounding over a 5 to 7 year horizon.",
        why: "Provides broad equity exposure spanning large, mid, and small-cap industries without human fund manager bias.",
        benefits: ["Rupee cost averaging", "Lowest expense ratios", "Participates in India's technology boom"],
        risks: "High short-term volatility; recommended only for horizons greater than 5 years."
      },
      {
        id: "rec-3",
        assetClass: "Fixed Deposit",
        name: "IDBI Suvidha Tax Saving FD",
        expectedReturn: "7.25% p.a.",
        suitability: "Ideal for securing tax-exempt returns under Section 80C.",
        why: "Guarantees 100% capital preservation and stable passive income payouts.",
        benefits: ["Sovereign banking grade safety", "Section 80C tax deduction", "Flexible interest payouts"],
        risks: "5-year premature withdrawal lock-in period."
      },
      {
        id: "rec-4",
        assetClass: "Gold",
        name: "IDBI Sovereign Gold Bond Tracker (SGB)",
        expectedReturn: "11.2% (Gold growth + 2.5% fixed interest)",
        suitability: "Essential hedge to secure inflation-beating diversification.",
        why: "Sovereign guaranteed physical gold certificate that yields extra 2.5% cash annually.",
        benefits: ["Sovereign security backing", "Zero capital gains tax on maturity", "Bi-annual cash dividends"],
        risks: "8-year maturity duration with liquidity window opening after year 5."
      }
    ];
    res.json(fallbackRecs);
  }
});

// 4. RETIREMENT CORPS ESTIMATOR
app.post("/api/retirement-plan", async (req, res) => {
  const { currentAge, retireAge, monthlyExp, inflationRate, returnRate } = req.body;
  const age = Number(currentAge || 32);
  const targetAge = Number(retireAge || 60);
  const exp = Number(monthlyExp || 60000);
  const infl = Number(inflationRate || 6) / 100;
  const ret = Number(returnRate || 11) / 100;

  const yearsToRetire = targetAge - age;
  // Future cost of living post retirement
  const futureMonthlyExp = exp * Math.pow(1 + infl, yearsToRetire);
  
  // Post retirement safety corpus (for 25 years of survival post retirement assuming post-ret return is inflation-matching)
  const targetCorpus = futureMonthlyExp * 12 * 25;

  // Monthly SIP required to hit the corpus today
  // Formula: S = FV * (r / ((1+r)^n - 1)) where r is monthly rate, n is monthly count
  const rMonthly = ret / 12;
  const nMonths = yearsToRetire * 12;
  const monthlySIP = rMonthly > 0 ? (targetCorpus * rMonthly) / (Math.pow(1 + rMonthly, nMonths) - 1) : targetCorpus / nMonths;

  res.json({
    yearsToRetire,
    futureMonthlyExpense: Math.round(futureMonthlyExp),
    estimatedCorpusRequired: Math.round(targetCorpus),
    recommendedMonthlySIP: Math.round(monthlySIP),
    explanation: `To maintain your current standard of living, inflation of ${inflationRate}% will raise your monthly cash outflow to ₹${Math.round(futureMonthlyExp).toLocaleString('en-IN')} by age ${retireAge}. You need a solid pile of ₹${Math.round(targetCorpus / 10000000).toFixed(2)} Crore. Running a steady SIP of ₹${Math.round(monthlySIP).toLocaleString('en-IN')}/month will hit this target flawlessly.`
  });
});

// 5. TAX SAVER ADVISORY
app.get("/api/tax-saver", (req, res) => {
  res.json({
    taxSlabs: [
      { regime: "New Tax Regime (FY 2024-25)", desc: "Exempt up to ₹7,00,000. Marginal slabs ranging from 5% to 30% with zero investment deductions." },
      { regime: "Old Tax Regime", desc: "Includes multiple investment deductions (Sec 80C, Sec 80D, NPS) up to ₹2,50,000 limit." }
    ],
    recommendations: [
      { section: "Section 80C", limit: "₹1,50,000", option: "Equity Linked Savings Scheme (ELSS) Mutual Funds", benefit: "Double advantage of tax exemption and potential high index growth (14-16% CAGR). Lowest lock-in of only 3 years.", suitability: "Highly recommended for salaried IT professionals." },
      { section: "Section 80CCD (1B)", limit: "₹50,000", option: "National Pension Scheme (NPS) Tier-1", benefit: "Additional deduction over and above Sec 80C. Combines growth with safe retirement backing.", suitability: "Best for secure retirement planning." },
      { section: "Section 80D", limit: "₹25,000 / ₹50,000", option: "IDBI Health Suvidha Premium", benefit: "Protects household capital from emergency healthcare bill inflation and provides direct tax exemptions.", suitability: "Mandatory for family healthcare." }
    ]
  });
});

// 6. REAL-TIME SIMULATED FINANCIAL NEWS FEED
app.get("/api/news", async (req, res) => {
  const prompt = `Generate exactly 6 fresh, real-time financial news headlines and summaries relevant to Indian banking and financial markets (such as Nifty, Reserve Bank of India, Indian tech sector, and IDBI).
Make sure to return a JSON array conforming strictly to:
interface FinancialNewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'Market' | 'Banking' | 'Policy' | 'Global' | 'Tech';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impactScore: number;
  summary: string;
}
Do not use markdown blocks. Return valid JSON only.`;

  try {
    const ai = getGeminiClient();
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (hasKey) {
      const response = await generateContentWithTimeout(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                source: { type: Type.STRING },
                timeAgo: { type: Type.STRING },
                category: { type: Type.STRING },
                sentiment: { type: Type.STRING },
                impactScore: { type: Type.INTEGER },
                summary: { type: Type.STRING }
              },
              required: ["id", "title", "source", "timeAgo", "category", "sentiment", "impactScore", "summary"]
            }
          }
        }
      });
      const data = JSON.parse(response.text || "[]");
      res.json(data);
    } else {
      throw new Error("Fallback required");
    }
  } catch (error) {
    const fallbackNews: FinancialNewsItem[] = [
      {
        id: "news-1",
        title: "RBI Keeps Repo Rate Unchanged at 6.50% Amid Robust GDP Growth Outlook",
        source: "Reserve Bank Bulletins",
        timeAgo: "2 mins ago",
        category: "Policy",
        sentiment: "neutral",
        impactScore: 8,
        summary: "The Monetary Policy Committee has decided by a 5:1 majority to remain focused on withdrawal of accommodation to ensure that inflation progressively aligns with the target of 4.0%."
      },
      {
        id: "news-2",
        title: "IDBI Bank Expands Digital Infrastructure; Launches Omnichannel Retail Wealth Desk",
        source: "Banking Ledger India",
        timeAgo: "12 mins ago",
        category: "Banking",
        sentiment: "bullish",
        impactScore: 9,
        summary: "In a move to capture the growing affluent middle-class savings pool, IDBI Bank unveiled an integrated AI-driven personal ledger workspace for retail account holders."
      },
      {
        id: "news-3",
        title: "Nifty 50 Extends Rallies to Landmark Highs; IT and Financial Stocks Fuel Momentum",
        source: "Dalal Street Wire",
        timeAgo: "45 mins ago",
        category: "Market",
        sentiment: "bullish",
        impactScore: 7,
        summary: "Robust institutional buying combined with positive domestic retail participation pushed key benchmark indices past crucial psychological resistances, supported by strong sector rotation."
      },
      {
        id: "news-4",
        title: "Indian Tech Sector Registers 18% Year-on-Year Export Surge in Cloud AI Services",
        source: "NASSCOM Insights",
        timeAgo: "1 hour ago",
        category: "Tech",
        sentiment: "bullish",
        impactScore: 6,
        summary: "Software export receipts rose sharply as enterprise clients in the US and Europe ramped up custom integration pipelines for sovereign language models and real-time processing nodes."
      },
      {
        id: "news-5",
        title: "Federal Reserve Signals Slower Rate Cut Trajectory Citing Resilient US Labor Market",
        source: "Bloomberg International",
        timeAgo: "2 hours ago",
        category: "Global",
        sentiment: "bearish",
        impactScore: 8,
        summary: "FOMC minutes indicate policymakers are in no rush to aggressively drop interest rates, preferring a cautious, data-dependent stance that could keep domestic bond yields elevated."
      },
      {
        id: "news-6",
        title: "Global Crude Oil Prices Moderate to $74/Barrel as Middle East Supply Apprehensions Ease",
        source: "Commodity Desk",
        timeAgo: "4 hours ago",
        category: "Global",
        sentiment: "bullish",
        impactScore: 7,
        summary: "A cooling energy market offers substantial fiscal relief to major oil-importing economies like India, directly tempering fuel inflation and reducing current account deficits."
      }
    ];
    res.json(fallbackNews);
  }
});

// ----------------------------------------------------
// VITE AND ASSETS MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
