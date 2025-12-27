'use client';

import { motion } from 'motion/react';
import { Coffee, Search } from 'lucide-react';
import { Product } from '@/lib/types/products';
import ProductCard from './product-card';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToOrder: (product: Product) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function ProductGrid({ 
  products, 
  isLoading, 
  onAddToOrder,
  searchQuery = '',
  onSearchChange
}: ProductGridProps) {
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Search Skeleton */}
        <div className="h-12 bg-white/20 rounded-xl animate-pulse"></div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden">
              {/* Image Skeleton */}
              <div className="h-40 w-full bg-white/20 animate-pulse"></div>
              
              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-5 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-white/20 rounded animate-pulse w-24"></div>
                  <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const availableProducts = products.filter(product => product.isAvailable);
  const unavailableProducts = products.filter(product => !product.isAvailable);

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
      >
        <div className="text-white/60 mb-4">
          <Coffee className="h-16 w-16 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-white/60">
          Thử thay đổi từ khóa tìm kiếm
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar - Tablet Optimized */}
      {onSearchChange && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all text-lg"
            />
          </div>
        </motion.div>
      )}

      {/* Available Products */}
      {availableProducts.length > 0 && (
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
          >
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            Có sẵn ({availableProducts.length})
          </motion.h3>
          
          {/* Grab-Style Grid: 2-3 columns with large touch targets */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {availableProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onAddToOrder={onAddToOrder}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Products */}
      {unavailableProducts.length > 0 && (
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-white/60 mb-4 flex items-center gap-2"
          >
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            Hết hàng ({unavailableProducts.length})
          </motion.h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {unavailableProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (availableProducts.length + index) * 0.05, duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onAddToOrder={onAddToOrder}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
