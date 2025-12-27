export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseCategoryFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ExpenseCategoryState {
  items: ExpenseCategory[];
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string;
}

// Predefined icons for categories
export const CATEGORY_ICONS = [
  { value: 'coffee', label: 'Cà phê', icon: '☕' },
  { value: 'building', label: 'Tòa nhà', icon: '🏢' },
  { value: 'zap', label: 'Điện', icon: '⚡' },
  { value: 'users', label: 'Nhân viên', icon: '👥' },
  { value: 'megaphone', label: 'Marketing', icon: '📢' },
  { value: 'truck', label: 'Vận chuyển', icon: '🚚' },
  { value: 'wrench', label: 'Bảo trì', icon: '🔧' },
  { value: 'shopping-cart', label: 'Mua sắm', icon: '🛒' },
  { value: 'phone', label: 'Liên lạc', icon: '📞' },
  { value: 'book', label: 'Văn phòng phẩm', icon: '📚' },
  { value: 'car', label: 'Xe cộ', icon: '🚗' },
  { value: 'home', label: 'Cơ sở vật chất', icon: '🏠' },
  { value: 'credit-card', label: 'Tài chính', icon: '💳' },
  { value: 'gift', label: 'Khuyến mãi', icon: '🎁' },
  { value: 'more-horizontal', label: 'Khác', icon: '⚫' },
];

// Predefined colors for categories
export const CATEGORY_COLORS = [
  { value: 'amber', label: 'Vàng cam', color: '#F59E0B', bgClass: 'bg-amber-500/20', textClass: 'text-amber-200', borderClass: 'border-amber-400/30' },
  { value: 'blue', label: 'Xanh dương', color: '#3B82F6', bgClass: 'bg-blue-500/20', textClass: 'text-blue-200', borderClass: 'border-blue-400/30' },
  { value: 'green', label: 'Xanh lá', color: '#10B981', bgClass: 'bg-green-500/20', textClass: 'text-green-200', borderClass: 'border-green-400/30' },
  { value: 'red', label: 'Đỏ', color: '#EF4444', bgClass: 'bg-red-500/20', textClass: 'text-red-200', borderClass: 'border-red-400/30' },
  { value: 'purple', label: 'Tím', color: '#8B5CF6', bgClass: 'bg-purple-500/20', textClass: 'text-purple-200', borderClass: 'border-purple-400/30' },
  { value: 'pink', label: 'Hồng', color: '#EC4899', bgClass: 'bg-pink-500/20', textClass: 'text-pink-200', borderClass: 'border-pink-400/30' },
  { value: 'yellow', label: 'Vàng', color: '#F59E0B', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-200', borderClass: 'border-yellow-400/30' },
  { value: 'indigo', label: 'Chàm', color: '#6366F1', bgClass: 'bg-indigo-500/20', textClass: 'text-indigo-200', borderClass: 'border-indigo-400/30' },
  { value: 'gray', label: 'Xám', color: '#6B7280', bgClass: 'bg-gray-500/20', textClass: 'text-gray-200', borderClass: 'border-gray-400/30' },
  { value: 'orange', label: 'Cam', color: '#F97316', bgClass: 'bg-orange-500/20', textClass: 'text-orange-200', borderClass: 'border-orange-400/30' },
];
