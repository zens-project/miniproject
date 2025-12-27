'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, TrendingDown, Sparkles, Download, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense, 
  setFilters,
  exportExpenses 
} from '@/store/slices/expense-management.slice';
import { fetchExpenseCategories } from '@/store/slices/expense-categories.slice';
import { Expense } from '@/lib/types/expenses';
import { Button } from '@workspace/ui';
import { toast } from 'sonner';
import ExpenseSummary from '@/components/expenses/expense-summary';
import ExpenseFilters from '@/components/expenses/expense-filters';
import ExpenseListByCategory from '@/components/expenses/expense-list-by-category';
import ExpenseForm from '@/components/expenses/expense-form';
import ExpenseCategoryManagement from '@/components/expenses/expense-category-management';
import Image from 'next/image';

export default function ExpenseManagementPage() {
  const dispatch = useAppDispatch();
  const { items, summary, filters, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.expenseManagement
  );
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchExpenseCategories());
  }, [dispatch]);

  // Refetch when filters change
  useEffect(() => {
    dispatch(fetchExpenses(filters));
  }, [dispatch, filters]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = async (expense: Expense) => {
    try {
      await dispatch(deleteExpense(expense.id)).unwrap();
      toast.success('Xóa chi tiêu thành công!');
    } catch (error) {
      toast.error('Không thể xóa chi tiêu. Vui lòng thử lại.');
    }
  };

  const handleFormSubmit = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingExpense) {
        await dispatch(updateExpense({ 
          id: editingExpense.id, 
          updates: expenseData 
        })).unwrap();
        toast.success('Cập nhật chi tiêu thành công!');
      } else {
        await dispatch(createExpense(expenseData)).unwrap();
        toast.success('Thêm chi tiêu thành công!');
      }
    } catch (error) {
      toast.error(editingExpense ? 'Không thể cập nhật chi tiêu' : 'Không thể thêm chi tiêu');
      throw error;
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleFiltersChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  const handleExport = async () => {
    try {
      await dispatch(exportExpenses('csv')).unwrap();
      toast.success('Xuất dữ liệu thành công!');
    } catch (error) {
      toast.error('Không thể xuất dữ liệu. Vui lòng thử lại.');
    }
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-stone-900/70 to-neutral-900/85" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Floating Coffee Beans Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
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
                className="relative rounded-full bg-gradient-to-br from-red-500 to-rose-600 p-4 shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TrendingDown className="h-8 w-8 text-white" strokeWidth={2.5} />
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
                  Quản lý Chi tiêu
                </h1>
                <p className="text-lg text-amber-100/90 mt-1">
                  Theo dõi và quản lý các khoản chi tiêu của coffee shop
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setIsCategoryManagementOpen(true)}
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Settings className="mr-2 h-4 w-4" />
                Quản lý danh mục
              </Button>
              <Button
                onClick={handleExport}
                disabled={isLoading || items.length === 0}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Xuất dữ liệu
              </Button>
              <Button
                onClick={handleAddExpense}
                disabled={isLoading}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm chi tiêu
              </Button>
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
              <TrendingDown className="h-5 w-5" />
              <span className="font-medium">Lỗi tải dữ liệu:</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <ExpenseSummary summary={summary} isLoading={isLoading} />
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <ExpenseFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Expense List Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-red-400 to-rose-500"></div>
                <h2 className="text-xl font-semibold text-white">
                  Danh sách chi tiêu
                </h2>
                <div className="text-sm text-white/60">
                  ({summary.totalCount} giao dịch)
                </div>
              </div>
            </div>
            
            <ExpenseListByCategory
              expenses={items}
              isLoading={isLoading}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Xu hướng</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Chi tiêu trung bình:</span>
                <span className="font-bold text-red-400">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    notation: 'compact'
                  }).format(summary.averageAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Tăng trưởng:</span>
                <span className="font-bold text-orange-400">+8.2%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" fill="currentColor" />
              <h3 className="text-lg font-semibold text-white">Thông tin</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Kỳ báo cáo:</span>
                <span className="font-bold text-amber-400">{summary.period}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Danh mục:</span>
                <span className="font-bold text-white">{Object.keys(summary.categoryBreakdown).length}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Báo cáo</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Định dạng:</span>
                <span className="font-bold text-green-400">CSV, PDF</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Trạng thái:</span>
                <span className="font-bold text-blue-400">Sẵn sàng</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Expense Form Modal */}
      <ExpenseForm
        expense={editingExpense}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Category Management Modal */}
      <ExpenseCategoryManagement
        isOpen={isCategoryManagementOpen}
        onClose={() => setIsCategoryManagementOpen(false)}
      />
    </div>
  );
}
