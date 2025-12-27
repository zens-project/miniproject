# Setup Guide - Coffee Shop Management

## ✅ What Has Been Created (Step 8)

### 1. **Monorepo Structure**
- ✅ Turborepo + pnpm workspace configured
- ✅ Root package.json with scripts
- ✅ Biome.js for linting/formatting
- ✅ TypeScript 5.7 strict mode

### 2. **Design System (packages/ui)**
- ✅ Tailwind CSS v4 with custom design system
- ✅ Color system (Primary, Neutral, Semantic colors)
- ✅ Typography scale (responsive)
- ✅ Spacing & dimensions
- ✅ 10 core UI components:
  - Button (5 variants with animations)
  - Input, Textarea, Label
  - Card (with Header, Content, Footer)
  - Dialog (modal)
  - Badge (5 variants)
  - Skeleton (loading state)
  - Tabs
  - Sonner (toast notifications)

### 3. **Next.js 15 App (apps/web)**
- ✅ App Router structure
- ✅ PWA manifest (native Next.js 15)
- ✅ Service Worker for offline support
- ✅ Beautiful landing page with:
  - Hero section with animations
  - Feature cards (6 features)
  - Stats section
  - Responsive footer
- ✅ Mobile-first responsive design
- ✅ Motion (Framer Motion) animations

### 4. **Icons & Assets**
- ✅ PWA icons moved to `/apps/web/public/icons/`
- ✅ Apple touch icon
- ✅ Favicon configured

## 🚀 Next Steps - Install & Run

### Step 1: Install Dependencies

```bash
# Make sure you're in the base2 directory
cd /Users/user/Public/Project/Zen-s/thiTho/base2

# Install pnpm globally if not installed
npm install -g pnpm@10.4.1

# Install all dependencies (this will take a few minutes)
pnpm install
```

**Expected result**: All TypeScript errors will disappear after installation.

### Step 2: Run Development Server

```bash
# Start the dev server
pnpm dev
```

**Expected result**: 
- Server starts at `http://localhost:3000`
- Beautiful landing page with animations
- Mobile-responsive design
- All UI components working

### Step 3: Test Mobile Responsive

Open Chrome DevTools (F12) and:
1. Click the device toggle icon (Ctrl+Shift+M)
2. Select different devices (iPhone, iPad, etc.)
3. Test the responsive layout

**Expected behavior**:
- Mobile (<768px): Stack layout, large touch targets
- Tablet (768-1023px): 2-column grid
- Desktop (1024px+): 3-column grid

### Step 4: Test PWA

```bash
# Run with HTTPS (required for PWA)
cd apps/web
pnpm dev --experimental-https
```

Then:
1. Open in Chrome
2. Open DevTools > Application
3. Check "Manifest" tab - should show app info
4. Check "Service Workers" tab - should show registered worker

## 📋 What's Next - Remaining Features

### Phase 1: Authentication (Priority: High)
```
apps/web/app/(auth)/
├── login/
│   └── page.tsx          # Login form with validation
└── register/
    └── page.tsx          # Register form
```

**Tasks**:
- [ ] Create login page with React Hook Form + Zod
- [ ] Create register page
- [ ] Add authentication context
- [ ] Add protected route middleware
- [ ] Mock auth service with localStorage

### Phase 2: Dashboard (Priority: High)
```
apps/web/app/(protected)/
└── dashboard/
    └── page.tsx          # Dashboard with charts
```

**Tasks**:
- [ ] Create dashboard layout with sidebar
- [ ] Add Chart.js integration
- [ ] Create stat cards with animations
- [ ] Add revenue/expense charts
- [ ] Date range picker
- [ ] Mock data for charts

### Phase 3: Sales/POS (Priority: High)
```
apps/web/app/(protected)/sales/
└── page.tsx              # POS interface
```

**Tasks**:
- [ ] Create Grab-style product grid
- [ ] Customer selector with autocomplete
- [ ] Current order panel
- [ ] Order confirmation flow
- [ ] Recent revenue list
- [ ] Mock products with images

### Phase 4: Products Management
```
apps/web/app/(protected)/products/
├── page.tsx              # Product list
└── [id]/
    └── page.tsx          # Product detail/edit
```

**Tasks**:
- [ ] Product CRUD operations
- [ ] Image upload component
- [ ] Category filter
- [ ] Search functionality

### Phase 5: Customers Management
```
apps/web/app/(protected)/customers/
├── page.tsx              # Customer list
└── [id]/
    └── page.tsx          # Customer detail
```

**Tasks**:
- [ ] Customer CRUD operations
- [ ] Loyalty program tracking
- [ ] Purchase history
- [ ] Quick create dialog

### Phase 6: Expenses Management
```
apps/web/app/(protected)/expenses/
└── page.tsx              # Expense tracking
```

**Tasks**:
- [ ] Expense CRUD operations
- [ ] Category management
- [ ] Date filtering
- [ ] Export reports

### Phase 7: Redux Store Setup
```
apps/web/store/
├── index.ts              # Store configuration
├── hooks.ts              # Typed hooks
└── slices/
    ├── auth.slice.ts
    ├── products.slice.ts
    ├── orders.slice.ts
    ├── customers.slice.ts
    └── expenses.slice.ts
```

**Tasks**:
- [ ] Setup Redux Toolkit
- [ ] Configure Redux Persist
- [ ] Create slices for each feature
- [ ] Add async thunks
- [ ] Connect to components

### Phase 8: Mock Data System
```
apps/web/lib/
├── mock-data/
│   ├── users.json
│   ├── products.json
│   ├── customers.json
│   ├── orders.json
│   └── expenses.json
└── services/
    ├── mock-api.service.ts
    ├── auth.service.ts
    ├── product.service.ts
    ├── order.service.ts
    ├── customer.service.ts
    └── expense.service.ts
```

**Tasks**:
- [ ] Create mock JSON data files
- [ ] Create mock API service with delays
- [ ] Create service files for each feature
- [ ] Add localStorage persistence

## 🎨 UI/UX Guidelines

### Mobile-First Approach
1. **Design for mobile first** (320px-767px)
2. **Scale up for tablet** (768px-1023px)
3. **Enhance for desktop** (1024px+)

### Touch Targets
- Minimum 44x44px for all buttons
- 8-12px spacing between interactive elements
- Large, readable fonts (16px+ for body text)

### Animations
- Use Motion for page transitions
- Stagger animations for lists
- Hover effects on cards
- Loading states with skeletons

### Color Usage
- **Primary (Blue)**: Main actions, links
- **Positive (Green)**: Success, revenue
- **Negative (Red)**: Errors, expenses
- **Warning (Yellow)**: Warnings, alerts
- **Neutral (Gray)**: Text, borders, backgrounds

## 🔧 Development Workflow

### Adding a New Page

1. Create page file:
```bash
# For public pages
apps/web/app/your-page/page.tsx

# For protected pages
apps/web/app/(protected)/your-page/page.tsx
```

2. Use existing components:
```typescript
import { Button, Card, Input } from '@workspace/ui';
```

3. Add animations:
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

### Adding a New Component

1. Create in packages/ui:
```bash
packages/ui/src/components/your-component.tsx
```

2. Export in index:
```typescript
// packages/ui/src/index.ts
export * from './components/your-component';
```

3. Use in app:
```typescript
import { YourComponent } from '@workspace/ui';
```

## 📱 Testing Checklist

### Desktop (1024px+)
- [ ] All pages load correctly
- [ ] Sidebar navigation works
- [ ] Charts display properly
- [ ] Forms validate correctly
- [ ] Animations are smooth

### Tablet (768-1023px)
- [ ] Drawer menu works
- [ ] 2-column layouts display correctly
- [ ] Touch targets are adequate
- [ ] Charts are responsive

### Mobile (<768px)
- [ ] Bottom navigation works
- [ ] Stack layouts display correctly
- [ ] Touch targets are 44x44px minimum
- [ ] Text is readable (16px+)
- [ ] Forms are easy to use
- [ ] Charts scroll horizontally if needed

### PWA
- [ ] Manifest loads correctly
- [ ] Service worker registers
- [ ] App can be installed
- [ ] Works offline (after first visit)
- [ ] Icons display correctly

## 🐛 Troubleshooting

### TypeScript Errors
**Problem**: "Cannot find module" errors everywhere
**Solution**: Run `pnpm install` to install all dependencies

### CSS Not Loading
**Problem**: Styles not applying
**Solution**: Check that `@workspace/ui/styles/globals.css` is imported in `app/layout.tsx`

### Components Not Found
**Problem**: "@workspace/ui" module not found
**Solution**: 
1. Make sure you ran `pnpm install`
2. Check `next.config.mjs` has `transpilePackages: ['@workspace/ui']`

### Build Errors
**Problem**: Build fails
**Solution**:
1. Clear `.next` folder: `rm -rf apps/web/.next`
2. Clear turbo cache: `rm -rf .turbo`
3. Reinstall: `rm -rf node_modules && pnpm install`
4. Build again: `pnpm build`

## 📚 Resources

### Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Motion (Framer Motion)](https://motion.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

### Design Inspiration
- [Grab App](https://www.grab.com/) - For POS interface
- [Dribbble](https://dribbble.com/tags/coffee-shop) - For UI ideas

## 🎯 Success Criteria

After completing all phases, the app should:
- ✅ Work perfectly on mobile devices
- ✅ Have beautiful, smooth animations
- ✅ Be installable as a PWA
- ✅ Work offline after first visit
- ✅ Have complete mock data system
- ✅ Be production-ready (after connecting real API)

---

**Current Status**: ✅ Step 8 Complete - Base structure with beautiful UI ready!

**Next Action**: Run `pnpm install` and then `pnpm dev` to see the landing page!
