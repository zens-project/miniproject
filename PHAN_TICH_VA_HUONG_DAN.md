# PHÂN TÍCH SOURCE BASE VÀ HƯỚNG DẪN XÂY DỰNG DỰ ÁN QUẢN LÝ COFFEE SHOP

## 📋 MỤC LỤC

1. [Phân Tích Source Base](#1-phân-tích-source-base)
2. [Các Package Đang Sử Dụng](#2-các-package-đang-sử-dụng)
3. [Component Hiện Có](#3-component-hiện-có)
4. [Cách Tổ Chức Code](#4-cách-tổ-chức-code)
5. [Setup Các Gói](#5-setup-các-gói)
6. [Hooks](#6-hooks)
7. [Package Tối Thiểu Cần Thiết](#7-package-tối-thiểu-cần-thiết)
8. [Prompt Generate Source Base](#8-prompt-generate-source-base)
9. [Ý Tưởng Dự Án Coffee Shop Management](#9-ý-tưởng-dự-án-coffee-shop-management)

---

## 1. PHÂN TÍCH SOURCE BASE

### 1.1. Kiến Trúc Tổng Quan

**Monorepo Structure:**
- **Framework**: Turborepo + pnpm workspace
- **Main App**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript 5.7 (strict mode)
- **Styling**: Tailwind CSS v4 + Custom Design System
- **Component Library**: Shadcn/ui trong package `@workspace/ui`
- **Linting**: Biome.js (thay ESLint/Prettier)

**Cấu Trúc Thư Mục:**
```
curex-web/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # Next.js App Router
│       │   ├── (auth)/         # Authentication routes
│       │   ├── (protected)/    # Protected routes
│       │   ├── layout.tsx      # Root layout
│       │   └── page.tsx        # Home page
│       ├── components/         # App-specific components
│       ├── lib/                # Utilities, services, schemas
│       ├── hooks/              # Custom React hooks
│       ├── models/             # TypeScript type definitions
│       ├── constants/          # Enums, constants
│       ├── contexts/           # React contexts
│       ├── providers/          # React providers
│       └── i18n/               # Internationalization
├── packages/
│   ├── ui/                     # Shared UI components package
│   │   ├── src/
│   │   │   ├── components/     # 29 Shadcn components
│   │   │   ├── hooks/          # Shared hooks
│   │   │   ├── lib/            # Utilities
│   │   │   └── styles/         # CSS files
│   │   └── package.json
│   └── typescript-config/      # Shared TS configs
├── biome.json                  # Linter config
├── turbo.json                  # Monorepo build config
├── pnpm-workspace.yaml         # Workspace definition
└── package.json                # Root dependencies
```

### 1.2. Design System

**Color System:**
- Primary colors: 50-1000 scale
- Neutral colors: 50-1000 scale
- Alpha variants cho transparency
- Semantic colors: positive, negative, warning, info
- CSS custom properties trong `packages/ui/src/styles/colors.css`

**Typography:**
- Custom font families: Display và Sans
- Typography scale: x-giant-display → small-label-primary
- Responsive typography với breakpoints

**Spacing & Layout:**
- Custom dimensions system
- Responsive breakpoints: mobile, tablet, 14inch, 16inch
- Box shadow utilities

### 1.3. Animation System

**Motion Library:**
- Sử dụng `motion` (framer-motion v12) cho animations
- Pre-defined variants trong `lib/motion.ts`:
  - `heroVariants`: Fade in + slide up
  - `staggerContainer`: Stagger children animations
  - `statItem`: Scale + fade animations
  - `cardVariants`: Card entrance animations
  - `processStep`: Slide in animations

**Animation Patterns:**
```typescript
// Section Animation Component
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0, duration: 0.8, ease: 'easeOut' }}
  viewport={{ once: true }}
>
  {children}
</motion.div>
```

### 1.4. Chart System

**Chart.js Integration:**
- Sử dụng `chart.js` v4.5.1
- Custom plugins: crosshair, valueOnBar, customLegend
- Chart types: Area, Bar, Multi-axis
- Proper cleanup để tránh memory leaks
- Responsive charts với custom tooltips

**Chart Patterns:**
- Destroy chart instance trước khi tạo mới
- Register plugins một lần duy nhất (global)
- Custom formatting cho VND currency
- Gradient fills cho area charts

### 1.5. Form Validation System

**React Hook Form + Zod:**
- Schema validation với Zod
- Real-time validation với `mode: 'onChange'`
- Error display với custom Input component
- Field arrays cho dynamic forms
- File upload validation

**Validation Patterns:**
```typescript
const schema = z.object({
  email: z.string().email(),
  phone: z.string().regex(phoneRegex),
  dob: z.string().refine(validateDob, { error: 'invalid_dob' })
});

const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange'
});
```

---

## 2. CÁC PACKAGE ĐANG SỬ DỤNG

### 2.1. Core Dependencies (apps/web)

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.1",      // Zod resolver cho RHF
    "@workspace/ui": "workspace:*",       // Shared UI components
    "axios": "^1.11.0",                   // HTTP client
    "canvas-confetti": "^1.9.3",          // Confetti animations
    "chart.js": "^4.5.1",                 // Chart library
    "class-variance-authority": "^0.7.1", // Component variants
    "clsx": "^2.1.1",                     // Class name utility
    "lucide-react": "^0.475.0",          // Icons
    "motion": "^12.12.1",                 // Animation library
    "next": "^15.4.4",                    // Next.js framework
    "next-intl": "^4.3.4",                // Internationalization
    "next-themes": "^0.4.4",              // Theme management
    "react": "^19.0.0",                   // React library
    "react-dom": "^19.0.0",               // React DOM
    "react-hook-form": "^7.62.0",         // Form handling
    "sonner": "^2.0.3",                   // Toast notifications
    "tailwind-merge": "^3.3.0",           // Tailwind class merger
    "zod": "^4.0.14"                      // Schema validation
  }
}
```

### 2.2. UI Package Dependencies

```json
{
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
    "@stepperize/react": "^5.1.9",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.475.0",
    "next-themes": "^0.4.4",
    "react": "^19.0.0",
    "react-day-picker": "^9.8.1",
    "react-dom": "^19.0.0",
    "react-image-crop": "^11.0.10",
    "sonner": "^2.0.3",
    "tailwind-merge": "^3.0.1",
    "tw-animate-css": "^1.2.4",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.8",
    "tailwindcss": "^4.0.8"
  }
}
```

### 2.3. Dev Dependencies

```json
{
  "devDependencies": {
    "@biomejs/biome": "2.1.1",            // Linter/Formatter
    "@workspace/typescript-config": "workspace:*",
    "turbo": "^2.4.2",                    // Monorepo build tool
    "typescript": "5.7.3"
  }
}
```

---

## 3. COMPONENT HIỆN CÓ

### 3.1. UI Components (29 components trong @workspace/ui)

**Form Components:**
- `input.tsx` - Text input với error display
- `textarea.tsx` - Textarea với validation
- `password-input.tsx` - Password input với show/hide
- `input-otp.tsx` - OTP input component
- `input-number-suggestion.tsx` - Number input với suggestions
- `select.tsx` - Dropdown select
- `checkbox.tsx` - Checkbox component
- `radio-group.tsx` - Radio button group
- `switch.tsx` - Toggle switch
- `date-picker.tsx` - Date picker với calendar
- `calendar.tsx` - Calendar component
- `uploader.tsx` - File upload component
- `image-crop.tsx` - Image crop tool

**Layout Components:**
- `button.tsx` - Button với variants (primary, secondary, etc.)
- `dialog.tsx` - Modal dialog
- `popover.tsx` - Popover component
- `tabs.tsx` - Tab navigation
- `breadcrumb.tsx` - Breadcrumb navigation
- `pagination.tsx` - Pagination component
- `table.tsx` - Data table
- `stepper.tsx` - Step indicator

**Display Components:**
- `avatar.tsx` - Avatar component
- `badge.tsx` - Badge component
- `skeleton.tsx` - Loading skeleton
- `progress.tsx` - Progress bar
- `icon-circle.tsx` - Icon wrapper
- `icons.tsx` - Icon library (Lucide)
- `social-icons.tsx` - Social media icons
- `sonner.tsx` - Toast notification component
- `label.tsx` - Form label
- `segmented-control.tsx` - Segmented control

### 3.2. App-Specific Components

**Layout Components:**
- `header.tsx` - App header
- `footer.tsx` - App footer
- `sidebar.tsx` - Sidebar navigation
- `content-panel.tsx` - Content wrapper
- `theme-switcher.tsx` - Theme toggle

**Feature Components:**
- `form.tsx` - Waitlist form
- `hero.tsx` - Hero section
- `section-animation.tsx` - Animation wrapper
- `countdown.tsx` - Countdown timer
- `loading-dots.tsx` - Loading indicator
- `people.tsx` - People counter animation
- `confetti.tsx` - Confetti effect

**Shared Components:**
- `breadcrumb-section.tsx` - Breadcrumb section
- `float-button.tsx` - Floating action button
- `loading.tsx` - Loading component
- `otp-form.tsx` - OTP form
- `password-form.tsx` - Password form
- `refresh-button.tsx` - Refresh button

---

## 4. CÁCH TỔ CHỨC CODE

### 4.1. File Naming Conventions

- **Files**: `kebab-case.tsx`
- **Components**: `PascalCase`
- **Hooks**: `use-hook-name.ts`
- **Contexts**: `name-context.tsx`
- **Services**: `name.service.ts`
- **Types**: `PascalCase` interfaces
- **Schemas**: `name-schemas.ts`

### 4.2. Folder Structure Patterns

**App Router Structure:**
```
app/
├── (auth)/              # Route group cho auth
│   ├── login/
│   └── register/
├── (protected)/         # Route group cho protected routes
│   ├── layout.tsx       # Protected layout
│   └── customers/
└── layout.tsx           # Root layout
```

**Component Organization:**
```
components/
├── feature-name/
│   ├── index.tsx        # Main component
│   ├── form.tsx         # Form component
│   └── components/      # Sub-components
└── shared/              # Shared components
```

### 4.3. Code Patterns

**Service Pattern:**
```typescript
// lib/services/auth.service.ts
export const authService = {
  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  }
};
```

**Schema Pattern:**
```typescript
// lib/schemas/user-schemas.ts
export const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
});
export type User = z.infer<typeof UserSchema>;
```

**Context Pattern:**
```typescript
// contexts/auth-context.tsx
export const AuthContext = createContext<AuthContextType | null>(null);
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**Hook Pattern:**
```typescript
// hooks/use-breakpoint.ts
export function useBreakpoint() {
  // Implementation
}
```

---

## 5. SETUP CÁC GÓI

### 5.1. Initial Setup

```bash
# 1. Install pnpm globally
npm install -g pnpm@10.4.1

# 2. Create project
mkdir curex-web && cd curex-web

# 3. Initialize pnpm workspace
pnpm init

# 4. Create workspace config
echo "packages:
  - 'apps/*'
  - 'packages/*'" > pnpm-workspace.yaml

# 5. Install root dependencies
pnpm add -D -w @biomejs/biome turbo typescript@5.7.3

# 6. Create apps/web
mkdir -p apps/web packages/ui packages/typescript-config

# 7. Setup Next.js app
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir

# 8. Install dependencies
pnpm add next@^15.4.4 react@^19.0.0 react-dom@^19.0.0
pnpm add motion@^12.12.1 chart.js@^4.5.1
pnpm add react-hook-form@^7.62.0 zod@^4.0.14 @hookform/resolvers@^5.2.1
pnpm add class-variance-authority@^0.7.1 clsx@^2.1.1 tailwind-merge@^3.3.0
pnpm add axios@^1.11.0 next-intl@^4.3.4 next-themes@^0.4.4
pnpm add sonner@^2.0.3 lucide-react@^0.475.0
```

### 5.2. UI Package Setup

```bash
cd packages/ui

# Initialize package
pnpm init

# Install Radix UI components
pnpm add @radix-ui/react-avatar @radix-ui/react-dialog
pnpm add @radix-ui/react-select @radix-ui/react-tabs
pnpm add @radix-ui/react-checkbox @radix-ui/react-switch
pnpm add @radix-ui/react-radio-group @radix-ui/react-popover
pnpm add @radix-ui/react-label @radix-ui/react-progress
pnpm add @radix-ui/react-slot @radix-ui/react-dropdown-menu

# Install other dependencies
pnpm add class-variance-authority clsx tailwind-merge
pnpm add lucide-react next-themes sonner
pnpm add date-fns react-day-picker input-otp
pnpm add react-image-crop @stepperize/react
pnpm add zod@^3.24.2

# Install Tailwind
pnpm add -D tailwindcss@^4.0.8 @tailwindcss/postcss@^4.0.8
```

### 5.3. Configuration Files

**biome.json:**
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": { "enabled": true },
  "linter": { "enabled": true },
  "formatter": { "enabled": true }
}
```

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": { "cache": false },
    "lint": {}
  }
}
```

---

## 6. HOOKS

### 6.1. Custom Hooks Hiện Có

**use-breakpoint.ts:**
```typescript
// hooks/use-breakpoint.ts
export function useBreakpoint() {
  // Returns current breakpoint: 'mobile' | 'tablet' | '14inch' | '16inch'
}
```

**use-scroll.ts:**
```typescript
// hooks/use-scroll.ts
export function useScroll() {
  // Returns scroll position and direction
}
```

**use-logout-on-unload.ts:**
```typescript
// hooks/use-logout-on-unload.ts
export function useLogoutOnUnload() {
  // Logs out user on page unload
}
```

### 6.2. UI Package Hooks

**use-breakpoint.ts:**
```typescript
// packages/ui/src/hooks/use-breakpoint.ts
// Shared breakpoint hook
```

**use-tab-observer.ts:**
```typescript
// packages/ui/src/hooks/use-tab-observer.ts
// Tab visibility observer
```

### 6.3. Hook Patterns

**Standard Hook Pattern:**
```typescript
export function useCustomHook() {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Side effects
  }, []);
  
  return { state, setState };
}
```

---

## 7. PACKAGE TỐI THIỂU CẦN THIẾT

### 7.1. Core Packages (Bắt Buộc)

```json
{
  "dependencies": {
    "next": "^15.4.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^12.12.1",                    // Animation
    "tailwindcss": "^4.0.8",                // Styling
    "@workspace/ui": "workspace:*",         // UI components
    "chart.js": "^4.5.1",                   // Charts
    "class-variance-authority": "^0.7.1",   // Component variants
    "zod": "^4.0.14",                       // Validation
    "tailwind-merge": "^3.3.0",            // Class merging
    "clsx": "^2.1.1"                        // Class utilities
  }
}
```

### 7.2. Form & Validation

```json
{
  "react-hook-form": "^7.62.0",
  "@hookform/resolvers": "^5.2.1"
}
```

### 7.3. UI Essentials

```json
{
  "lucide-react": "^0.475.0",              // Icons
  "sonner": "^2.0.3"                        // Toast notifications
}
```

### 7.4. Packages Có Thể Loại Bỏ Ban Đầu

- `canvas-confetti` - Chỉ cần khi có celebration
- `next-intl` - Chỉ cần khi có i18n
- `axios` - Có thể dùng fetch API
- `date-fns` - Chỉ cần khi có date manipulation phức tạp
- `react-image-crop` - Chỉ cần khi có upload ảnh
- `input-otp` - Chỉ cần khi có OTP flow
- `@stepperize/react` - Chỉ cần khi có stepper

### 7.5. Minimal UI Package Dependencies

```json
{
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-slot": "^1.1.2",
  "@radix-ui/react-label": "^2.1.7",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.0.1",
  "lucide-react": "^0.475.0",
  "sonner": "^2.0.3"
}
```

---

## 8. PROMPT GENERATE SOURCE BASE

### 8.1. Prompt Hoàn Chỉnh

```
Tạo một dự án Next.js 15 monorepo với các yêu cầu sau:

KIẾN TRÚC:
- Monorepo: Turborepo + pnpm workspace
- Framework: Next.js 15 (App Router) + React 19
- Language: TypeScript 5.7 (strict mode)
- Styling: Tailwind CSS v4 + custom design system
- Components: Shadcn/ui trong shared package @workspace/ui
- Linting: Biome.js

CẤU TRÚC THƯ MỤC:
curex-web/
├── apps/web/                    # Main Next.js app
│   ├── app/                     # App Router
│   │   ├── (auth)/              # Auth routes group
│   │   ├── (protected)/         # Protected routes group
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/              # App components
│   ├── lib/                     # Utilities, services, schemas
│   │   ├── services/            # API services (mock)
│   │   ├── schemas/             # Zod schemas
│   │   ├── mock-data/           # Mock JSON data files
│   │   ├── utils.ts             # Utility functions
│   │   ├── motion.ts            # Animation variants
│   │   └── storage.ts            # LocalStorage utilities
│   ├── store/                   # Redux store
│   │   ├── index.ts             # Store configuration
│   │   ├── hooks.ts              # Typed hooks
│   │   └── slices/               # Redux slices
│   ├── public/                  # Public assets
│   │   ├── manifest.json         # PWA manifest
│   │   └── icons/                # PWA icons
│   ├── hooks/                   # Custom hooks
│   ├── models/                  # TypeScript types
│   ├── constants/               # Enums, constants
│   ├── contexts/                # React contexts
│   ├── providers/               # React providers
│   └── i18n/                    # Internationalization
├── packages/
│   ├── ui/                      # Shared UI components
│   │   ├── src/
│   │   │   ├── components/      # UI components
│   │   │   ├── hooks/           # Shared hooks
│   │   │   ├── lib/             # Utilities
│   │   │   └── styles/          # CSS files
│   │   └── package.json
│   └── typescript-config/       # Shared TS configs
├── biome.json                   # Linter config
├── turbo.json                   # Monorepo config
└── pnpm-workspace.yaml          # Workspace

DEPENDENCIES CHÍNH:
Root:
- @biomejs/biome: 2.1.1
- turbo: ^2.4.2
- typescript: 5.7.3

apps/web:
- next: ^15.4.4
- react: ^19.0.0
- react-dom: ^19.0.0
- motion: ^12.12.1 (animation)
- chart.js: ^4.5.1 (charts)
- react-hook-form: ^7.62.0
- zod: ^4.0.14
- @hookform/resolvers: ^5.2.1
- class-variance-authority: ^0.7.1
- clsx: ^2.1.1
- tailwind-merge: ^3.3.0
- lucide-react: ^0.475.0 (icons)
- sonner: ^2.0.3 (toast)
- next-themes: ^0.4.4 (theme)
- @reduxjs/toolkit: ^2.0.0 (state management)
- react-redux: ^9.0.0 (Redux bindings)
- redux-persist: ^6.0.0 (state persistence)
- KHÔNG sử dụng next-pwa (không tương thích với Next.js 15, dùng native PWA support)
- openai: ^4.0.0 (OpenAI API - optional)
- @anthropic-ai/sdk: ^0.20.0 (Claude API - optional)

packages/ui:
- @radix-ui/react-* (dialog, select, tabs, slot, label, checkbox, switch, radio-group, popover, progress, avatar, dropdown-menu)
- class-variance-authority: ^0.7.1
- clsx: ^2.1.1
- tailwind-merge: ^3.0.1
- lucide-react: ^0.475.0
- sonner: ^2.0.3
- next-themes: ^0.4.4
- zod: ^3.24.2
- tailwindcss: ^4.0.8 (dev)

DESIGN SYSTEM:

1. COLOR SYSTEM:
Tạo file packages/ui/src/styles/colors.css với:
- Primary colors: 50-1000 scale
- Neutral colors: 50-1000 scale
- Alpha variants cho transparency
- Semantic colors: positive, negative, warning, info
- Sử dụng CSS custom properties

Ví dụ:
:root {
  --color-primary-50: #fdfdff;
  --color-primary-100: #f7f9ff;
  ...
  --color-primary-1000: #222a63;
  
  --color-neutral-50: #fdfdfc;
  ...
  --color-neutral-1000: #22201a;
  
  --color-positive-50: ...
  --color-negative-50: ...
  --color-warning-50: ...
  --color-info-50: ...
}

2. TYPOGRAPHY:
Tạo file packages/ui/src/styles/typography.css với:
- Custom font families: Display và Sans
- Typography scale từ x-giant-display đến small-label-primary
- Responsive typography với breakpoints

3. SPACING & DIMENSIONS:
Tạo file packages/ui/src/styles/dimensions.css với:
- Custom spacing system
- Responsive breakpoints: mobile, tablet, 14inch, 16inch
- Box shadow utilities

4. ANIMATION SYSTEM:
Tạo file apps/web/lib/motion.ts với pre-defined variants:
- heroVariants: { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }
- staggerContainer: Stagger children animations
- statItem: Scale + fade animations
- cardVariants: Card entrance animations
- processStep: Slide in animations

Tạo component apps/web/components/section-animation.tsx:
- Sử dụng motion/react-client
- Props: children, className, duration, delay
- Animation: fade in + slide up
- Viewport: once: true

5. CHART SYSTEM:
Tạo chart components với Chart.js:
- Area chart với gradient fill
- Bar chart với value labels
- Multi-axis chart
- Custom plugins: crosshair, valueOnBar, customLegend
- Proper cleanup để tránh memory leaks
- Format VND currency

Pattern:
```typescript
useEffect(() => {
  // Destroy existing chart
  if (chartRef.current) {
    chartRef.current.destroy();
    chartRef.current = null;
  }
  
  // Create new chart
  const chart = new Chart(canvasRef.current, config);
  chartRef.current = chart;
  
  return () => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };
}, [data]);
```

6. FORM VALIDATION:
Tạo form components với React Hook Form + Zod:
- Schema validation với Zod
- Real-time validation với mode: 'onChange'
- Error display với custom Input component
- Field arrays cho dynamic forms

Pattern:
```typescript
const schema = z.object({
  email: z.string().email(),
  phone: z.string().regex(phoneRegex),
  dob: z.string().refine(validateDob)
});

const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange'
});
```

7. UI COMPONENTS (Tối thiểu):
Tạo các components sau trong packages/ui/src/components/:
- button.tsx: Với variants (primary, secondary, tertiary, danger)
- input.tsx: Với error display
- textarea.tsx: Với validation
- select.tsx: Dropdown select
- dialog.tsx: Modal dialog
- tabs.tsx: Tab navigation
- table.tsx: Data table
- label.tsx: Form label
- sonner.tsx: Toast notifications
- skeleton.tsx: Loading skeleton
- badge.tsx: Badge component
- avatar.tsx: Avatar component

Mỗi component:
- Sử dụng class-variance-authority cho variants
- Sử dụng tailwind-merge cho class merging
- Sử dụng Radix UI primitives
- Có TypeScript types đầy đủ
- Có error handling

8. UTILITIES:
Tạo apps/web/lib/utils.ts với:
- cn(): Class name merger với tailwind-merge
- formatCurrency(): Format VND
- formatChartValue(): Format chart values
- validateDob(): Validate date of birth
- phoneRegex: Vietnamese phone regex
- formatTimestampToDate(): Format timestamps

9. TOAST NOTIFICATIONS:
Setup Sonner với:
- Custom icons từ lucide-react
- Theme support với next-themes
- Custom styling với CSS variables
- Rich colors enabled

10. THEME SYSTEM:
Setup next-themes với:
- Light/dark mode support
- System preference detection
- Theme persistence
- Custom theme variables

11. STATE MANAGEMENT (Redux Toolkit):
Setup Redux Toolkit với:
- Store configuration
- Slices cho từng feature (auth, products, orders, customers, expenses)
- Persist state với redux-persist và localStorage
- Async thunks cho API calls (mock)

Dependencies:
- @reduxjs/toolkit: ^2.0.0
- react-redux: ^9.0.0
- redux-persist: ^6.0.0

Cấu trúc:
apps/web/
├── store/
│   ├── index.ts              # Store configuration
│   ├── hooks.ts              # Typed hooks
│   └── slices/
│       ├── auth.slice.ts     # Auth state
│       ├── products.slice.ts # Products state
│       ├── orders.slice.ts   # Orders state
│       ├── customers.slice.ts # Customers state
│       └── expenses.slice.ts # Expenses state

Store setup:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth.slice';
import productsReducer from './slices/products.slice';
// ... other reducers

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'products', 'orders', 'customers', 'expenses']
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  // ... other reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

12. MOCK DATA SYSTEM:
Tạo mock data system để simulate API calls:
- Mock data files trong apps/web/lib/mock-data/
- Mock API service để delay response như real API
- JSON structure cho tất cả entities

Cấu trúc:
apps/web/
├── lib/
│   ├── mock-data/
│   │   ├── users.json         # Mock users
│   │   ├── products.json      # Mock products
│   │   ├── orders.json        # Mock orders
│   │   ├── customers.json     # Mock customers
│   │   ├── expenses.json      # Mock expenses
│   │   └── revenues.json       # Mock revenues
│   ├── services/
│   │   ├── mock-api.service.ts # Mock API service
│   │   ├── auth.service.ts     # Auth service với mock
│   │   ├── product.service.ts  # Product service với mock
│   │   ├── order.service.ts    # Order service với mock
│   │   ├── customer.service.ts # Customer service với mock
│   │   └── expense.service.ts  # Expense service với mock

Mock API Service Pattern:
```typescript
// lib/services/mock-api.service.ts
export class MockApiService {
  private static delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async get<T>(data: T[], delayMs: number = 500): Promise<T[]> {
    await this.delay(delayMs);
    return Promise.resolve([...data]);
  }

  static async getById<T extends { id: string }>(
    data: T[],
    id: string,
    delayMs: number = 500
  ): Promise<T | null> {
    await this.delay(delayMs);
    const item = data.find(item => item.id === id);
    return Promise.resolve(item ? { ...item } : null);
  }

  static async post<T extends { id?: string }>(
    data: T[],
    newItem: Omit<T, 'id'>,
    delayMs: number = 500
  ): Promise<T> {
    await this.delay(delayMs);
    const item = {
      ...newItem,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;
    data.push(item);
    // Save to localStorage
    this.saveToStorage(data);
    return Promise.resolve(item);
  }

  static async put<T extends { id: string }>(
    data: T[],
    id: string,
    updates: Partial<T>,
    delayMs: number = 500
  ): Promise<T> {
    await this.delay(delayMs);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    const updated = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as T;
    data[index] = updated;
    this.saveToStorage(data);
    return Promise.resolve(updated);
  }

  static async delete<T extends { id: string }>(
    data: T[],
    id: string,
    delayMs: number = 500
  ): Promise<void> {
    await this.delay(delayMs);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    data.splice(index, 1);
    this.saveToStorage(data);
    return Promise.resolve();
  }

  private static saveToStorage<T>(data: T[]): void {
    // Save to localStorage để persist khi reload
    // Implementation tùy vào storage key
  }
}
```

Auth Service với Mock:
```typescript
// lib/services/auth.service.ts
import { MockApiService } from './mock-api.service';
import mockUsers from '../mock-data/users.json';

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<User> {
    // Simulate API call
    await MockApiService.delay(800);
    
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      token: `mock-token-${user.id}`,
    };
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return userData;
  },

  async register(data: RegisterRequest): Promise<User> {
    await MockApiService.delay(800);
    
    // Check if email exists
    const exists = mockUsers.some(u => u.email === data.email);
    if (exists) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      token: `mock-token-${crypto.randomUUID()}`,
    };
    
    // Add to mock data
    mockUsers.push({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      password: data.password, // In real app, this should be hashed
    });
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newUser.token);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    return newUser;
  },

  async logout(): Promise<void> {
    await MockApiService.delay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },
};
```

Mock Data Files:
```json
// lib/mock-data/users.json
[
  {
    "id": "1",
    "email": "admin@coffeeshop.com",
    "password": "admin123",
    "name": "Admin User"
  },
  {
    "id": "2",
    "email": "staff@coffeeshop.com",
    "password": "staff123",
    "name": "Staff User"
  }
]

// lib/mock-data/products.json
[
  {
    "id": "1",
    "name": "Cà phê đen",
    "description": "Cà phê đen truyền thống",
    "price": 25000,
    "category": "coffee",
    "imageUrl": "/images/coffee-black.jpg",
    "isAvailable": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]

// lib/mock-data/customers.json
[
  {
    "id": "1",
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "email": "nguyenvana@email.com",
    "address": "123 Đường ABC",
    "purchaseCount": 5,
    "freeDrinkEarned": 0,
    "freeDrinkUsed": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]

// lib/mock-data/orders.json
[]

// lib/mock-data/expenses.json
[]

// lib/mock-data/revenues.json
[]

// lib/mock-data/shop-profile.json
{
  "id": "1",
  "shopName": "Coffee Shop ABC",
  "address": "123 Đường XYZ, Quận 1, TP.HCM",
  "phone": "0912345678",
  "email": "info@coffeeshop.com",
  "description": "Cửa hàng cà phê truyền thống",
  "logoUrl": "/images/shop-logo.png",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}

// lib/mock-data/owner-profile.json
{
  "id": "1",
  "userId": "1",
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678",
  "email": "owner@coffeeshop.com",
  "avatarUrl": "/images/avatar.png",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}

// lib/mock-data/notes.json
[
  {
    "id": "1",
    "title": "Nhắc nhở đặt hàng cà phê",
    "content": "Đặt 10kg cà phê Arabica vào thứ 2 tuần sau",
    "tags": ["mua hàng", "cà phê"],
    "isPinned": true,
    "color": "#FFE5B4",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "2",
    "title": "Khách hàng VIP - Nguyễn Văn A",
    "content": "Khách hàng này thích cà phê đen, không đường. Nhớ phục vụ nhanh.",
    "tags": ["khách hàng", "VIP"],
    "isPinned": false,
    "createdAt": "2024-01-14T14:30:00Z",
    "updatedAt": "2024-01-14T14:30:00Z"
  }
]
```

13. CSS IMPORT CẤU TRÚC (QUAN TRỌNG):
- packages/ui/src/styles/globals.css: File chính import tailwindcss và các CSS files khác
  ```css
  @import "tailwindcss";
  @source "../../../apps/**/*.{ts,tsx}";
  @source "../../../components/**/*.{ts,tsx}";
  @source "../**/*.{ts,tsx}";
  
  @import "./colors.css";
  @import "./typography.css";
  @import "./dimensions.css";
  
  @layer base {
    * {
      border-color: var(--color-neutral-200);
    }
    body {
      font-family: var(--font-sans, 'Inter', system-ui, -apple-system, sans-serif);
      background-color: white;
      color: var(--color-neutral-900);
    }
  }
  ```

- packages/ui/src/styles/colors.css: Chỉ có :root với CSS variables, KHÔNG có @layer base
- packages/ui/src/styles/typography.css: Chỉ có :root với CSS variables, KHÔNG có @layer base
- packages/ui/src/styles/dimensions.css: Chỉ có :root với CSS variables, KHÔNG có @layer base
- apps/web/app/layout.tsx: Import "@workspace/ui/styles/globals.css" (KHÔNG tạo globals.css trong apps/web)
- packages/ui/package.json: Export "./styles/globals.css": "./src/styles/globals.css"

14. POSTCSS CONFIG:
- apps/web/postcss.config.mjs: Chỉ có @tailwindcss/postcss (KHÔNG cần postcss-import)
  ```javascript
  export default {
    plugins: { "@tailwindcss/postcss": {} },
  };
  ```

- packages/ui/postcss.config.mjs: Chỉ có @tailwindcss/postcss
  ```javascript
  export default {
    plugins: { "@tailwindcss/postcss": {} },
  };
  ```

15. NEXT.CONFIG.MJS:
Tạo file apps/web/next.config.mjs với cấu hình đầy đủ:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile shared packages
  transpilePackages: ["@workspace/ui"],
  
  // Webpack config để resolve exports từ packages
  webpack: (config) => {
    config.resolve.conditionNames = ["import", "require", "default"];
    return config;
  },
  
  // Security headers cho PWA
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**LƯU Ý:**
- KHÔNG sử dụng next-pwa hoặc withPWA wrapper
- KHÔNG cần webpack alias cho @workspace/ui (dùng conditionNames thay thế)
- Security headers theo Next.js PWA documentation

16. PWA SETUP (Next.js 15 Native):
- KHÔNG sử dụng next-pwa (không tương thích với Next.js 15)
- Sử dụng Next.js 15 native PWA support theo https://nextjs.org/docs/app/guides/progressive-web-apps

Cấu trúc:
- app/manifest.ts: PWA manifest (Next.js 15 tự động serve)
  ```typescript
  import type { MetadataRoute } from "next";
  
  export default function manifest(): MetadataRoute.Manifest {
    return {
      name: "Coffee Shop Management",
      short_name: "Coffee Shop",
      description: "Quản lý coffee shop",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#222a63",
      orientation: "portrait-primary",
      icons: [
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    };
  }
  ```

- public/sw.js: Service worker
  ```javascript
  self.addEventListener('push', function (event) {
    if (event.data) {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
        },
      };
      event.waitUntil(self.registration.showNotification(data.title, options));
    }
  });

  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
  });

  self.addEventListener('install', function (event) {
    self.skipWaiting();
  });

  self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
  });
  ```

- app/layout.tsx: PWA metadata
  ```typescript
  export const metadata: Metadata = {
    title: "Coffee Shop Management",
    description: "Quản lý coffee shop",
    themeColor: "#222a63",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Coffee Shop",
    },
  };
  
  // Trong return:
  <head>
    <link rel="icon" href="/icons/favicon-svgrepo-com.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
  </head>
  ```

- Register service worker trong client component:
  ```typescript
  // components/service-worker-register.tsx
  'use client';
  
  import { useEffect } from 'react';
  
  export function ServiceWorkerRegister() {
    useEffect(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/', updateViaCache: 'none' })
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      }
    }, []);
    
    return null;
  }
  ```

- Thêm vào app/layout.tsx:
  ```typescript
  import { ServiceWorkerRegister } from '@/components/service-worker-register';
  
  export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          <ServiceWorkerRegister />
          {children}
        </body>
      </html>
    );
  }
  ```

- Testing PWA locally (theo Next.js docs):
  - Chạy với HTTPS: `next dev --experimental-https`
  - Service worker chỉ hoạt động trên HTTPS hoặc localhost
  - Kiểm tra trong DevTools > Application > Service Workers
  - Kiểm tra manifest trong DevTools > Application > Manifest

- Web Push Notifications (Optional - nếu cần):
  - Cần VAPID keys (generate bằng: `web-push generate-vapid-keys`)
  - Cần web-push package: `pnpm add web-push`
  - Setup theo hướng dẫn tại https://nextjs.org/docs/app/guides/progressive-web-apps

17. LAYOUT.TSX - IMPORT CSS (QUAN TRỌNG):
- apps/web/app/layout.tsx: Import CSS từ @workspace/ui
  ```typescript
  import type { Metadata } from "next";
  import "@workspace/ui/styles/globals.css"; // QUAN TRỌNG: Import từ package
  
  export const metadata: Metadata = {
    title: "Coffee Shop Management",
    description: "Quản lý coffee shop",
    themeColor: "#222a63",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Coffee Shop",
    },
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <head>
          <link rel="icon" href="/icons/favicon-svgrepo-com.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        </head>
        <body>
          {children}
        </body>
      </html>
    );
  }
  ```

**LƯU Ý QUAN TRỌNG:**
- KHÔNG tạo file globals.css trong apps/web/app/
- Chỉ import từ "@workspace/ui/styles/globals.css"
- File globals.css duy nhất nằm trong packages/ui/src/styles/

18. TSCONFIG & PATH ALIASES:
- apps/web/tsconfig.json: Sử dụng path aliases với @
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"]
      }
    },
    "extends": "@workspace/typescript-config/base.json",
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
  }
  ```

- packages/ui/tsconfig.json:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    },
    "extends": "@workspace/typescript-config/base.json",
    "include": ["src/**/*.ts", "src/**/*.tsx"],
    "exclude": ["node_modules", "dist"]
  }
  ```

- packages/ui/package.json: Export paths
  ```json
  {
    "name": "@workspace/ui",
    "version": "0.0.0",
    "exports": {
      ".": "./src/index.ts",
      "./styles/globals.css": "./src/styles/globals.css",
      "./components/*": "./src/components/*.tsx",
      "./hooks/*": "./src/hooks/*.ts",
      "./lib/*": "./src/lib/*.ts"
    }
  }
  ```

19. LOCALSTORAGE PERSISTENCE:
Setup localStorage để persist data khi reload:
- Utility functions để sync Redux state với localStorage
- Auto-save khi state changes
- Auto-load khi app starts

Pattern:
```typescript
// lib/storage.ts
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH: 'auth',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  EXPENSES: 'expenses',
  REVENUES: 'revenues',
  SHOP_PROFILE: 'shop_profile',
  OWNER_PROFILE: 'owner_profile',
  NOTES: 'notes',
} as const;
```

FEATURES CẦN CÓ:
- Authentication flow với mock API và localStorage
- Redux Toolkit cho state management
- Redux Persist để persist state khi reload
- Mock data system cho tất cả entities
- JSON-based API simulation với delay
- Protected routes với middleware
- Form handling với validation
- Toast notifications
- Theme switching
- Responsive design
- Animation system
- Chart system
- Error handling
- PWA support với offline capability
- Service worker cho caching
- Install prompt cho mobile

CODE STYLE:
- File naming: kebab-case.tsx
- Component naming: PascalCase
- Hook naming: use-hook-name.ts
- Service naming: name.service.ts
- Schema naming: name-schemas.ts
- Slice naming: name.slice.ts
- TypeScript strict mode
- Biome.js for linting/formatting

Tạo đầy đủ các file config:
- biome.json
- turbo.json
- tsconfig.json (root và cho từng package với path aliases)
- next.config.mjs (với PWA security headers, KHÔNG dùng next-pwa)
- apps/web/postcss.config.mjs (chỉ có @tailwindcss/postcss)
- packages/ui/postcss.config.mjs (chỉ có @tailwindcss/postcss)
- app/manifest.ts (PWA manifest, Next.js 15 native)
- public/sw.js (Service Worker)
- packages/ui/src/styles/globals.css (import tailwindcss và các CSS files)
- packages/ui/src/styles/colors.css (chỉ có :root, không có @layer)
- packages/ui/src/styles/typography.css (chỉ có :root, không có @layer)
- packages/ui/src/styles/dimensions.css (chỉ có :root, không có @layer)

**QUAN TRỌNG - CÁC LỖI THƯỜNG GẶP VÀ CÁCH TRÁNH:**

1. **CSS IMPORT:**
   - ✅ ĐÚNG: `import "@workspace/ui/styles/globals.css"` trong apps/web/app/layout.tsx
   - ❌ SAI: Tạo globals.css trong apps/web/app/
   - ❌ SAI: Import từ "./globals.css" hoặc "../globals.css"
   - File globals.css DUY NHẤT nằm trong packages/ui/src/styles/globals.css

2. **POSTCSS CONFIG:**
   - ✅ ĐÚNG: Chỉ có `{ "@tailwindcss/postcss": {} }`
   - ❌ SAI: Thêm postcss-import hoặc plugins khác
   - Cả apps/web và packages/ui đều cần postcss.config.mjs riêng

3. **NEXT.CONFIG.MJS:**
   - ✅ ĐÚNG: `transpilePackages: ["@workspace/ui"]`
   - ✅ ĐÚNG: `config.resolve.conditionNames = ["import", "require", "default"]`
   - ❌ SAI: Thêm webpack alias cho @workspace/ui (không cần)
   - ✅ ĐÚNG: Security headers cho PWA

4. **PWA SETUP:**
   - ✅ ĐÚNG: Sử dụng app/manifest.ts (Next.js 15 native)
   - ✅ ĐÚNG: Service worker trong public/sw.js
   - ❌ SAI: Sử dụng next-pwa package
   - ❌ SAI: Tạo manifest.json trong public/ (dùng manifest.ts thay thế)

5. **TSCONFIG PATH ALIASES:**
   - ✅ ĐÚNG: `"@/*": ["./*"]` trong apps/web/tsconfig.json
   - ✅ ĐÚNG: `"@/*": ["./src/*"]` trong packages/ui/tsconfig.json
   - ✅ ĐÚNG: Export paths trong packages/ui/package.json

6. **PACKAGE.JSON EXPORTS:**
   - ✅ ĐÚNG: Export "./styles/globals.css": "./src/styles/globals.css"
   - ✅ ĐÚNG: Export "./components/*": "./src/components/*.tsx"
   - Đảm bảo package.json exports đúng để Next.js có thể resolve

7. **TAILWIND CSS V4:**
   - ✅ ĐÚNG: Sử dụng @import "tailwindcss" trong globals.css
   - ✅ ĐÚNG: Sử dụng @source để scan files
   - ❌ SAI: Sử dụng @tailwind directives (chỉ dùng cho v3)

8. **SERVICE WORKER:**
   - ✅ ĐÚNG: File public/sw.js
   - ✅ ĐÚNG: Register trong client component
   - ✅ ĐÚNG: Scope: '/' và updateViaCache: 'none'

**CHECKLIST TRƯỚC KHI CHẠY:**
- [ ] packages/ui/src/styles/globals.css đã tạo với @import "tailwindcss"
- [ ] packages/ui/package.json có exports cho styles/globals.css
- [ ] apps/web/app/layout.tsx import "@workspace/ui/styles/globals.css"
- [ ] KHÔNG có globals.css trong apps/web/app/
- [ ] postcss.config.mjs chỉ có @tailwindcss/postcss
- [ ] next.config.mjs có transpilePackages và conditionNames
- [ ] app/manifest.ts đã tạo (không phải manifest.json)
- [ ] public/sw.js đã tạo
- [ ] tsconfig.json có path aliases đúng
- [ ] Service worker register component đã tạo và thêm vào layout
```

---

## 9. Ý TƯỞNG DỰ ÁN COFFEE SHOP MANAGEMENT

### 9.1. Tổng Quan Dự Án

**Mục Đích:**
Xây dựng hệ thống quản lý coffee shop với các chức năng:
1. Thống kê thu chi với biểu đồ
2. Quản lý chi tiêu theo loại
3. Quản lý menu sản phẩm
4. Quản lý đơn hàng (takeaway)
5. Quản lý khách hàng với loyalty program
6. Tích hợp AI assistant cho hỏi đáp
7. Cài đặt hồ sơ (Profile Settings)
8. Ghi chú nhanh (Take Note)

### 9.1.1. UI/UX Optimization cho Mini Project (4-5 giờ)

**Nguyên tắc thiết kế:**
- **Gom menu tối đa**: Giảm số lượng menu items, gom các chức năng liên quan vào 1 menu
- **Tối thiểu thao tác**: Mỗi chức năng chỉ cần 1-2 clicks để truy cập
- **Responsive ưu tiên**: Mobile-first design, tối ưu cho mọi kích thước màn hình
- **Quick actions**: Các thao tác thường dùng luôn hiển thị, không cần vào menu sâu

**Cấu trúc Menu Tối Ưu (Gom lại):**

```
📱 Mobile Navigation (Bottom Sheet/Drawer):
├── 🏠 Trang chủ (Dashboard)
│   └── Thống kê thu chi + Charts
│
├── 💰 Quản lý Tài chính
│   ├── Thống kê (Dashboard)
│   ├── Chi tiêu (Expenses)
│   └── Doanh thu (Revenue)
│
├── 🛒 Bán hàng
│   ├── Menu sản phẩm
│   ├── Tạo đơn hàng
│   └── Lịch sử đơn hàng
│
├── 👥 Khách hàng
│   ├── Danh sách khách hàng
│   ├── Loyalty program
│   └── Thêm khách hàng mới
│
├── 📝 Ghi chú (Quick Note)
│   └── Tất cả notes trong 1 trang
│
├── 🤖 AI Assistant
│   └── Chat interface
│
└── ⚙️ Cài đặt
    ├── Hồ sơ cửa hàng
    ├── Hồ sơ cá nhân
    ├── Đổi mật khẩu
    └── Đăng xuất
```

**Layout Structure:**

**Desktop (≥1024px):**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo | Search | Quick Note | Avatar Menu        │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │  Main Content Area                           │
│ (Fixed)  │  - Dashboard với tabs                       │
│          │  - Charts + Stats cards                      │
│ - Menu   │  - Recent items                              │
│ - Stats  │                                              │
│ - Notes  │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**Tablet (768px - 1023px):**
```
┌─────────────────────────────────────┐
│ Header: Logo | Menu Icon | Avatar   │
├─────────────────────────────────────┤
│                                      │
│  Main Content (Full width)           │
│  - Dashboard với tabs                │
│  - Charts responsive                 │
│  - Stats cards (2 columns)          │
│                                      │
│  [Sidebar mở bằng drawer]            │
└─────────────────────────────────────┘
```

**Mobile (<768px):**
```
┌─────────────────────┐
│ Header: Logo | ☰   │
├─────────────────────┤
│                     │
│  Main Content       │
│  - Full width       │
│  - Stack layout     │
│  - Stats cards (1)  │
│  - Charts scroll    │
│                     │
│  [Bottom Nav Bar]   │
│  🏠 💰 🛒 👥 📝 ⚙️  │
└─────────────────────┘
```

**Menu Gộp Chi Tiết:**

**1. Menu "Quản lý Tài chính" (Gom Statistics + Expenses):**
```
Trang: /finance
├── Tab 1: "Thống kê"
│   ├── Stat cards: Tổng thu, Tổng chi, Lợi nhuận
│   ├── Charts: Line chart (thu/chi), Pie chart (phân loại)
│   └── Date range picker
│
└── Tab 2: "Chi tiêu"
    ├── Button "Thêm chi tiêu" (Floating hoặc top)
    ├── Table/List chi tiêu
    └── Filter by category
```

**2. Menu "Bán hàng" (Gom Products + Orders):**
```
Trang: /sales
├── Tab 1: "Menu sản phẩm"
│   ├── Grid/Card view products
│   ├── Button "Thêm sản phẩm"
│   └── Search + Filter
│
└── Tab 2: "Đơn hàng"
    ├── Button "Tạo đơn mới" (Prominent)
    ├── List orders
    └── Status filter
```

**3. Menu "Khách hàng" (Gom List + Loyalty):**
```
Trang: /customers
├── Header: Button "Thêm khách hàng"
├── Search bar
├── Customer list với:
│   ├── Avatar + Name
│   ├── Purchase count badge
│   ├── Free drink indicator (nếu có)
│   └── Click → Detail page
└── Detail page:
    ├── Customer info
    ├── Purchase history
    └── Loyalty status
```

**4. Quick Note (Luôn accessible):**
```
- Header: Textarea nhỏ "Ghi chú nhanh..." + Button "Lưu"
- Hoặc Floating button → Drawer với:
  ├── Quick input
  └── List notes (compact)
```

**5. Cài đặt (Gom tất cả settings):**
```
Trang: /settings
├── Tab 1: "Cửa hàng"
│   └── Form shop info
│
├── Tab 2: "Cá nhân"
│   ├── Avatar upload
│   └── Form owner info
│
├── Tab 3: "Bảo mật"
│   └── Change password form
│
└── Footer: Button "Đăng xuất"
```

**Responsive Breakpoints:**
```typescript
const breakpoints = {
  mobile: '0px - 767px',      // Stack layout, bottom nav
  tablet: '768px - 1023px',   // 2 columns, drawer menu
  desktop: '1024px+',         // Sidebar + main content
};
```

**Component Layout Patterns:**

**1. Dashboard Page:**
```typescript
// Mobile: Stack vertically
<div className="flex flex-col gap-4 p-4">
  <StatCards gridCols={1} />      // 1 column
  <Charts fullWidth />            // Full width, scrollable
  <RecentItems />                 // Stack
</div>

// Tablet: 2 columns
<div className="grid grid-cols-2 gap-4 p-4">
  <StatCards gridCols={2} />     // 2 columns
  <Charts />                      // Full width
  <RecentItems />                 // 2 columns
</div>

// Desktop: Grid layout
<div className="grid grid-cols-12 gap-4 p-6">
  <StatCards className="col-span-12" gridCols={4} />
  <Charts className="col-span-8" />
  <RecentItems className="col-span-4" />
</div>
```

**2. Table/List Component:**
```typescript
// Mobile: Card view (dễ tap)
<div className="space-y-2">
  {items.map(item => (
    <Card className="p-4">      // Large touch target
      {/* Content */}
    </Card>
  ))}
</div>

// Desktop: Table view (compact)
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      {/* ... */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* Rows */}
  </TableBody>
</Table>
```

**3. Form Layout:**
```typescript
// Mobile: Stack, full width inputs
<form className="space-y-4 p-4">
  <Input fullWidth />             // Full width
  <Input fullWidth />
  <Button fullWidth>Submit</Button>
</form>

// Desktop: 2 columns (nếu form dài)
<form className="grid grid-cols-2 gap-4 p-6">
  <Input />
  <Input />
  <Button className="col-span-2">Submit</Button>
</form>
```

**Quick Actions (Luôn hiển thị):**

**Header Component:**
```typescript
<Header>
  {/* Mobile: Hamburger menu */}
  <MobileMenuButton />
  
  {/* Logo */}
  <Logo />
  
  {/* Desktop: Search */}
  <SearchBar className="hidden md:flex" />
  
  {/* Quick Note (Compact) */}
  <QuickNoteInput className="hidden lg:flex" />
  
  {/* Avatar Menu */}
  <AvatarMenu>
    <DropdownMenu>
      <MenuItem>Hồ sơ</MenuItem>
      <MenuItem>Cài đặt</MenuItem>
      <MenuItem>Đăng xuất</MenuItem>
    </DropdownMenu>
  </AvatarMenu>
</Header>
```

**Bottom Navigation (Mobile only):**
```typescript
<BottomNav className="md:hidden fixed bottom-0">
  <NavItem icon="home" label="Trang chủ" />
  <NavItem icon="dollar" label="Tài chính" />
  <NavItem icon="shopping" label="Bán hàng" />
  <NavItem icon="users" label="Khách hàng" />
  <NavItem icon="note" label="Ghi chú" />
  <NavItem icon="settings" label="Cài đặt" />
</BottomNav>
```

**Touch Targets:**
- Minimum 44x44px cho mobile (iOS guideline)
- Spacing giữa buttons: 8-12px
- Padding trong cards: 16px mobile, 24px desktop

**Performance Optimization:**
- Lazy load charts (chỉ render khi visible)
- Virtual scrolling cho long lists
- Debounce search inputs
- Memoize expensive calculations

**Accessibility:**
- Keyboard navigation support
- ARIA labels cho icons
- Focus indicators rõ ràng
- Screen reader friendly

### 9.2. Chi Tiết Các Module

#### 9.2.1. Module Thống Kê (Statistics Dashboard)

**Chức Năng:**
- Hiển thị biểu đồ thu và chi theo thời gian (ngày/tuần/tháng/năm)
- Hiển thị các số liệu: Tổng doanh thu, Tổng chi phí, Lợi nhuận
- Phân tích theo loại chi tiêu
- So sánh các kỳ

**UI Components:**
- Dashboard layout với grid
- Chart components: Line chart (thu/chi theo thời gian), Bar chart (so sánh kỳ), Pie chart (phân loại chi tiêu)
- Stat cards: Tổng doanh thu, Tổng chi phí, Lợi nhuận, Số đơn hàng
- Date range picker để filter
- Export data (CSV/PDF)

**Data Structure:**
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
```

**Chart Types:**
- Line chart: Thu/Chi theo thời gian (2 lines)
- Bar chart: So sánh thu/chi theo kỳ
- Pie chart: Phân loại chi tiêu
- Area chart: Lợi nhuận tích lũy

#### 9.2.2. Module Quản Lý Chi Tiêu (Expense Management)

**Chức Năng:**
- Thêm/sửa/xóa chi tiêu
- Phân loại chi tiêu (nguyên liệu, thuê, điện nước, lương, marketing, khác)
- Tính toán tự động tổng chi tiêu
- Tính toán lại tổng doanh thu khi có thu mới hoặc chi mới
- Lọc và tìm kiếm chi tiêu
- Export báo cáo

**UI Components:**
- Form thêm/sửa chi tiêu với validation
- Table hiển thị danh sách chi tiêu
- Filter và search
- Category selector
- Date picker
- Amount input với format VND

**Form Schema:**
```typescript
const ExpenseSchema = z.object({
  date: z.date(),
  amount: z.number().min(0),
  category: z.nativeEnum(ExpenseCategory),
  description: z.string().min(1).max(500)
});
```

**Features:**
- Real-time calculation khi thêm/sửa/xóa
- Validation: Số tiền > 0, Ngày không quá tương lai
- Confirmation dialog khi xóa
- Toast notification khi thành công/lỗi

#### 9.2.3. Module Quản Lý Menu (Product Menu)

**Chức Năng:**
- Danh sách sản phẩm (cà phê, trà, bánh, etc.)
- Thêm/sửa/xóa sản phẩm
- Quản lý giá, mô tả, hình ảnh
- Phân loại sản phẩm

**UI Components:**
- Product grid/card view với hình ảnh (Grab-style visual display)
- Product form với image upload
- Category filter
- Search bar
- Price display với format VND

**Visual Design Requirements:**
- Products displayed in grid layout similar to Grab app
- Large, high-quality product images
- Product cards với image, name, price prominently displayed
- Plus button overlay trên product image để quick add-to-cart
- Responsive grid: 2-3 columns trên tablet, 1-2 trên mobile
- Hover effects và smooth transitions

**Data Structure:**
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
  COFFEE = 'coffee',
  TEA = 'tea',
  DESSERT = 'dessert',
  SNACK = 'snack',
  OTHER = 'other'
}
```

#### 9.2.4. Module Quản Lý Bán Hàng (Sales/Order Management - Point of Sale)

**Mục Đích:**
Đây là giao diện dành cho người bán, tối ưu cho tablet. Màn hình bán hàng cần trực quan và dễ sử dụng, tương tự như giao diện Grab.

**Tính Năng Chính:**
- Hiển thị sản phẩm trực quan với hình ảnh (Grab-style)
- Tìm kiếm/chọn khách hàng với tùy chọn tạo nhanh
- Thêm sản phẩm vào đơn hàng với phản hồi trực quan
- Xác nhận đơn hàng để ghi nhận doanh thu
- Danh sách doanh thu gần đây với các hành động chỉnh sửa/xóa để sửa lỗi

**Layout UI:**
```
┌─────────────────────────────────────────┐
│  Tìm kiếm khách hàng [Nút Tạo]         │
├─────────────────────────────────────────┤
│  Khách hàng đã chọn: [Tên/SĐT]         │
├─────────────────────────────────────────┤
│  Đơn hàng hiện tại                      │
│  - Sản phẩm 1 x2                        │
│  - Sản phẩm 2 x1                        │
│  Tổng: 150,000 VND                      │
│  [Nút Xác nhận đơn hàng]                │
├─────────────────────────────────────────┤
│  Menu sản phẩm (Grid kiểu Grab)         │
│  ┌────┐ ┌────┐ ┌────┐                 │
│  │Ảnh │ │Ảnh │ │Ảnh │                 │
│  │ +  │ │ +  │ │ +  │                 │
│  └────┘ └────┘ └────┘                 │
│  Tên   Tên   Tên                        │
│  Giá   Giá   Giá                        │
├─────────────────────────────────────────┤
│  Doanh thu gần đây                      │
│  - Đơn #001 - 150,000 VND [Sửa][Xóa]  │
│  - Đơn #002 - 200,000 VND [Sửa][Xóa]  │
└─────────────────────────────────────────┘
```

**Luồng Người Dùng:**

1. **Chọn Khách Hàng:**
   - Người bán hỏi: "Khách hàng có phải thành viên không?"
   - Nếu có: Tìm kiếm khách hàng trong ô tìm kiếm (autocomplete)
   - Nếu không:
     - Tùy chọn 1: Click nút "Tạo" bên cạnh ô tìm kiếm → Popup với các trường Tên và Số điện thoại → Tạo khách hàng mới
     - Tùy chọn 2: Chọn tùy chọn "Khác" (cho khách hàng walk-in không đăng ký)
   - Thông tin khách hàng đã chọn hiển thị bên dưới ô tìm kiếm

2. **Thêm Sản Phẩm:**
   - Menu sản phẩm hiển thị bên dưới dạng grid kiểu Grab
   - Mỗi thẻ sản phẩm hiển thị:
     - Hình ảnh sản phẩm lớn
     - Nút cộng (+) overlay trên hình ảnh (góc trên bên phải)
     - Tên sản phẩm
     - Giá (định dạng VND)
   - Click nút cộng → Sản phẩm được thêm vào đơn hàng hiện tại
   - Phản hồi trực quan: Animation nút, mục xuất hiện trong danh sách đơn hàng
   - Số lượng có thể điều chỉnh trong danh sách đơn hàng

3. **Xác Nhận Đơn Hàng:**
   - Tóm tắt đơn hàng hiện tại hiển thị:
     - Danh sách các mục với số lượng
     - Tổng số tiền
   - Click nút "Xác nhận đơn hàng"
   - Đơn hàng được lưu và doanh thu được ghi nhận
   - Thông báo thành công toast
   - Đơn hàng xuất hiện trong danh sách "Doanh thu gần đây" bên dưới

4. **Quản Lý Doanh Thu Gần Đây:**
   - Danh sách các mục doanh thu gần đây (10-20 đơn hàng cuối)
   - Mỗi mục hiển thị:
     - ID/Số đơn hàng
     - Tên khách hàng (nếu có)
     - Tổng số tiền
     - Timestamp
     - Các nút hành động [Sửa] và [Xóa]
   - Sửa: Mở dialog để chỉnh sửa chi tiết đơn hàng (để sửa lỗi)
   - Xóa: Dialog xác nhận → Xóa đơn hàng và điều chỉnh doanh thu

**UI Components:**
- Customer search box với autocomplete
- Create customer button (bên cạnh tìm kiếm)
- Create customer dialog (các trường Tên, Số điện thoại)
- Tùy chọn "Khác" cho khách hàng không phải thành viên
- Current order panel (sticky hoặc fixed position)
- Product grid (Grab-style với hình ảnh)
- Plus button overlay trên hình ảnh sản phẩm
- Order confirmation button
- Recent revenue list với các nút hành động
- Edit order dialog
- Delete confirmation dialog

**Data Structure:**
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

**Yêu Cầu Thiết Kế:**
- **Tối ưu cho tablet**: Các mục tiêu chạm lớn, dễ sử dụng khi đứng
- **Ưu tiên trực quan**: Hình ảnh sản phẩm nổi bật, văn bản là thứ yếu
- **Thân thiện với người bán**: Không tập trung vào admin, quy trình đơn giản và nhanh
- **Bảng màu**: Sử dụng màu chính cho các nút, màu trung tính cho nền
- **Typography**: Phông chữ lớn, dễ đọc cho xem trên tablet
- **Khoảng cách**: Padding rộng rãi để dễ chạm
- **Phản hồi**: Phản hồi trực quan rõ ràng cho mọi hành động (animations, toasts)

**Cấu Trúc Component:**
```
components/sales/
├── sales-page.tsx              # Trang bán hàng chính
├── customer-selector.tsx        # Tìm kiếm khách hàng + tạo
├── create-customer-dialog.tsx  # Popup tạo khách hàng
├── current-order-panel.tsx     # Tóm tắt đơn hàng hiện tại
├── product-grid.tsx            # Grid sản phẩm kiểu Grab
├── product-card.tsx            # Thẻ sản phẩm với nút +
├── recent-revenue-list.tsx     # Danh sách doanh thu gần đây
├── edit-order-dialog.tsx       # Dialog chỉnh sửa đơn hàng
└── order-item-list.tsx         # Hiển thị các mục đơn hàng
```

**Redux Slice:**
```typescript
// store/slices/sales.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SalesState {
  currentOrder: {
    customerId?: string | 'others';
    customerName?: string;
    items: OrderItem[];
    total: number;
  };
  recentRevenues: RevenueEntry[];
  isLoading: boolean;
}

const initialState: SalesState = {
  currentOrder: {
    items: [],
    total: 0,
  },
  recentRevenues: [],
  isLoading: false,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<{ id?: string | 'others'; name?: string }>) => {
      state.currentOrder.customerId = action.payload.id;
      state.currentOrder.customerName = action.payload.name;
    },
    addProductToOrder: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const existingItem = state.currentOrder.items.find(
        item => item.productId === action.payload.product.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        state.currentOrder.items.push({
          productId: action.payload.product.id,
          productName: action.payload.product.name,
          quantity: action.payload.quantity || 1,
          price: action.payload.product.price,
          subtotal: action.payload.product.price * (action.payload.quantity || 1),
        });
      }
      state.currentOrder.total = state.currentOrder.items.reduce(
        (sum, item) => sum + item.subtotal, 0
      );
    },
    removeProductFromOrder: (state, action: PayloadAction<string>) => {
      state.currentOrder.items = state.currentOrder.items.filter(
        item => item.productId !== action.payload
      );
      state.currentOrder.total = state.currentOrder.items.reduce(
        (sum, item) => sum + item.subtotal, 0
      );
    },
    updateProductQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.currentOrder.items.find(
        item => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        item.subtotal = item.quantity * item.price;
      }
      state.currentOrder.total = state.currentOrder.items.reduce(
        (sum, item) => sum + item.subtotal, 0
      );
    },
    confirmOrder: (state) => {
      const revenueEntry: RevenueEntry = {
        id: crypto.randomUUID(),
        orderId: crypto.randomUUID(),
        customerId: state.currentOrder.customerId,
        customerName: state.currentOrder.customerName,
        items: [...state.currentOrder.items],
        total: state.currentOrder.total,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.recentRevenues.unshift(revenueEntry);
      state.currentOrder = {
        items: [],
        total: 0,
      };
    },
    editRevenueEntry: (state, action: PayloadAction<{ id: string; updates: Partial<RevenueEntry> }>) => {
      const index = state.recentRevenues.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.recentRevenues[index] = {
          ...state.recentRevenues[index],
          ...action.payload.updates,
          updatedAt: new Date(),
        };
      }
    },
    deleteRevenueEntry: (state, action: PayloadAction<string>) => {
      state.recentRevenues = state.recentRevenues.filter(entry => entry.id !== action.payload);
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = {
        items: [],
        total: 0,
      };
    },
  },
});

export const {
  setCustomer,
  addProductToOrder,
  removeProductFromOrder,
  updateProductQuantity,
  confirmOrder,
  editRevenueEntry,
  deleteRevenueEntry,
  clearCurrentOrder,
} = salesSlice.actions;

export default salesSlice.reducer;
```

**English Prompt for Sales/Order Management Module:**

```
Create a Point of Sale (POS) interface for coffee shop sellers, optimized for tablet use. The sales screen should be visual and intuitive, similar to Grab's interface style.

KEY REQUIREMENTS:

1. VISUAL PRODUCT DISPLAY:
   - Products displayed in grid layout similar to Grab app
   - Large, high-quality product images
   - Product cards with image, name, price prominently displayed
   - Plus (+) button overlay on product image (top-right corner) for quick add-to-cart
   - Responsive grid: 2-3 columns on tablet, 1-2 on mobile
   - Hover effects and smooth transitions

2. CUSTOMER SELECTION FLOW:
   - Customer search box with autocomplete (search by name or phone)
   - "Create" button next to search box
   - Create customer dialog: Name and Phone fields only
   - "Others" option for walk-in customers without registration
   - Selected customer info displayed below search box
   - Flow: Ask "Is customer a member?" → If yes: search → If no: create or select "Others"

3. ORDER MANAGEMENT:
   - Current order panel (sticky or fixed position) showing:
     - List of items with quantities
     - Total amount (VND format)
     - "Confirm Order" button
   - Click plus button on product → Product added to current order
   - Visual feedback: Button animation, item appears in order list
   - Quantity can be adjusted in order list
   - Click "Confirm Order" → Order saved, revenue recorded, success toast

4. RECENT REVENUE MANAGEMENT:
   - List of recent revenue entries (last 10-20 orders) below product grid
   - Each entry shows:
     - Order ID/Number
     - Customer name (if applicable)
     - Total amount
     - Timestamp
     - [Edit] and [Delete] action buttons
   - Edit: Opens dialog to modify order details (for error corrections)
   - Delete: Confirmation dialog → Removes order and adjusts revenue

5. DESIGN REQUIREMENTS:
   - Tablet-optimized: Large touch targets (min 44x44px), easy to use while standing
   - Visual-first: Product images are prominent, text is secondary
   - Seller-friendly: Not admin-focused, simple and fast workflow
   - Color scheme: Use primary colors for buttons, neutral for backgrounds
   - Typography: Large, readable fonts for tablet viewing
   - Spacing: Generous padding for easy tapping
   - Feedback: Clear visual feedback for all actions (animations, toasts)

6. COMPONENT STRUCTURE:
   ```
   components/sales/
   ├── sales-page.tsx              # Main sales page
   ├── customer-selector.tsx        # Customer search + create
   ├── create-customer-dialog.tsx   # Create customer popup
   ├── current-order-panel.tsx     # Current order summary
   ├── product-grid.tsx            # Grab-style product grid
   ├── product-card.tsx            # Individual product card with + button
   ├── recent-revenue-list.tsx     # Recent revenue entries
   ├── edit-order-dialog.tsx       # Edit order dialog
   └── order-item-list.tsx         # Order items display
   ```

7. DATA STRUCTURE:
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
   ```

8. REDUX STATE MANAGEMENT:
   - Use Redux Toolkit slice for sales state
   - Actions: setCustomer, addProductToOrder, removeProductFromOrder, updateProductQuantity, confirmOrder, editRevenueEntry, deleteRevenueEntry, clearCurrentOrder
   - Auto-calculate total when items change
   - Persist recent revenues to localStorage

9. USER FLOW:
   1. Seller asks: "Is customer a member?"
   2. If yes: Search customer → Select
   3. If no: Click "Create" → Enter name & phone → Create OR select "Others"
   4. Selected customer displayed
   5. Click plus button on products → Products added to order
   6. Adjust quantities if needed
   7. Click "Confirm Order" → Order saved, appears in recent revenue list
   8. If error: Click [Edit] or [Delete] on recent revenue entry

10. INTEGRATION:
    - When order confirmed with customer: Update customer purchaseCount
    - Check loyalty program: If purchaseCount % 10 === 0, increment freeDrinkEarned
    - Show notification and send email (if customer has email)
    - Update revenue statistics automatically
```

#### 9.2.5. Module Quản Lý Khách Hàng (Customer Management)

**Chức Năng:**
- Customer list management
- Quick customer creation during sales
- Customer details với purchase history
- Purchase count tracking
- Loyalty program: Buy 10 times → Get 1 free drink
- Email notification when reaching 10 purchases
- In-app notification
- Call reminder (optional)

**UI Components:**
- Customer list table (cho admin view)
- Customer search với autocomplete (cho sales)
- Quick create customer dialog (Name, Phone)
- Customer detail page
- Purchase history
- Loyalty badge/indicator
- Free drink notification banner

**Data Structure:**
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

**Tích Hợp Với Module Bán Hàng:**
- Khi đơn hàng được xác nhận với khách hàng:
  - Increment `purchaseCount`
  - Check if `purchaseCount % 10 === 0`
  - If yes: Increment `freeDrinkEarned`, show notification, send email (if email exists)
  - Update `lastPurchaseDate`

**Loyalty Logic:**
```typescript
// Khi đơn hàng hoàn thành
const updateLoyalty = (customerId: string) => {
  const customer = getCustomer(customerId);
  customer.purchaseCount += 1;
  customer.lastPurchaseDate = new Date();
  
  // Kiểm tra nếu đủ 10 lần mua
  if (customer.purchaseCount % 10 === 0) {
    customer.freeDrinkEarned += 1;
    
    // Gửi email thông báo
    if (customer.email) {
      sendEmail(customer.email, {
        subject: 'Chúc mừng! Bạn đã nhận được 1 ly miễn phí',
        body: `Bạn đã mua đủ 10 lần. Bạn được tặng 1 ly miễn phí!`
      });
    }
    
    // Hiển thị thông báo trong app
    toast.success(`${customer.name} đã nhận được 1 ly miễn phí!`);
  }
  
  // Lưu khách hàng
  updateCustomer(customer);
};
```

**Features:**
- Auto-increment purchase count khi hoàn thành đơn hàng
- Email notification với template
- In-app notification banner
- Free drink redemption tracking
- Customer search với phone/name autocomplete
- Quick create trong luồng bán hàng

#### 9.2.6. Module AI Assistant (Docs với AI)

**Chức Năng:**
- Menu docs tích hợp AI
- Hỏi đáp về quy trình, chính sách
- AI đưa ra phương án giải quyết
- Search trong docs
- Chat interface

**UI Components:**
- Chat interface
- Message list
- Input với send button
- Loading indicator
- Suggested questions
- Document viewer

**Features:**
- Integration với AI API (OpenAI, Claude, hoặc local LLM)
- Context-aware responses
- Document search
- Conversation history
- Export conversation

**Data Structure:**
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string[]; // Related document IDs
  tokensUsed?: number; // For cost tracking
}

interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  embedding?: number[]; // For semantic search
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

**AI API Integration Chi Tiết:**

**1. OpenAI Integration:**
```typescript
// lib/services/ai/openai.service.ts
import OpenAI from 'openai';

export class OpenAIService {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }
  
  async chat(messages: ChatMessage[], context?: string): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini', // Hoặc 'gpt-3.5-turbo' để tiết kiệm
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    return response.choices[0]?.message?.content || '';
  }
  
  private buildSystemPrompt(context?: string): string {
    return `Bạn là trợ lý AI chuyên về quản lý coffee shop. 
Bạn giúp người dùng trả lời câu hỏi về quy trình, chính sách, và đưa ra giải pháp.
${context ? `\n\nContext từ documents:\n${context}` : ''}
Hãy trả lời ngắn gọn, rõ ràng và hữu ích.`;
  }
}
```

**2. Claude Integration (Anthropic):**
```typescript
// lib/services/ai/claude.service.ts
import Anthropic from '@anthropic-ai/sdk';

export class ClaudeService {
  private client: Anthropic;
  
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }
  
  async chat(messages: ChatMessage[], context?: string): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    
    const response = await this.client.messages.create({
      model: 'claude-3-haiku-20240307', // Hoặc 'claude-3-sonnet' cho tốt hơn
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    });
    
    return response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : '';
  }
  
  private buildSystemPrompt(context?: string): string {
    return `Bạn là trợ lý AI chuyên về quản lý coffee shop.
${context ? `\n\nContext:\n${context}` : ''}
Trả lời ngắn gọn, thực tế và hữu ích.`;
  }
}
```

**3. Local LLM Integration (Ollama/LLaMA):**
```typescript
// lib/services/ai/local-llm.service.ts
export class LocalLLMService {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }
  
  async chat(messages: ChatMessage[], context?: string): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3', // Hoặc 'mistral', 'phi', etc.
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        stream: false,
      }),
    });
    
    const data = await response.json();
    return data.message?.content || '';
  }
  
  private buildSystemPrompt(context?: string): string {
    return `Bạn là trợ lý AI cho coffee shop.
${context ? `\n\nContext:\n${context}` : ''}
Trả lời ngắn gọn và hữu ích.`;
  }
}
```

**4. AI Service Factory:**
```typescript
// lib/services/ai/ai-service.factory.ts
import { OpenAIService } from './openai.service';
import { ClaudeService } from './claude.service';
import { LocalLLMService } from './local-llm.service';

export type AIProvider = 'openai' | 'claude' | 'local';

export interface AIService {
  chat(messages: ChatMessage[], context?: string): Promise<string>;
}

export class AIServiceFactory {
  static create(provider: AIProvider, config: AIConfig): AIService {
    switch (provider) {
      case 'openai':
        if (!config.apiKey) throw new Error('OpenAI API key required');
        return new OpenAIService(config.apiKey);
      
      case 'claude':
        if (!config.apiKey) throw new Error('Claude API key required');
        return new ClaudeService(config.apiKey);
      
      case 'local':
        return new LocalLLMService();
      
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
```

**Context-Aware Responses Implementation:**

**1. Document Search & Retrieval:**
```typescript
// lib/services/ai/document-search.service.ts
export class DocumentSearchService {
  private documents: Document[];
  
  constructor(documents: Document[]) {
    this.documents = documents;
  }
  
  // Simple keyword search (cho MVP)
  searchRelevant(query: string, limit: number = 3): Document[] {
    const queryLower = query.toLowerCase();
    
    return this.documents
      .map(doc => ({
        doc,
        score: this.calculateRelevance(doc, queryLower),
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.doc);
  }
  
  private calculateRelevance(doc: Document, query: string): number {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const tagsLower = doc.tags.join(' ').toLowerCase();
    
    // Title match (highest weight)
    if (titleLower.includes(query)) score += 10;
    
    // Tag match
    if (tagsLower.includes(query)) score += 5;
    
    // Content match
    const queryWords = query.split(' ');
    queryWords.forEach(word => {
      if (contentLower.includes(word)) score += 1;
    });
    
    return score;
  }
  
  // Semantic search với embeddings (nâng cao)
  async semanticSearch(query: string, limit: number = 3): Promise<Document[]> {
    // Cần embedding model (OpenAI embeddings, hoặc local)
    const queryEmbedding = await this.getEmbedding(query);
    
    return this.documents
      .map(doc => ({
        doc,
        similarity: this.cosineSimilarity(queryEmbedding, doc.embedding || []),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.doc);
  }
  
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  private async getEmbedding(text: string): Promise<number[]> {
    // Implementation với OpenAI embeddings API
    // Hoặc local embedding model
    // Return vector representation
    return [];
  }
}
```

**2. Context Builder:**
```typescript
// lib/services/ai/context-builder.service.ts
export class ContextBuilderService {
  private documentSearch: DocumentSearchService;
  
  constructor(documents: Document[]) {
    this.documentSearch = new DocumentSearchService(documents);
  }
  
  async buildContext(
    userQuery: string,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    // 1. Tìm relevant documents
    const relevantDocs = this.documentSearch.searchRelevant(userQuery, 3);
    
    // 2. Extract key information từ conversation history
    const recentContext = this.extractRecentContext(conversationHistory);
    
    // 3. Build context string
    let context = '';
    
    if (relevantDocs.length > 0) {
      context += 'Thông tin liên quan từ documents:\n\n';
      relevantDocs.forEach((doc, index) => {
        context += `${index + 1}. ${doc.title}\n`;
        context += `${doc.content.substring(0, 200)}...\n\n`;
      });
    }
    
    if (recentContext) {
      context += `\nContext từ cuộc trò chuyện trước:\n${recentContext}\n`;
    }
    
    return context;
  }
  
  private extractRecentContext(messages: ChatMessage[]): string {
    // Lấy 3-5 messages gần nhất
    const recent = messages.slice(-5);
    return recent
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
  }
}
```

**3. AI Chat Service với Context:**
```typescript
// lib/services/ai/ai-chat.service.ts
export class AIChatService {
  private aiService: AIService;
  private contextBuilder: ContextBuilderService;
  private documents: Document[];
  
  constructor(
    provider: AIProvider,
    config: AIConfig,
    documents: Document[]
  ) {
    this.aiService = AIServiceFactory.create(provider, config);
    this.documents = documents;
    this.contextBuilder = new ContextBuilderService(documents);
  }
  
  async sendMessage(
    userMessage: string,
    conversationHistory: ChatMessage[]
  ): Promise<ChatMessage> {
    try {
      // 1. Build context từ documents và history
      const context = await this.contextBuilder.buildContext(
        userMessage,
        conversationHistory
      );
      
      // 2. Prepare messages
      const messages: ChatMessage[] = [
        ...conversationHistory,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: userMessage,
          timestamp: new Date(),
        },
      ];
      
      // 3. Call AI service với context
      const response = await this.aiService.chat(messages, context);
      
      // 4. Return assistant message
      return {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        context: context ? ['context'] : undefined,
      };
    } catch (error) {
      console.error('AI chat error:', error);
      throw new Error('Không thể kết nối với AI. Vui lòng thử lại.');
    }
  }
}
```

**4. Redux Slice cho AI Chat:**
```typescript
// store/slices/ai-chat.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIChatService } from '@/lib/services/ai/ai-chat.service';

interface AIChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  provider: AIProvider;
  config: AIConfig;
}

const initialState: AIChatState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
  provider: 'openai', // hoặc từ settings
  config: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000,
  },
};

export const sendAIMessage = createAsyncThunk(
  'aiChat/sendMessage',
  async (
    { message, conversationId }: { message: string; conversationId?: string },
    { getState }
  ) => {
    const state = getState() as { aiChat: AIChatState; documents: { documents: Document[] } };
    const { provider, config } = state.aiChat;
    const { documents } = state.documents;
    
    const aiService = new AIChatService(provider, config, documents);
    const conversation = state.aiChat.conversations.find(
      c => c.id === conversationId || c.id === state.aiChat.currentConversationId
    );
    
    const history = conversation?.messages || [];
    const response = await aiService.sendMessage(message, history);
    
    return {
      conversationId: conversationId || conversation?.id || crypto.randomUUID(),
      userMessage: {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
      },
      assistantMessage: response,
    };
  }
);

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    createConversation: (state) => {
      const newConv: Conversation = {
        id: crypto.randomUUID(),
        title: 'Cuộc trò chuyện mới',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.conversations.push(newConv);
      state.currentConversationId = newConv.id;
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    setProvider: (state, action: PayloadAction<AIProvider>) => {
      state.provider = action.payload;
      state.config.provider = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAIMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { conversationId, userMessage, assistantMessage } = action.payload;
        
        let conversation = state.conversations.find(c => c.id === conversationId);
        
        if (!conversation) {
          conversation = {
            id: conversationId,
            title: userMessage.content.substring(0, 50),
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          state.conversations.push(conversation);
        }
        
        conversation.messages.push(userMessage, assistantMessage);
        conversation.updatedAt = new Date();
        state.currentConversationId = conversationId;
      })
      .addCase(sendAIMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Có lỗi xảy ra';
      });
  },
});

export const { createConversation, setCurrentConversation, setProvider } = aiChatSlice.actions;
export default aiChatSlice.reducer;
```

**5. React Component với Context-Aware:**
```typescript
// components/ai-chat/ai-chat-interface.tsx
'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendAIMessage, createConversation } from '@/store/slices/ai-chat.slice';

export function AIChatInterface() {
  const dispatch = useAppDispatch();
  const { conversations, currentConversationId, isLoading } = useAppSelector(
    state => state.aiChat
  );
  const [input, setInput] = useState('');
  
  const currentConversation = conversations.find(
    c => c.id === currentConversationId
  );
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!currentConversationId) {
      dispatch(createConversation());
    }
    
    const message = input;
    setInput('');
    
    await dispatch(
      sendAIMessage({
        message,
        conversationId: currentConversationId || undefined,
      })
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation?.messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              'p-3 rounded-lg',
              msg.role === 'user'
                ? 'bg-primary text-white ml-auto max-w-[80%]'
                : 'bg-muted mr-auto max-w-[80%]'
            )}
          >
            <p>{msg.content}</p>
            {msg.context && (
              <p className="text-xs mt-2 opacity-70">
                Đã sử dụng context từ documents
              </p>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LoadingSpinner />
            <span>AI đang suy nghĩ...</span>
          </div>
        )}
      </div>
      
      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Hỏi về quy trình, chính sách..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading}>
            Gửi
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          AI sẽ tự động tìm thông tin liên quan từ documents
        </p>
      </div>
    </div>
  );
}
```

**6. Suggested Questions (Context-aware):**
```typescript
// components/ai-chat/suggested-questions.tsx
export function SuggestedQuestions({ onSelect }: { onSelect: (q: string) => void }) {
  const { documents } = useAppSelector(state => state.documents);
  
  const suggestedQuestions = [
    'Làm thế nào để thêm sản phẩm mới?',
    'Quy trình xử lý đơn hàng takeaway?',
    'Cách tính lợi nhuận?',
    'Làm sao để quản lý khách hàng VIP?',
  ];
  
  // Context-aware: Suggest based on available documents
  const contextAwareQuestions = documents.length > 0
    ? [
        ...suggestedQuestions,
        `Có bao nhiêu documents về quy trình?`,
        'Tìm thông tin về chính sách khách hàng',
      ]
    : suggestedQuestions;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
      {contextAwareQuestions.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelect(question)}
          className="text-left p-3 border rounded-lg hover:bg-muted transition"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
```

**7. Environment Variables:**
```typescript
// .env.local
NEXT_PUBLIC_AI_PROVIDER=openai # hoặc 'claude', 'local'
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_LOCAL_LLM_URL=http://localhost:11434
```

**8. Error Handling & Fallback:**
```typescript
// lib/services/ai/ai-service-with-fallback.ts
export class AIServiceWithFallback {
  private primaryService: AIService;
  private fallbackService?: AIService;
  
  async chat(messages: ChatMessage[], context?: string): Promise<string> {
    try {
      return await this.primaryService.chat(messages, context);
    } catch (error) {
      console.error('Primary AI service failed:', error);
      
      if (this.fallbackService) {
        try {
          return await this.fallbackService.chat(messages, context);
        } catch (fallbackError) {
          console.error('Fallback service also failed:', fallbackError);
        }
      }
      
      // Ultimate fallback: return helpful message
      return 'Xin lỗi, tôi không thể kết nối với AI service lúc này. Vui lòng thử lại sau hoặc liên hệ support.';
    }
  }
}
```

**Cost Optimization:**
```typescript
// lib/services/ai/cost-tracker.service.ts
export class CostTrackerService {
  private costs: { [key: string]: number } = {};
  
  trackTokens(provider: AIProvider, tokens: number) {
    const costPerToken = {
      openai: { input: 0.00015 / 1000, output: 0.0006 / 1000 }, // gpt-4o-mini
      claude: { input: 0.00025 / 1000, output: 0.00125 / 1000 }, // claude-3-haiku
      local: { input: 0, output: 0 }, // Free
    };
    
    // Simplified: assume 50/50 input/output
    const cost = (tokens / 2) * (costPerToken[provider].input + costPerToken[provider].output);
    this.costs[provider] = (this.costs[provider] || 0) + cost;
  }
  
  getTotalCost(): number {
    return Object.values(this.costs).reduce((sum, cost) => sum + cost, 0);
  }
}
```

#### 9.2.7. Module Cài Đặt Hồ Sơ (Profile Settings)

**Chức Năng:**
- Chi tiết hồ sơ: Xem thông tin cửa hàng, chủ shop hiện tại
- Cập nhật hồ sơ:
  - Thay đổi thông tin cửa hàng (tên cửa hàng, địa chỉ, số điện thoại, email)
  - Thay đổi thông tin chủ shop (tên, số điện thoại, email)
  - Thay đổi ảnh đại diện (avatar)
  - Thay đổi mật khẩu
- Đăng xuất: Logout và xóa session

**UI Components:**
- Profile page với tabs:
  - Tab "Thông tin cửa hàng": Form cập nhật thông tin cửa hàng
  - Tab "Thông tin cá nhân": Form cập nhật thông tin chủ shop
  - Tab "Bảo mật": Form thay đổi mật khẩu
- Avatar upload component với image crop
- Form validation với React Hook Form + Zod
- Logout button với confirmation dialog
- Success/Error toast notifications

**Data Structure:**
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

**Form Schemas:**
```typescript
const ShopProfileSchema = z.object({
  shopName: z.string().min(1, 'Tên cửa hàng không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  phone: z.string().regex(phoneRegex, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  description: z.string().optional(),
});

const OwnerProfileSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phone: z.string().regex(phoneRegex, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
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

**Features:**
- Upload và crop ảnh đại diện
- Real-time form validation
- Password strength indicator
- Confirmation dialog khi logout
- Auto-save profile changes
- Toast notifications cho mọi actions
- Image preview trước khi upload

**Flow:**
1. Vào trang Settings/Profile
2. Chọn tab muốn cập nhật:
   - Thông tin cửa hàng: Cập nhật tên, địa chỉ, SĐT, email cửa hàng
   - Thông tin cá nhân: Cập nhật tên, SĐT, email, avatar chủ shop
   - Bảo mật: Thay đổi mật khẩu (yêu cầu mật khẩu hiện tại)
3. Submit form → Validate → Save to localStorage/Redux
4. Hiển thị toast success/error
5. Logout: Click button → Confirmation → Clear auth data → Redirect to login

#### 9.2.8. Module Ghi Chú Nhanh (Take Note)

**Chức Năng:**
- Tạo ghi chú nhanh (quick notes)
- Xem danh sách ghi chú
- Sửa/xóa ghi chú
- Tìm kiếm ghi chú
- Phân loại ghi chú (tags/categories)
- Pin/Unpin ghi chú quan trọng
- Sắp xếp theo ngày tạo, ngày sửa, hoặc alphabet

**UI Components:**
- Quick note input: Textarea với placeholder "Ghi chú nhanh..."
- Note list: Grid hoặc list view
- Note card: Hiển thị title, content, tags, date
- Note editor: Dialog/modal để edit note
- Search bar: Tìm kiếm trong notes
- Filter: Lọc theo tags, date range
- Sort dropdown: Sắp xếp notes
- Pin icon: Pin/unpin note
- Delete button: Xóa note với confirmation

**Data Structure:**
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string; // Optional: màu sắc để phân biệt
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

**Form Schema:**
```typescript
const NoteSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(100),
  content: z.string().max(5000, 'Nội dung không được quá 5000 ký tự'),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
});
```

**Features:**
- Quick create: Tạo note nhanh từ textarea ở header/sidebar
- Rich text support (optional): Bold, italic, lists
- Auto-save: Tự động lưu khi typing (debounce)
- Character counter: Hiển thị số ký tự đã nhập
- Tag autocomplete: Gợi ý tags khi typing
- Pin to top: Pinned notes luôn hiển thị ở đầu
- Search: Full-text search trong title và content
- Filter by tags: Lọc notes theo tags
- Sort options: Nhiều cách sắp xếp
- Delete with undo: Xóa với option undo trong 5 giây
- Export notes: Export to text file (optional)

**UI/UX Flow:**
1. Quick Note Input:
   - User type vào textarea ở header/sidebar
   - Click "Lưu" hoặc Enter → Tạo note mới
   - Auto-generate title từ first line nếu không có title

2. View Notes:
   - Hiển thị danh sách notes (pinned ở đầu)
   - Click note → Mở editor dialog
   - Hover → Hiển thị actions (edit, delete, pin)

3. Edit Note:
   - Click note → Mở dialog với form
   - Edit title, content, tags
   - Click "Lưu" → Update note
   - Click "Hủy" → Đóng dialog

4. Delete Note:
   - Click delete icon → Confirmation dialog
   - Confirm → Xóa note → Toast với undo option
   - Click undo trong 5 giây → Restore note

5. Search & Filter:
   - Type vào search bar → Filter notes real-time
   - Select tags → Filter by tags
   - Select sort option → Re-sort notes

**Mock Data:**
```json
// lib/mock-data/notes.json
[
  {
    "id": "1",
    "title": "Nhắc nhở đặt hàng cà phê",
    "content": "Đặt 10kg cà phê Arabica vào thứ 2 tuần sau",
    "tags": ["mua hàng", "cà phê"],
    "isPinned": true,
    "color": "#FFE5B4",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "2",
    "title": "Khách hàng VIP - Nguyễn Văn A",
    "content": "Khách hàng này thích cà phê đen, không đường. Nhớ phục vụ nhanh.",
    "tags": ["khách hàng", "VIP"],
    "isPinned": false,
    "createdAt": "2024-01-14T14:30:00Z",
    "updatedAt": "2024-01-14T14:30:00Z"
  }
]
```

**Redux Slice:**
```typescript
// store/slices/notes.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotesState {
  notes: Note[];
  searchQuery: string;
  selectedTags: string[];
  sortBy: NoteSortBy;
}

const initialState: NotesState = {
  notes: [],
  searchQuery: '',
  selectedTags: [],
  sortBy: NoteSortBy.UPDATED_AT_DESC,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(n => n.id !== action.payload);
    },
    togglePin: (state, action: PayloadAction<string>) => {
      const note = state.notes.find(n => n.id === action.payload);
      if (note) {
        note.isPinned = !note.isPinned;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
    setSortBy: (state, action: PayloadAction<NoteSortBy>) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  addNote,
  updateNote,
  deleteNote,
  togglePin,
  setSearchQuery,
  setSelectedTags,
  setSortBy,
} = notesSlice.actions;

export default notesSlice.reducer;
```

### 9.3. Database Schema (Gợi ý)

```typescript
// Revenue Table
interface Revenue {
  id: string;
  orderId?: string;
  amount: number;
  date: Date;
  type: 'sale' | 'other';
  description?: string;
}

// Expense Table
interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description: string;
}

// Product Table
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  isAvailable: boolean;
}

// Order Table
interface Order {
  id: string;
  customerId?: string;
  items: OrderItem[];
  total: number;
  type: 'dine-in' | 'takeaway';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

// Customer Table
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  purchaseCount: number;
  freeDrinkEarned: number;
  freeDrinkUsed: number;
}

// Shop Profile Table
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

// Owner Profile Table
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

// Note Table
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
```

### 9.4. API Endpoints (Gợi ý)

```
GET    /api/statistics/revenue?startDate=&endDate=
GET    /api/statistics/expense?startDate=&endDate=
GET    /api/statistics/summary

GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id

GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id
GET    /api/orders/:id

GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
GET    /api/customers/:id
GET    /api/customers/:id/purchases
POST   /api/customers/:id/redeem-free-drink

POST   /api/ai/chat
GET    /api/ai/documents
GET    /api/ai/conversations
POST   /api/ai/conversations
DELETE /api/ai/conversations/:id
GET    /api/ai/conversations/:id
POST   /api/ai/search-documents?q=
GET    /api/ai/suggested-questions
POST   /api/ai/embedding (for semantic search)

GET    /api/profile/shop
PUT    /api/profile/shop
GET    /api/profile/owner
PUT    /api/profile/owner
POST   /api/profile/avatar
POST   /api/profile/change-password
POST   /api/auth/logout

GET    /api/notes
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id
PATCH  /api/notes/:id/pin
GET    /api/notes/search?q=
```

### 9.5. UI/UX Flow (Tối Ưu cho Mini Project)

**Navigation Flow (Gom menu):**

**1. Login → Dashboard (Trang chủ)**
- Hiển thị ngay: Stat cards + Charts + Recent items
- 1 click để xem tất cả thông tin quan trọng

**2. Quản lý Tài chính (/finance)**
- Tab "Thống kê": Charts + Stats (đã có ở dashboard, có thể bỏ)
- Tab "Chi tiêu": List + Button "Thêm" nổi bật
- **Chỉ 1 menu item** thay vì 2 menu riêng

**3. Bán hàng (/sales)**
- Tab "Menu": Grid products + Button "Thêm sản phẩm"
- Tab "Đơn hàng": List + Button "Tạo đơn" (Floating Action Button)
- **Gom Products + Orders vào 1 trang**

**4. Khách hàng (/customers)**
- List view với search bar
- Button "Thêm khách hàng" ở header
- Click item → Detail page (lịch sử + loyalty)
- **Tất cả trong 1 trang, không tách riêng**

**5. Ghi chú (/notes)**
- Quick input ở header (desktop) hoặc floating button (mobile)
- List notes với search/filter
- **Luôn accessible, không cần vào menu sâu**

**6. Cài đặt (/settings)**
- 3 tabs: Cửa hàng | Cá nhân | Bảo mật
- Button "Đăng xuất" ở footer
- **Gom tất cả settings vào 1 trang**

**Optimized User Flows:**

**Dashboard Flow (Tối ưu):**
1. Login → Dashboard (tự động)
2. Xem ngay: Stats + Charts + Recent (không cần click)
3. Quick actions: Click stat card → Navigate to detail
4. **0 clicks để xem overview**

**Finance Flow (Gom lại):**
1. Click "Quản lý Tài chính" (1 click)
2. Tab "Thống kê": Xem charts (nếu cần chi tiết hơn dashboard)
3. Tab "Chi tiêu": Click "Thêm" → Form → Submit (2 clicks)
4. **Tối đa 3 clicks** cho mọi thao tác

**Sales Flow (Gom lại):**
1. Click "Bán hàng" (1 click)
2. Tab "Menu": Xem products, click "Thêm" → Form (2 clicks)
3. Tab "Đơn hàng": Click FAB "Tạo đơn" → Chọn products → Submit (3 clicks)
4. **Tất cả trong 1 trang, không cần navigate nhiều**

**Customer Flow (Tối ưu):**
1. Click "Khách hàng" (1 click)
2. Search/Filter ngay trên trang
3. Click customer → Detail page (2 clicks)
4. Xem lịch sử + Loyalty status (không cần navigate thêm)
5. **Tất cả info trong 1 detail page**

**Note Flow (Quick access):**
1. **Option 1**: Type vào quick input ở header → Enter (0 clicks, chỉ type)
2. **Option 2**: Click "Ghi chú" → List → Click note → Edit (2 clicks)
3. **Luôn accessible, không cần vào menu**

**Settings Flow (Gom lại):**
1. Click avatar → "Cài đặt" (2 clicks)
2. Chọn tab: Cửa hàng | Cá nhân | Bảo mật
3. Edit → Submit (1 click)
4. **Tất cả settings trong 1 trang**

**Mobile-Specific Optimizations:**

**Bottom Navigation (Always visible):**
- 6 main items: Trang chủ, Tài chính, Bán hàng, Khách hàng, Ghi chú, Cài đặt
- Active state rõ ràng
- Badge notifications (nếu có)

**Swipe Gestures:**
- Swipe left/right để chuyển tabs
- Swipe down để refresh
- Long press để quick actions

**Touch Optimizations:**
- Large buttons (min 44x44px)
- Generous spacing (8-12px)
- Full-width inputs trên mobile
- Sticky headers khi scroll

**Desktop-Specific Optimizations:**

**Sidebar Navigation:**
- Fixed sidebar với main items
- Collapsible sub-items
- Active state highlighting
- Quick stats trong sidebar

**Keyboard Shortcuts:**
- `Ctrl/Cmd + K`: Search
- `Ctrl/Cmd + N`: New item (context-aware)
- `Ctrl/Cmd + /`: Quick note
- `Esc`: Close modals/drawers

**Multi-column Layout:**
- Stats: 4 columns
- Charts: 2 columns (side by side)
- Tables: Full width với horizontal scroll nếu cần

**Profile Settings Flow:**
1. Click avatar/user menu → "Cài đặt" hoặc "Hồ sơ"
2. Profile page với 3 tabs:
   - **Thông tin cửa hàng**: Form cập nhật shop info
   - **Thông tin cá nhân**: Form cập nhật owner info + upload avatar
   - **Bảo mật**: Form thay đổi mật khẩu
3. Chọn tab → Điền form → Submit → Validate → Save → Toast success
4. Upload avatar: Click avatar → Chọn ảnh → Crop → Save → Preview
5. Logout: Click "Đăng xuất" → Confirmation dialog → Confirm → Clear auth → Redirect login

**Take Note Flow:**
1. Quick Note (Header/Sidebar):
   - Type vào textarea "Ghi chú nhanh..."
   - Enter hoặc click "Lưu" → Tạo note mới → Toast success
2. View Notes:
   - Vào trang "Ghi chú" → Hiển thị danh sách (pinned ở đầu)
   - Search: Type vào search bar → Filter real-time
   - Filter: Chọn tags → Filter by tags
   - Sort: Chọn sort option → Re-sort notes
3. Edit Note:
   - Click note card → Mở dialog với form
   - Edit title, content, tags → Click "Lưu" → Update → Toast success
4. Pin/Unpin:
   - Click pin icon trên note → Toggle pin → Note di chuyển lên/xuống
5. Delete Note:
   - Click delete icon → Confirmation dialog → Confirm → Delete → Toast với undo
   - Click undo trong 5 giây → Restore note

### 9.6. Tính Năng Bổ Sung (Ideas)

1. **Inventory Management:**
   - Quản lý tồn kho nguyên liệu
   - Cảnh báo khi hết hàng
   - Auto-deduct khi bán hàng

2. **Employee Management:**
   - Quản lý nhân viên
   - Phân ca làm việc
   - Tính lương

3. **Marketing:**
   - Gửi SMS/Email khuyến mãi
   - Loyalty points system
   - Referral program

4. **Reports:**
   - Báo cáo doanh thu theo sản phẩm
   - Báo cáo khách hàng VIP
   - Báo cáo chi tiêu theo category

5. **Notifications:**
   - Push notifications
   - Email notifications
   - SMS notifications

6. **Analytics:**
   - Best selling products
   - Peak hours analysis
   - Customer retention rate

7. **Multi-location:**
   - Quản lý nhiều cửa hàng
   - So sánh performance
   - Centralized reporting

### 9.7. Technology Stack Bổ Sung

**Backend (Nếu cần):**
- Next.js API Routes hoặc tách riêng
- Database: PostgreSQL, MongoDB, hoặc Supabase
- Authentication: NextAuth.js hoặc Clerk
- File storage: Cloudinary, AWS S3

**AI Integration:**
- OpenAI API hoặc Anthropic Claude
- Vector database cho document search (Pinecone, Weaviate)
- LangChain cho RAG (Retrieval Augmented Generation)

**Third-party Services:**
- Email: Resend, SendGrid
- SMS: Twilio, AWS SNS
- Payment: Stripe, VNPay

### 9.8. Implementation Priority

**Phase 1 (MVP):**
1. Statistics dashboard với charts
2. Expense management
3. Product menu
4. Order management (basic)
5. Customer management (basic)
6. Profile Settings (cơ bản: update shop info, owner info, change password, logout)
7. Take Note (cơ bản: create, view, edit, delete notes)

**Phase 2:**
1. Loyalty program
2. Email notifications
3. Advanced statistics
4. Reports
5. Profile Settings (nâng cao: avatar upload với crop, image preview)
6. Take Note (nâng cao: search, filter, sort, pin, tags, colors)

**Phase 3:**
1. AI assistant
2. Advanced features
3. Mobile app (nếu cần)
4. Multi-location support

### 9.9. Quick Implementation Tips (4-5 giờ)

**Time Allocation:**
- Setup & Structure: 30 phút
- Core Components: 1 giờ
- Pages & Navigation: 1.5 giờ
- Forms & CRUD: 1 giờ
- Charts & Stats: 30 phút
- Styling & Responsive: 1 giờ
- Testing & Polish: 30 phút

**Code Reuse Strategy:**

**1. Shared Layout Component:**
```typescript
// components/layouts/main-layout.tsx
export function MainLayout({ children, title }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 p-4 md:p-6">
          <h1 className="mb-4">{title}</h1>
          {children}
        </main>
      </div>
      <BottomNav className="md:hidden" />
    </div>
  );
}
```

**2. Reusable Tab Container:**
```typescript
// components/tabs-container.tsx
export function TabsContainer({ tabs, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

// Usage:
<TabsContainer
  tabs={[
    { value: 'stats', label: 'Thống kê', content: <StatsContent /> },
    { value: 'expenses', label: 'Chi tiêu', content: <ExpensesContent /> },
  ]}
/>
```

**3. Generic Form Modal:**
```typescript
// components/form-modal.tsx
export function FormModal({ 
  open, 
  onClose, 
  title, 
  schema, 
  defaultValues,
  onSubmit 
}) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues });
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Render fields based on schema */}
            <DialogFooter>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

**4. Reusable Data Table:**
```typescript
// components/data-table.tsx
export function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete,
  searchable = true 
}) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);
  
  return (
    <div>
      {searchable && (
        <Input 
          placeholder="Tìm kiếm..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
      )}
      {/* Mobile: Card view */}
      <div className="md:hidden space-y-2">
        {filtered.map(item => (
          <Card key={item.id} className="p-4">
            {/* Render item */}
          </Card>
        ))}
      </div>
      {/* Desktop: Table view */}
      <Table className="hidden md:table">
        {/* Table content */}
      </Table>
    </div>
  );
}
```

**5. Quick Stat Cards:**
```typescript
// components/stat-card.tsx
export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  onClick 
}) {
  return (
    <Card 
      className={cn("p-4 cursor-pointer hover:shadow-md transition", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{formatCurrency(value)}</p>
          {trend && <p className="text-xs text-green-600">{trend}</p>}
        </div>
        {icon && <div className="text-4xl opacity-20">{icon}</div>}
      </div>
    </Card>
  );
}

// Usage:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Tổng thu" value={totalRevenue} icon={<DollarSign />} />
  <StatCard title="Tổng chi" value={totalExpense} icon={<TrendingDown />} />
  <StatCard title="Lợi nhuận" value={profit} icon={<TrendingUp />} />
</div>
```

**6. Responsive Utilities:**
```typescript
// lib/responsive.ts
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);
  
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};
```

**Quick Component Library (Copy-paste ready):**

**1. Bottom Navigation:**
```typescript
// components/bottom-nav.tsx
export function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: Home, label: 'Trang chủ' },
    { href: '/finance', icon: DollarSign, label: 'Tài chính' },
    { href: '/sales', icon: ShoppingCart, label: 'Bán hàng' },
    { href: '/customers', icon: Users, label: 'Khách hàng' },
    { href: '/notes', icon: StickyNote, label: 'Ghi chú' },
    { href: '/settings', icon: Settings, label: 'Cài đặt' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
      <div className="grid grid-cols-6 h-16">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center",
              pathname === item.href && "text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

**2. Floating Action Button:**
```typescript
// components/fab.tsx
export function FAB({ onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl transition z-50"
      aria-label={label}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
```

**3. Quick Note Input (Header):**
```typescript
// components/quick-note-input.tsx
export function QuickNoteInput() {
  const [value, setValue] = useState('');
  const dispatch = useAppDispatch();
  
  const handleSubmit = () => {
    if (!value.trim()) return;
    dispatch(addNote({
      id: crypto.randomUUID(),
      title: value.split('\n')[0] || 'Ghi chú',
      content: value,
      tags: [],
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    setValue('');
    toast.success('Đã lưu ghi chú');
  };
  
  return (
    <div className="hidden lg:flex items-center gap-2 max-w-xs">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ghi chú nhanh..."
        className="min-h-[40px] max-h-[80px]"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
        }}
      />
      <Button onClick={handleSubmit} size="sm">Lưu</Button>
    </div>
  );
}
```

**CSS Utilities (Tailwind):**
```css
/* Responsive grid patterns */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.grid-stats {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4;
}

/* Touch-friendly buttons */
.btn-touch {
  @apply min-h-[44px] min-w-[44px] px-4 py-2;
}

/* Mobile-first spacing */
.container-mobile {
  @apply p-4 md:p-6 lg:p-8;
}
```

**Mock Data Quick Setup:**
```typescript
// lib/mock-data/index.ts - Export all mock data
export { default as users } from './users.json';
export { default as products } from './products.json';
export { default as customers } from './customers.json';
export { default as orders } from './orders.json';
export { default as expenses } from './expenses.json';
export { default as notes } from './notes.json';
export { default as shopProfile } from './shop-profile.json';
export { default as ownerProfile } from './owner-profile.json';
export { default as documents } from './documents.json'; // For AI
```

**AI Integration Quick Setup:**

**1. Install Dependencies:**
```bash
# Option 1: OpenAI
pnpm add openai

# Option 2: Claude
pnpm add @anthropic-ai/sdk

# Option 3: Local LLM (Ollama)
# No package needed, just install Ollama locally
```

**2. Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_AI_PROVIDER=openai # or 'claude', 'local'
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_LOCAL_LLM_URL=http://localhost:11434
```

**3. Quick AI Service Setup (MVP):**
```typescript
// lib/services/ai/simple-ai.service.ts - Simplified for MVP
export class SimpleAIService {
  async chat(message: string, context?: string): Promise<string> {
    const provider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai';
    
    if (provider === 'openai') {
      return this.chatWithOpenAI(message, context);
    } else if (provider === 'claude') {
      return this.chatWithClaude(message, context);
    } else {
      return this.chatWithLocal(message, context);
    }
  }
  
  private async chatWithOpenAI(message: string, context?: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Bạn là trợ lý AI cho coffee shop. ${context || ''}`,
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    const data = await response.json();
    return data.choices[0]?.message?.content || 'Xin lỗi, không thể trả lời.';
  }
  
  // Similar for Claude and Local...
}
```

**4. Mock Documents for Context:**
```json
// lib/mock-data/documents.json
[
  {
    "id": "1",
    "title": "Quy trình thêm sản phẩm mới",
    "content": "Để thêm sản phẩm mới: 1. Vào menu Bán hàng > Tab Menu sản phẩm 2. Click nút 'Thêm sản phẩm' 3. Điền thông tin: tên, mô tả, giá, loại 4. Upload ảnh (nếu có) 5. Click 'Lưu'",
    "category": "quy-trinh",
    "tags": ["sản phẩm", "thêm mới", "menu"]
  },
  {
    "id": "2",
    "title": "Xử lý đơn hàng takeaway",
    "content": "Quy trình: 1. Khách hàng chọn sản phẩm 2. Thêm vào giỏ hàng 3. Nhập thông tin khách hàng (nếu chưa có) 4. Xác nhận đơn hàng 5. Hệ thống tự động cập nhật doanh thu và số lượng bán",
    "category": "quy-trinh",
    "tags": ["đơn hàng", "takeaway", "bán hàng"]
  }
]
```

**5. Simple Context Search (No embeddings needed for MVP):**
```typescript
// lib/services/ai/simple-context.service.ts
export function findRelevantDocuments(query: string, documents: Document[]): Document[] {
  const queryLower = query.toLowerCase();
  
  return documents
    .filter(doc => {
      const titleMatch = doc.title.toLowerCase().includes(queryLower);
      const contentMatch = doc.content.toLowerCase().includes(queryLower);
      const tagMatch = doc.tags.some(tag => tag.toLowerCase().includes(queryLower));
      return titleMatch || contentMatch || tagMatch;
    })
    .slice(0, 3); // Top 3 most relevant
}

export function buildContext(query: string, documents: Document[]): string {
  const relevant = findRelevantDocuments(query, documents);
  
  if (relevant.length === 0) return '';
  
  return relevant
    .map((doc, i) => `${i + 1}. ${doc.title}\n${doc.content.substring(0, 200)}...`)
    .join('\n\n');
}
```

**Priority Order (Code trong 4-5 giờ):**

1. **Setup (30 phút):**
   - Install dependencies
   - Setup Redux store
   - Create mock data files
   - Setup routing

2. **Layout (30 phút):**
   - Header component
   - Sidebar (desktop)
   - Bottom nav (mobile)
   - Main layout wrapper

3. **Dashboard (45 phút):**
   - Stat cards (4 cards)
   - 1-2 basic charts
   - Recent items list

4. **Finance Page (45 phút):**
   - Tabs container
   - Stats tab (reuse dashboard)
   - Expenses tab với table + form

5. **Sales Page (45 phút):**
   - Tabs container
   - Products tab (grid + form)
   - Orders tab (list + FAB)

6. **Customers Page (30 phút):**
   - List với search
   - Detail page (basic)

7. **Notes Page (30 phút):**
   - Quick input
   - List notes
   - Basic CRUD

8. **Settings Page (30 phút):**
   - Tabs container
   - 3 forms (shop, owner, password)

9. **AI Assistant (45 phút - Optional nhưng recommended):**
   - Setup AI service (OpenAI/Claude/Local)
   - Create documents mock data
   - Simple context search
   - Chat interface component
   - Redux slice cho conversations
   - Suggested questions

10. **Polish (30 phút):**
   - Responsive adjustments
   - Toast notifications
   - Loading states
   - Error handling

**Skip for MVP (Có thể làm sau):**
- Avatar upload với crop (dùng placeholder)
- Advanced search/filter
- Export functionality
- Email notifications
- Advanced charts (chỉ cần basic line/bar chart)
- Semantic search với embeddings (dùng keyword search cho MVP)
- Cost tracking (có thể thêm sau)

---

## 10. KẾT LUẬN

Source base hiện tại cung cấp một nền tảng vững chắc với:
- ✅ Design system hoàn chỉnh
- ✅ Animation system
- ✅ Chart system
- ✅ Form validation system
- ✅ Component library
- ✅ Code organization tốt

Với source base này, bạn có thể:
1. Sử dụng prompt ở mục 8 để generate lại source base
2. Phát triển dự án coffee shop management theo ý tưởng ở mục 9
3. Tùy chỉnh và mở rộng theo nhu cầu

**Lưu ý:**
- Bắt đầu với minimal packages (mục 7)
- Thêm packages khi cần thiết
- Follow code patterns đã có
- Maintain code quality với Biome.js
- Test thoroughly trước khi deploy

**Next Steps:**
1. Review và customize prompt ở mục 8
2. Generate source base mới
3. Plan implementation theo phases
4. Start với Phase 1 (MVP)
5. Iterate và improve

---

*Document created: 2024*
*Last updated: 2024*
