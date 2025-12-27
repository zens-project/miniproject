'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfile } from '@/store/slices/auth.slice';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Edit3, 
  Shield, 
  Bell,
  Palette,
  Coffee,
  Sparkles,
  Upload,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { Button } from '@workspace/ui';
import Image from 'next/image';


export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update editedProfile when user data changes
  useEffect(() => {
    if (user) {
      setEditedProfile({
        ...user,
        phone: user.phone || '',
        address: user.address || '',
        joinedDate: user.joinedDate || new Date().toISOString(),
        preferences: user.preferences || {
          theme: 'coffee',
          notifications: true,
          emailUpdates: true,
          language: 'vi'
        }
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Đang tải thông tin người dùng...</div>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setEditedProfile(prev => prev ? ({ ...prev, avatar: result }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    
    try {
      await dispatch(updateProfile(editedProfile)).unwrap();
      setIsEditing(false);
      setAvatarPreview(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(user);
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedProfile(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setEditedProfile(prev => prev ? ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }) : null);
  };

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
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-4 shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User className="h-8 w-8 text-white" strokeWidth={2.5} />
                <motion.div
                  className="absolute -right-1 -top-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-300" fill="currentColor" />
                </motion.div>
              </motion.div>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Hồ sơ cá nhân
                </h1>
                <p className="text-lg text-amber-100/90 mt-1">
                  Quản lý thông tin và cài đặt tài khoản
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                    disabled={isLoading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                      {(avatarPreview || user.avatar) ? (
                        <img
                          src={avatarPreview || user.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-white/60" />
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {user.name}
                </h2>
                <p className="text-amber-200 mb-1">{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</p>
              </div>
            </div>
          </motion.div>

          {/* Information & Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Thông tin cá nhân</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm"
                    />
                  ) : (
                    <p className="text-white">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm"
                    />
                  ) : (
                    <p className="text-white">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm"
                    />
                  ) : (
                    <p className="text-white">{user.phone || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile?.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm resize-none"
                    />
                  ) : (
                    <p className="text-white">{user.address || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
