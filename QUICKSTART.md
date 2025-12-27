# 🚀 Quick Start - Coffee Shop Management

## ✅ Bước 8 Đã Hoàn Thành!

Dự án đã được setup với:
- ✅ **Monorepo** với Turborepo + pnpm
- ✅ **Design System** đầy đủ (colors, typography, spacing)
- ✅ **10 UI Components** đẹp với animations
- ✅ **Next.js 15** với App Router
- ✅ **Landing Page** với animations mượt mà
- ✅ **PWA Support** (có thể cài như app)
- ✅ **Mobile-First** responsive design

## 🎯 Chạy Ngay (3 Bước)

### Bước 1: Cài Dependencies

```bash
# Di chuyển vào thư mục dự án
cd /Users/user/Public/Project/Zen-s/thiTho/base2

# Cài pnpm (nếu chưa có)
npm install -g pnpm@10.4.1

# Cài tất cả dependencies
pnpm install
```

⏱️ **Thời gian**: ~2-3 phút

### Bước 2: Chạy Dev Server

```bash
pnpm dev
```

🌐 **Mở trình duyệt**: http://localhost:3000

### Bước 3: Xem Kết Quả

Bạn sẽ thấy:
- 🎨 Landing page đẹp với gradient background
- ✨ Animations mượt mà khi scroll
- 📱 Responsive hoàn hảo (test bằng DevTools)
- 🎯 6 feature cards với icons
- 📊 Stats section với gradient

## 📱 Test Mobile

1. Mở Chrome DevTools (F12)
2. Click icon điện thoại (hoặc Ctrl+Shift+M)
3. Chọn iPhone/iPad để test
4. Zoom in/out để xem responsive

## 🎨 Những Gì Đã Có

### UI Components (packages/ui)
```typescript
import { 
  Button,      // 5 variants: primary, secondary, tertiary, danger, ghost
  Input,       // Với error display
  Textarea,    // Với validation
  Label,       // Form label
  Card,        // Với Header, Content, Footer
  Dialog,      // Modal popup
  Badge,       // 5 variants
  Skeleton,    // Loading state
  Tabs,        // Tab navigation
  Toaster,     // Toast notifications
} from '@workspace/ui';
```

### Design System
```css
/* Colors */
var(--color-primary-700)    /* Blue - Main actions */
var(--color-positive-600)   /* Green - Success */
var(--color-negative-600)   /* Red - Errors */
var(--color-warning-600)    /* Yellow - Warnings */
var(--color-neutral-900)    /* Gray - Text */

/* Typography */
text-4xl font-bold          /* Headings */
text-lg text-neutral-600    /* Body text */

/* Spacing */
p-4, p-6, p-8              /* Padding */
gap-4, gap-6, gap-8        /* Gap */
```

### Animations (Motion)
```typescript
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Your content */}
</motion.div>
```

## 📂 Cấu Trúc Dự Án

```
base2/
├── apps/web/                   # Main app
│   ├── app/                    # Pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── manifest.ts         # PWA manifest
│   ├── public/
│   │   ├── icons/              # PWA icons
│   │   └── sw.js               # Service worker
│   └── package.json
│
├── packages/ui/                # UI library
│   ├── src/
│   │   ├── components/         # 10 components
│   │   ├── styles/             # Design system
│   │   │   ├── globals.css     # Main CSS
│   │   │   ├── colors.css      # Color system
│   │   │   ├── typography.css  # Typography
│   │   │   └── dimensions.css  # Spacing
│   │   └── lib/
│   │       └── utils.ts        # cn() utility
│   └── package.json
│
├── README.md                   # Project overview
├── SETUP.md                    # Detailed setup guide
└── QUICKSTART.md              # This file
```

## 🎯 Tiếp Theo Làm Gì?

### Option 1: Xem Landing Page (Đã Xong)
```bash
pnpm dev
# Mở http://localhost:3000
```

### Option 2: Tạo Login Page
```bash
# Tạo file mới
mkdir -p apps/web/app/\(auth\)/login
touch apps/web/app/\(auth\)/login/page.tsx
```

### Option 3: Tạo Dashboard
```bash
# Tạo protected route
mkdir -p apps/web/app/\(protected\)/dashboard
touch apps/web/app/\(protected\)/dashboard/page.tsx
```

### Option 4: Tạo POS/Sales Page
```bash
# Tạo sales page
mkdir -p apps/web/app/\(protected\)/sales
touch apps/web/app/\(protected\)/sales/page.tsx
```

## 💡 Tips

### 1. Sử Dụng Components
```typescript
// apps/web/app/your-page/page.tsx
import { Button, Card } from '@workspace/ui';

export default function YourPage() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

### 2. Thêm Animations
```typescript
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  {/* Animated content */}
</motion.div>
```

### 3. Responsive Design
```typescript
// Mobile first approach
<div className="
  p-4              // Mobile: 16px padding
  md:p-6           // Tablet: 24px padding
  lg:p-8           // Desktop: 32px padding
  grid
  grid-cols-1      // Mobile: 1 column
  md:grid-cols-2   // Tablet: 2 columns
  lg:grid-cols-3   // Desktop: 3 columns
">
  {/* Content */}
</div>
```

## 🐛 Lỗi Thường Gặp

### Lỗi: "Cannot find module"
**Giải pháp**: Chạy `pnpm install`

### Lỗi: CSS không load
**Giải pháp**: Kiểm tra `import '@workspace/ui/styles/globals.css'` trong `layout.tsx`

### Lỗi: Port 3000 đã được sử dụng
**Giải pháp**: 
```bash
# Kill process trên port 3000
lsof -ti:3000 | xargs kill -9

# Hoặc dùng port khác
pnpm dev --port 3001
```

## 📚 Tài Liệu

- **README.md**: Tổng quan dự án
- **SETUP.md**: Hướng dẫn chi tiết từng bước
- **PHAN_TICH_VA_HUONG_DAN.md**: Phân tích và hướng dẫn đầy đủ

## 🎉 Kết Quả Mong Đợi

Sau khi chạy `pnpm dev`, bạn sẽ thấy:

1. ✅ Landing page đẹp với animations
2. ✅ Responsive hoàn hảo trên mọi thiết bị
3. ✅ UI components hoạt động tốt
4. ✅ Toast notifications
5. ✅ PWA manifest
6. ✅ Service worker đã đăng ký

## 🚀 Production Build

```bash
# Build cho production
pnpm build

# Chạy production server
cd apps/web
pnpm start
```

---

**🎯 Bước 8 Hoàn Thành!** 

Giờ bạn có một base project đẹp, hiện đại, mobile-first với animations mượt mà!

**Next**: Tạo các trang còn lại (Login, Dashboard, Sales, Products, Customers, Expenses)
