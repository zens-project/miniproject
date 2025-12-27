'use client';

import { useEffect } from 'react';
import { authService } from '@/lib/services/auth.service';

export function InitApp() {
  useEffect(() => {
    authService.initializeDefaultUser();
    console.log('✅ Default user initialized');
  }, []);

  return null;
}
