'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Eye, EyeOff, Settings } from 'lucide-react';
import { Button } from '@workspace/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchExpenseCategories, 
  createExpenseCategory, 
  updateExpenseCategory, 
  deleteExpenseCategory,
  toggleCategoryStatus 
} from '@/store/slices/expense-categories.slice';
import { ExpenseCategory } from '@/lib/types/expense-categories';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/types/expense-categories';
import { toast } from 'sonner';
import ExpenseCategoryForm from './expense-category-form';

interface ExpenseCategoryManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpenseCategoryManagement({ isOpen, onClose }: ExpenseCategoryManagementProps) {
  const dispatch = useAppDispatch();
  const { items, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.expenseCategories
  );
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchExpenseCategories());
    }
  }, [dispatch, isOpen]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = async (category: ExpenseCategory) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      try {
        await dispatch(deleteExpenseCategory(category.id)).unwrap();
        toast.success('Xóa danh mục thành công!');
      } catch (error) {
        toast.error('Không thể xóa danh mục. Vui lòng thử lại.');
      }
    }
  };

  const handleToggleStatus = async (category: ExpenseCategory) => {
    try {
      await dispatch(toggleCategoryStatus({ 
        id: category.id, 
        isActive: !category.isActive 
      })).unwrap();
      toast.success(`${category.isActive ? 'Ẩn' : 'Hiện'} danh mục thành công!`);
    } catch (error) {
      toast.error('Không thể thay đổi trạng thái danh mục.');
    }
  };

  const handleFormSubmit = async (categoryData: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    try {
      if (editingCategory) {
        await dispatch(updateExpenseCategory({ 
          id: editingCategory.id, 
          updates: categoryData 
        })).unwrap();
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await dispatch(createExpenseCategory(categoryData)).unwrap();
        toast.success('Thêm danh mục thành công!');
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error(editingCategory ? 'Không thể cập nhật danh mục' : 'Không thể thêm danh mục');
      throw error;
    }
  };

  const getIconEmoji = (iconValue: string) => {
    const iconConfig = CATEGORY_ICONS.find(icon => icon.value === iconValue);
    return iconConfig?.icon || '⚫';
  };

  const getColorConfig = (colorValue: string) => {
    return CATEGORY_COLORS.find(color => color.value === colorValue) || CATEGORY_COLORS[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/90 via-stone-900/90 to-neutral-900/90 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quản lý Danh mục Chi tiêu</h2>
              <p className="text-sm text-white/70">Tạo và quản lý các danh mục cho chi tiêu</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAddCategory}
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
            <Button
              onClick={onClose}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Đóng
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 rounded-xl bg-red-500/20 border border-red-400/30 p-4 text-red-100"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Lỗi:</span>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-8 bg-white/20 rounded-full animate-pulse"></div>
                      <div className="h-6 w-16 bg-white/20 rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded animate-pulse w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Categories Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((category, index) => {
                const colorConfig = getColorConfig(category.color);
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl hover:bg-white/15 transition-all"
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`h-10 w-10 rounded-full flex items-center justify-center text-lg ${colorConfig.bgClass} border ${colorConfig.borderClass}`}
                          >
                            {getIconEmoji(category.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{category.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${colorConfig.bgClass} ${colorConfig.textClass} border ${colorConfig.borderClass}`}>
                                {colorConfig.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-white/70 line-clamp-2">
                        {category.description || 'Không có mô tả'}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="text-xs text-white/60">
                          {category.createdAt.toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleToggleStatus(category)}
                            disabled={isSubmitting}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
                            size="sm"
                          >
                            {category.isActive ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => handleEditCategory(category)}
                            disabled={isSubmitting}
                            className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30 p-2"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCategory(category)}
                            disabled={isSubmitting}
                            className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 p-2"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Empty State */}
              {items.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <div className="text-white/60 mb-4">
                    <Settings className="h-16 w-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Chưa có danh mục nào
                  </h3>
                  <p className="text-white/60 mb-4">
                    Tạo danh mục đầu tiên để bắt đầu quản lý chi tiêu
                  </p>
                  <Button
                    onClick={handleAddCategory}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm danh mục đầu tiên
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Category Form Modal */}
      <ExpenseCategoryForm
        category={editingCategory}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
