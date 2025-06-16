'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types'; // Assuming User type is defined

const MOCK_USER_KEY = 'mockUser';

export function useMockAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(MOCK_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(MOCK_USER_KEY);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password?: string) => {
    // In a real app, you'd fetch user data from an API
    const mockUserData: User = {
      id: 'user-123',
      name: email.split('@')[0] || 'Admin User',
      email: email,
      avatarUrl: 'https://placehold.co/100x100.png?text=A',
      kycStatus: 'verified',
      walletAddress: '0xMockWalletAddress123',
      loyaltyPoints: 1500,
      cryptoBalance: 2.5,
      accountStatus: 'active',
      lastLogin: new Date().toISOString(),
      joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // Joined 30 days ago
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUserData));
    setUser(mockUserData);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
    router.push('/login');
  }, [router]);

  return { user, loading, login, logout };
}
