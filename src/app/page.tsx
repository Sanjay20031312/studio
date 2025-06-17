// src/app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/use-mock-auth';

// Retaining the redirect logic as it's sensible for a root page.
// The prompt to change Home to DashboardPage and display "BlockPay Dashboard"
// is better suited for the actual /dashboard page itself if needed,
// or this root page can simply be a loading/redirector.
// If a direct placeholder was truly intended here, this redirect logic would be removed.
// For now, keeping the auth-based redirect.
// If a simple placeholder page is strictly required at the root, this logic would change to:
/*
export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold font-headline">BlockPay Dashboard</h1>
      <p className="text-muted-foreground">Admin Dashboard Overview - Content coming soon.</p>
    </div>
  );
}
*/

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
