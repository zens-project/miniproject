'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Sparkles, Coffee } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchRecentRevenues,
  fetchCustomers,
  createCustomer,
  completeOrder,
  addItemToOrder,
  removeItemFromOrder,
  updateItemQuantity,
  setOrderCustomer,
  setOrderType,
  clearCurrentOrder
} from '@/store/slices/sales-management.slice';
import { fetchProducts } from '@/store/slices/product-management.slice';
import { Product } from '@/lib/types/products';
import { toast } from 'sonner';
import ProductGrid from '@/components/sales/product-grid';
import CurrentOrderPanel from '@/components/sales/current-order-panel';
import RecentOrdersList from '@/components/sales/recent-orders-list';
import { CustomerFormData } from '@/lib/types/sales';
import Image from 'next/image';

export default function SalesPage() {
  const dispatch = useAppDispatch();
  const { currentOrder, recentRevenues, customers, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.salesManagement
  );
  const { items: products, isLoading: productsLoading } = useAppSelector(
    (state) => state.productManagement
  );
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRecentRevenues());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleAddToOrder = (product: Product) => {
    dispatch(addItemToOrder({ product, quantity: 1 }));
    toast.success(`Đã thêm ${product.name} vào đơn hàng`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateItemQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeItemFromOrder(productId));
    toast.success('Đã xóa sản phẩm khỏi đơn hàng');
  };

  const handleSetCustomer = (customerId?: string, customerName?: string) => {
    dispatch(setOrderCustomer({ customerId, customerName }));
  };

  const handleSetOrderType = (type: 'dine-in' | 'takeaway') => {
    dispatch(setOrderType(type));
  };

  const handleCompleteOrder = async () => {
    if (currentOrder.items.length === 0) {
      toast.error('Vui lòng thêm sản phẩm vào đơn hàng');
      return;
    }

    try {
      await dispatch(completeOrder(currentOrder)).unwrap();
      toast.success('Đơn hàng đã được hoàn thành thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hoàn thành đơn hàng');
    }
  };

  const handleClearOrder = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ đơn hàng?')) {
      dispatch(clearCurrentOrder());
      toast.success('Đã xóa đơn hàng');
    }
  };

  const handleCreateCustomer = async (customerData: CustomerFormData) => {
    try {
      const newCustomer = await dispatch(createCustomer(customerData)).unwrap();
      // Automatically select the newly created customer
      dispatch(setOrderCustomer({ customerId: newCustomer.id, customerName: newCustomer.name }));
      toast.success(`Đã tạo khách hàng ${newCustomer.name}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo khách hàng');
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 via-stone-800/50 to-neutral-800/65" />
              <div className="absolute inset-0 backdrop-blur-[1.5px]" />
            </div>

      {/* Floating Coffee Beans Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
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
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-4 shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ShoppingCart className="h-8 w-8 text-white" strokeWidth={2.5} />
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
                Bán hàng (POS)
              </h1>
              <p className="text-lg text-amber-100/90 mt-1">
                Giao diện bán hàng tối ưu cho tablet
              </p>
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
              <Coffee className="h-5 w-5" />
              <span className="font-medium">Lỗi:</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Main POS Layout - Tablet Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section - Takes 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                <h2 className="text-xl font-semibold text-white">
                  Danh sách sản phẩm
                </h2>
                <div className="text-sm text-white/60">
                  ({filteredProducts.length} sản phẩm)
                </div>
              </div>
              
              <ProductGrid
                products={filteredProducts}
                isLoading={productsLoading}
                onAddToOrder={handleAddToOrder}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </motion.div>

          {/* Current Order Panel - Sticky on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <CurrentOrderPanel
              currentOrder={currentOrder}
              customers={customers}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onSetCustomer={handleSetCustomer}
              onSetOrderType={handleSetOrderType}
              onCompleteOrder={handleCompleteOrder}
              onClearOrder={handleClearOrder}
              onCreateCustomer={handleCreateCustomer}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </div>

        {/* Recent Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <h2 className="text-xl font-semibold text-white">
                Đơn hàng đã hoàn thành
              </h2>
              <div className="text-sm text-white/60">
                ({recentRevenues.length} đơn)
              </div>
            </div>
            
            <RecentOrdersList
              orders={recentRevenues}
              isLoading={isLoading}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
