'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

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
      localStorage.removeItem(MOCK_USER_KEY); // Clear corrupted data
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password?: string) => {
    setLoading(true);
    const mockUserData: User = {
      id: 'user-admin-blockpay',
      name: email.split('@')[0] || 'Admin User', // Extract name from email or default
      email: email,
      avatarUrl: `https://placehold.co/100x100.png?text=${(email.split('@')[0] || 'A').charAt(0).toUpperCase()}`,
      kycStatus: 'verified',
      walletAddress: '0xAbCdEf1234567890aBcDeF1234567890AbCdEf12',
      loyaltyPoints: 1500,
      cryptoBalance: 2.5,
      accountStatus: 'active',
      lastLogin: new Date().toISOString(),
      joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // Joined 30 days ago
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUserData));
    setUser(mockUserData);
    router.push('/dashboard'); // Navigate after setting user
    // setLoading(false); // No need to set loading false here, page transition will happen
  }, [router]);

  const logout = useCallback(() => {
    setLoading(true);
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
    router.push('/login'); // Navigate after clearing user
    // setLoading(false); // Handled by page transition/useEffect
  }, [router]);

  return { user, loading, login, logout };
}
