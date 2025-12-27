export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface RevenueEntry {
  id: string;
  orderId: string;
  customerId?: string | 'others';
  customerName?: string;
  items: OrderItem[];
  total: number;
  createdAt: string; // ISO string for Redux serialization
  updatedAt: string; // ISO string for Redux serialization
}

export interface Order {
  id: string;
  customerId?: string | 'others';
  customerName?: string;
  items: OrderItem[];
  total: number;
  type: 'dine-in' | 'takeaway';
  status: 'completed';
  createdAt: Date;
}

export interface CurrentOrder {
  items: OrderItem[];
  customerId?: string | 'others';
  customerName?: string;
  type: 'dine-in' | 'takeaway';
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  lastPurchaseDate?: string; // ISO string for Redux serialization
  createdAt: string; // ISO string for Redux serialization
  updatedAt: string; // ISO string for Redux serialization
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email?: string;
}

export interface SalesState {
  currentOrder: CurrentOrder;
  recentRevenues: RevenueEntry[];
  customers: Customer[];
  loyaltyNotifications: LoyaltyNotification[];
  loyaltyRewards: LoyaltyReward[];
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string;
}

export interface SalesFilters {
  search: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  customerFilter: string;
}

// Loyalty Program
export interface LoyaltyReward {
  id: string;
  customerId: string;
  customerName: string;
  rewardType: 'free_drink' | 'discount' | 'bonus_points';
  description: string;
  isUsed: boolean;
  earnedAt: string; // ISO string for Redux serialization
  usedAt?: string; // ISO string for Redux serialization
  expiresAt?: string; // ISO string for Redux serialization
}

export interface LoyaltyNotification {
  id: string;
  customerId: string;
  customerName: string;
  message: string;
  type: 'reward_earned' | 'points_added' | 'milestone_reached';
  isRead: boolean;
  createdAt: string; // ISO string for Redux serialization
}

// Loyalty Program Constants
export const LOYALTY_CONFIG = {
  POINTS_PER_PURCHASE: 1,
  POINTS_FOR_FREE_DRINK: 10,
  REWARD_EXPIRY_DAYS: 30
} as const;

// Order types for UI
export const ORDER_TYPES = [
  { value: 'dine-in', label: 'Tại chỗ', icon: '🍽️' },
  { value: 'takeaway', label: 'Mang về', icon: '🥤' }
] as const;
