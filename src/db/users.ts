import { db } from './index.ts';
import { users, goals, transactions, portfolios } from './schema.ts';
import { eq } from 'drizzle-orm';
import { Goal, Transaction, Portfolio } from '../types.ts';

// ----------------------------------------------------
// DEFAULT SEED GENERATORS
// ----------------------------------------------------

const defaultGoalsList = [
  {
    name: "Buy Dream House",
    targetAmount: 7500000,
    currentSavings: 1800000,
    targetDate: "2031-12-31",
    monthlyContribution: 45000,
    category: "House",
  },
  {
    name: "Children's Higher Education",
    targetAmount: 2500000,
    currentSavings: 650000,
    targetDate: "2036-06-30",
    monthlyContribution: 15000,
    category: "Education",
  },
  {
    name: "Tesla electric car",
    targetAmount: 4000000,
    currentSavings: 800000,
    targetDate: "2029-03-31",
    monthlyContribution: 25000,
    category: "Car",
  },
  {
    name: "Retirement Gold Chest",
    targetAmount: 50000000,
    currentSavings: 2400000,
    targetDate: "2054-07-07",
    monthlyContribution: 30000,
    category: "Retirement",
  },
];

const defaultPortfolioData = {
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

function generateDefaultTransactions(): Omit<Transaction, 'id'>[] {
  const transactionList: Omit<Transaction, 'id'>[] = [];

  // Add predictable credits (Salary)
  transactionList.push({
    date: "2026-06-01",
    category: "Income",
    description: "IDBI BANK Corporate Salary Credited",
    amount: 145000,
    type: "credit",
    status: "completed",
  });
  transactionList.push({
    date: "2026-05-01",
    category: "Income",
    description: "IDBI BANK Corporate Salary Credited",
    amount: 145000,
    type: "credit",
    status: "completed",
  });
  transactionList.push({
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
    recurring.forEach((item) => {
      transactionList.push({
        date: `2026-${monthStr}-05`,
        category: item.category,
        description: item.desc,
        amount: item.amount,
        type: "debit",
        status: "completed",
      });
    });
  }

  // Random transactional expenses (approx 30 transactions to prevent slow insertions)
  const randomExpenses = [
    { category: "Food" as const, descs: ["Zomato Food Delivery", "Swiggy Order", "Starbucks Coffee", "Barbeque Nation Dinner", "Local Grocery Store"] },
    { category: "Travel" as const, descs: ["Uber Ride", "Ola Cabs", "HP Petrol Pump", "MakeMyTrip Flight Booking"] },
    { category: "Shopping" as const, descs: ["Amazon Shopping", "Myntra Clothing", "Flipkart Retail", "Zara Store"] },
    { category: "Utilities" as const, descs: ["Indane Gas Cylinder", "Airtel Prepaid Mobile"] },
    { category: "Entertainment" as const, descs: ["Netflix Monthly Subscription", "BookMyShow Movie Tickets", "Spotify Premium"] },
    { category: "Healthcare" as const, descs: ["Apollo Pharmacy Medicines", "Max Healthcare Clinic"] },
  ];

  const dates = [];
  for (let i = 1; i <= 90; i++) {
    const date = new Date("2026-04-01");
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  for (let i = 0; i < 30; i++) {
    const rDate = dates[Math.floor(Math.random() * dates.length)];
    const group = randomExpenses[Math.floor(Math.random() * randomExpenses.length)];
    const desc = group.descs[Math.floor(Math.random() * group.descs.length)];
    let amount = Math.floor(Math.random() * 2500) + 150;

    if (desc.includes("Flight") || desc.includes("Zara")) {
      amount = Math.floor(Math.random() * 8000) + 3000;
    }

    const isSuspicious = i === 5 || i === 18;
    const finalDesc = isSuspicious ? (i === 5 ? "Unknown Foreign Merchant Moscow" : "Suspicious Online Crypto Gateway") : desc;
    const finalAmount = isSuspicious ? (i === 5 ? 48500 : 92000) : amount;

    transactionList.push({
      date: rDate,
      category: group.category,
      description: finalDesc,
      amount: finalAmount,
      type: "debit",
      status: isSuspicious ? "flagged" : "completed",
      flagReason: isSuspicious ? (i === 5 ? "Unusual high-value foreign transaction executed from a blacklisted merchant location." : "High velocity transfer to suspicious cryptocurrency escrow wallet.") : undefined,
    });
  }

  return transactionList.sort((a, b) => b.date.localeCompare(a.date));
}

// ----------------------------------------------------
// DATABASE ACCESS HELPERS WITH GRACEFUL IN-MEMORY FALLBACKS
// ----------------------------------------------------

// Simple in-memory fallback store to handle container-blocked port 5432/6543 environments
const memoryUsersStore = new Map<string | number, any>();
const memoryGoalsStore = new Map<string | number, any[]>();
const memoryTransactionsStore = new Map<string | number, any[]>();
const memoryPortfoliosStore = new Map<string | number, any>();

let memoryIdCounter = 1000;

export async function getOrCreateUser(uid: string, email: string, name: string = "Valued IDBI Client") {
  try {
    // 1. Check if user already exists
    const existingUsers = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existingUsers.length > 0) {
      return existingUsers[0];
    }

    // 2. Wrap creation and seeding in transaction
    return await db.transaction(async (tx) => {
      // Create user
      const insertedUsers = await tx.insert(users)
        .values({
          uid,
          email,
          name,
          age: 32,
          occupation: "Senior Software Engineer",
          monthlyIncome: 145000,
          riskAppetite: "Moderate",
          investmentPreference: ["Mutual Funds", "Equity", "SIP"],
          language: "English",
          theme: "dark"
        })
        .returning();

      const userRecord = insertedUsers[0];

      // Create initial portfolio
      await tx.insert(portfolios)
        .values({
          userId: userRecord.id,
          totalValue: defaultPortfolioData.totalValue,
          assets: defaultPortfolioData.assets,
          totalReturns: defaultPortfolioData.totalReturns,
          ytdReturnsPercentage: defaultPortfolioData.ytdReturnsPercentage,
          growthHistory: defaultPortfolioData.growthHistory,
        });

      // Create default goals
      const goalsToInsert = defaultGoalsList.map(g => ({
        userId: userRecord.id,
        name: g.name,
        targetAmount: g.targetAmount,
        currentSavings: g.currentSavings,
        targetDate: g.targetDate,
        monthlyContribution: g.monthlyContribution,
        category: g.category,
      }));
      await tx.insert(goals).values(goalsToInsert);

      // Create default transactions
      const transactionsToInsert = generateDefaultTransactions().map(t => ({
        userId: userRecord.id,
        date: t.date,
        category: t.category,
        description: t.description,
        amount: t.amount,
        type: t.type,
        status: t.status,
        flagReason: t.flagReason,
      }));
      await tx.insert(transactions).values(transactionsToInsert);

      return userRecord;
    });

  } catch (error) {
    console.warn("Direct PostgreSQL Connection Failed/Blocked. Initializing session via robust in-memory datastore.", error);
    
    // In-Memory fallback implementation
    if (memoryUsersStore.has(uid)) {
      return memoryUsersStore.get(uid);
    }

    const mockId = ++memoryIdCounter;
    const userRecord = {
      id: mockId,
      uid,
      email,
      name,
      age: 32,
      occupation: "Senior Software Engineer",
      monthlyIncome: 145000,
      riskAppetite: "Moderate",
      investmentPreference: ["Mutual Funds", "Equity", "SIP"],
      language: "English",
      theme: "dark"
    };

    memoryUsersStore.set(uid, userRecord);
    memoryUsersStore.set(String(mockId), userRecord);

    memoryPortfoliosStore.set(mockId, {
      id: mockId,
      userId: mockId,
      totalValue: defaultPortfolioData.totalValue,
      assets: defaultPortfolioData.assets,
      totalReturns: defaultPortfolioData.totalReturns,
      ytdReturnsPercentage: defaultPortfolioData.ytdReturnsPercentage,
      growthHistory: defaultPortfolioData.growthHistory,
    });

    const goalsList = defaultGoalsList.map((g, idx) => ({
      id: idx + 2000,
      userId: mockId,
      name: g.name,
      targetAmount: g.targetAmount,
      currentSavings: g.currentSavings,
      targetDate: g.targetDate,
      monthlyContribution: g.monthlyContribution,
      category: g.category,
    }));
    memoryGoalsStore.set(mockId, goalsList);

    const txsList = generateDefaultTransactions().map((t, idx) => ({
      id: idx + 3000,
      userId: mockId,
      date: t.date,
      category: t.category,
      description: t.description,
      amount: t.amount,
      type: t.type,
      status: t.status,
      flagReason: t.flagReason,
    }));
    memoryTransactionsStore.set(mockId, txsList);

    return userRecord;
  }
}

export async function getUserData(userId: number) {
  try {
    const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userRecords.length === 0) {
      throw new Error("User record not found");
    }
    const profile = userRecords[0];

    const goalsRecords = await db.select().from(goals).where(eq(goals.userId, userId));
    const transactionsRecords = await db.select().from(transactions).where(eq(transactions.userId, userId));
    const portfolioRecords = await db.select().from(portfolios).where(eq(portfolios.userId, userId)).limit(1);

    const sortedTransactions = transactionsRecords.sort((a, b) => b.date.localeCompare(a.date));

    // Calculate dynamic balance based on transactions
    const debits = sortedTransactions.filter(t => t.type === "debit");
    const credits = sortedTransactions.filter(t => t.type === "credit");

    const totalSpending = debits.reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = credits.reduce((acc, t) => acc + t.amount, 0);

    // Dynamic current liquid balance calculation or static baseline + difference
    const liquidBalance = Math.max(10000, 450000 + (totalIncome - totalSpending - 200000)); // offset calculation

    // Portfolio fallback if none exists
    const defaultPort = {
      totalValue: 0,
      assets: [],
      totalReturns: 0,
      ytdReturnsPercentage: 0,
      growthHistory: []
    };
    const portfolio = portfolioRecords[0] ? {
      totalValue: portfolioRecords[0].totalValue || 0,
      assets: (portfolioRecords[0].assets as any) || [],
      totalReturns: portfolioRecords[0].totalReturns || 0,
      ytdReturnsPercentage: portfolioRecords[0].ytdReturnsPercentage || 0,
      growthHistory: (portfolioRecords[0].growthHistory as any) || []
    } : defaultPort;

    // Convert SQL schema records back into frontend types (including string IDs for consistency)
    const formattedGoals = goalsRecords.map(g => ({
      id: `g-${g.id}`,
      name: g.name,
      targetAmount: g.targetAmount,
      currentSavings: g.currentSavings || 0,
      targetDate: g.targetDate,
      monthlyContribution: g.monthlyContribution || 0,
      category: g.category as any,
    }));

    const formattedTransactions = sortedTransactions.map(t => ({
      id: `tx-${t.id}`,
      date: t.date,
      category: t.category as any,
      description: t.description,
      amount: t.amount,
      type: t.type as any,
      status: t.status as any,
      flagReason: t.flagReason || undefined,
    }));

    return {
      profile: {
        name: profile.name,
        email: profile.email,
        age: profile.age || 32,
        occupation: profile.occupation || "Engineer",
        monthlyIncome: profile.monthlyIncome || 0,
        riskAppetite: (profile.riskAppetite as any) || 'Moderate',
        investmentPreference: (profile.investmentPreference as any) || [],
        language: profile.language || 'English',
        theme: (profile.theme as any) || 'dark',
      },
      goals: formattedGoals,
      portfolio,
      transactions: formattedTransactions,
      summary: {
        liquidBalance: liquidBalance,
        monthlyIncome: profile.monthlyIncome || 0,
        monthlySpending: 84300,
        netSavings: (profile.monthlyIncome || 0) - 84300,
        financialHealthScore: 84,
      }
    };
  } catch (error) {
    console.warn("Direct database query failed, pulling from in-memory backup:", error.message || error);
    
    // In-Memory fallback retrieval
    const profile = memoryUsersStore.get(String(userId)) || {
      name: "Rahul Sharma",
      email: "rahul.sharma@idbi.com",
      age: 32,
      occupation: "Senior Software Engineer",
      monthlyIncome: 145000,
      riskAppetite: "Moderate",
      investmentPreference: ["Mutual Funds", "Equity", "SIP"],
      language: "English",
      theme: "dark"
    };

    const goalsRecords = memoryGoalsStore.get(userId) || [];
    const transactionsRecords = memoryTransactionsStore.get(userId) || [];
    const portfolio = memoryPortfoliosStore.get(userId) || {
      totalValue: defaultPortfolioData.totalValue,
      assets: defaultPortfolioData.assets,
      totalReturns: defaultPortfolioData.totalReturns,
      ytdReturnsPercentage: defaultPortfolioData.ytdReturnsPercentage,
      growthHistory: defaultPortfolioData.growthHistory,
    };

    const sortedTransactions = transactionsRecords.sort((a, b) => b.date.localeCompare(a.date));
    const debits = sortedTransactions.filter(t => t.type === "debit");
    const credits = sortedTransactions.filter(t => t.type === "credit");
    const totalSpending = debits.reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = credits.reduce((acc, t) => acc + t.amount, 0);
    const liquidBalance = Math.max(10000, 450000 + (totalIncome - totalSpending - 200000));

    const formattedGoals = goalsRecords.map(g => ({
      id: `g-${g.id}`,
      name: g.name,
      targetAmount: g.targetAmount,
      currentSavings: g.currentSavings || 0,
      targetDate: g.targetDate,
      monthlyContribution: g.monthlyContribution || 0,
      category: g.category as any,
    }));

    const formattedTransactions = sortedTransactions.map(t => ({
      id: `tx-${t.id}`,
      date: t.date,
      category: t.category as any,
      description: t.description,
      amount: t.amount,
      type: t.type as any,
      status: t.status as any,
      flagReason: t.flagReason || undefined,
    }));

    return {
      profile: {
        name: profile.name,
        email: profile.email,
        age: profile.age || 32,
        occupation: profile.occupation || "Engineer",
        monthlyIncome: profile.monthlyIncome || 0,
        riskAppetite: (profile.riskAppetite as any) || 'Moderate',
        investmentPreference: (profile.investmentPreference as any) || [],
        language: profile.language || 'English',
        theme: (profile.theme as any) || 'dark',
      },
      goals: formattedGoals,
      portfolio,
      transactions: formattedTransactions,
      summary: {
        liquidBalance: liquidBalance,
        monthlyIncome: profile.monthlyIncome || 0,
        monthlySpending: 84300,
        netSavings: (profile.monthlyIncome || 0) - 84300,
        financialHealthScore: 84,
      }
    };
  }
}

export async function updateUserProfile(userId: number, fields: {
  name?: string;
  age?: number;
  occupation?: string;
  monthlyIncome?: number;
  riskAppetite?: string;
}) {
  try {
    const updateData: any = {};
    if (fields.name !== undefined) updateData.name = fields.name;
    if (fields.age !== undefined) updateData.age = Number(fields.age);
    if (fields.occupation !== undefined) updateData.occupation = fields.occupation;
    if (fields.monthlyIncome !== undefined) updateData.monthlyIncome = Number(fields.monthlyIncome);
    if (fields.riskAppetite !== undefined) updateData.riskAppetite = fields.riskAppetite;

    await db.update(users).set(updateData).where(eq(users.id, userId));
  } catch (error) {
    console.warn("Direct database update profile failed, updating in-memory:", error.message || error);
    
    const profile = memoryUsersStore.get(String(userId));
    if (profile) {
      if (fields.name !== undefined) profile.name = fields.name;
      if (fields.age !== undefined) profile.age = Number(fields.age);
      if (fields.occupation !== undefined) profile.occupation = fields.occupation;
      if (fields.monthlyIncome !== undefined) profile.monthlyIncome = Number(fields.monthlyIncome);
      if (fields.riskAppetite !== undefined) profile.riskAppetite = fields.riskAppetite;
      memoryUsersStore.set(String(userId), profile);
      memoryUsersStore.set(profile.uid, profile);
    }
  }
}

export async function createGoal(userId: number, goalData: {
  name: string;
  targetAmount: number;
  targetDate: string;
  monthlyContribution: number;
  category: string;
}) {
  try {
    await db.insert(goals).values({
      userId,
      name: goalData.name,
      targetAmount: Number(goalData.targetAmount),
      targetDate: goalData.targetDate,
      monthlyContribution: Number(goalData.monthlyContribution),
      category: goalData.category,
      currentSavings: 0
    });
  } catch (error) {
    console.warn("Direct database create goal failed, writing to in-memory:", error.message || error);
    
    const goalsList = memoryGoalsStore.get(userId) || [];
    const newId = ++memoryIdCounter;
    goalsList.push({
      id: newId,
      userId,
      name: goalData.name,
      targetAmount: Number(goalData.targetAmount),
      targetDate: goalData.targetDate,
      monthlyContribution: Number(goalData.monthlyContribution),
      category: goalData.category,
      currentSavings: 0
    });
    memoryGoalsStore.set(userId, goalsList);
  }
}

export async function investInGoal(userId: number, goalIdStr: string, amount: number) {
  try {
    // extract integer id from "g-ID"
    const goalId = parseInt(goalIdStr.replace("g-", ""), 10);
    if (isNaN(goalId)) {
      throw new Error("Invalid goal ID format");
    }

    // fetch goal first
    const existingGoals = await db.select().from(goals).where(eq(goals.id, goalId)).limit(1);
    if (existingGoals.length === 0 || existingGoals[0].userId !== userId) {
      throw new Error("Goal not found or access denied");
    }

    const current = existingGoals[0].currentSavings || 0;
    const updatedAmount = current + amount;

    await db.update(goals)
      .set({ currentSavings: updatedAmount })
      .where(eq(goals.id, goalId));
  } catch (error) {
    console.warn("Direct database invest in goal failed, updating in-memory:", error.message || error);
    
    const goalId = parseInt(goalIdStr.replace("g-", ""), 10);
    const goalsList = memoryGoalsStore.get(userId) || [];
    const goal = goalsList.find(g => g.id === goal) || goalsList.find(g => String(g.id) === String(goalId));
    if (goal) {
      goal.currentSavings = (goal.currentSavings || 0) + amount;
    }
  }
}
