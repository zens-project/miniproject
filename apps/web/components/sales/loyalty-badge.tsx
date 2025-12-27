'use client';

import { motion } from 'motion/react';
import { Star, Gift, Crown } from 'lucide-react';
import { LOYALTY_CONFIG } from '@/lib/types/sales';

interface LoyaltyBadgeProps {
  loyaltyPoints: number;
  totalPurchases: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export default function LoyaltyBadge({ 
  loyaltyPoints, 
  totalPurchases, 
  size = 'md',
  showProgress = true 
}: LoyaltyBadgeProps) {
  
  const progress = (loyaltyPoints % LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK) / LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK;
  const pointsToNextReward = LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK - (loyaltyPoints % LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK);
  const rewardsEarned = Math.floor(loyaltyPoints / LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK);
  
  // Determine badge level and styling
  const getBadgeLevel = () => {
    if (loyaltyPoints >= 50) return { level: 'vip', icon: Crown, color: 'from-yellow-400 to-orange-500', text: 'VIP' };
    if (loyaltyPoints >= 20) return { level: 'gold', icon: Star, color: 'from-yellow-400 to-yellow-600', text: 'Gold' };
    if (loyaltyPoints >= 10) return { level: 'silver', icon: Gift, color: 'from-gray-300 to-gray-500', text: 'Silver' };
    return { level: 'bronze', icon: Star, color: 'from-amber-400 to-amber-600', text: 'Bronze' };
  };

  const badgeInfo = getBadgeLevel();
  const IconComponent = badgeInfo.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2', 
    lg: 'text-base px-4 py-3'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="space-y-2">
      {/* Main Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${badgeInfo.color} text-white font-semibold ${sizeClasses[size]} shadow-lg`}
      >
        <IconComponent className={iconSizes[size]} />
        <span>{loyaltyPoints} điểm</span>
        {rewardsEarned > 0 && (
          <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
            {rewardsEarned} 🎁
          </div>
        )}
      </motion.div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/70">
            <span>{loyaltyPoints % LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK}/{LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK}</span>
            <span>{pointsToNextReward === LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK ? 'Hoàn thành!' : `${pointsToNextReward} điểm nữa`}</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${badgeInfo.color} rounded-full relative`}
            >
              {progress > 0.8 && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-white/30 rounded-full"
                />
              )}
            </motion.div>
          </div>
          
          <div className="text-xs text-white/60 text-center">
            {pointsToNextReward === LOYALTY_CONFIG.POINTS_FOR_FREE_DRINK 
              ? '🎉 Đã đủ điểm nhận quà!' 
              : `Còn ${pointsToNextReward} điểm để nhận ly cà phê miễn phí`
            }
          </div>
        </div>
      )}

      {/* Stats */}
      {size !== 'sm' && (
        <div className="flex gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>{totalPurchases} đơn hàng</span>
          </div>
          {rewardsEarned > 0 && (
            <div className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              <span>{rewardsEarned} phần thưởng</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
