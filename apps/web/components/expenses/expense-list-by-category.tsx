'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit, Trash2, ChevronDown, ChevronRight, Coffee, Building, Zap, Users, Megaphone, MoreHorizontal, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Expense } from '@/lib/types/expenses';
import { ExpenseCategory } from '@/lib/types/expense-categories';
import { useAppSelector } from '@/store/hooks';

interface ExpenseListByCategoryProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

interface CategoryGroup {
  category: ExpenseCategory;
  expenses: Expense[];
  total: number;
  count: number;
}

export default function ExpenseListByCategory({ expenses, isLoading, onEdit, onDelete }: ExpenseListByCategoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { items: categories } = useAppSelector((state) => state.expenseCategories);

  // Group expenses by category
  const categoryGroups: CategoryGroup[] = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category.id);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      category,
      expenses: categoryExpenses,
      total,
      count: categoryExpenses.length
    };
  }).filter(group => group.count > 0); // Only show categories with expenses

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

  const getIconComponent = (iconValue: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'coffee': <Coffee className="h-4 w-4" />,
      'building': <Building className="h-4 w-4" />,
      'zap': <Zap className="h-4 w-4" />,
      'users': <Users className="h-4 w-4" />,
      'megaphone': <Megaphone className="h-4 w-4" />,
      'more-horizontal': <MoreHorizontal className="h-4 w-4" />,
    };
    return iconMap[iconValue] || <MoreHorizontal className="h-4 w-4" />;
  };

  const getColorClasses = (colorValue: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      'amber': { bg: 'bg-amber-500/20', text: 'text-amber-200', border: 'border-amber-400/30' },
      'blue': { bg: 'bg-blue-500/20', text: 'text-blue-200', border: 'border-blue-400/30' },
      'green': { bg: 'bg-green-500/20', text: 'text-green-200', border: 'border-green-400/30' },
      'red': { bg: 'bg-red-500/20', text: 'text-red-200', border: 'border-red-400/30' },
      'purple': { bg: 'bg-purple-500/20', text: 'text-purple-200', border: 'border-purple-400/30' },
      'pink': { bg: 'bg-pink-500/20', text: 'text-pink-200', border: 'border-pink-400/30' },
      'yellow': { bg: 'bg-yellow-500/20', text: 'text-yellow-200', border: 'border-yellow-400/30' },
      'indigo': { bg: 'bg-indigo-500/20', text: 'text-indigo-200', border: 'border-indigo-400/30' },
      'gray': { bg: 'bg-gray-500/20', text: 'text-gray-200', border: 'border-gray-400/30' },
      'orange': { bg: 'bg-orange-500/20', text: 'text-orange-200', border: 'border-orange-400/30' },
    };
    return colorMap[colorValue] || colorMap['gray'];
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
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

  // Auto-expand categories on first load
  useEffect(() => {
    if (categoryGroups.length > 0 && expandedCategories.size === 0) {
      const firstCategoryId = categoryGroups[0]?.category.id;
      if (firstCategoryId) {
        setExpandedCategories(new Set([firstCategoryId]));
      }
    }
  }, [categoryGroups.length]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-white/20 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-white/20 rounded animate-pulse w-24"></div>
                </div>
              </div>
              <div className="h-6 w-6 bg-white/20 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-white/10 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categoryGroups.length === 0) {
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
          Thêm chi tiêu đầu tiên để bắt đầu theo dõi theo danh mục
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {categoryGroups.map((group, groupIndex) => {
        const colorClasses = getColorClasses(group.category.color);
        const isExpanded = expandedCategories.has(group.category.id);
        
        return (
          <motion.div
            key={group.category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1, duration: 0.4 }}
            className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(group.category.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${colorClasses.bg} border ${colorClasses.border}`}>
                  {getIconComponent(group.category.icon)}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">
                    {group.category.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>{group.count} giao dịch</span>
                    <span className="font-medium text-red-400">
                      {formatCurrency(group.total)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses.bg} ${colorClasses.text} border ${colorClasses.border}`}>
                  {group.count}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-5 w-5 text-white/60" />
                </motion.div>
              </div>
            </button>

            {/* Category Expenses */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/10"
                >
                  <div className="p-6 pt-4 space-y-3">
                    {group.expenses.map((expense, expenseIndex) => (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: expenseIndex * 0.05, duration: 0.3 }}
                        className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors"
                      >
                        {/* Desktop Layout */}
                        <div className="hidden md:flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-center min-w-[80px]">
                              <div className="text-white font-medium text-sm">
                                {formatDate(expense.date)}
                              </div>
                              <div className="text-white/60 text-xs">
                                {formatTime(expense.date)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium line-clamp-1">
                                {expense.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-red-400">
                                {formatCurrency(expense.amount)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => onEdit(expense)}
                                disabled={deletingId === expense.id}
                                className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30 p-2"
                                size="sm"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(expense)}
                                disabled={deletingId === expense.id}
                                className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 p-2"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="md:hidden space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-white font-medium line-clamp-2 mb-1">
                                {expense.description}
                              </p>
                              <div className="text-sm text-white/60">
                                {formatDate(expense.date)} • {formatTime(expense.date)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-red-400">
                              {formatCurrency(expense.amount)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => onEdit(expense)}
                                disabled={deletingId === expense.id}
                                className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30 p-2"
                                size="sm"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(expense)}
                                disabled={deletingId === expense.id}
                                className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 p-2"
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
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
