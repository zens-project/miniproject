'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Package, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  toggleProductAvailability,
  setFilters 
} from '@/store/slices/product-management.slice';
import { Product } from '@/lib/types/products';
import { Button } from '@workspace/ui';
import { toast } from 'sonner';
import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import ProductForm from '@/components/products/product-form';
import Image from 'next/image';

export default function ProductMenuPage() {
  const dispatch = useAppDispatch();
  const { items, filters, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.productManagement
  );
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Refetch when filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ 
          id: editingProduct.id, 
          updates: data 
        })).unwrap();
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success('Thêm sản phẩm thành công!');
      }
      handleCloseForm();
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      toast.success('Xóa sản phẩm thành công!');
    } catch (error) {
      toast.error('Không thể xóa sản phẩm!');
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      await dispatch(toggleProductAvailability({ 
        id: product.id, 
        isAvailable: !product.isAvailable 
      })).unwrap();
      toast.success(
        product.isAvailable 
          ? 'Đã ẩn sản phẩm khỏi menu' 
          : 'Đã hiển thị sản phẩm trong menu'
      );
    } catch (error) {
      toast.error('Không thể thay đổi trạng thái sản phẩm!');
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
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
                className="relative rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-4 shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Package className="h-8 w-8 text-white" strokeWidth={2.5} />
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
                  Quản lý Menu
                </h1>
                <p className="text-lg text-amber-100/90 mt-1">
                  Quản lý danh sách sản phẩm của cửa hàng
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddProduct}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
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
              <Package className="h-5 w-5" />
              <span className="font-medium">Lỗi tải dữ liệu:</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
            <h2 className="text-xl font-semibold text-white">
              Danh sách sản phẩm
            </h2>
            <div className="text-sm text-white/60">
              ({items.length} sản phẩm)
            </div>
          </div>
          
          <ProductGrid
            products={items}
            isLoading={isLoading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onToggleAvailability={handleToggleAvailability}
          />
        </motion.div>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
