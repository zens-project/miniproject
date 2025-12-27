'use client';

import { motion } from 'motion/react';
import { ShoppingCart, User, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@workspace/ui';
import { RevenueEntry } from '@/lib/types/sales';

interface RecentOrdersListProps {
  orders: RevenueEntry[];
  isLoading: boolean;
  onEditOrder?: (order: RevenueEntry) => void;
  onDeleteOrder?: (order: RevenueEntry) => void;
}

export default function RecentOrdersList({ 
  orders, 
  isLoading, 
  onEditOrder, 
  onDeleteOrder 
}: RecentOrdersListProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/20 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-white/20 rounded animate-pulse w-24"></div>
                </div>
              </div>
              <div className="h-5 bg-white/20 rounded animate-pulse w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl"
      >
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Chưa có đơn hàng nào
        </h3>
        <p className="text-white/60">
          Các đơn hàng đã hoàn thành sẽ hiển thị ở đây
        </p>
      </motion.div>
    );
  }

  // Group orders by date
  const groupedOrders = orders.reduce((groups, order) => {
    const dateKey = new Date(order.createdAt).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(order);
    return groups;
  }, {} as Record<string, RevenueEntry[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedOrders).map(([dateKey, dayOrders]) => (
        <motion.div
          key={dateKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-4 w-4 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">
              {formatDate(dayOrders[0].createdAt)}
            </h3>
            <div className="text-sm text-white/60">
              ({dayOrders.length} đơn)
            </div>
          </div>

          <div className="space-y-3">
            {dayOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="group rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Customer Avatar */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">
                          {order.customerName}
                        </h4>
                        <span className="text-xs text-white/60">
                          #{order.orderId.slice(-6)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span>{order.items.length} sản phẩm</span>
                        <span>•</span>
                        <span>{formatTime(order.createdAt)}</span>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mt-2 text-xs text-white/60">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <span key={idx}>
                            {item.productName} x{item.quantity}
                            {idx < Math.min(order.items.length, 2) - 1 && ', '}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span> và {order.items.length - 2} sản phẩm khác</span>
                        )}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-green-400">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEditOrder && (
                      <Button
                        onClick={() => onEditOrder(order)}
                        className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30 p-2"
                        size="sm"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {onDeleteOrder && (
                      <Button
                        onClick={() => onDeleteOrder(order)}
                        className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 p-2"
                        size="sm"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
