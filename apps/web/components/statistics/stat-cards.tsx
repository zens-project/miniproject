'use client';

import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Coffee, Sparkles } from 'lucide-react';
import { StatsSummary } from '@/lib/types/statistics';

interface StatCardsProps {
  summary: StatsSummary;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  isLoading: boolean;
  gradient: string;
  index: number;
}

function StatCard({ title, value, change, changeType, icon, isLoading, gradient, index }: StatCardProps) {
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

  const changeColor = changeType === 'positive' 
    ? 'text-green-300' 
    : changeType === 'negative' 
    ? 'text-red-300' 
    : 'text-amber-200';

  const ChangeIcon = changeType === 'positive' ? TrendingUp : TrendingDown;

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
        className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-amber-400/30"
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
          <p className="text-2xl md:text-3xl font-bold text-white mb-3">
            {value}
          </p>
          {change && (
            <div className={`flex items-center gap-1 ${changeColor}`}>
              <ChangeIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{change}</span>
            </div>
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
            <Sparkles className="h-4 w-4 text-yellow-300" fill="currentColor" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function StatCards({ summary, isLoading }: StatCardsProps) {
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

  const profitChangeType = summary.profit > 0 ? 'positive' : summary.profit < 0 ? 'negative' : 'neutral';

  const cards: Array<{
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    gradient: string;
  }> = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(summary.totalRevenue),
      change: "+12.5% so với tháng trước",
      changeType: "positive",
      icon: <DollarSign className="h-7 w-7 text-green-300" strokeWidth={2.5} />,
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-600/20"
    },
    {
      title: "Tổng chi phí",
      value: formatCurrency(summary.totalExpense),
      change: "+5.2% so với tháng trước",
      changeType: "negative",
      icon: <TrendingDown className="h-7 w-7 text-red-300" strokeWidth={2.5} />,
      gradient: "bg-gradient-to-br from-red-500/20 to-rose-600/20"
    },
    {
      title: "Lợi nhuận",
      value: formatCurrency(summary.profit),
      change: `${summary.profit > 0 ? '+' : ''}${((summary.profit / (summary.totalRevenue || 1)) * 100).toFixed(1)}%`,
      changeType: profitChangeType,
      icon: <Coffee className="h-7 w-7 text-amber-300" strokeWidth={2.5} />,
      gradient: profitChangeType === 'positive' 
        ? "bg-gradient-to-br from-amber-500/20 to-orange-600/20"
        : "bg-gradient-to-br from-gray-500/20 to-slate-600/20"
    },
    {
      title: "Số đơn hàng",
      value: formatNumber(summary.orderCount),
      change: "+8 đơn hôm nay",
      changeType: "positive",
      icon: <ShoppingCart className="h-7 w-7 text-blue-300" strokeWidth={2.5} />,
      gradient: "bg-gradient-to-br from-blue-500/20 to-indigo-600/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, index) => (
        <StatCard
          key={card.title}
          {...card}
          isLoading={isLoading}
          index={index}
        />
      ))}
    </div>
  );
}
