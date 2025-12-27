export interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: string; // Changed to string to match dynamic category IDs
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ExpenseCategory {
  INGREDIENTS = 'ingredients',    // Nguyên liệu
  RENT = 'rent',                 // Thuê mặt bằng
  UTILITIES = 'utilities',       // Điện nước
  SALARY = 'salary',             // Lương nhân viên
  MARKETING = 'marketing',       // Marketing
  OTHER = 'other'                // Khác
}

export interface ExpenseFilters {
  search: string;
  category: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  sortBy: ExpenseSortBy;
  sortOrder: 'asc' | 'desc';
}

export enum ExpenseSortBy {
  DATE = 'date',
  AMOUNT = 'amount',
  CATEGORY = 'category',
  CREATED_AT = 'createdAt'
}

export interface ExpenseSummary {
  totalAmount: number;
  totalCount: number;
  categoryBreakdown: Record<string, number>;
  averageAmount: number;
  period: string;
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: string;
  description: string;
}

export interface ExpenseState {
  items: Expense[];
  summary: ExpenseSummary;
  filters: ExpenseFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string;
}
