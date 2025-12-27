'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Coffee, Building, Zap, Users, Megaphone, MoreHorizontal, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Expense, ExpenseCategory } from '@/lib/types/expenses';
import React from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, isLoading, onEdit, onDelete }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categoryConfig: Record<ExpenseCategory, { label: string; icon: React.ReactElement; color: string }> = {
    [ExpenseCategory.INGREDIENTS]: {
      label: 'Nguyên liệu',
      icon: <Coffee className="h-4 w-4" />,
      color: 'bg-amber-500/20 text-amber-200 border-amber-400/30'
    },
    [ExpenseCategory.RENT]: {
      label: 'Thuê mặt bằng',
      icon: <Building className="h-4 w-4" />,
      color: 'bg-blue-500/20 text-blue-200 border-blue-400/30'
    },
    [ExpenseCategory.UTILITIES]: {
      label: 'Điện nước',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
    },
    [ExpenseCategory.SALARY]: {
      label: 'Lương',
      icon: <Users className="h-4 w-4" />,
      color: 'bg-green-500/20 text-green-200 border-green-400/30'
    },
    [ExpenseCategory.MARKETING]: {
      label: 'Marketing',
      icon: <Megaphone className="h-4 w-4" />,
      color: 'bg-pink-500/20 text-pink-200 border-pink-400/30'
    },
    [ExpenseCategory.OTHER]: {
      label: 'Khác',
      icon: <MoreHorizontal className="h-4 w-4" />,
      color: 'bg-purple-500/20 text-purple-200 border-purple-400/30'
    }
  };

  const getCategoryConfig = (category: string) => {
    const config = categoryConfig[category as ExpenseCategory];
    return config || {
      label: 'Không xác định',
      icon: <MoreHorizontal className="h-4 w-4" />,
      color: 'bg-gray-500/20 text-gray-200 border-gray-400/30'
    };
  };

  const handleDelete = async (expense: Expense) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chi tiêu "${expense.description}"?`)) {
      setDeletingId(expense.id);
      try {
        await onDelete(expense);
      } catch (error) {
        console.error('Error deleting expense:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Desktop Table Skeleton */}
        <div className="hidden lg:block">
          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="h-6 bg-white/20 rounded animate-pulse w-48"></div>
            </div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="p-4 border-b border-white/5 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-4 bg-white/20 rounded animate-pulse w-20"></div>
                    <div className="h-6 bg-white/20 rounded-full animate-pulse w-24"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-40"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-white/20 rounded animate-pulse w-24"></div>
                    <div className="h-8 bg-white/20 rounded animate-pulse w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="lg:hidden space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-white/20 rounded-full animate-pulse w-24"></div>
                  <div className="h-4 bg-white/20 rounded animate-pulse w-20"></div>
                </div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-white/20 rounded animate-pulse w-32"></div>
                  <div className="h-8 bg-white/20 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
      >
        <div className="text-white/60 mb-4">
          <DollarSign className="h-16 w-16 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Chưa có chi tiêu nào
        </h3>
        <p className="text-white/60">
          Thêm chi tiêu đầu tiên để bắt đầu theo dõi
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="p-4 border-b border-white/10">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-white/80">
              <div className="col-span-2">Ngày</div>
              <div className="col-span-2">Danh mục</div>
              <div className="col-span-4">Mô tả</div>
              <div className="col-span-2 text-right">Số tiền</div>
              <div className="col-span-2 text-right">Thao tác</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2">
                    <div className="text-white font-medium">
                      {formatDate(expense.date)}
                    </div>
                    <div className="text-white/60 text-sm">
                      {formatTime(expense.date)}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryConfig(expense.category).color}`}>
                      {getCategoryConfig(expense.category).icon}
                      {getCategoryConfig(expense.category).label}
                    </span>
                  </div>
                  
                  <div className="col-span-4">
                    <p className="text-white font-medium line-clamp-2">
                      {expense.description}
                    </p>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <p className="text-xl font-bold text-red-400">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => onEdit(expense)}
                        disabled={deletingId === expense.id}
                        className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(expense)}
                        disabled={deletingId === expense.id}
                        className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {expenses.map((expense, index) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryConfig(expense.category).color}`}>
                  {getCategoryConfig(expense.category).icon}
                  {getCategoryConfig(expense.category).label}
                </span>
                <div className="text-right">
                  <div className="text-white/60 text-sm">
                    {formatDate(expense.date)}
                  </div>
                  <div className="text-white/60 text-xs">
                    {formatTime(expense.date)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-white font-medium line-clamp-2">
                  {expense.description}
                </p>
              </div>

              {/* Amount and Actions */}
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-red-400">
                  {formatCurrency(expense.amount)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => onEdit(expense)}
                    disabled={deletingId === expense.id}
                    className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(expense)}
                    disabled={deletingId === expense.id}
                    className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
