'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/header';
import { AppFooter } from '@/components/layout/footer';
import { useMockAuth } from '@/hooks/use-mock-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || (!loading && !user)) { // Show loader if loading OR if not loading and no user (before redirect kicks in)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
         <p className="ml-4 text-lg text-foreground">Loading BlockPay Admin...</p>
      </div>
    );
  }
  
  // This check is an additional safeguard, useEffect should handle the redirect.
  if (!user) { 
    return null; // Or a minimal loading state, as redirect is in progress
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen w-full flex-col">
        <AppHeader user={user} />
        <main className="flex-1 overflow-y-auto bg-background p-4 pt-6 md:p-8">
          {children}
        </main>
        <AppFooter user={user} />
      </div>
    </QueryClientProvider>
  );
}
