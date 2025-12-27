'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Minus, Plus, X, User, Coffee, CheckCircle } from 'lucide-react';
import { Button } from '@workspace/ui';
import { CurrentOrder, OrderItem, ORDER_TYPES, Customer, CustomerFormData } from '@/lib/types/sales';
import CustomerSelector from './customer-selector';

interface CurrentOrderPanelProps {
  currentOrder: CurrentOrder;
  customers: Customer[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onSetCustomer: (customerId?: string, customerName?: string) => void;
  onSetOrderType: (type: 'dine-in' | 'takeaway') => void;
  onCompleteOrder: () => void;
  onClearOrder: () => void;
  onCreateCustomer: (customerData: CustomerFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CurrentOrderPanel({
  currentOrder,
  customers,
  onUpdateQuantity,
  onRemoveItem,
  onSetCustomer,
  onSetOrderType,
  onCompleteOrder,
  onClearOrder,
  onCreateCustomer,
  isSubmitting = false
}: CurrentOrderPanelProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const isEmpty = currentOrder.items.length === 0;

  return (
    <div className="sticky top-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Đơn hàng hiện tại</h2>
            <p className="text-sm text-white/60">
              {currentOrder.items.length} sản phẩm
            </p>
          </div>
        </div>
        
        {!isEmpty && (
          <Button
            onClick={onClearOrder}
            disabled={isSubmitting}
            className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 p-2"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Order Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-3">
          Loại đơn hàng
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ORDER_TYPES.map((type) => (
            <Button
              key={type.value}
              onClick={() => onSetOrderType(type.value)}
              disabled={isSubmitting}
              className={`${
                currentOrder.type === type.value
                  ? 'bg-amber-500/30 border-amber-400/50 text-amber-200'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              } justify-center`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Customer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-3">
          Khách hàng
        </label>
        <CustomerSelector
          customers={customers}
          selectedCustomerId={currentOrder.customerId}
          selectedCustomerName={currentOrder.customerName}
          onSelectCustomer={onSetCustomer}
          onCreateCustomer={onCreateCustomer}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-3">
          Sản phẩm đã chọn
        </label>
        
        {isEmpty ? (
          <div className="text-center py-8 text-white/60">
            <Coffee className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có sản phẩm nào</p>
            <p className="text-sm">Chọn sản phẩm để bắt đầu</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {currentOrder.items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-white/60">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={isSubmitting}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-1 h-8 w-8"
                      size="sm"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-white font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      disabled={isSubmitting}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-1 h-8 w-8"
                      size="sm"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      onClick={() => onRemoveItem(item.productId)}
                      disabled={isSubmitting}
                      className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 p-1 h-8 w-8 ml-2"
                      size="sm"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Order Summary */}
      {!isEmpty && (
        <div className="border-t border-white/10 pt-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-white/80">
              <span>Tạm tính:</span>
              <span>{formatCurrency(currentOrder.total)}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Thuế (0%):</span>
              <span>0 ₫</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-amber-400 pt-2 border-t border-white/10">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(currentOrder.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Complete Order Button */}
      <Button
        onClick={onCompleteOrder}
        disabled={isEmpty || isSubmitting}
        className={`w-full ${
          isEmpty 
            ? 'bg-gray-500/20 border-gray-400/30 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
        }`}
        size="lg"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Đang xử lý...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Hoàn thành đơn hàng
          </div>
        )}
      </Button>

      {/* Order Info */}
      {!isEmpty && (
        <div className="mt-4 text-center text-xs text-white/60">
          <p>Loại: {ORDER_TYPES.find(t => t.value === currentOrder.type)?.label}</p>
          {currentOrder.customerName && (
            <p>Khách hàng: {currentOrder.customerName}</p>
          )}
        </div>
      )}
    </div>
  );
}
