'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Settings, Gift, Mail } from 'lucide-react';
import { Button } from '@workspace/ui';

interface LoyaltySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: LoyaltySettings) => void;
  currentSettings?: LoyaltySettings;
}

export interface LoyaltySettings {
  rewardThreshold: number;
  emailEnabled: boolean;
  emailTemplate: string;
  rewardMessage: string;
}

export default function LoyaltySettings({
  isOpen,
  onClose,
  onSave,
  currentSettings
}: LoyaltySettingsProps) {
  const [settings, setSettings] = useState<LoyaltySettings>({
    rewardThreshold: 15,
    emailEnabled: true,
    emailTemplate: 'Chúc mừng bạn đã đủ {points} điểm! Bạn có thể đổi 1 ly miễn phí.',
    rewardMessage: 'Khách hàng {name} đã đủ {points} điểm để nhận thưởng!'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (settings.rewardThreshold < 1) {
      newErrors.rewardThreshold = 'Ngưỡng điểm phải lớn hơn 0';
    }

    if (settings.rewardThreshold > 1000) {
      newErrors.rewardThreshold = 'Ngưỡng điểm không được vượt quá 1000';
    }

    if (!settings.emailTemplate.trim()) {
      newErrors.emailTemplate = 'Mẫu email không được để trống';
    }

    if (!settings.rewardMessage.trim()) {
      newErrors.rewardMessage = 'Thông báo không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(settings);
    onClose();
  };

  const handleInputChange = (field: keyof LoyaltySettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
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
        className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center border border-amber-400/30">
              <Settings className="h-5 w-5 text-amber-300" />
            </div>
            <h2 className="text-xl font-bold text-white">Cài đặt Loyalty</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reward Threshold */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Gift className="h-4 w-4 inline mr-2" />
              Ngưỡng điểm nhận thưởng
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={settings.rewardThreshold}
              onChange={(e) => handleInputChange('rewardThreshold', parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400/50 backdrop-blur-sm ${
                errors.rewardThreshold 
                  ? 'border-red-400/50 focus:border-red-400/50' 
                  : 'border-white/30 focus:border-amber-400/50'
              }`}
              placeholder="Nhập số điểm"
            />
            {errors.rewardThreshold && (
              <p className="text-red-300 text-sm mt-1">{errors.rewardThreshold}</p>
            )}
            <p className="text-white/60 text-sm mt-1">
              Khách hàng sẽ nhận thưởng khi đạt đủ số điểm này
            </p>
          </div>

          {/* Email Enabled */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => handleInputChange('emailEnabled', e.target.checked)}
                className="w-4 h-4 text-amber-500 bg-white/10 border-white/30 rounded focus:ring-amber-400/50 focus:ring-2"
              />
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/80" />
                <span className="text-white/80">Gửi email thông báo tự động</span>
              </div>
            </label>
            <p className="text-white/60 text-sm mt-1 ml-7">
              Tự động gửi email khi khách hàng đủ điểm nhận thưởng
            </p>
          </div>

          {/* Email Template */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Mẫu email thông báo
            </label>
            <textarea
              value={settings.emailTemplate}
              onChange={(e) => handleInputChange('emailTemplate', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400/50 backdrop-blur-sm resize-none ${
                errors.emailTemplate 
                  ? 'border-red-400/50 focus:border-red-400/50' 
                  : 'border-white/30 focus:border-amber-400/50'
              }`}
              placeholder="Nhập mẫu email..."
            />
            {errors.emailTemplate && (
              <p className="text-red-300 text-sm mt-1">{errors.emailTemplate}</p>
            )}
            <p className="text-white/60 text-sm mt-1">
              Sử dụng {'{points}'} cho số điểm, {'{name}'} cho tên khách hàng
            </p>
          </div>

          {/* Reward Message */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Thông báo cho admin
            </label>
            <textarea
              value={settings.rewardMessage}
              onChange={(e) => handleInputChange('rewardMessage', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-amber-400/50 backdrop-blur-sm resize-none ${
                errors.rewardMessage 
                  ? 'border-red-400/50 focus:border-red-400/50' 
                  : 'border-white/30 focus:border-amber-400/50'
              }`}
              placeholder="Nhập thông báo..."
            />
            {errors.rewardMessage && (
              <p className="text-red-300 text-sm mt-1">{errors.rewardMessage}</p>
            )}
            <p className="text-white/60 text-sm mt-1">
              Thông báo hiển thị khi có khách hàng đủ điểm
            </p>
          </div>

          {/* Preview */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Xem trước:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-white/70">Email: </span>
                <span className="text-white">
                  {settings.emailTemplate
                    .replace('{points}', settings.rewardThreshold.toString())
                    .replace('{name}', 'Nguyễn Văn A')}
                </span>
              </div>
              <div>
                <span className="text-white/70">Thông báo: </span>
                <span className="text-white">
                  {settings.rewardMessage
                    .replace('{points}', settings.rewardThreshold.toString())
                    .replace('{name}', 'Nguyễn Văn A')}
                </span>
              </div>
            </div>
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
              className="flex-1 bg-gradient-to-r from-amber-500/90 to-orange-600/90 backdrop-blur-sm border border-white/20 text-white hover:from-amber-600/90 hover:to-orange-700/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu cài đặt
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
