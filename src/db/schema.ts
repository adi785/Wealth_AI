import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, jsonb } from 'drizzle-orm/pg-core';

// 1. Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  age: integer('age'),
  occupation: text('occupation'),
  monthlyIncome: doublePrecision('monthly_income').default(0),
  riskAppetite: text('risk_appetite').default('Moderate'), // 'Conservative' | 'Moderate' | 'Aggressive'
  investmentPreference: jsonb('investment_preference').default('[]'),
  language: text('language').default('English'),
  theme: text('theme').default('dark'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Goals table
export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  targetAmount: doublePrecision('target_amount').notNull(),
  currentSavings: doublePrecision('current_savings').default(0),
  targetDate: text('target_date').notNull(), // YYYY-MM-DD
  monthlyContribution: doublePrecision('monthly_contribution').default(0),
  category: text('category').notNull(), // 'House' | 'Car' | 'Education' | 'Vacation' | 'Retirement' | 'General'
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Transactions table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  category: text('category').notNull(),
  description: text('description').notNull(),
  amount: doublePrecision('amount').notNull(),
  type: text('type').notNull(), // 'debit' | 'credit'
  status: text('status').notNull(), // 'completed' | 'pending' | 'flagged'
  flagReason: text('flag_reason'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Portfolio table (we can store custom portfolio for user)
export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  totalValue: doublePrecision('total_value').default(0),
  assets: jsonb('assets').default('[]'), // Stores array of Asset
  totalReturns: doublePrecision('total_returns').default(0),
  ytdReturnsPercentage: doublePrecision('ytd_returns_percentage').default(0),
  growthHistory: jsonb('growth_history').default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  goals: many(goals),
  transactions: many(transactions),
  portfolio: one(portfolios, {
    fields: [users.id],
    references: [portfolios.userId],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const portfoliosRelations = relations(portfolios, ({ one }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
}));
