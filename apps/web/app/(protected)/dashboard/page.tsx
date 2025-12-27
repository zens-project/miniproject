'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';
import { TrendingUp, TrendingDown, Users, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  {
    name: 'Doanh thu hôm nay',
    value: '2,450,000₫',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    name: 'Chi phí hôm nay',
    value: '850,000₫',
    change: '-5.2%',
    trend: 'down',
    icon: TrendingDown,
  },
  {
    name: 'Đơn hàng',
    value: '45',
    change: '+8.1%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    name: 'Khách hàng mới',
    value: '12',
    change: '+3.2%',
    trend: 'up',
    icon: Users,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-neutral-900)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-neutral-600)]">
          Tổng quan hoạt động coffee shop
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--color-neutral-600)]">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-[var(--color-neutral-400)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--color-neutral-900)]">
                  {stat.value}
                </div>
                <p
                  className={`text-xs ${
                    stat.trend === 'up'
                      ? 'text-[var(--color-positive-600)]'
                      : 'text-[var(--color-negative-600)]'
                  }`}
                >
                  {stat.change} so với hôm qua
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center text-[var(--color-neutral-400)]">
              Chart sẽ được thêm vào sau
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi phí theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center text-[var(--color-neutral-400)]">
              Chart sẽ được thêm vào sau
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
