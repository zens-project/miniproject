'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Coffee, Building, Zap, Users, Megaphone, MoreHorizontal, DollarSign, Calendar, FileText } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Expense, ExpenseFormData } from '@/lib/types/expenses';
import { useAppSelector } from '@/store/hooks';

interface ExpenseFormProps {
  expense?: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormErrors {
  date?: string;
  amount?: string;
  category?: string;
  description?: string;
}

export default function ExpenseForm({ expense, isOpen, onClose, onSubmit, isSubmitting }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Get dynamic categories from Redux state
  const { items: categories } = useAppSelector((state) => state.expenseCategories);

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

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date.toISOString().split('T')[0],
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        description: '',
      });
    }
    setErrors({});
  }, [expense, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = 'Ngày không được để trống';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    } else if (isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Số tiền không hợp lệ';
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Mô tả không được quá 500 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const expenseData = {
        date: new Date(formData.date),
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
      };

      await onSubmit(expenseData);
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return numericValue;
  };

  const formatCurrencyPreview = (amount: string) => {
    const numValue = parseFloat(amount);
    if (isNaN(numValue)) return '';
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numValue);
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-amber-900/90 via-stone-900/90 to-neutral-900/90 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              {expense ? 'Sửa chi tiêu' : 'Thêm chi tiêu mới'}
            </div>
            <Button
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 w-8 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Date Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Ngày chi tiêu <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all ${
                errors.date 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            {errors.date && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.date}
              </motion.p>
            )}
          </motion.div>

          {/* Category Select */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              {selectedCategory ? getIconComponent(selectedCategory.icon) : <FileText className="inline h-4 w-4 mr-2" />}
              Danh mục <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 appearance-none transition-all ${
                errors.category 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            >
              <option value="" className="bg-gray-800 text-white">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.category}
              </motion.p>
            )}
          </motion.div>

          {/* Amount Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              <DollarSign className="inline h-4 w-4 mr-2" />
              Số tiền (VND) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', formatAmount(e.target.value))}
              placeholder="0"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all ${
                errors.amount 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            {errors.amount ? (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.amount}
              </motion.p>
            ) : formData.amount && !errors.amount && (
              <p className="mt-2 text-sm text-amber-300 font-medium">
                {formatCurrencyPreview(formData.amount)}
              </p>
            )}
          </motion.div>

          {/* Description Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              Mô tả <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Nhập mô tả chi tiêu..."
              rows={3}
              maxLength={500}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 resize-none transition-all ${
                errors.description 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.description ? (
                <p className="text-sm text-red-300">{errors.description}</p>
              ) : (
                <div></div>
              )}
              <p className="text-sm text-white/60">
                {formData.description.length}/500
              </p>
            </div>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 pt-4"
          >
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Coffee className="h-4 w-4" />
                  </motion.div>
                  Đang lưu...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {expense ? 'Cập nhật' : 'Thêm mới'}
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
