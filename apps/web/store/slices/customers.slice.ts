import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerService } from '@/lib/services/customer.service';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  totalSpent: number;
  visitCount: number;
  createdAt: string;
}

interface CustomersState {
  items: Customer[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCustomers = createAsyncThunk('customers/fetchAll', async () => {
  const customers = await customerService.getAll();
  return customers;
});

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpent' | 'visitCount' | 'createdAt'>) => {
    const newCustomer = await customerService.create(customer);
    return newCustomer;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch customers';
      });

    // Create customer
    builder.addCase(createCustomer.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
  },
});

export const { clearError } = customersSlice.actions;
export default customersSlice.reducer;
