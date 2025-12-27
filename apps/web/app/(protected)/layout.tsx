'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LayoutDashboard, TrendingUp, TrendingDown, ShoppingCart, Package, Users, FileText, Settings, LogOut, User, StickyNote, Coffee, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@workspace/ui';
import { motion } from 'motion/react';
import { AIChat } from './components/ai-chat';
import LoyaltyNotificationComponent from '@/components/sales/loyalty-notification';
import { markNotificationAsRead, clearAllNotifications } from '@/store/slices/sales-management.slice';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chi tiêu', href: '/expenses', icon: TrendingDown },
  { name: 'Quản lý Menu', href: '/products', icon: Package },
  { name: 'Bán hàng (POS)', href: '/sales', icon: ShoppingCart },
  { name: 'Khách hàng', href: '/customers', icon: Users },
  { name: 'Ghi chú', href: '/notes', icon: StickyNote },
  { name: 'Hồ sơ', href: '/profile', icon: User },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { loyaltyNotifications } = useAppSelector((state) => state.salesManagement);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push('/login');
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleClearAllNotifications = () => {
    dispatch(clearAllNotifications());
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 border-r border-amber-200 bg-gradient-to-b from-amber-50 to-orange-50 lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-500 to-orange-600 px-6">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Coffee className="h-6 w-6 text-white" strokeWidth={2.5} />
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-yellow-300" fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold text-white drop-shadow-md">
              Coffee Shop
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md scale-105'
                      : 'text-amber-900 hover:bg-amber-100 hover:scale-102'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 p-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-white font-bold shadow-md">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">
                  {user?.name}
                </p>
                <p className="text-xs text-amber-700">
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-amber-900 hover:bg-amber-200 hover:text-amber-950"
              onClick={() => {
                router.push('/login');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-500 to-orange-600 px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Coffee className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold text-white drop-shadow-md">
              Coffee Shop
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <LoyaltyNotificationComponent
              notifications={loyaltyNotifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onClearAll={handleClearAllNotifications}
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-amber-700 font-bold shadow-md">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile bottom navigation */}
        <nav className="flex border-t border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 lg:hidden">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-all ${
                  isActive
                    ? 'text-amber-700 font-bold scale-110'
                    : 'text-amber-900/60 hover:text-amber-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* AI Chat Component */}
        <AIChat />
      </div>
    </div>
  );
}
