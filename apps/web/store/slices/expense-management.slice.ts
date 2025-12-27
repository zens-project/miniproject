import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpenseFilters, ExpenseSummary, ExpenseState, ExpenseSortBy } from '@/lib/types/expenses';
import mockData from '@/lib/mock-data/expenses.json';

// Simulate API calls with mock data
export const fetchExpenses = createAsyncThunk(
  'expenseManagement/fetchAll',
  async (filters?: Partial<ExpenseFilters>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Convert string dates to Date objects
    let expenses: Expense[] = mockData.expenses.map(exp => ({
      ...exp,
      date: new Date(exp.date),
      createdAt: new Date(exp.createdAt),
      updatedAt: new Date(exp.updatedAt),
      category: exp.category
    }));

    // Apply filters
    if (filters) {
      if (filters.search) {
        expenses = expenses.filter(exp => 
          exp.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      
      if (filters.category) {
        expenses = expenses.filter(exp => exp.category === filters.category);
      }
      
      if (filters.dateFrom) {
        expenses = expenses.filter(exp => exp.date >= filters.dateFrom!);
      }
      
      if (filters.dateTo) {
        expenses = expenses.filter(exp => exp.date <= filters.dateTo!);
      }

      // Apply sorting
      if (filters.sortBy) {
        expenses.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (filters.sortBy) {
            case ExpenseSortBy.DATE:
              aValue = a.date.getTime();
              bValue = b.date.getTime();
              break;
            case ExpenseSortBy.AMOUNT:
              aValue = a.amount;
              bValue = b.amount;
              break;
            case ExpenseSortBy.CATEGORY:
              aValue = a.category;
              bValue = b.category;
              break;
            case ExpenseSortBy.CREATED_AT:
              aValue = a.createdAt.getTime();
              bValue = b.createdAt.getTime();
              break;
            default:
              aValue = a.date.getTime();
              bValue = b.date.getTime();
          }
          
          const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          return filters.sortOrder === 'desc' ? -result : result;
        });
      }
    }

    // Calculate summary
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalCount = expenses.length;
    const categoryBreakdown = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const summary: ExpenseSummary = {
      totalAmount,
      totalCount,
      categoryBreakdown,
      averageAmount: totalCount > 0 ? totalAmount / totalCount : 0,
      period: mockData.summary.period
    };

    return { expenses, summary };
  }
);

export const createExpense = createAsyncThunk(
  'expenseManagement/create',
  async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newExpense;
  }
);

export const updateExpense = createAsyncThunk(
  'expenseManagement/update',
  async ({ id, updates }: { id: string; updates: Partial<Expense> }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      id,
      updates: {
        ...updates,
        updatedAt: new Date()
      }
    };
  }
);

export const deleteExpense = createAsyncThunk(
  'expenseManagement/delete',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return id;
  }
);

export const exportExpenses = createAsyncThunk(
  'expenseManagement/export',
  async (format: 'csv' | 'pdf', { getState }) => {
    const state = getState() as { expenseManagement: ExpenseState };
    const { items } = state.expenseManagement;
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (format === 'csv') {
      const csvData = [
        ['Ngày', 'Danh mục', 'Số tiền', 'Mô tả'],
        ...items.map(exp => [
          exp.date.toLocaleDateString('vi-VN'),
          getCategoryLabel(exp.category),
          exp.amount.toString(),
          exp.description
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `chi-tieu-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    
    return { success: true, format };
  }
);

// Helper function for category labels - now uses dynamic categories
const getCategoryLabel = (categoryId: string): string => {
  // This will be replaced by dynamic category lookup in the future
  return categoryId;
};

const initialState: ExpenseState = {
  items: [],
  summary: {
    totalAmount: 0,
    totalCount: 0,
    categoryBreakdown: {} as Record<string, number>,
    averageAmount: 0,
    period: 'Tháng hiện tại'
  },
  filters: {
    search: '',
    category: '',
    dateFrom: null,
    dateTo: null,
    sortBy: ExpenseSortBy.DATE,
    sortOrder: 'desc'
  },
  isLoading: false,
  isSubmitting: false,
  error: undefined
};

const expenseManagementSlice = createSlice({
  name: 'expenseManagement',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ExpenseFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.expenses;
        state.summary = action.payload.summary;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tải danh sách chi tiêu';
      })
      // Create expense
      .addCase(createExpense.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items.unshift(action.payload);
        // Update summary
        state.summary.totalAmount += action.payload.amount;
        state.summary.totalCount += 1;
        const categoryId = action.payload.category;
        state.summary.categoryBreakdown[categoryId] = 
          (state.summary.categoryBreakdown[categoryId] || 0) + action.payload.amount;
        state.summary.averageAmount = state.summary.totalAmount / state.summary.totalCount;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể thêm chi tiêu';
      })
      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          const oldExpense = state.items[index];
          state.items[index] = { ...oldExpense, ...action.payload.updates };
          
          // Update summary if amount or category changed
          if (action.payload.updates.amount !== undefined || action.payload.updates.category !== undefined) {
            // Recalculate summary (simplified approach)
            const totalAmount = state.items.reduce((sum, exp) => sum + exp.amount, 0);
            const categoryBreakdown = state.items.reduce((acc, exp) => {
              acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
              return acc;
            }, {} as Record<string, number>);
            
            state.summary.totalAmount = totalAmount;
            state.summary.categoryBreakdown = categoryBreakdown;
            state.summary.averageAmount = totalAmount / state.summary.totalCount;
          }
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể cập nhật chi tiêu';
      })
      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.items.findIndex(item => item.id === action.payload);
        if (index !== -1) {
          const deletedExpense = state.items[index];
          state.items.splice(index, 1);
          
          // Update summary
          state.summary.totalAmount -= deletedExpense.amount;
          state.summary.totalCount -= 1;
          const categoryId = deletedExpense.category;
          state.summary.categoryBreakdown[categoryId] -= deletedExpense.amount;
          if (state.summary.categoryBreakdown[categoryId] <= 0) {
            delete state.summary.categoryBreakdown[categoryId];
          }
          state.summary.averageAmount = state.summary.totalCount > 0 
            ? state.summary.totalAmount / state.summary.totalCount 
            : 0;
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể xóa chi tiêu';
      })
      // Export expenses
      .addCase(exportExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exportExpenses.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể xuất dữ liệu';
      });
  }
});

export const { setFilters, clearFilters, clearError } = expenseManagementSlice.actions;
export default expenseManagementSlice.reducer;
