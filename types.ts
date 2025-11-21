
export type Period = 'day' | 'week' | 'month';
export type Priority = 'high' | 'medium' | 'low';
export type Language = 'zh' | 'en';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  period: Period;
  priority: Priority;
  date: string; // ISO Date string YYYY-MM-DD
  createdAt: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: number;
}

export interface SmartTransactionInput {
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
}

export interface GreetingData {
    emoji: string;
    text: string;
}

export type View = 'home' | 'calendar' | 'planner' | 'finance' | 'dashboard';
