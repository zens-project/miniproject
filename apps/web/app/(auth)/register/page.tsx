'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Button, Input, Label } from '@workspace/ui';
import { Coffee, Mail, Lock, User, Sparkles, UserPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register } from '@/store/slices/auth.slice';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await dispatch(register({ name, email, password })).unwrap();
      toast.success('Đăng ký thành công!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/5 to-yellow-400/10" />
      </div>

      {/* Floating Coffee Steam Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-amber-300/30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 20,
              scale: Math.random() * 0.8 + 0.3,
              opacity: 0.6
            }}
            animate={{ 
              y: -20,
              x: Math.random() * window.innerWidth,
              scale: 0,
              opacity: 0
            }}
            transition={{ 
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 1.5
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
              className="relative rounded-full bg-linear-to-br from-orange-400 to-amber-600 p-5 shadow-2xl"
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <UserPlus className="h-14 w-14 text-white" strokeWidth={2.5} />
              <motion.div
                className="absolute -left-1 -top-1"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -10, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-6 w-6 text-yellow-300" fill="currentColor" />
              </motion.div>
            </motion.div>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white drop-shadow-lg">
            Đăng ký
          </h1>
          <p className="text-lg text-amber-100/90">
            Tạo tài khoản mới để bắt đầu
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Tạo tài khoản</h2>
            <p className="mt-1 text-amber-100/80">
              Điền thông tin để đăng ký tài khoản mới
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Họ tên</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-300" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/30 bg-white/20 pl-10 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-amber-400/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/30 bg-white/20 pl-10 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-amber-400/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/30 bg-white/20 pl-10 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-amber-400/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-300" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-white/30 bg-white/20 pl-10 text-white placeholder:text-white/50 focus:border-amber-400 focus:ring-amber-400/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-red-400/30 bg-red-500/20 p-3 text-sm text-red-100"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-lg hover:from-orange-600 hover:to-amber-700 hover:shadow-xl"
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
                  Đang đăng ký...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Đăng ký
                </span>
              )}
            </Button>

            <div className="text-center text-sm text-white/90">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="font-semibold text-amber-300 hover:text-amber-200 hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
