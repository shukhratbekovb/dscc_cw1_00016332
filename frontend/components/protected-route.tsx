'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized && !accessToken) {
      router.push('/login');
    }
  }, [accessToken, isInitialized, router]);

  // While redirecting, still render children to avoid hydration mismatch
  if (!isInitialized) {
    return <>{children}</>;
  }

  if (!accessToken) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
