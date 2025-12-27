'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Eye, EyeOff, Coffee } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Product, PRODUCT_CATEGORIES } from '@/lib/types/products';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleAvailability: (product: Product) => void;
  isLoading?: boolean;
}

export default function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onToggleAvailability, 
  isLoading = false 
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getCategoryInfo = () => {
    return PRODUCT_CATEGORIES.find(cat => cat.value === product.category) || PRODUCT_CATEGORIES[4];
  };

  const categoryInfo = getCategoryInfo();

  const handleDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(product);
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      'amber': { bg: 'bg-amber-500/20', text: 'text-amber-200', border: 'border-amber-400/30' },
      'green': { bg: 'bg-green-500/20', text: 'text-green-200', border: 'border-green-400/30' },
      'pink': { bg: 'bg-pink-500/20', text: 'text-pink-200', border: 'border-pink-400/30' },
      'orange': { bg: 'bg-orange-500/20', text: 'text-orange-200', border: 'border-orange-400/30' },
      'gray': { bg: 'bg-gray-500/20', text: 'text-gray-200', border: 'border-gray-400/30' },
    };
    return colorMap[color] || colorMap['gray'];
  };

  const colorClasses = getColorClasses(categoryInfo.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden hover:bg-white/15 transition-all duration-300 ${
        !product.isAvailable ? 'opacity-60' : ''
      }`}
    >
      {/* Availability Badge */}
      {!product.isAvailable && (
        <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-red-500/80 text-white text-xs font-medium">
          Hết hàng
        </div>
      )}

      {/* Category Badge */}
      <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-full ${colorClasses.bg} ${colorClasses.text} border ${colorClasses.border} text-xs font-medium`}>
        {categoryInfo.icon} {categoryInfo.label}
      </div>

      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {!imageError && product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
            <Coffee className="h-16 w-16 text-amber-400/60" />
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(product)}
              disabled={isLoading || isDeleting}
              className="bg-blue-500/80 border-blue-400/30 text-white hover:bg-blue-500 p-2"
              size="sm"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onToggleAvailability(product)}
              disabled={isLoading || isDeleting}
              className={`${
                product.isAvailable 
                  ? 'bg-red-500/80 border-red-400/30 hover:bg-red-500' 
                  : 'bg-green-500/80 border-green-400/30 hover:bg-green-500'
              } text-white p-2`}
              size="sm"
            >
              {product.isAvailable ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
              className="bg-red-500/80 border-red-400/30 text-white hover:bg-red-500 p-2"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-amber-200 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-white/70 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-400">
              {formatCurrency(product.price)}
            </p>
          </div>
          
          {/* Availability Status */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.isAvailable 
              ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
              : 'bg-red-500/20 text-red-200 border border-red-400/30'
          }`}>
            {product.isAvailable ? 'Có sẵn' : 'Hết hàng'}
          </div>
        </div>

        {/* Product Meta */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>ID: {product.id}</span>
            <span>Cập nhật: {product.updatedAt.toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(isLoading || isDeleting) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
        </div>
      )}
    </motion.div>
  );
}
