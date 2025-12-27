import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SalesState, CurrentOrder, OrderItem, RevenueEntry, Customer, CustomerFormData, LoyaltyNotification, LoyaltyReward, LOYALTY_CONFIG } from '@/lib/types/sales';
import { Product } from '@/lib/types/products';
import mockSalesData from '@/lib/mock-data/sales.json';

// Simulate API calls with mock data
export const fetchRecentRevenues = createAsyncThunk(
  'salesManagement/fetchRecentRevenues',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Explicitly ensure dates are strings for Redux serialization
    const revenues: RevenueEntry[] = mockSalesData.revenueEntries.map(revenue => ({
      ...revenue,
      createdAt: String(revenue.createdAt),
      updatedAt: String(revenue.updatedAt)
    }));

    return revenues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
);

export const fetchCustomers = createAsyncThunk(
  'salesManagement/fetchCustomers',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Explicitly ensure dates are strings for Redux serialization
    const customers: Customer[] = mockSalesData.customers.map(customer => ({
      ...customer,
      lastPurchaseDate: customer.lastPurchaseDate ? String(customer.lastPurchaseDate) : undefined,
      createdAt: String(customer.createdAt),
      updatedAt: String(customer.updatedAt)
    }));

    return customers;
  }
);

export const createCustomer = createAsyncThunk(
  'salesManagement/createCustomer',
  async (customerData: CustomerFormData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const newCustomer: Customer = {
      ...customerData,
      id: `cust_${Date.now()}`,
      loyaltyPoints: 0,
      totalPurchases: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newCustomer;
  }
);

export const updateCustomer = createAsyncThunk(
  'salesManagement/updateCustomer',
  async ({ id, updates }: { id: string; updates: Partial<CustomerFormData> }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      id,
      updates: {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    };
  }
);

export const deleteCustomer = createAsyncThunk(
  'salesManagement/deleteCustomer',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return id;
  }
);

export const completeOrder = createAsyncThunk(
  'salesManagement/completeOrder',
  async (orderData: CurrentOrder, { getState, dispatch }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const orderId = `ord_${Date.now()}`;
    const revenueEntry: RevenueEntry = {
      id: `rev_${Date.now()}`,
      orderId,
      customerId: orderData.customerId || 'others',
      customerName: orderData.customerName || 'Khách lẻ',
      items: orderData.items,
      total: orderData.total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Handle loyalty points for registered customers
    let loyaltyNotification: LoyaltyNotification | null = null;
    let loyaltyReward: LoyaltyReward | null = null;

    if (orderData.customerId && orderData.customerId !== 'others') {
      const state = getState() as any;
      const customer = state.salesManagement.customers.find((c: Customer) => c.id === orderData.customerId);
      
      if (customer) {
        const newPoints = customer.loyaltyPoints + LOYALTY_CONFIG.POINTS_PER_PURCHASE;
        const newTotalPurchases = customer.totalPurchases + 1;
        
        // Check if customer earned a reward
        if (newPoints >= LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK && 
            customer.loyaltyPoints < LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK) {
          
          // Create loyalty reward
          loyaltyReward = {
            id: `reward_${Date.now()}`,
            customerId: customer.id,
            customerName: customer.name,
            rewardType: 'free_drink',
            description: 'Ly cà phê miễn phí - Chúc mừng bạn đã tích đủ 10 điểm!',
            isUsed: false,
            earnedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + LOYALTY_CONFIG.REWARD_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString()
          };

          // Create notification
          loyaltyNotification = {
            id: `notif_${Date.now()}`,
            customerId: customer.id,
            customerName: customer.name,
            message: `🎉 Chúc mừng ${customer.name}! Bạn đã nhận được 1 ly cà phê miễn phí khi tích đủ 10 điểm!`,
            type: 'reward_earned',
            isRead: false,
            createdAt: new Date().toISOString()
          };
        } else {
          // Regular points notification
          loyaltyNotification = {
            id: `notif_${Date.now()}`,
            customerId: customer.id,
            customerName: customer.name,
            message: `${customer.name} đã nhận +1 điểm! Tổng: ${newPoints}/${LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK} điểm`,
            type: 'points_added',
            isRead: false,
            createdAt: new Date().toISOString()
          };
        }
      }
    }

    return { 
      revenueEntry, 
      loyaltyNotification, 
      loyaltyReward,
      customerId: orderData.customerId 
    };
  }
);

export const updateRevenueEntry = createAsyncThunk(
  'salesManagement/updateRevenueEntry',
  async ({ id, updates }: { id: string; updates: Partial<RevenueEntry> }) => {
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

export const deleteRevenueEntry = createAsyncThunk(
  'salesManagement/deleteRevenueEntry',
  async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return id;
  }
);

const initialState: SalesState = {
  currentOrder: {
    items: [],
    type: 'dine-in',
    total: 0
  },
  recentRevenues: [],
  customers: [],
  loyaltyNotifications: [],
  loyaltyRewards: [],
  isLoading: false,
  isSubmitting: false,
  error: undefined
};

const salesManagementSlice = createSlice({
  name: 'salesManagement',
  initialState,
  reducers: {
    // Current Order Management
    addItemToOrder: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.currentOrder.items.findIndex(
        item => item.productId === product.id
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        state.currentOrder.items[existingItemIndex].quantity += quantity;
        state.currentOrder.items[existingItemIndex].subtotal = 
          state.currentOrder.items[existingItemIndex].quantity * product.price;
      } else {
        // Add new item
        const newItem: OrderItem = {
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
          subtotal: quantity * product.price
        };
        state.currentOrder.items.push(newItem);
      }

      // Recalculate total
      state.currentOrder.total = state.currentOrder.items.reduce(
        (sum, item) => sum + item.subtotal, 0
      );
    },

    removeItemFromOrder: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.currentOrder.items = state.currentOrder.items.filter(
        item => item.productId !== productId
      );

      // Recalculate total
      state.currentOrder.total = state.currentOrder.items.reduce(
        (sum, item) => sum + item.subtotal, 0
      );
    },

    updateItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.currentOrder.items.findIndex(
        item => item.productId === productId
      );

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.currentOrder.items.splice(itemIndex, 1);
        } else {
          // Update quantity and subtotal
          state.currentOrder.items[itemIndex].quantity = quantity;
          state.currentOrder.items[itemIndex].subtotal = 
            quantity * state.currentOrder.items[itemIndex].price;
        }

        // Recalculate total
        state.currentOrder.total = state.currentOrder.items.reduce(
          (sum, item) => sum + item.subtotal, 0
        );
      }
    },

    setOrderCustomer: (state, action: PayloadAction<{ customerId?: string; customerName?: string }>) => {
      state.currentOrder.customerId = action.payload.customerId;
      state.currentOrder.customerName = action.payload.customerName;
    },

    setOrderType: (state, action: PayloadAction<'dine-in' | 'takeaway'>) => {
      state.currentOrder.type = action.payload;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = {
        items: [],
        type: 'dine-in',
        total: 0
      };
    },

    // Loyalty Notification Management
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.loyaltyNotifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },

    clearAllNotifications: (state) => {
      state.loyaltyNotifications = [];
    },

    addLoyaltyNotification: (state, action: PayloadAction<LoyaltyNotification>) => {
      state.loyaltyNotifications.unshift(action.payload);
    },

    // Loyalty Reward Management
    markRewardAsUsed: (state, action: PayloadAction<string>) => {
      const reward = state.loyaltyRewards.find(r => r.id === action.payload);
      if (reward) {
        reward.isUsed = true;
        reward.usedAt = new Date().toISOString();
      }
    },

    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch recent revenues
      .addCase(fetchRecentRevenues.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchRecentRevenues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentRevenues = action.payload;
      })
      .addCase(fetchRecentRevenues.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tải danh sách doanh thu';
      })
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tải danh sách khách hàng';
      })
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.customers.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể tạo khách hàng';
      })
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.customers.findIndex(customer => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = { ...state.customers[index], ...action.payload.updates };
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể cập nhật khách hàng';
      })
      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể xóa khách hàng';
      })
      // Complete order
      .addCase(completeOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(completeOrder.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { revenueEntry, loyaltyNotification, loyaltyReward, customerId } = action.payload;
        
        // Add revenue entry
        state.recentRevenues.unshift(revenueEntry);
        
        // Update customer loyalty points if applicable
        if (customerId && customerId !== 'others') {
          const customerIndex = state.customers.findIndex(c => c.id === customerId);
          if (customerIndex !== -1) {
            state.customers[customerIndex].loyaltyPoints += LOYALTY_CONFIG.POINTS_PER_PURCHASE;
            state.customers[customerIndex].totalPurchases += 1;
            state.customers[customerIndex].lastPurchaseDate = new Date().toISOString();
            state.customers[customerIndex].updatedAt = new Date().toISOString();
          }
        }
        
        // Add loyalty notification if created
        if (loyaltyNotification) {
          state.loyaltyNotifications.unshift(loyaltyNotification);
        }
        
        // Add loyalty reward if earned
        if (loyaltyReward) {
          state.loyaltyRewards.unshift(loyaltyReward);
        }
        
        // Clear current order after successful completion
        state.currentOrder = {
          items: [],
          type: 'dine-in',
          total: 0
        };
      })
      .addCase(completeOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể hoàn thành đơn hàng';
      })
      // Update revenue entry
      .addCase(updateRevenueEntry.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(updateRevenueEntry.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.recentRevenues.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.recentRevenues[index] = { ...state.recentRevenues[index], ...action.payload.updates };
        }
      })
      .addCase(updateRevenueEntry.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể cập nhật doanh thu';
      })
      // Delete revenue entry
      .addCase(deleteRevenueEntry.pending, (state) => {
        state.isSubmitting = true;
        state.error = undefined;
      })
      .addCase(deleteRevenueEntry.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.recentRevenues = state.recentRevenues.filter(item => item.id !== action.payload);
      })
      .addCase(deleteRevenueEntry.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Không thể xóa doanh thu';
      });
  }
});

export const {
  addItemToOrder,
  removeItemFromOrder,
  updateItemQuantity,
  setOrderCustomer,
  setOrderType,
  clearCurrentOrder,
  markNotificationAsRead,
  clearAllNotifications,
  addLoyaltyNotification,
  markRewardAsUsed,
  clearError
} = salesManagementSlice.actions;

export default salesManagementSlice.reducer;
