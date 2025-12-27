import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExpenseCategory, ExpenseCategoryState } from '@/lib/types/expense-categories';
import mockData from '@/lib/mock-data/expense-categories.json';

// Simulate API calls with mock data
export const fetchExpenseCategories = createAsyncThunk(
  'expenseCategories/fetchAll',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Keep dates as ISO strings for Redux serialization
    const categories: ExpenseCategory[] = mockData.categories.map(cat => ({
      ...cat,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt
    }));

    return categories.filter(cat => cat.isActive);
  }
);

export const createExpenseCategory = createAsyncThunk(
  'expenseCategories/create',
  async (categoryData: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newCategory: ExpenseCategory = {
      ...categoryData,
      id: `cat_${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newCategory;
  }
);

export const updateExpenseCategory = createAsyncThunk(
  'expenseCategories/update',
  async ({ id, updates }: { id: string; updates: Partial<ExpenseCategory> }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id,
      updates: {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    };
  }
);

export const deleteExpenseCategory = createAsyncThunk(
  'expenseCategories/delete',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return id;
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  'expenseCategories/toggleStatus',
  async ({ id, isActive }: { id: string; isActive: boolean }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { id, isActive, updatedAt: new Date().toISOString() };
  }
);

const initialState: ExpenseCategoryState = {
  items: [],
  isLoading: false,
  isSubmitting: false,
  error: undefined
};

const expenseCategoriesSlice = createSlice({
  name: 'expenseCategories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchExpenseCategories.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tải danh sách danh mục';
      })
      // Create category
      .addCase(createExpenseCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(createExpenseCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items.push(action.payload);
      })
      .addCase(createExpenseCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể tạo danh mục';
      })
      // Update category
      .addCase(updateExpenseCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(updateExpenseCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.updates };
        }
      })
      .addCase(updateExpenseCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể cập nhật danh mục';
      })
      // Delete category
      .addCase(deleteExpenseCategory.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(deleteExpenseCategory.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteExpenseCategory.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể xóa danh mục';
      })
      // Toggle category status
      .addCase(toggleCategoryStatus.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          if (action.payload.isActive) {
            state.items[index].isActive = true;
            state.items[index].updatedAt = action.payload.updatedAt;
          } else {
            // Remove from active list when deactivated
            state.items.splice(index, 1);
          }
        }
      })
      .addCase(toggleCategoryStatus.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể thay đổi trạng thái danh mục';
      });
  }
});

export const { clearError } = expenseCategoriesSlice.actions;
export default expenseCategoriesSlice.reducer;
