'use client';

import { motion } from 'motion/react';
import { Coffee } from 'lucide-react';
import { Product } from '@/lib/types/products';
import ProductCard from './product-card';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleAvailability: (product: Product) => void;
}

export default function ProductGrid({ 
  products, 
  isLoading, 
  onEdit, 
  onDelete, 
  onToggleAvailability 
}: ProductGridProps) {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden">
            {/* Image Skeleton */}
            <div className="h-48 w-full bg-white/20 animate-pulse"></div>
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-5 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse w-1/2"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-white/20 rounded animate-pulse w-24"></div>
                <div className="h-6 bg-white/20 rounded animate-pulse w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
          Thử thay đổi bộ lọc hoặc thêm sản phẩm mới
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <ProductCard
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleAvailability={onToggleAvailability}
          />
        </motion.div>
      ))}
    </div>
  );
}
