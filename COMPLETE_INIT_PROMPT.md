# PROMPT KHỞI TẠO DỰ ÁN COFFEE SHOP MANAGEMENT - HOÀN CHỈNH

## 🎯 Mục tiêu
Tạo một ứng dụng quản lý coffee shop hiện đại với Next.js 15, React 19, TypeScript, Redux Toolkit, Tailwind CSS v4, và Turborepo monorepo architecture.

## 📋 Yêu cầu hệ thống
- Node.js >= 18.0.0
- pnpm >= 10.0.0
- TypeScript 5.7.3

## 🏗️ Kiến trúc Monorepo

### Cấu trúc thư mục tổng quan:
```
coffee-shop-management/
├── apps/
│   └── web/                    # Next.js app chính
│       ├── app/                # App Router
│       │   ├── (auth)/        # Auth routes (login, register)
│       │   ├── (protected)/   # Protected routes (dashboard, products, orders, customers, expenses)
│       │   ├── layout.tsx
│       │   └── page.tsx       # Landing page
│       ├── lib/               # Business logic
│       │   ├── services/      # API services (mock)
│       │   ├── mock-data/     # Mock data
│       │   └── utils/         # Utilities
│       ├── store/             # Redux store
│       │   ├── slices/        # Redux slices
│       │   ├── hooks.ts
│       │   ├── index.ts
│       │   └── provider.tsx
│       ├── public/            # Static assets
│       │   ├── icons/         # PWA icons
│       │   └── coffee-bg.jpeg # Background image
│       ├── next.config.mjs
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── ui/                    # Shared UI components
│   │   └── src/
│   │       ├── components/    # React components (shadcn/ui based)
│   │       ├── hooks/         # Custom hooks
│   │       ├── lib/           # Utilities
│   │       ├── styles/        # Global CSS & design tokens
│   │       └── index.ts
│   └── typescript-config/     # Shared TypeScript configs
│       ├── base.json
│       ├── nextjs.json
│       └── react-library.json
├── pnpm-workspace.yaml
├── turbo.json
├── biome.json
└── package.json
```

## 📦 Dependencies chính

### Root package.json:
```json
{
  "name": "coffee-shop-management",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@10.4.1",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=10.0.0"
  },
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "format": "biome format --write .",
    "check": "biome check --write ."
  },
  "devDependencies": {
    "@biomejs/biome": "2.1.1",
    "turbo": "^2.4.2",
    "typescript": "5.7.3"
  }
}
```

### apps/web/package.json:
```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check ."
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.1",
    "@reduxjs/toolkit": "^2.5.0",
    "@workspace/ui": "workspace:*",
    "chart.js": "^4.5.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "motion": "^12.12.1",
    "next": "^15.4.4",
    "next-themes": "^0.4.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.62.0",
    "react-redux": "^9.2.0",
    "redux-persist": "^6.0.0",
    "sonner": "^2.0.3",
    "tailwind-merge": "^3.3.0",
    "zod": "^4.0.14"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.8",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@workspace/typescript-config": "workspace:*",
    "tailwindcss": "^4.0.8",
    "typescript": "5.7.3"
  }
}
```

### packages/ui/package.json:
```json
{
  "name": "@workspace/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./styles/globals.css": "./src/styles/globals.css",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./lib/*": "./src/lib/*.ts"
  },
  "scripts": {
    "lint": "biome check .",
    "format": "biome format --write ."
  },
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "next-themes": "^0.4.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sonner": "^2.0.3",
    "tailwind-merge": "^3.0.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.8",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@workspace/typescript-config": "workspace:*",
    "tailwindcss": "^4.0.8",
    "typescript": "5.7.3"
  }
}
```

## 🔧 Configuration Files

### pnpm-workspace.yaml:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### turbo.json:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

### biome.json:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5"
    }
  }
}
```

### apps/web/next.config.mjs:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  
  webpack: (config) => {
    config.resolve.conditionNames = ['import', 'require', 'default'];
    return config;
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### apps/web/postcss.config.mjs & packages/ui/postcss.config.mjs:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### apps/web/tsconfig.json:
```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### packages/typescript-config/base.json:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": false,
    "isolatedModules": true,
    "moduleResolution": "Bundler",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "skipLibCheck": true,
    "strict": true,
    "strictNullChecks": true
  },
  "exclude": ["node_modules"]
}
```

### packages/typescript-config/nextjs.json:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Next.js",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

### packages/typescript-config/react-library.json:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "React Library",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2015", "DOM"],
    "module": "ESNext",
    "target": "es6"
  }
}
```

## 🎨 Design System (packages/ui/src/styles/)

### globals.css:
```css
@import "tailwindcss";
@source "../../../apps/**/*.{ts,tsx}";
@source "../../../packages/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";

@import "./colors.css";
@import "./typography.css";
@import "./dimensions.css";

@layer base {
  * {
    border-color: var(--color-neutral-200);
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-sans);
    background-color: white;
    color: var(--color-neutral-900);
    line-height: var(--line-height-normal);
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-neutral-100);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-neutral-300);
    border-radius: var(--radius-full);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-neutral-400);
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### colors.css - Tạo design tokens với CSS variables cho:
- Primary colors (blue theme)
- Neutral colors (gray scale)
- Semantic colors (positive, negative, warning, info)
- Sử dụng format: `--color-{category}-{shade}`

### typography.css - Typography tokens:
- Font families
- Font sizes
- Font weights
- Line heights
- Letter spacing

### dimensions.css - Spacing & sizing tokens:
- Spacing scale
- Border radius
- Shadows
- Z-index layers

## 🧩 Core Components (packages/ui/src/components/)

Tạo các components dựa trên shadcn/ui với Radix UI primitives:

1. **Form Components:**
   - Button (với variants)
   - Input
   - InputNumberSuggestion (custom input với suggestions)
   - Label
   - Checkbox
   - RadioGroup
   - Select
   - Switch
   - Textarea

2. **Layout Components:**
   - Card (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
   - Dialog (Modal)
   - Tabs
   - Popover
   - DropdownMenu

3. **Feedback Components:**
   - Toast (sonner)
   - Progress
   - Avatar
   - Badge

4. **Data Display:**
   - Table
   - StatCard (custom component cho dashboard)

## 🔐 Authentication & State Management

### Redux Store Structure (apps/web/store/):

1. **store/index.ts** - Configure store với redux-persist:
```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth.slice';
import productsReducer from './slices/products.slice';
import ordersReducer from './slices/orders.slice';
import customersReducer from './slices/customers.slice';
import expensesReducer from './slices/expenses.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  orders: ordersReducer,
  customers: customersReducer,
  expenses: expensesReducer,
});

const persistConfig = {
  key: 'coffee-shop-root',
  storage,
  whitelist: ['auth', 'products', 'customers'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
```

2. **store/hooks.ts** - Typed hooks:
```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

3. **store/provider.tsx** - Redux Provider với PersistGate:
```typescript
'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './index';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
```

4. **store/slices/auth.slice.ts** - Auth slice với async thunks:
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/lib/services/auth.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { email, password, name }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(email, password, name);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
```

Tạo tương tự cho: products.slice.ts, orders.slice.ts, customers.slice.ts, expenses.slice.ts

## 🔌 Services Layer (apps/web/lib/services/)

### mock-api.service.ts - Base service class:
```typescript
export class MockApiService {
  protected simulateDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected generateToken(): string {
    return `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected getFromStorage<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  protected saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }
}
```

### auth.service.ts - Authentication service với localStorage:
```typescript
import { MockApiService } from './mock-api.service';
import type { User } from '@/store/slices/auth.slice';

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService extends MockApiService {
  private readonly STORAGE_KEY = 'coffee-shop-users';
  private readonly TOKEN_KEY = 'coffee-shop-token';

  async login(email: string, password: string): Promise<AuthResponse> {
    await this.simulateDelay();

    const users = this.getFromStorage<User & { password: string }>(this.STORAGE_KEY);
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    const token = this.generateToken();
    localStorage.setItem(this.TOKEN_KEY, token);

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    await this.simulateDelay();

    const users = this.getFromStorage<User & { password: string }>(this.STORAGE_KEY);
    
    if (users.some((u) => u.email === email)) {
      throw new Error('Email đã được sử dụng');
    }

    const newUser = {
      id: this.generateId(),
      email,
      password,
      name,
      role: 'staff' as const,
    };

    users.push(newUser);
    this.saveToStorage(this.STORAGE_KEY, users);

    const token = this.generateToken();
    localStorage.setItem(this.TOKEN_KEY, token);

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async logout(): Promise<void> {
    await this.simulateDelay(200);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

export const authService = new AuthService();
```

Tạo tương tự cho: product.service.ts, order.service.ts, customer.service.ts, expense.service.ts

## 📱 App Routes Structure

### 1. Landing Page (apps/web/app/page.tsx):
- Hero section với CTA buttons
- Features showcase
- Modern, responsive design
- Links to /login và /register

### 2. Auth Routes (apps/web/app/(auth)/):

#### login/page.tsx - Màn hình đăng nhập với:
- Background image coffee (coffee-bg.jpeg)
- Glassmorphism design (backdrop-blur, semi-transparent card)
- Framer Motion animations:
  - Floating coffee beans particles
  - Fade-in transitions
  - Logo sparkles animation
- Form với email & password
- Link to register
- Demo credentials display
- Toast notifications
- Color scheme: Amber/Orange coffee theme

#### register/page.tsx - Màn hình đăng ký với:
- Tương tự login nhưng với:
  - Steam particles animation (bay lên)
  - UserPlus icon thay vì Coffee
  - Form fields: name, email, password, confirmPassword
  - Password validation
  - Link to login

### 3. Protected Routes (apps/web/app/(protected)/):

#### layout.tsx - Protected layout với:
- Sidebar navigation
- Header với user menu
- Auth guard (redirect to login if not authenticated)
- Responsive design

#### dashboard/page.tsx - Dashboard với:
- Stats cards (doanh thu, đơn hàng, sản phẩm, khách hàng)
- Charts (Chart.js)
- Recent orders table
- Quick actions

#### products/page.tsx - Quản lý sản phẩm:
- Product list với search & filter
- Add/Edit/Delete products
- Product categories
- Image upload placeholder
- Stock management

#### orders/page.tsx - Quản lý đơn hàng:
- Orders list với status
- Order details modal
- Create new order
- Order status workflow
- Payment tracking

#### customers/page.tsx - Quản lý khách hàng:
- Customer list
- Customer details
- Add/Edit customers
- Purchase history
- Loyalty points

#### expenses/page.tsx - Quản lý chi phí:
- Expense list
- Add/Edit expenses
- Categories
- Date range filter
- Total calculations

## 🎨 UI/UX Features

### Glassmorphism Design:
- Semi-transparent backgrounds: `bg-white/10`
- Backdrop blur: `backdrop-blur-xl`
- Border with opacity: `border-white/20`
- Shadow effects: `shadow-2xl`

### Animations (Framer Motion):
- Page transitions
- Component fade-in
- Hover effects
- Loading states
- Particle effects

### Color Palette:
- Primary: Blue (#222a63)
- Accent: Amber/Orange (coffee theme)
- Neutral: Gray scale
- Semantic: Success, Error, Warning, Info

### Responsive Design:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Collapsible sidebar on mobile
- Touch-friendly interactions

## 📊 Mock Data Structure

### Products:
```typescript
interface Product {
  id: string;
  name: string;
  category: 'coffee' | 'tea' | 'food' | 'other';
  price: number;
  cost: number;
  stock: number;
  image?: string;
  description?: string;
}
```

### Orders:
```typescript
interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}
```

### Customers:
```typescript
interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt: string;
}
```

### Expenses:
```typescript
interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createdBy: string;
}
```

## 🚀 Hướng dẫn khởi tạo

### Bước 1: Setup monorepo structure
```bash
mkdir coffee-shop-management
cd coffee-shop-management

# Tạo cấu trúc thư mục
mkdir -p apps/web packages/ui packages/typescript-config

# Init root package.json
pnpm init

# Setup workspace
echo "packages:\n  - 'apps/*'\n  - 'packages/*'" > pnpm-workspace.yaml
```

### Bước 2: Install dependencies
```bash
# Root dependencies
pnpm add -D turbo @biomejs/biome typescript

# Web app dependencies
cd apps/web
pnpm init
pnpm add next react react-dom
pnpm add @reduxjs/toolkit react-redux redux-persist
pnpm add motion lucide-react sonner clsx tailwind-merge class-variance-authority
pnpm add react-hook-form @hookform/resolvers zod chart.js next-themes
pnpm add -D @tailwindcss/postcss tailwindcss typescript @types/node @types/react @types/react-dom

# UI package dependencies
cd ../../packages/ui
pnpm init
pnpm add react react-dom lucide-react clsx tailwind-merge class-variance-authority sonner next-themes zod
pnpm add @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs
pnpm add -D @tailwindcss/postcss tailwindcss typescript @types/react @types/react-dom
```

### Bước 3: Setup configuration files
- Tạo tất cả config files như đã mô tả ở trên
- Setup TypeScript configs
- Setup Biome, Turbo, PostCSS

### Bước 4: Create design system
- Tạo CSS design tokens (colors, typography, dimensions)
- Setup globals.css với Tailwind v4
- Create base components

### Bước 5: Build core features
- Setup Redux store với slices
- Create services layer
- Build authentication flow
- Create protected routes

### Bước 6: Build UI pages
- Landing page
- Auth pages (login, register) với glassmorphism
- Dashboard với stats
- CRUD pages (products, orders, customers, expenses)

### Bước 7: Add coffee background
- Download hoặc thêm coffee background image
- Place vào apps/web/public/coffee-bg.jpeg
- Sử dụng trong auth pages

### Bước 8: Testing & refinement
```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Lint & format
pnpm lint
pnpm format
```

## ✅ Checklist hoàn thành

- [ ] Monorepo structure setup
- [ ] All dependencies installed
- [ ] Configuration files created
- [ ] Design system implemented
- [ ] UI components library
- [ ] Redux store setup
- [ ] Services layer
- [ ] Authentication flow
- [ ] Landing page
- [ ] Login page với glassmorphism
- [ ] Register page với glassmorphism
- [ ] Protected layout
- [ ] Dashboard page
- [ ] Products management
- [ ] Orders management
- [ ] Customers management
- [ ] Expenses management
- [ ] Responsive design
- [ ] Animations implemented
- [ ] Mock data working
- [ ] No errors on build
- [ ] App runs successfully

## 🎯 Demo Credentials
```
Email: admin@coffee.com
Password: admin123
```

## 📝 Notes quan trọng

1. **Tailwind CSS v4**: Sử dụng `@import "tailwindcss"` và `@source` directives
2. **Gradient classes**: Sử dụng `bg-linear-to-r` thay vì `bg-gradient-to-r`
3. **Redux Persist**: Cấu hình serializableCheck để tránh warnings
4. **Next.js 15**: Sử dụng App Router, Server Components mặc định
5. **React 19**: Cập nhật types và features mới
6. **Glassmorphism**: Kết hợp backdrop-blur, opacity, và shadows
7. **Framer Motion**: Import từ 'motion' package (v12+)
8. **Export interfaces**: Export AuthState và các interfaces khác để tránh TypeScript errors

## 🔥 Key Features

- ✅ Modern monorepo với Turborepo
- ✅ Next.js 15 + React 19
- ✅ TypeScript strict mode
- ✅ Redux Toolkit + Redux Persist
- ✅ Tailwind CSS v4 với design tokens
- ✅ Glassmorphism UI design
- ✅ Framer Motion animations
- ✅ Radix UI components
- ✅ Form validation với React Hook Form + Zod
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Mock API với localStorage
- ✅ PWA ready
- ✅ SEO optimized
- ✅ Biome for linting & formatting

---

**Prompt này đảm bảo tạo ra một ứng dụng hoàn chỉnh, không lỗi, và giống hệt source code hiện tại!**
