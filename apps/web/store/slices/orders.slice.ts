import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '@/lib/services/order.service';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  note?: string;
}

interface OrdersState {
  items: Order[];
  currentOrder: OrderItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  currentOrder: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  const orders = await orderService.getAll();
  return orders;
});

export const createOrder = createAsyncThunk(
  'orders/create',
  async (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder = await orderService.create(order);
    return newOrder;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addToCurrentOrder: (state, action: PayloadAction<OrderItem>) => {
      const existing = state.currentOrder.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.currentOrder.push(action.payload);
      }
    },
    removeFromCurrentOrder: (state, action: PayloadAction<string>) => {
      state.currentOrder = state.currentOrder.filter((item) => item.productId !== action.payload);
    },
    updateOrderItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.currentOrder.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });

    // Create order
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.currentOrder = [];
    });
  },
});

export const {
  addToCurrentOrder,
  removeFromCurrentOrder,
  updateOrderItemQuantity,
  clearCurrentOrder,
} = ordersSlice.actions;
export default ordersSlice.reducer;
