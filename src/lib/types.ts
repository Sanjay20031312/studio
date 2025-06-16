
export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'payment' | 'withdrawal' | 'deposit' | 'refund';
  timestamp: string;
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
  lastLogin: string;
  joinDate: string;
}

export interface BlockchainNetworkStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  blockHeight: number;
  lastBlockTime: string;
  avgGasPrice: string;
}

export interface SmartContractLog {
  id: string;
  contractAddress: string;
  functionCalled: string;
  params: Record<string, any>;
  timestamp: string;
  status: 'success' | 'failure';
  gasUsed: string;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface UserGrowth {
  date: string;
  newUsers: number;
}

export interface SystemMetric {
  name: string;
  value: string | number;
  unit?: string;
  status?: 'healthy' | 'warning' | 'critical';
}

// For Zustand store
export interface UiState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
};

export type NavItemGroup = {
  title?: string;
  items: NavItem[];
};

