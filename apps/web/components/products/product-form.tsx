'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Package, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Product, ProductFormData, ProductCategory, PRODUCT_CATEGORIES } from '@/lib/types/products';

interface ProductFormProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  imageUrl?: string;
}

export default function ProductForm({ product, isOpen, onClose, onSubmit, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        imageUrl: product.imageUrl || '',
        isAvailable: product.isAvailable,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        isAvailable: true,
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả sản phẩm là bắt buộc';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Giá sản phẩm là bắt buộc';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Giá sản phẩm phải là số dương';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Danh mục sản phẩm là bắt buộc';
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
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category as ProductCategory,
        imageUrl: formData.imageUrl.trim() || undefined,
        isAvailable: formData.isAvailable,
      };

      await onSubmit(productData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const formatCurrencyPreview = (price: string) => {
    const numValue = parseFloat(price);
    if (isNaN(numValue)) return '';
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numValue);
  };

  const selectedCategory = PRODUCT_CATEGORIES.find(cat => cat.value === formData.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-amber-900/90 via-stone-900/90 to-neutral-900/90 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              {product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </div>
            <Button
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                Tên sản phẩm <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên sản phẩm..."
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all ${
                  errors.name 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                    : 'border-white/30'
                }`}
              />
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-300"
                >
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                {selectedCategory ? selectedCategory.icon : '📦'} Danh mục <span className="text-red-400">*</span>
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
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value} className="bg-gray-800 text-white">
                    {category.icon} {category.label}
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
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              Mô tả sản phẩm <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              rows={3}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all resize-none ${
                errors.description 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            {errors.description && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.description}
              </motion.p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                Giá sản phẩm <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all ${
                    errors.price 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                      : 'border-white/30'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
                  VND
                </div>
              </div>
              {formData.price && !errors.price && (
                <p className="mt-2 text-sm text-amber-300">
                  {formatCurrencyPreview(formData.price)}
                </p>
              )}
              {errors.price && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-300"
                >
                  {errors.price}
                </motion.p>
              )}
            </motion.div>

            {/* Image URL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                <Upload className="inline h-4 w-4 mr-2" />
                URL hình ảnh
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all"
              />
              <p className="mt-1 text-xs text-white/60">
                Tùy chọn: Để trống sẽ sử dụng hình ảnh mặc định
              </p>
            </motion.div>
          </div>

          {/* Availability Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              {formData.isAvailable ? (
                <Eye className="h-5 w-5 text-green-400" />
              ) : (
                <EyeOff className="h-5 w-5 text-red-400" />
              )}
              <div>
                <h3 className="text-white font-medium">Trạng thái sản phẩm</h3>
                <p className="text-sm text-white/60">
                  {formData.isAvailable ? 'Sản phẩm có sẵn trong menu' : 'Sản phẩm tạm hết hàng'}
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => handleInputChange('isAvailable', !formData.isAvailable)}
              disabled={isSubmitting}
              className={`${
                formData.isAvailable 
                  ? 'bg-green-500/20 border-green-400/30 text-green-200 hover:bg-green-500/30' 
                  : 'bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30'
              }`}
            >
              {formData.isAvailable ? 'Có sẵn' : 'Hết hàng'}
            </Button>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-end gap-3 pt-6 border-t border-white/10"
          >
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang lưu...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {product ? 'Cập nhật' : 'Thêm sản phẩm'}
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
