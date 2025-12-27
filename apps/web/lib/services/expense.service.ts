import { MockApiService } from './mock-api.service';
import type { Expense } from '@/store/slices/expenses.slice';

class ExpenseService extends MockApiService {
  private readonly STORAGE_KEY = 'coffee-shop-expenses';

  async getAll(): Promise<Expense[]> {
    await this.simulateDelay();
    const expenses = this.getFromStorage<Expense>(this.STORAGE_KEY);
    return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async create(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    await this.simulateDelay();
    const expenses = this.getFromStorage<Expense>(this.STORAGE_KEY);
    
    const newExpense: Expense = {
      ...expense,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };
    
    expenses.push(newExpense);
    this.saveToStorage(this.STORAGE_KEY, expenses);
    
    return newExpense;
  }

  async delete(id: string): Promise<void> {
    await this.simulateDelay();
    const expenses = this.getFromStorage<Expense>(this.STORAGE_KEY);
    const filtered = expenses.filter((e) => e.id !== id);
    this.saveToStorage(this.STORAGE_KEY, filtered);
  }
}

export const expenseService = new ExpenseService();
