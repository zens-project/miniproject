# Coffee Shop Management System

A modern, mobile-first Progressive Web App (PWA) for managing coffee shop operations built with Next.js 15, React 19, and Tailwind CSS v4.

## 🚀 Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layouts
- **Beautiful UI**: Modern design with smooth animations using Framer Motion
- **PWA Support**: Install on mobile devices, works offline
- **State Management**: Redux Toolkit with persistence
- **Form Validation**: React Hook Form + Zod
- **Charts**: Chart.js for revenue/expense visualization
- **Mock Data**: Complete mock API system for development

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + Custom Design System
- **Components**: Radix UI + Custom Components
- **State**: Redux Toolkit + Redux Persist
- **Forms**: React Hook Form + Zod
- **Charts**: Chart.js
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion v12)
- **Monorepo**: Turborepo + pnpm

## 🏗️ Project Structure

```
base2/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # App Router pages
│       ├── components/         # App-specific components
│       ├── lib/                # Utilities, services, mock data
│       ├── store/              # Redux store
│       └── public/             # Static assets
├── packages/
│   ├── ui/                     # Shared UI component library
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── styles/         # Design system (colors, typography)
│   │   │   └── lib/            # Utilities
│   │   └── package.json
│   └── typescript-config/      # Shared TypeScript configs
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # Workspace configuration
└── turbo.json                  # Monorepo build config
```

## 🎨 Design System

### Colors
- **Primary**: Blue scale (50-1000)
- **Neutral**: Gray scale (50-1000)
- **Semantic**: Positive (green), Negative (red), Warning (yellow), Info (blue)

### Typography
- **Font**: Inter
- **Scale**: From x-giant-display (4.5rem) to small-label (0.75rem)
- **Responsive**: Scales down on mobile

### Components
- Button (5 variants: primary, secondary, tertiary, danger, ghost)
- Input, Textarea, Label
- Card, Dialog, Badge, Skeleton
- Tabs, Sonner (Toast)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 10+

### Installation

```bash
# Install pnpm globally if you haven't
npm install -g pnpm@10.4.1

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build all packages
pnpm build

# Start production server
cd apps/web
pnpm start
```

## 📱 PWA Setup

The app is configured as a PWA with:
- Manifest file (`app/manifest.ts`)
- Service Worker (`public/sw.js`)
- Offline support
- Install prompt on mobile

To test PWA locally:
```bash
# Run with HTTPS (required for PWA)
cd apps/web
pnpm dev --experimental-https
```

## 🎯 Key Features Implementation

### 1. Authentication
- Login/Register pages with validation
- Protected routes
- Session management with localStorage

### 2. Dashboard
- Revenue/Expense charts
- Statistics cards with animations
- Date range filtering

### 3. Sales/POS
- Grab-style product grid with images
- Customer selection with quick create
- Real-time order management
- Recent revenue tracking

### 4. Products
- Product CRUD operations
- Image upload support
- Category filtering

### 5. Customers
- Customer management
- Loyalty program tracking
- Purchase history

### 6. Expenses
- Expense tracking by category
- Automatic calculations
- Export reports

## 🎨 Mobile-First Responsive Design

### Breakpoints
- **Mobile**: 0-767px (stack layout, bottom nav)
- **Tablet**: 768-1023px (2 columns, drawer menu)
- **Desktop**: 1024px+ (sidebar + main content)

### Touch Targets
- Minimum 44x44px for all interactive elements
- Generous padding (16-24px)
- Large, readable fonts

### Navigation
- **Mobile**: Bottom navigation bar (6 items)
- **Tablet/Desktop**: Sidebar navigation

## 🔧 Development

### Code Style
- **Linting**: Biome.js
- **Formatting**: Biome.js (auto-format on save)
- **Naming**: kebab-case for files, PascalCase for components

### Commands
```bash
# Development
pnpm dev          # Start dev server

# Building
pnpm build        # Build all packages

# Linting
pnpm lint         # Lint all packages
pnpm check        # Check and fix with Biome

# Formatting
pnpm format       # Format all files
```

## 📝 Mock Data

The app uses a complete mock data system:
- Mock API service with delays
- JSON data files for all entities
- localStorage persistence
- Simulates real API behavior

Mock data files are in `apps/web/lib/mock-data/`:
- `users.json` - User accounts
- `products.json` - Product catalog
- `customers.json` - Customer database
- `orders.json` - Order history
- `expenses.json` - Expense records

## 🎭 Animations

Using Motion (Framer Motion v12) for smooth animations:
- Page transitions
- Card entrance animations
- Hover effects
- Loading states

Pre-defined variants in `lib/motion.ts`:
- `heroVariants` - Hero section animations
- `staggerContainer` - Stagger children
- `cardVariants` - Card entrance
- `statItem` - Stats animations

## 📊 Charts

Chart.js integration with custom plugins:
- Area charts (revenue over time)
- Bar charts (comparisons)
- Pie charts (expense categories)
- Custom tooltips with VND formatting
- Responsive sizing

## 🔐 State Management

Redux Toolkit with persistence:
- Slices for each feature (auth, products, orders, etc.)
- Automatic localStorage sync
- Type-safe hooks
- Async thunks for API calls

## 🌐 Internationalization (Future)

Ready for i18n with next-intl:
- Vietnamese (primary)
- English (secondary)

## 📄 License

Private - For internal use only

## 👥 Team

Built for coffee shop owners who need a simple, beautiful management system.

---

**Note**: This is step 8 implementation from the project guide. All TypeScript errors will resolve after running `pnpm install`.
