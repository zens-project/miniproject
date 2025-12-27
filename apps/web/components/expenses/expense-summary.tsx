'use client';

import { motion } from 'motion/react';
import { TrendingDown, Calculator, PieChart, Coffee, Sparkles } from 'lucide-react';
import { ExpenseSummary, ExpenseCategory } from '@/lib/types/expenses';

interface ExpenseSummaryProps {
  summary: ExpenseSummary;
  isLoading: boolean;
}

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  isLoading: boolean;
  gradient: string;
  index: number;
}

function SummaryCard({ title, value, subtitle, icon, isLoading, gradient, index }: SummaryCardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-white/20 rounded animate-pulse"></div>
            <div className="h-8 bg-white/20 rounded animate-pulse"></div>
            <div className="h-3 bg-white/20 rounded animate-pulse w-24"></div>
          </div>
          <div className="h-14 w-14 bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 opacity-20 ${gradient}`} />
      
      {/* Floating Coffee Bean Animation */}
      <motion.div
        className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-amber-400/30"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80 mb-2">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-white/60">
              {subtitle}
            </p>
          )}
        </div>
        
        <motion.div 
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-600/30 flex items-center justify-center backdrop-blur-sm border border-white/20"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-3 w-3 text-yellow-300" fill="currentColor" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ExpenseSummaryComponent({ summary, isLoading }: ExpenseSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Get top category
  const topCategory = Object.entries(summary.categoryBreakdown).reduce(
    (max, [category, amount]) => amount > (max[1] || 0) ? [category, amount] : max,
    ['', 0]
  );

  const categoryLabels = {
    [ExpenseCategory.INGREDIENTS]: 'Nguyên liệu',
    [ExpenseCategory.RENT]: 'Thuê mặt bằng',
    [ExpenseCategory.UTILITIES]: 'Điện nước',
    [ExpenseCategory.SALARY]: 'Lương',
    [ExpenseCategory.MARKETING]: 'Marketing',
    [ExpenseCategory.OTHER]: 'Khác'
  };

  const cards = [
    {
      title: "Tổng chi tiêu",
      value: formatCurrency(summary.totalAmount),
      subtitle: `${summary.period}`,
      icon: <TrendingDown className="h-7 w-7 text-red-300" strokeWidth={2.5} />,
      gradient: "bg-gradient-to-br from-red-500/20 to-rose-600/20"
    },
    {
      title: "Số giao dịch",
      value: formatNumber(summary.totalCount),
      subtitle: "Tổng số lần chi tiêu",
      icon: <Calculator className="h-7 w-7 text-blue-300" strokeWidth={2.5} />,
      gradient: "bg-gradient-to-br from-blue-500/20 to-indigo-600/20"
    },
    {
      title: "Chi tiêu trung bình",
      value: formatCurrency(summary.averageAmount),
      subtitle: "Mỗi giao dịch",
      icon: <Coffee className="h-7 w-7 text-amber-300" strokeWidth={2.5} />,
      gradient: "bg-gradient-to-br from-amber-500/20 to-orange-600/20"
    },
    {
      title: "Danh mục cao nhất",
      value: topCategory[0] ? categoryLabels[topCategory[0] as ExpenseCategory] : 'Chưa có',
      subtitle: topCategory[1] ? formatCurrency(topCategory[1]) : '0 VND',
      icon: <PieChart className="h-7 w-7 text-purple-300" strokeWidth={2.5} />,
      gradient: "bg-gradient-to-br from-purple-500/20 to-violet-600/20"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <SummaryCard
            key={card.title}
            {...card}
            isLoading={isLoading}
            index={index}
          />
        ))}
      </div>

      {/* Category Breakdown */}
      {!isLoading && Object.keys(summary.categoryBreakdown).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
            <h3 className="text-xl font-semibold text-white">
              Phân bổ chi tiêu theo danh mục
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(summary.categoryBreakdown).map(([category, amount], index) => {
              const percentage = ((amount / summary.totalAmount) * 100).toFixed(1);
              const categoryKey = category as ExpenseCategory;
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/80">
                      {categoryLabels[categoryKey]}
                    </p>
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-amber-300 font-medium">
                      {percentage}%
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
