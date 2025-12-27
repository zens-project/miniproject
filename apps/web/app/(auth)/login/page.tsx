'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Button, Input, Label } from '@workspace/ui';
import { Coffee, Mail, Lock, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearError } from '@/store/slices/auth.slice';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success('Đăng nhập thành công!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/5 to-yellow-400/10" />
      </div>

      {/* Floating Coffee Beans Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-3 w-3 rounded-full bg-amber-400/20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: window.innerHeight + 20,
              x: Math.random() * window.innerWidth,
              rotate: 360
            }}
            transition={{ 
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo & Title */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mb-6 flex justify-center">
            <motion.div 
              className="relative rounded-full bg-linear-to-br from-amber-400 to-orange-600 p-5 shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Coffee className="h-14 w-14 text-white" strokeWidth={2.5} />
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
                <Sparkles className="h-6 w-6 text-yellow-300" fill="currentColor" />
              </motion.div>
            </motion.div>
          </div>
          <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
            Đăng nhập
          </h1>
          <p className="text-lg text-amber-900/80">
            Quản lý coffee shop của bạn
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl border border-amber-200 bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-amber-900">Chào mừng trở lại</h2>
            <p className="mt-1 text-amber-700">
              Đăng nhập để tiếp tục sử dụng hệ thống
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-900 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-600" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@coffee.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-amber-300 bg-white pl-10 text-amber-900 placeholder:text-amber-400 focus:border-amber-500 focus:ring-amber-500/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-900 font-medium">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-600" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-amber-300 bg-white pl-10 text-amber-900 placeholder:text-amber-400 focus:border-amber-500 focus:ring-amber-500/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-red-500/20 border border-red-400/30 p-3 text-sm text-red-100"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:from-amber-600 hover:to-orange-700 hover:shadow-xl"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Coffee className="h-5 w-5" />
                  </motion.div>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </Button>

            <motion.div 
              className="rounded-lg border border-amber-300 bg-amber-100 p-3 text-sm text-amber-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <strong className="text-amber-800">Demo:</strong> admin@coffee.com / admin123
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
