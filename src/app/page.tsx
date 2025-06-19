'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/use-mock-auth';

export default function HomePage() {
  const { user, loading } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      <p className="ml-4 text-lg text-foreground">Loading BlockPay...</p>
    </div>
  );
}
