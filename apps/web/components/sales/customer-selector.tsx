'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Search, Plus, Check, X } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Customer } from '@/lib/types/sales';
import CreateCustomerDialog from './create-customer-dialog';
import LoyaltyBadge from './loyalty-badge';

interface CustomerSelectorProps {
  customers: Customer[];
  selectedCustomerId?: string;
  selectedCustomerName?: string;
  onSelectCustomer: (customerId?: string, customerName?: string) => void;
  onCreateCustomer: (customerData: any) => Promise<void>;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export default function CustomerSelector({
  customers,
  selectedCustomerId,
  selectedCustomerName,
  onSelectCustomer,
  onCreateCustomer,
  isLoading = false,
  isSubmitting = false
}: CustomerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      (customer.email && customer.email.toLowerCase().includes(query))
    );
  }, [customers, searchQuery]);

  const handleSelectCustomer = (customer?: Customer) => {
    if (customer) {
      onSelectCustomer(customer.id, customer.name);
    } else {
      onSelectCustomer('others', 'Khách lẻ');
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCreateCustomer = async (customerData: any) => {
    try {
      await onCreateCustomer(customerData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const displayName = selectedCustomerName || 'Chọn khách hàng';
  const isGuestCustomer = selectedCustomerId === 'others';

  return (
    <>
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading || isSubmitting}
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 justify-between"
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="truncate">{displayName}</span>
          </div>
          {selectedCustomerId && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onSelectCustomer(undefined, undefined);
              }}
              className="bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 p-1 h-6 w-6 ml-2"
              size="sm"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-amber-200/30 bg-gradient-to-br from-amber-900/95 via-orange-900/95 to-stone-900/95 backdrop-blur-xl shadow-2xl"
            >
              <div className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm khách hàng..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/20 border border-amber-300/30 text-white placeholder-white/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all"
                  />
                </div>

                {/* Guest Customer Option */}
                <motion.button
                  onClick={() => handleSelectCustomer()}
                  className={`w-full p-3 rounded-lg text-left transition-all mb-2 ${
                    isGuestCustomer
                      ? 'bg-amber-500/30 border border-amber-400/50 text-white shadow-md'
                      : 'bg-black/20 hover:bg-black/30 text-white border border-white/10 hover:border-amber-400/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-600/40 flex items-center justify-center border border-gray-500/30">
                        <User className="h-4 w-4 text-gray-300" />
                      </div>
                      <div>
                        <p className="font-medium">Khách lẻ</p>
                        <p className="text-sm opacity-70">Không cần thông tin khách hàng</p>
                      </div>
                    </div>
                    {isGuestCustomer && <Check className="h-4 w-4 text-amber-400" />}
                  </div>
                </motion.button>

                {/* Customer List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredCustomers.length === 0 ? (
                    <div className="text-center py-4 text-white/60">
                      <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchQuery ? 'Không tìm thấy khách hàng' : 'Chưa có khách hàng nào'}
                      </p>
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <motion.button
                        key={customer.id}
                        onClick={() => handleSelectCustomer(customer)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedCustomerId === customer.id
                            ? 'bg-blue-500/30 border border-blue-400/50 text-white shadow-md'
                            : 'bg-black/20 hover:bg-black/30 text-white border border-white/10 hover:border-blue-400/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500/40 flex items-center justify-center border border-blue-400/30">
                              <User className="h-4 w-4 text-blue-300" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm opacity-70">{customer.phone}</p>
                              <div className="mt-1">
                                <LoyaltyBadge 
                                  loyaltyPoints={customer.loyaltyPoints}
                                  totalPurchases={customer.totalPurchases}
                                  size="sm"
                                  showProgress={false}
                                />
                              </div>
                            </div>
                          </div>
                          {selectedCustomerId === customer.id && (
                            <Check className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>

                {/* Create New Customer */}
                <div className="border-t border-amber-300/20 pt-4 mt-4">
                  <Button
                    onClick={() => {
                      setIsCreateDialogOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo khách hàng mới
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Customer Dialog */}
      <CreateCustomerDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateCustomer}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
