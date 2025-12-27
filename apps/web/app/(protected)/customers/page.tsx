'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Gift,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  Sparkles,
  Download,
  Settings,
  X
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRecentRevenues, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/store/slices/sales-management.slice';
import LoyaltyBadge from '@/components/sales/loyalty-badge';
import CustomerForm from '@/components/customers/customer-form';
import LoyaltySettings, { LoyaltySettings as LoyaltySettingsType } from '@/components/customers/loyalty-settings';
import LoyaltyAlert, { ScrollingAlert } from '@/components/customers/loyalty-alert';
import { Customer } from '@/lib/types/sales';
import { toast } from 'sonner';
import Image from 'next/image';

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { customers, recentRevenues, isLoading } = useAppSelector(
    (state) => state.salesManagement
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showLoyaltySettings, setShowLoyaltySettings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Loyalty settings state
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettingsType>({
    rewardThreshold: 15,
    emailEnabled: true,
    emailTemplate: 'Chúc mừng bạn đã đủ {points} điểm! Bạn có thể đổi 1 ly miễn phí.',
    rewardMessage: 'Khách hàng {name} đã đủ {points} điểm để nhận thưởng!'
  });
  
  // Dismissed alerts
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchRecentRevenues());
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get customer purchase history
  const getCustomerPurchases = (customerId: string) => {
    return recentRevenues.filter(revenue => revenue.customerId === customerId);
  };

  // Calculate customer stats
  const getCustomerStats = (customerId: string) => {
    const purchases = getCustomerPurchases(customerId);
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const avgOrderValue = purchases.length > 0 ? totalSpent / purchases.length : 0;
    
    return {
      totalPurchases: purchases.length,
      totalSpent,
      avgOrderValue,
      lastPurchase: purchases.length > 0 ? purchases[0].createdAt : null
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN');
  };

  // Action handlers
  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowCustomerDetail(true);
  };

  const handleEditCustomer = (customerId: string) => {
    setEditingCustomer(customerId);
    setShowCreateForm(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setShowDeleteConfirm(customerId);
  };

  const confirmDeleteCustomer = async () => {
    if (showDeleteConfirm) {
      try {
        await dispatch(deleteCustomer(showDeleteConfirm)).unwrap();
        toast.success('Xóa khách hàng thành công!');
        setShowDeleteConfirm(null);
      } catch (error) {
        toast.error('Không thể xóa khách hàng. Vui lòng thử lại.');
      }
    }
  };

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setShowCreateForm(true);
  };

  const handleSaveCustomer = async (customerData: any) => {
    try {
      // Convert to CustomerFormData format
      const formData = {
        name: customerData.name || '',
        phone: customerData.phone || '',
        email: customerData.email,
        address: customerData.address
      };

      if (editingCustomer) {
        await dispatch(updateCustomer({ id: editingCustomer, updates: formData })).unwrap();
        toast.success('Cập nhật khách hàng thành công!');
      } else {
        await dispatch(createCustomer(formData)).unwrap();
        toast.success('Thêm khách hàng thành công!');
      }
      
      setShowCreateForm(false);
      setEditingCustomer(null);
    } catch (error) {
      toast.error('Không thể lưu thông tin khách hàng. Vui lòng thử lại.');
    }
  };

  const handleSendEmail = async (customer: Customer) => {
    try {
      const emailData = {
        to: customer.email!,
        subject: 'Thông báo tích điểm - Coffee Shop',
        html: loyaltySettings.emailTemplate
          .replace('{points}', customer.loyaltyPoints.toString())
          .replace('{name}', customer.name),
        customerName: customer.name,
        points: customer.loyaltyPoints
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      toast.success(`Đã gửi email thành công cho ${customer.name}!`);
    } catch (error) {
      toast.error(`Không thể gửi email cho ${customer.name}. Vui lòng thử lại.`);
    }
  };

  const handleExportData = () => {
    try {
      const csvContent = [
        ['Tên', 'Số điện thoại', 'Email', 'Điểm tích lũy', 'Tổng đơn hàng', 'Ngày tham gia'],
        ...customers.map(customer => [
          customer.name,
          customer.phone,
          customer.email || '',
          customer.loyaltyPoints.toString(),
          customer.totalPurchases.toString(),
          new Date(customer.createdAt).toLocaleDateString('vi-VN')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Xuất dữ liệu thành công!');
    } catch (error) {
      toast.error('Không thể xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  const handleApplyFilters = () => {
    setShowLoyaltySettings(true);
  };

  const handleSaveLoyaltySettings = (settings: LoyaltySettingsType) => {
    setLoyaltySettings(settings);
    toast.success('Cài đặt loyalty đã được lưu!');
  };

  const handleDismissAlert = (customerId: string) => {
    setDismissedAlerts(prev => new Set([...prev, customerId]));
  };

  // Get eligible customers for alerts (not dismissed)
  const eligibleCustomers = customers.filter(customer => 
    customer.loyaltyPoints >= loyaltySettings.rewardThreshold && 
    !dismissedAlerts.has(customer.id)
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
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Quản lý Khách hàng</h1>
                <p className="text-amber-200/80">
                  Quản lý thông tin khách hàng và chương trình loyalty
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleCreateCustomer}
              className="bg-gradient-to-r from-purple-500/90 to-indigo-600/90 backdrop-blur-sm border border-white/20 text-white hover:from-purple-600/90 hover:to-indigo-700/90 shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
            <Button
              onClick={handleExportData}
              variant="ghost"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất dữ liệu
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-400/30">
                <Users className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-blue-200/80">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-white">{customers.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
                <Star className="h-6 w-6 text-green-300" />
              </div>
              <div>
                <p className="text-sm text-green-200/80">Khách VIP</p>
                <p className="text-2xl font-bold text-white">
                  {customers.filter(c => c.loyaltyPoints >= 50).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-400/30">
                <Gift className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-sm text-amber-200/80">Có phần thưởng</p>
                <p className="text-2xl font-bold text-white">
                  {customers.filter(c => c.loyaltyPoints >= 10).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
                <ShoppingBag className="h-6 w-6 text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-purple-200/80">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-white">{recentRevenues.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleApplyFilters}
                variant="ghost" 
                size="sm"
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Customer List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <h2 className="text-lg font-semibold text-white">
              Danh sách khách hàng ({filteredCustomers.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
              <p className="mt-2 text-white/70">Đang tải...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/70">
                {searchTerm ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
            {filteredCustomers.map((customer) => {
              const stats = getCustomerStats(customer.id);
              
              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div className="h-12 w-12 bg-gradient-to-br from-purple-400/80 to-indigo-600/80 rounded-full flex items-center justify-center text-white font-semibold border border-white/20 backdrop-blur-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Customer Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white">{customer.name}</h3>
                          <LoyaltyBadge 
                            loyaltyPoints={customer.loyaltyPoints}
                            totalPurchases={customer.totalPurchases}
                            size="sm"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-white/70">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            {stats.totalPurchases} đơn hàng
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {customer.lastPurchaseDate 
                              ? formatDate(customer.lastPurchaseDate)
                              : 'Chưa mua hàng'
                            }
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {formatCurrency(stats.totalSpent)}
                        </p>
                        <p className="text-sm text-white/70">
                          TB: {formatCurrency(stats.avgOrderValue)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCustomer(customer.id)}
                        className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditCustomer(customer.id)}
                        className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="bg-white/10 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-400/30"
                        title="Xóa khách hàng"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </div>
          )}
        </motion.div>

        {/* Customer Detail Modal */}
        {showCustomerDetail && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCustomerDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const customer = customers.find(c => c.id === selectedCustomer);
                const stats = getCustomerStats(selectedCustomer);
                const purchases = getCustomerPurchases(selectedCustomer);
                
                if (!customer) return null;
                
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">Chi tiết khách hàng</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCustomerDetail(false)}
                        className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gradient-to-br from-purple-400/80 to-indigo-600/80 rounded-full flex items-center justify-center text-white font-bold text-xl border border-white/20">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{customer.name}</h3>
                            <LoyaltyBadge 
                              loyaltyPoints={customer.loyaltyPoints}
                              totalPurchases={customer.totalPurchases}
                              size="md"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-white/80">
                            <Phone className="h-4 w-4" />
                            <span>{customer.phone}</span>
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-2 text-white/80">
                              <Mail className="h-4 w-4" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-white/80">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Tham gia: {formatDate(customer.createdAt)}
                            </span>
                          </div>
                          {customer.lastPurchaseDate && (
                            <div className="flex items-center gap-2 text-white/80">
                              <ShoppingBag className="h-4 w-4" />
                              <span>
                                Mua cuối: {formatDate(customer.lastPurchaseDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Thống kê</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-sm text-white/70">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold text-white">{stats.totalPurchases}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-sm text-white/70">Tổng chi tiêu</p>
                            <p className="text-lg font-bold text-white">{formatCurrency(stats.totalSpent)}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-sm text-white/70">Trung bình/đơn</p>
                            <p className="text-lg font-bold text-white">{formatCurrency(stats.avgOrderValue)}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-sm text-white/70">Điểm tích lũy</p>
                            <p className="text-2xl font-bold text-white">{customer.loyaltyPoints}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Purchase History */}
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Lịch sử mua hàng</h4>
                      {purchases.length === 0 ? (
                        <p className="text-white/70 text-center py-4">Chưa có đơn hàng nào</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {purchases.slice(0, 10).map((purchase) => (
                            <div key={purchase.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                              <div>
                                <p className="text-white font-medium">Đơn hàng #{purchase.id.slice(-6)}</p>
                                <p className="text-white/70 text-sm">{formatDate(purchase.createdAt)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-semibold">{formatCurrency(purchase.total)}</p>
                                <p className="text-white/70 text-sm">{purchase.items.length} món</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={() => {
                          setShowCustomerDetail(false);
                          handleEditCustomer(customer.id);
                        }}
                        className="bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-sm border border-white/20 text-white hover:from-blue-600/90 hover:to-indigo-700/90"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                      <Button
                        onClick={() => {
                          setShowCustomerDetail(false);
                          handleDeleteCustomer(customer.id);
                        }}
                        variant="ghost"
                        className="bg-red-500/20 border border-red-400/30 text-red-200 hover:bg-red-500/30"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa khách hàng
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const customer = customers.find(c => c.id === showDeleteConfirm);
                if (!customer) return null;
                
                return (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-400/30">
                        <Trash2 className="h-6 w-6 text-red-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Xóa khách hàng</h3>
                        <p className="text-white/70 text-sm">Hành động này không thể hoàn tác</p>
                      </div>
                    </div>

                    <p className="text-white/80 mb-6">
                      Bạn có chắc chắn muốn xóa khách hàng <strong className="text-white">{customer.name}</strong>? 
                      Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                    </p>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowDeleteConfirm(null)}
                        variant="ghost"
                        className="flex-1 bg-white/10 border border-white/20 text-white hover:bg-white/20"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={confirmDeleteCustomer}
                        className="flex-1 bg-red-500/90 border border-red-400/30 text-white hover:bg-red-600/90"
                      >
                        Xóa khách hàng
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}

        {/* Customer Form Modal */}
        <CustomerForm
          customer={editingCustomer ? customers.find(c => c.id === editingCustomer) : null}
          isOpen={showCreateForm}
          onClose={() => {
            setShowCreateForm(false);
            setEditingCustomer(null);
          }}
          onSave={handleSaveCustomer}
          isLoading={isSubmitting}
        />

        {/* Loyalty Settings Modal */}
        <LoyaltySettings
          isOpen={showLoyaltySettings}
          onClose={() => setShowLoyaltySettings(false)}
          onSave={handleSaveLoyaltySettings}
          currentSettings={loyaltySettings}
        />

        {/* Loyalty Alerts */}
        <LoyaltyAlert
          customers={eligibleCustomers}
          rewardThreshold={loyaltySettings.rewardThreshold}
          onSendEmail={handleSendEmail}
          onDismiss={handleDismissAlert}
        />

        {/* Scrolling Alert */}
        <ScrollingAlert
          customers={customers}
          rewardThreshold={loyaltySettings.rewardThreshold}
        />
      </div>
    </div>
  );
}
