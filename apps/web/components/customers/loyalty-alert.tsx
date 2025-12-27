'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Mail, Check } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Customer } from '@/lib/types/sales';

interface LoyaltyAlertProps {
  customers: Customer[];
  rewardThreshold: number;
  onSendEmail: (customer: Customer) => void;
  onDismiss: (customerId: string) => void;
}

export default function LoyaltyAlert({
  customers,
  rewardThreshold,
  onSendEmail,
  onDismiss
}: LoyaltyAlertProps) {
  const [eligibleCustomers, setEligibleCustomers] = useState<Customer[]>([]);
  const [sentEmails, setSentEmails] = useState<Set<string>>(new Set());

  useEffect(() => {
    const eligible = customers.filter(customer => 
      customer.loyaltyPoints >= rewardThreshold && 
      customer.email && 
      customer.email.trim() !== ''
    );
    setEligibleCustomers(eligible);
  }, [customers, rewardThreshold]);

  const handleSendEmail = async (customer: Customer) => {
    try {
      await onSendEmail(customer);
      setSentEmails(prev => new Set([...prev, customer.id]));
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleDismiss = (customerId: string) => {
    onDismiss(customerId);
    setEligibleCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  if (eligibleCustomers.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {eligibleCustomers.slice(0, 3).map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="bg-gradient-to-r from-amber-500/90 to-orange-600/90 backdrop-blur-sm rounded-xl border border-amber-400/30 shadow-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift className="h-5 w-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white text-sm truncate">
                    {customer.name}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(customer.id)}
                    className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <p className="text-white/90 text-xs mb-3">
                  Đã đủ {customer.loyaltyPoints} điểm để nhận thưởng!
                </p>
                
                <div className="flex gap-2">
                  {customer.email && (
                    <Button
                      size="sm"
                      onClick={() => handleSendEmail(customer)}
                      disabled={sentEmails.has(customer.id)}
                      className="h-7 px-3 text-xs bg-white/20 border border-white/30 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sentEmails.has(customer.id) ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Đã gửi
                        </>
                      ) : (
                        <>
                          <Mail className="h-3 w-3 mr-1" />
                          Gửi email
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Animated progress bar */}
            <div className="mt-3 bg-white/20 rounded-full h-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: index * 0.1 }}
                className="h-full bg-white/60"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Show count if more than 3 customers */}
      {eligibleCustomers.length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-3 text-center"
        >
          <p className="text-white/80 text-sm">
            +{eligibleCustomers.length - 3} khách hàng khác đủ điểm
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Scrolling text alert for admin dashboard
export function ScrollingAlert({ 
  customers, 
  rewardThreshold 
}: { 
  customers: Customer[], 
  rewardThreshold: number 
}) {
  const eligibleCustomers = customers.filter(customer => 
    customer.loyaltyPoints >= rewardThreshold
  );

  if (eligibleCustomers.length === 0) {
    return null;
  }

  const alertText = eligibleCustomers.length === 1 
    ? `🎉 ${eligibleCustomers[0].name} đã đủ ${eligibleCustomers[0].loyaltyPoints} điểm để nhận thưởng!`
    : `🎉 ${eligibleCustomers.length} khách hàng đã đủ điểm nhận thưởng: ${eligibleCustomers.slice(0, 3).map(c => c.name).join(', ')}${eligibleCustomers.length > 3 ? '...' : ''}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 overflow-hidden">
      <motion.div
        animate={{ x: ['100%', '-100%'] }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
        className="whitespace-nowrap text-sm font-medium"
      >
        {alertText}
      </motion.div>
    </div>
  );
}
