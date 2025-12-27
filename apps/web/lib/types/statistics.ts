export interface Revenue {
  id: string;
  date: Date;
  amount: number;
  type: 'sale' | 'other';
  orderId?: string;
}

export interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: ExpenseCategory;
  description: string;
}

export enum ExpenseCategory {
  INGREDIENTS = 'ingredients',
  RENT = 'rent',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  MARKETING = 'marketing',
  OTHER = 'other'
}

export interface StatsSummary {
  totalRevenue: number;
  totalExpense: number;
  profit: number;
  orderCount: number;
  period: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface DateRange {
  start: string; // ISO string for Redux serialization
  end: string;   // ISO string for Redux serialization
}

export interface StatisticsState {
  revenues: Revenue[];
  expenses: Expense[];
  summary: StatsSummary;
  dateRange: DateRange;
  isLoading: boolean;
  error?: string;
}
