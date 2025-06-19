import type React from 'react';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'payment' | 'withdrawal' | 'deposit' | 'refund';
  timestamp: string; // ISO string
  merchant?: string;
  blockchainTxHash?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  kycStatus: 'verified' | 'pending' | 'rejected' | 'not_started';
  walletAddress: string;
  loyaltyPoints: number;
  cryptoBalance: number;
  accountStatus: 'active' | 'suspended';
  lastLogin: string; // ISO string
  joinDate: string; // ISO string
}

export interface BlockchainNetworkStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  blockHeight: number;
  lastBlockTime: string; // ISO string
  avgGasPrice: string;
}

export interface SmartContractLog {
  id: string;
  contractAddress: string;
  functionCalled: string;
  params: Record<string, any>;
  timestamp: string; // ISO string
  status: 'success' | 'failure';
  gasUsed: string;
}

export interface DailyRevenue {
  date: string; // Formatted string e.g., "MMM dd"
  revenue: number;
}

export interface UserGrowth {
  date: string; // Formatted string e.g., "MMM dd"
  newUsers: number;
}

export interface SystemMetric {
  name: string;
  value: string | number;
  unit?: string;
  status?: 'healthy' | 'warning' | 'critical';
}

export interface UiState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: UiState['theme']) => void;
  // sidebarOpen is part of the original type, keeping it for type consistency even if not visually used
  sidebarOpen: boolean; 
  toggleSidebar: () => void;
}

export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string; // For badges or additional info
  description?: string;
};

export type NavItemGroup = {
  title?: string; // Optional title for a group of items
  items: NavItem[];
};
