'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { LayoutDashboard, ShoppingCart, Package, Users, FileText, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@workspace/ui';
import { motion } from 'motion/react';
import { AIChat } from './components/ai-chat';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bán hàng', href: '/sales', icon: ShoppingCart },
  { name: 'Sản phẩm', href: '/products', icon: Package },
  { name: 'Khách hàng', href: '/customers', icon: Users },
  { name: 'Chi phí', href: '/expenses', icon: FileText },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[var(--color-neutral-50)]">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 border-r border-[var(--color-neutral-200)] bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-[var(--color-neutral-200)] px-6">
            <h1 className="text-xl font-bold text-[var(--color-primary-700)]">
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
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                      : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-[var(--color-neutral-200)] p-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-neutral-900)]">
                  {user?.name}
                </p>
                <p className="text-xs text-[var(--color-neutral-600)]">
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
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
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-neutral-200)] bg-white px-4 lg:hidden">
          <h1 className="text-lg font-bold text-[var(--color-primary-700)]">
            Coffee Shop
          </h1>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
            {user?.name.charAt(0).toUpperCase()}
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
        <nav className="flex border-t border-[var(--color-neutral-200)] bg-white lg:hidden">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
                  isActive
                    ? 'text-[var(--color-primary-700)]'
                    : 'text-[var(--color-neutral-600)]'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* AI Chat Widget */}
      <AIChat />
    </div>
  );
}
