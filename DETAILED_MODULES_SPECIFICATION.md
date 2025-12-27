# DETAILED MODULES SPECIFICATION - COFFEE SHOP MANAGEMENT

## Overview

This document provides detailed specifications for the 8 core modules extracted from section 9 of the Coffee Shop Management project. Each module includes comprehensive UI/UX requirements, component specifications, data structures, and implementation details.

## Module List

1. **Statistics Dashboard** - Thống kê và biểu đồ
2. **Expense Management** - Quản lý chi tiêu
3. **Product Menu** - Quản lý menu sản phẩm
4. **Sales/Order Management** - Quản lý bán hàng (Point of Sale)
5. **Customer Management** - Quản lý khách hàng
6. **AI Assistant** - Trợ lý AI tích hợp docs
7. **Profile Settings** - Cài đặt hồ sơ
8. **Take Note** - Ghi chú nhanh

---

## 1. MODULE STATISTICS DASHBOARD (Thống kê)

### Purpose
Hiển thị tổng quan về tình hình kinh doanh với các biểu đồ và số liệu thống kê.

### Core Features
- Hiển thị biểu đồ thu và chi theo thời gian (ngày/tuần/tháng/năm)
- Stat cards: Tổng doanh thu, Tổng chi phí, Lợi nhuận, Số đơn hàng
- Phân tích theo loại chi tiêu
- So sánh các kỳ
- Export data (CSV/PDF)

### UI Components Required
```
components/statistics/
├── statistics-dashboard.tsx     # Main dashboard page
├── stat-cards.tsx              # Revenue, expense, profit cards
├── revenue-chart.tsx           # Line chart for revenue/expense over time
├── expense-pie-chart.tsx       # Pie chart for expense categories
├── comparison-bar-chart.tsx    # Bar chart for period comparison
├── date-range-picker.tsx       # Filter by date range
└── export-data-button.tsx     # Export functionality
```

### Data Structure
```typescript
interface Revenue {
  id: string;
  date: Date;
  amount: number;
  type: 'sale' | 'other';
  orderId?: string;
}

interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: ExpenseCategory;
  description: string;
}

enum ExpenseCategory {
  INGREDIENTS = 'ingredients',
  RENT = 'rent',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  MARKETING = 'marketing',
  OTHER = 'other'
}

interface StatsSummary {
  totalRevenue: number;
  totalExpense: number;
  profit: number;
  orderCount: number;
  period: string;
}
```

### Chart Types
- **Line Chart**: Thu/Chi theo thời gian (2 lines)
- **Bar Chart**: So sánh thu/chi theo kỳ
- **Pie Chart**: Phân loại chi tiêu
- **Area Chart**: Lợi nhuận tích lũy

### UI/UX Requirements
- **Responsive Grid**: 4 stat cards trên desktop, 2 trên tablet, 1 trên mobile
- **Interactive Charts**: Hover effects, tooltips với VND formatting
- **Date Range Filter**: Quick presets (7 days, 30 days, 3 months, 1 year)
- **Loading States**: Skeleton loading cho charts và cards
- **Empty States**: Friendly messages khi chưa có data

---

## 2. MODULE EXPENSE MANAGEMENT (Quản lý Chi tiêu)

### Purpose
Quản lý tất cả các khoản chi tiêu của cửa hàng với phân loại và báo cáo.

### Core Features
- Thêm/sửa/xóa chi tiêu
- Phân loại chi tiêu (6 categories)
- Tính toán tự động tổng chi tiêu
- Lọc và tìm kiếm chi tiêu
- Export báo cáo

### UI Components Required
```
components/expenses/
├── expense-management.tsx      # Main expense page
├── expense-form.tsx           # Add/edit expense form
├── expense-list.tsx           # Table/list of expenses
├── expense-filters.tsx        # Search and filter controls
├── expense-categories.tsx     # Category selector
├── expense-summary.tsx        # Total expense summary
└── delete-expense-dialog.tsx  # Confirmation dialog
```

### Data Structure
```typescript
interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

enum ExpenseCategory {
  INGREDIENTS = 'ingredients',    // Nguyên liệu
  RENT = 'rent',                 // Thuê mặt bằng
  UTILITIES = 'utilities',       // Điện nước
  SALARY = 'salary',             // Lương nhân viên
  MARKETING = 'marketing',       // Marketing
  OTHER = 'other'                // Khác
}
```

### Form Schema
```typescript
const ExpenseSchema = z.object({
  date: z.date(),
  amount: z.number().min(0, 'Số tiền phải lớn hơn 0'),
  category: z.nativeEnum(ExpenseCategory),
  description: z.string().min(1, 'Mô tả không được để trống').max(500)
});
```

### UI/UX Requirements
- **Form Validation**: Real-time validation với error messages
- **Amount Input**: VND formatting, number input với separators
- **Date Picker**: Calendar component với Vietnamese locale
- **Category Icons**: Visual icons cho mỗi category
- **Confirmation Dialogs**: Xác nhận khi xóa
- **Toast Notifications**: Success/error feedback
- **Responsive Table**: Horizontal scroll trên mobile

---

## 3. MODULE PRODUCT MENU (Quản lý Menu)

### Purpose
Quản lý danh sách sản phẩm của cửa hàng với hình ảnh và phân loại.

### Core Features
- Danh sách sản phẩm với hình ảnh
- Thêm/sửa/xóa sản phẩm
- Quản lý giá, mô tả, hình ảnh
- Phân loại sản phẩm (5 categories)
- Toggle availability

### UI Components Required
```
components/products/
├── product-menu.tsx           # Main product page
├── product-grid.tsx           # Grid display of products
├── product-card.tsx           # Individual product card
├── product-form.tsx           # Add/edit product form
├── product-image-upload.tsx   # Image upload with preview
├── product-filters.tsx        # Category filter and search
└── product-availability-toggle.tsx # Toggle product availability
```

### Data Structure
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum ProductCategory {
  COFFEE = 'coffee',      // Cà phê
  TEA = 'tea',           // Trà
  DESSERT = 'dessert',   // Bánh ngọt
  SNACK = 'snack',       // Snack
  OTHER = 'other'        // Khác
}
```

### Visual Design Requirements
- **Grid Layout**: 3 columns trên desktop, 2 trên tablet, 1 trên mobile
- **Product Cards**: Large images, prominent pricing
- **Hover Effects**: Smooth transitions và overlay actions
- **Image Upload**: Drag & drop với preview
- **Price Display**: VND formatting với typography emphasis
- **Availability Badge**: Visual indicator cho available/unavailable

---

## 4. MODULE SALES/ORDER MANAGEMENT (Point of Sale)

### Purpose
Giao diện bán hàng tối ưu cho tablet, tương tự Grab interface.

### Core Features
- Hiển thị sản phẩm trực quan với hình ảnh
- Tìm kiếm/chọn khách hàng với tạo nhanh
- Thêm sản phẩm vào đơn hàng
- Xác nhận đơn hàng để ghi nhận doanh thu
- Quản lý doanh thu gần đây với edit/delete

### UI Components Required
```
components/sales/
├── sales-page.tsx              # Main POS interface
├── customer-selector.tsx       # Customer search + create
├── create-customer-dialog.tsx  # Quick customer creation
├── current-order-panel.tsx     # Current order summary
├── product-grid.tsx            # Grab-style product grid
├── product-card.tsx            # Product card with + button
├── recent-revenue-list.tsx     # Recent sales list
├── edit-order-dialog.tsx       # Edit order dialog
└── order-item-list.tsx         # Order items display
```

### Data Structure
```typescript
interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface RevenueEntry {
  id: string;
  orderId: string;
  customerId?: string | 'others';
  customerName?: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  customerId?: string | 'others';
  customerName?: string;
  items: OrderItem[];
  total: number;
  type: 'dine-in' | 'takeaway';
  status: 'completed';
  createdAt: Date;
}
```

### Design Requirements (Tablet-Optimized)
- **Large Touch Targets**: Minimum 44x44px buttons
- **Visual-First**: Product images prominent, text secondary
- **Plus Button Overlay**: Quick add-to-cart on product images
- **Sticky Order Panel**: Always visible current order
- **Grab-Style Grid**: 2-3 columns với large product images
- **Quick Customer Creation**: Minimal fields (Name + Phone only)

---

## 5. MODULE CUSTOMER MANAGEMENT (Quản lý Khách hàng)

### Purpose
Quản lý thông tin khách hàng và chương trình loyalty.

### Core Features
- Customer list management
- Quick customer creation during sales
- Customer details với purchase history
- Loyalty program: Buy 10 → Get 1 free drink
- Email notification khi đủ 10 purchases
- Purchase count tracking

### UI Components Required
```
components/customers/
├── customer-management.tsx     # Main customer page
├── customer-list.tsx          # Customer table/grid
├── customer-detail.tsx        # Customer detail page
├── customer-form.tsx          # Add/edit customer form
├── purchase-history.tsx       # Customer purchase history
├── loyalty-badge.tsx          # Loyalty status indicator
└── free-drink-notification.tsx # Loyalty achievement notification
```

### Data Structure
```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  purchaseCount: number;
  freeDrinkEarned: number;
  freeDrinkUsed: number;
  lastPurchaseDate?: Date;
  createdAt: Date;
}

interface CustomerPurchase {
  customerId: string;
  orderId: string;
  date: Date;
  total: number;
}
```

### Loyalty Logic
```typescript
// When order completed with customer
const updateLoyalty = (customerId: string) => {
  const customer = getCustomer(customerId);
  customer.purchaseCount += 1;
  customer.lastPurchaseDate = new Date();
  
  // Check if reached 10 purchases
  if (customer.purchaseCount % 10 === 0) {
    customer.freeDrinkEarned += 1;
    
    // Send email notification
    if (customer.email) {
      sendEmail(customer.email, {
        subject: 'Chúc mừng! Bạn đã nhận được 1 ly miễn phí',
        body: `Bạn đã mua đủ 10 lần. Bạn được tặng 1 ly miễn phí!`
      });
    }
    
    // Show in-app notification
    toast.success(`${customer.name} đã nhận được 1 ly miễn phí!`);
  }
  
  updateCustomer(customer);
};
```

---

## 6. MODULE AI ASSISTANT (Trợ lý AI)

### Purpose
Menu docs tích hợp AI để hỗ trợ trả lời câu hỏi về quy trình và chính sách.

### Core Features
- Chat interface với AI
- Context-aware responses từ documents
- Document search và retrieval
- Conversation history
- Multiple AI provider support (OpenAI, Claude, Local LLM)

### UI Components Required
```
components/ai-assistant/
├── ai-chat.tsx                # Main chat interface
├── chat-message-list.tsx      # Message history display
├── chat-input.tsx             # Message input with send button
├── suggested-questions.tsx    # Quick question suggestions
├── document-viewer.tsx        # Document display
├── conversation-history.tsx   # Past conversations
└── ai-settings.tsx           # AI provider configuration
```

### Data Structure
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string[];
  tokensUsed?: number;
}

interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  embedding?: number[];
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface AIConfig {
  provider: 'openai' | 'claude' | 'local';
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}
```

### AI Integration
- **OpenAI**: GPT-4o-mini for cost efficiency
- **Claude**: Claude-3-haiku for speed
- **Local LLM**: Ollama support for privacy
- **Context Building**: Document search + conversation history
- **Cost Tracking**: Token usage monitoring

---

## 7. MODULE PROFILE SETTINGS (Cài đặt Hồ sơ)

### Purpose
Quản lý thông tin cửa hàng, chủ shop và cài đặt bảo mật.

### Core Features
- Cập nhật thông tin cửa hàng (tên, địa chỉ, SĐT, email)
- Cập nhật thông tin chủ shop (tên, SĐT, email, avatar)
- Thay đổi mật khẩu
- Đăng xuất với confirmation

### UI Components Required
```
components/profile/
├── profile-settings.tsx       # Main settings page with tabs
├── shop-info-form.tsx        # Shop information form
├── owner-info-form.tsx       # Owner information form
├── security-form.tsx         # Password change form
├── avatar-upload.tsx         # Avatar upload with crop
├── logout-button.tsx         # Logout with confirmation
└── password-strength-indicator.tsx # Password strength meter
```

### Data Structure
```typescript
interface ShopProfile {
  id: string;
  shopName: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OwnerProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

### Form Schemas
```typescript
const ShopProfileSchema = z.object({
  shopName: z.string().min(1, 'Tên cửa hàng không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  phone: z.string().regex(phoneRegex, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  description: z.string().optional(),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại không được để trống'),
  newPassword: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ cái viết hoa')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});
```

---

## 8. MODULE TAKE NOTE (Ghi chú nhanh)

### Purpose
Tạo và quản lý ghi chú nhanh cho các thông tin quan trọng.

### Core Features
- Tạo ghi chú nhanh từ textarea
- Xem danh sách ghi chú
- Sửa/xóa ghi chú
- Tìm kiếm trong ghi chú
- Pin/Unpin ghi chú quan trọng
- Phân loại với tags
- Sắp xếp theo nhiều tiêu chí

### UI Components Required
```
components/notes/
├── take-note.tsx             # Main notes page
├── quick-note-input.tsx      # Quick note creation
├── note-list.tsx            # Grid/list of notes
├── note-card.tsx            # Individual note card
├── note-editor.tsx          # Edit note dialog
├── note-search.tsx          # Search and filter
├── note-tags.tsx            # Tag management
└── delete-note-dialog.tsx   # Delete confirmation with undo
```

### Data Structure
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum NoteSortBy {
  CREATED_AT_DESC = 'createdAt_desc',
  CREATED_AT_ASC = 'createdAt_asc',
  UPDATED_AT_DESC = 'updatedAt_desc',
  UPDATED_AT_ASC = 'updatedAt_asc',
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc',
}
```

### Features
- **Quick Create**: Header textarea với auto-save
- **Full-text Search**: Search trong title và content
- **Tag Autocomplete**: Gợi ý tags khi typing
- **Pin to Top**: Pinned notes luôn ở đầu
- **Delete with Undo**: 5-second undo option
- **Character Counter**: Real-time character count
- **Auto-generate Title**: Từ first line nếu không có title

---

## RESPONSIVE DESIGN REQUIREMENTS

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Layout Patterns
- **Mobile**: Single column, bottom navigation
- **Tablet**: 2-column grid, sidebar navigation
- **Desktop**: Multi-column grid, fixed sidebar

### Touch Optimization
- **Minimum Touch Target**: 44x44px
- **Generous Spacing**: 8-12px padding
- **Large Buttons**: Full-width on mobile
- **Swipe Gestures**: Left/right navigation

---

## REDUX STATE MANAGEMENT

### Store Structure
```typescript
interface RootState {
  auth: AuthState;
  statistics: StatisticsState;
  expenses: ExpensesState;
  products: ProductsState;
  sales: SalesState;
  customers: CustomersState;
  ai: AIState;
  profile: ProfileState;
  notes: NotesState;
}
```

### Persistence Strategy
- **localStorage**: All slices except AI (for privacy)
- **sessionStorage**: Temporary UI state
- **Redux Persist**: Automatic hydration on app start

---

## IMPLEMENTATION PRIORITY

### Phase 1 (MVP - 4-5 hours)
1. Statistics Dashboard (basic charts)
2. Expense Management (CRUD)
3. Product Menu (CRUD with images)
4. Sales/Order Management (basic POS)
5. Customer Management (basic CRUD)

### Phase 2 (Enhanced - 2-3 hours)
1. Profile Settings (complete with avatar upload)
2. Take Note (full features)
3. Loyalty program integration
4. Advanced statistics

### Phase 3 (Advanced - 3-4 hours)
1. AI Assistant (full integration)
2. Advanced reporting
3. Email notifications
4. Export functionality

This specification provides the complete blueprint for implementing all 8 modules with modern, responsive, and user-friendly interfaces using React, TypeScript, Tailwind CSS, and Redux Toolkit.
