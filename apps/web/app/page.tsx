'use client';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui';
import { Coffee, TrendingUp, Users, ShoppingCart, FileText, Settings } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: TrendingUp,
    title: 'Thống kê thu chi',
    description: 'Theo dõi doanh thu và chi phí với biểu đồ trực quan',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: ShoppingCart,
    title: 'Quản lý bán hàng',
    description: 'Giao diện POS hiện đại, dễ sử dụng',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: Coffee,
    title: 'Menu sản phẩm',
    description: 'Quản lý menu với hình ảnh đẹp mắt',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Users,
    title: 'Khách hàng',
    description: 'Chương trình khách hàng thân thiết',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: FileText,
    title: 'Ghi chú nhanh',
    description: 'Lưu trữ ghi chú quan trọng',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    icon: Settings,
    title: 'Cài đặt',
    description: 'Tùy chỉnh hồ sơ và cài đặt',
    color: 'bg-gray-100 text-gray-700',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-[var(--color-primary-100)] p-4">
              <Coffee className="h-16 w-16 text-[var(--color-primary-700)]" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-[var(--color-neutral-900)] md:text-6xl">
            Coffee Shop Management
          </h1>
          <p className="mb-8 text-lg text-[var(--color-neutral-600)] md:text-xl">
            Hệ thống quản lý coffee shop hiện đại, tối ưu cho mobile
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-base">
              Đăng nhập
            </Button>
            <Button size="lg" variant="secondary" className="text-base">
              Tìm hiểu thêm
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-[var(--color-neutral-900)]">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-[var(--color-neutral-600)]">
              Mọi thứ bạn cần để quản lý coffee shop hiệu quả
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className={`mb-4 inline-flex rounded-lg p-3 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-[var(--color-primary-700)] to-[var(--color-primary-900)] text-white">
              <CardContent className="p-8 md:p-12">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold">100%</div>
                    <div className="text-blue-100">Mobile Responsive</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold">PWA</div>
                    <div className="text-blue-100">Cài đặt như app</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold">Offline</div>
                    <div className="text-blue-100">Hoạt động offline</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-neutral-200)] px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-[var(--color-neutral-600)]">
          <p>© 2024 Coffee Shop Management. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
