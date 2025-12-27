'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Gift, Star, X, Crown } from 'lucide-react';
import { Button } from '@workspace/ui';
import { LoyaltyNotification } from '@/lib/types/sales';

interface LoyaltyNotificationProps {
  notifications: LoyaltyNotification[];
  onMarkAsRead: (notificationId: string) => void;
  onClearAll: () => void;
}

export default function LoyaltyNotificationComponent({ 
  notifications, 
  onMarkAsRead, 
  onClearAll 
}: LoyaltyNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Show notification badge when there are new notifications
  useEffect(() => {
    if (unreadCount > 0) {
      setShowBadge(true);
    }
  }, [unreadCount]);

  // Auto-show latest notification as toast
  useEffect(() => {
    const latestNotification = notifications.find(n => !n.isRead);
    if (latestNotification && latestNotification.type === 'reward_earned') {
      // Show celebration animation for reward earned
      setShowBadge(true);
    }
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reward_earned':
        return <Gift className="h-5 w-5 text-yellow-400" />;
      case 'points_added':
        return <Star className="h-5 w-5 text-blue-400" />;
      case 'milestone_reached':
        return <Crown className="h-5 w-5 text-purple-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
        size="sm"
      >
        <Bell className="h-5 w-5" />
        
        {/* Notification Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Animation for New Notifications */}
        {showBadge && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-yellow-400/30"
          />
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 z-50 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Thông báo tích điểm
                </h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <Button
                      onClick={onClearAll}
                      className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 text-xs px-2 py-1"
                      size="sm"
                    >
                      Xóa tất cả
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-1"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Chưa có thông báo nào</p>
                    <p className="text-sm">Thông báo tích điểm sẽ hiển thị ở đây</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        notification.isRead
                          ? 'bg-white/5 border-white/10 text-white/70'
                          : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 text-white'
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          onMarkAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.isRead ? 'text-white/70' : 'text-white'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-white/50 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                          </div>
                        )}
                      </div>

                      {/* Special styling for reward notifications */}
                      {notification.type === 'reward_earned' && !notification.isRead && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/10 to-orange-400/10 pointer-events-none"
                        />
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <p className="text-xs text-white/60">
                    {unreadCount > 0 
                      ? `${unreadCount} thông báo chưa đọc`
                      : 'Tất cả thông báo đã được đọc'
                    }
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Toast for New Rewards */}
      <AnimatePresence>
        {notifications.some(n => !n.isRead && n.type === 'reward_earned') && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-4 right-4 z-50 p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl max-w-sm"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Gift className="h-8 w-8" />
              </motion.div>
              <div>
                <h4 className="font-bold">🎉 Chúc mừng!</h4>
                <p className="text-sm">
                  {notifications.find(n => !n.isRead && n.type === 'reward_earned')?.customerName} 
                  {' '}đã nhận được phần thưởng!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
