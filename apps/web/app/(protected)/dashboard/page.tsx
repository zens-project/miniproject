'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Coffee, Sparkles, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStatistics, setDateRange } from '@/store/slices/statistics.slice';
import { DateRange } from '@/lib/types/statistics';
import StatCards from '@/components/statistics/stat-cards';
import RevenueChart from '@/components/statistics/revenue-chart';
import ExpensePieChart from '@/components/statistics/expense-pie-chart';
import DateRangePicker from '@/components/statistics/date-range-picker';
import ExportDataButton from '@/components/statistics/export-data-button';
import Image from 'next/image';

export default function StatisticsPage() {
  const dispatch = useAppDispatch();
  const { revenues, expenses, summary, dateRange, isLoading, error } = useAppSelector(
    (state) => state.statistics
  );

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  const handleDateRangeChange = (newDateRange: DateRange) => {
    dispatch(setDateRange(newDateRange));
    dispatch(fetchStatistics(newDateRange));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with Coffee Theme */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/coffee-bg.jpeg"
          alt="Coffee Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 via-stone-800/50 to-neutral-800/65" />
        <div className="absolute inset-0 backdrop-blur-[1.5px]" />
      </div>

      {/* Floating Coffee Beans Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-amber-400/20"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: -20,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              rotate: 360
            }}
            transition={{ 
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-4 shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TrendingUp className="h-8 w-8 text-white" strokeWidth={2.5} />
                <motion.div
                  className="absolute -right-1 -top-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-300" fill="currentColor" />
                </motion.div>
              </motion.div>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Thống kê
                </h1>
                <p className="text-lg text-amber-100/90 mt-1">
                  Tổng quan về tình hình kinh doanh coffee shop
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <DateRangePicker
                dateRange={dateRange}
                onChange={handleDateRangeChange}
                isLoading={isLoading}
              />
              <ExportDataButton />
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 rounded-xl bg-red-500/20 border border-red-400/30 p-4 text-red-100"
          >
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              <span className="font-medium">Lỗi tải dữ liệu:</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <StatCards summary={summary} isLoading={isLoading} />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart - Takes 2 columns on xl screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="xl:col-span-2"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                <h2 className="text-xl font-semibold text-white">
                  Biểu đồ Thu Chi
                </h2>
                <div className="text-sm text-white/60">
                  ({summary.period})
                </div>
              </div>
              <RevenueChart 
                revenues={revenues} 
                expenses={expenses} 
                height={400}
              />
            </div>
          </motion.div>

          {/* Expense Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
                <h2 className="text-xl font-semibold text-white">
                  Phân loại Chi tiêu
                </h2>
              </div>
              <ExpensePieChart 
                expenses={expenses} 
                height={400}
              />
            </div>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Coffee className="h-6 w-6 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Hiệu suất</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Tỷ lệ lợi nhuận:</span>
                <span className={`font-bold ${summary.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {((summary.profit / (summary.totalRevenue || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Doanh thu/Đơn:</span>
                <span className="font-bold text-blue-400">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    notation: 'compact'
                  }).format(summary.totalRevenue / (summary.orderCount || 1))}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Xu hướng</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Tăng trưởng:</span>
                <span className="font-bold text-green-400">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Dự báo tháng sau:</span>
                <span className="font-bold text-amber-400">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    notation: 'compact'
                  }).format(summary.totalRevenue * 1.125)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" fill="currentColor" />
              <h3 className="text-lg font-semibold text-white">Thông tin</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Tổng giao dịch:</span>
                <span className="font-bold text-white">{summary.orderCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Kỳ báo cáo:</span>
                <span className="font-bold text-amber-400">{summary.period}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
