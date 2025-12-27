'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Coffee } from 'lucide-react';
import { Product, PRODUCT_CATEGORIES } from '@/lib/types/products';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToOrder: (product: Product) => void;
  isLoading?: boolean;
}

export default function ProductCard({ 
  product, 
  onAddToOrder, 
  isLoading = false 
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

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

  const handleAddClick = () => {
    if (!product.isAvailable || isLoading) return;
    onAddToOrder(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`group relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
        !product.isAvailable 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-white/15 hover:scale-105 cursor-pointer'
      }`}
    >
      {/* Product Image */}
      <div className="relative h-40 w-full overflow-hidden">
        {!imageError && product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
            <Coffee className="h-12 w-12 text-amber-400/60" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {categoryInfo.icon}
        </div>

        {/* Availability Badge */}
        {!product.isAvailable && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-red-500/80 text-white text-xs font-medium">
            Hết hàng
          </div>
        )}

        {/* Plus Button Overlay - Grab Style */}
        {product.isAvailable && (
          <motion.button
            onClick={handleAddClick}
            disabled={isLoading}
            className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-6 w-6" strokeWidth={3} />
          </motion.button>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
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

        {/* Price - Prominent Display */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-xl font-bold text-amber-400">
              {formatCurrency(product.price)}
            </p>
          </div>
          
          {/* Quick Add Button for Mobile */}
          {product.isAvailable && (
            <motion.button
              onClick={handleAddClick}
              disabled={isLoading}
              className="md:hidden h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5" strokeWidth={3} />
            </motion.button>
          )}
        </div>

        {/* Availability Status */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            product.isAvailable 
              ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
              : 'bg-red-500/20 text-red-200 border border-red-400/30'
          }`}>
            {product.isAvailable ? '✓ Có sẵn' : '✗ Hết hàng'}
          </div>
        </div>
      </div>

      {/* Touch-friendly overlay for tablet */}
      {product.isAvailable && (
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={handleAddClick}
        />
      )}
    </motion.div>
  );
}
