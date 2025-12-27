'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Palette, Type, FileText } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { ExpenseCategory, ExpenseCategoryFormData, CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/types/expense-categories';

interface ExpenseCategoryFormProps {
  category?: ExpenseCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export default function ExpenseCategoryForm({ category, isOpen, onClose, onSubmit, isSubmitting }: ExpenseCategoryFormProps) {
  const [formData, setFormData] = useState<ExpenseCategoryFormData>({
    name: '',
    description: '',
    icon: 'more-horizontal',
    color: 'gray',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon,
        color: category.color,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'more-horizontal',
        color: 'gray',
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Tên danh mục không được quá 50 ký tự';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Mô tả không được quá 200 ký tự';
    }

    if (!formData.icon) {
      newErrors.icon = 'Vui lòng chọn biểu tượng';
    }

    if (!formData.color) {
      newErrors.color = 'Vui lòng chọn màu sắc';
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
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        color: formData.color,
      };

      await onSubmit(categoryData);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleInputChange = (field: keyof ExpenseCategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedIcon = CATEGORY_ICONS.find(icon => icon.value === formData.icon);
  const selectedColor = CATEGORY_COLORS.find(color => color.value === formData.color);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-amber-900/90 via-stone-900/90 to-neutral-900/90 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <Palette className="h-4 w-4 text-white" />
              </div>
              {category ? 'Sửa danh mục' : 'Thêm danh mục mới'}
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
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              <Type className="inline h-4 w-4 mr-2" />
              Tên danh mục <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ví dụ: Nguyên liệu"
              maxLength={50}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all ${
                errors.name 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.name ? (
                <p className="text-sm text-red-300">{errors.name}</p>
              ) : (
                <div></div>
              )}
              <p className="text-sm text-white/60">
                {formData.name.length}/50
              </p>
            </div>
          </motion.div>

          {/* Description Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả chi tiết về danh mục này..."
              rows={3}
              maxLength={200}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 resize-none transition-all ${
                errors.description 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-sm text-red-300">{errors.description}</p>
              ) : (
                <div></div>
              )}
              <p className="text-sm text-white/60">
                {formData.description.length}/200
              </p>
            </div>
          </motion.div>

          {/* Icon Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-3">
              Biểu tượng <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORY_ICONS.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => handleInputChange('icon', icon.value)}
                  disabled={isSubmitting}
                  className={`p-3 rounded-xl border transition-all ${
                    formData.icon === icon.value
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                  title={icon.label}
                >
                  <span className="text-lg">{icon.icon}</span>
                </button>
              ))}
            </div>
            {errors.icon && (
              <p className="mt-2 text-sm text-red-300">{errors.icon}</p>
            )}
          </motion.div>

          {/* Color Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-3">
              Màu sắc <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  disabled={isSubmitting}
                  className={`p-3 rounded-xl border transition-all ${
                    formData.color === color.value
                      ? 'border-amber-400 bg-amber-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  title={color.label}
                >
                  <div 
                    className="w-6 h-6 rounded-full mx-auto"
                    style={{ backgroundColor: color.color }}
                  ></div>
                </button>
              ))}
            </div>
            {errors.color && (
              <p className="mt-2 text-sm text-red-300">{errors.color}</p>
            )}
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl bg-white/5 border border-white/10 p-4"
          >
            <label className="block text-sm font-medium text-white/90 mb-3">
              Xem trước
            </label>
            <div className="flex items-center gap-3">
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center text-lg ${selectedColor?.bgClass} border ${selectedColor?.borderClass}`}
              >
                {selectedIcon?.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {formData.name || 'Tên danh mục'}
                </h3>
                <p className="text-sm text-white/70">
                  {formData.description || 'Mô tả danh mục'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
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
                    <Palette className="h-4 w-4" />
                  </motion.div>
                  Đang lưu...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {category ? 'Cập nhật' : 'Thêm mới'}
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
