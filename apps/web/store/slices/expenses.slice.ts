import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expenseService } from '@/lib/services/expense.service';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface ExpensesState {
  items: Expense[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async () => {
  const expenses = await expenseService.getAll();
  return expenses;
});

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense = await expenseService.create(expense);
    return newExpense;
  }
);

export const deleteExpense = createAsyncThunk('expenses/delete', async (id: string) => {
  await expenseService.delete(id);
  return id;
});

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch expenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      });

    // Create expense
    builder.addCase(createExpense.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    // Delete expense
    builder.addCase(deleteExpense.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
    });
  },
});

export const { clearError } = expensesSlice.actions;
export default expensesSlice.reducer;
