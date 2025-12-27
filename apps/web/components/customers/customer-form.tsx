'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, User, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Customer } from '@/lib/types/sales';

interface CustomerFormProps {
  customer?: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Partial<Customer>) => void;
  isLoading?: boolean;
}

export default function CustomerForm({
  customer,
  isOpen,
  onClose,
  onSave,
  isLoading = false
}: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: ''
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên khách hàng là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const customerData: Partial<Customer> = {
      ...formData,
      phone: formData.phone.replace(/\s/g, ''),
      email: formData.email || undefined
    };

    if (customer) {
      customerData.id = customer.id;
    }

    onSave(customerData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {customer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Tên khách hàng *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm ${
                errors.name 
                  ? 'border-red-400/50 focus:border-red-400/50' 
                  : 'border-white/30 focus:border-purple-400/50'
              }`}
              placeholder="Nhập tên khách hàng"
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm ${
                errors.phone 
                  ? 'border-red-400/50 focus:border-red-400/50' 
                  : 'border-white/30 focus:border-purple-400/50'
              }`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-red-300 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 backdrop-blur-sm ${
                errors.email 
                  ? 'border-red-400/50 focus:border-red-400/50' 
                  : 'border-white/30 focus:border-purple-400/50'
              }`}
              placeholder="Nhập email (tùy chọn)"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Địa chỉ
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm resize-none"
              placeholder="Nhập địa chỉ (tùy chọn)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="flex-1 bg-white/10 border border-white/20 text-white hover:bg-white/20"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-500/90 to-indigo-600/90 backdrop-blur-sm border border-white/20 text-white hover:from-purple-600/90 hover:to-indigo-700/90"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {customer ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
