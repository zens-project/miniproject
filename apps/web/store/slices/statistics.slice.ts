import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Revenue, Expense, StatsSummary, DateRange, StatisticsState } from '@/lib/types/statistics';
import mockData from '@/lib/mock-data/statistics.json';

// Simulate API calls with mock data
export const fetchStatistics = createAsyncThunk(
  'statistics/fetchAll',
  async (dateRange?: DateRange) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Convert string dates to Date objects and ensure proper typing
    const revenues: Revenue[] = mockData.revenues.map(rev => ({
      ...rev,
      date: new Date(rev.date),
      type: rev.type as 'sale' | 'other'
    }));
    
    const expenses: Expense[] = mockData.expenses.map(exp => ({
      ...exp,
      date: new Date(exp.date),
      category: exp.category as any // Will be properly typed with ExpenseCategory enum
    }));

    // Filter by date range if provided
    let filteredRevenues = revenues;
    let filteredExpenses = expenses;
    
    if (dateRange) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      filteredRevenues = revenues.filter(rev => 
        rev.date >= startDate && rev.date <= endDate
      );
      filteredExpenses = expenses.filter(exp => 
        exp.date >= startDate && exp.date <= endDate
      );
    }

    // Calculate summary
    const totalRevenue = filteredRevenues.reduce((sum, rev) => sum + rev.amount, 0);
    const totalExpense = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = totalRevenue - totalExpense;
    const orderCount = filteredRevenues.length;

    const summary: StatsSummary = {
      totalRevenue,
      totalExpense,
      profit,
      orderCount,
      period: dateRange ? 
        `${new Date(dateRange.start).toLocaleDateString('vi-VN')} - ${new Date(dateRange.end).toLocaleDateString('vi-VN')}` :
        mockData.summary.period
    };

    return {
      revenues: filteredRevenues,
      expenses: filteredExpenses,
      summary
    };
  }
);

export const exportStatisticsData = createAsyncThunk(
  'statistics/export',
  async (format: 'csv' | 'pdf', { getState }) => {
    const state = getState() as { statistics: StatisticsState };
    const { revenues, expenses } = state.statistics;
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (format === 'csv') {
      const csvData = [
        ['Loại', 'Ngày', 'Số tiền', 'Mô tả'],
        ...revenues.map(r => ['Doanh thu', r.date.toLocaleDateString('vi-VN'), r.amount, r.type]),
        ...expenses.map(e => ['Chi phí', e.date.toLocaleDateString('vi-VN'), e.amount, e.description])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `thong-ke-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    
    return { success: true, format };
  }
);

const initialState: StatisticsState = {
  revenues: [],
  expenses: [],
  summary: {
    totalRevenue: 0,
    totalExpense: 0,
    profit: 0,
    orderCount: 0,
    period: 'Tháng hiện tại'
  },
  dateRange: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    end: new Date().toISOString()
  },
  isLoading: false,
  error: undefined
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch statistics
      .addCase(fetchStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenues = action.payload.revenues;
        state.expenses = action.payload.expenses;
        state.summary = action.payload.summary;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tải dữ liệu thống kê';
      })
      // Export data
      .addCase(exportStatisticsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exportStatisticsData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportStatisticsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể xuất dữ liệu';
      });
  }
});

export const { setDateRange, clearError } = statisticsSlice.actions;
export default statisticsSlice.reducer;
