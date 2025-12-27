'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, User, Phone, Mail } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { CustomerFormData } from '@/lib/types/sales';

interface CreateCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export default function CreateCustomerDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting = false 
}: CreateCustomerDialogProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên khách hàng là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || undefined,
      });
      
      // Reset form
      setFormData({ name: '', phone: '', email: '' });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '', email: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-amber-900/90 via-stone-900/90 to-neutral-900/90 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              Thêm khách hàng mới
            </div>
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Customer Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Tên khách hàng <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nhập tên khách hàng..."
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all ${
                errors.name 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            {errors.name && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Phone Number */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              <Phone className="inline h-4 w-4 mr-2" />
              Số điện thoại <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="0901234567"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all ${
                errors.phone 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            {errors.phone && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.phone}
              </motion.p>
            )}
          </motion.div>

          {/* Email (Optional) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-white/90 mb-2">
              <Mail className="inline h-4 w-4 mr-2" />
              Email (tùy chọn)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@gmail.com"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all ${
                errors.email 
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                  : 'border-white/30'
              }`}
            />
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-300"
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-3 pt-4 border-t border-white/10"
          >
            <Button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang tạo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Tạo khách hàng
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
