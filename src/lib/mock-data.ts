import type { Transaction, User, BlockchainNetworkStatus, SmartContractLog, DailyRevenue, UserGrowth, SystemMetric } from './types';
import { format, subDays, subHours } from 'date-fns';

const generateRandomId = () => Math.random().toString(36).substring(2, 15);
const generateRandomName = () => {
  const firstNames = ["Alice", "Bob", "Charlie", "David", "Eve", "Fiona", "George"];
  const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson"];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};
const generateRandomWalletAddress = () => `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
const generateRandomTxHash = () => `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

const now = new Date();

export const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => {
  const statuses: Transaction['status'][] = ['completed', 'pending', 'failed', 'refunded'];
  const types: Transaction['type'][] = ['payment', 'withdrawal', 'deposit', 'refund'];
  return {
    id: generateRandomId(),
    userId: generateRandomId(),
    userName: generateRandomName(),
    amount: parseFloat((Math.random() * 1000).toFixed(2)),
    currency: 'USD',
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    timestamp: subDays(now, i).toISOString(),
    merchant: `Walmart Store #${Math.floor(Math.random() * 1000)}`,
    blockchainTxHash: generateRandomTxHash(),
  };
});

export const mockUsers: User[] = Array.from({ length: 30 }, (_, i) => {
  const kycStatuses: User['kycStatus'][] = ['verified', 'pending', 'rejected', 'not_started'];
  const accountStatuses: User['accountStatus'][] = ['active', 'suspended'];
  return {
    id: generateRandomId(),
    name: generateRandomName(),
    email: `user${i}@example.com`,
    avatarUrl: `https://placehold.co/40x40.png?text=${generateRandomName().charAt(0)}`,
    kycStatus: kycStatuses[Math.floor(Math.random() * kycStatuses.length)],
    walletAddress: generateRandomWalletAddress(),
    loyaltyPoints: Math.floor(Math.random() * 5000),
    cryptoBalance: parseFloat((Math.random() * 5).toFixed(4)),
    accountStatus: accountStatuses[Math.floor(Math.random() * accountStatuses.length)],
    lastLogin: subHours(now, Math.floor(Math.random() * 72)).toISOString(),
    joinDate: subDays(now, Math.floor(Math.random() * 365)).toISOString(),
  };
});

export const mockBlockchainNetworkStatus: BlockchainNetworkStatus[] = [
  { name: 'Ethereum Mainnet', status: 'online', blockHeight: 19000000 + Math.floor(Math.random() * 1000), lastBlockTime: new Date().toISOString(), avgGasPrice: `${(Math.random() * 50 + 10).toFixed(2)} Gwei` },
  { name: 'Polygon Mainnet', status: 'online', blockHeight: 50000000 + Math.floor(Math.random() * 1000), lastBlockTime: new Date().toISOString(), avgGasPrice: `${(Math.random() * 100 + 30).toFixed(2)} Gwei` },
  { name: 'Hyperledger Fabric (Walmart)', status: 'degraded', blockHeight: 120000 + Math.floor(Math.random() * 100), lastBlockTime: subHours(now, 1).toISOString(), avgGasPrice: 'N/A' },
];

export const mockSmartContractLogs: SmartContractLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: generateRandomId(),
  contractAddress: generateRandomWalletAddress(),
  functionCalled: ['transfer', 'approve', 'mint', 'burn'][Math.floor(Math.random() * 4)],
  params: { to: generateRandomWalletAddress(), amount: Math.random() * 100 },
  timestamp: subHours(now, i * 2).toISOString(),
  status: Math.random() > 0.1 ? 'success' : 'failure',
  gasUsed: `${(Math.random() * 100000 + 21000).toFixed(0)}`,
}));

export const mockDailyRevenue: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(now, i), 'MMM dd'),
  revenue: Math.floor(Math.random() * 50000 + 10000),
})).reverse();

export const mockUserGrowth: UserGrowth[] = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(now, i), 'MMM dd'),
  newUsers: Math.floor(Math.random() * 100 + 10),
})).reverse();


export const mockSystemMetrics: SystemMetric[] = [
    { name: 'API Latency', value: `${(Math.random() * 100 + 50).toFixed(0)}`, unit: 'ms', status: 'healthy' },
    { name: 'Error Rate', value: `${(Math.random() * 1).toFixed(2)}`, unit: '%', status: 'healthy' },
    { name: 'Database Connections', value: Math.floor(Math.random() * 50 + 20), unit: 'active', status: 'healthy' },
    { name: 'Queue Length', value: Math.floor(Math.random() * 10), unit: 'jobs', status: 'healthy' },
];


// Mock fetch functions for React Query
export const fetchDashboardData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return {
    totalTransactions: mockTransactions.length,
    totalUsers: mockUsers.length,
    totalRevenue: mockTransactions.reduce((sum, tx) => tx.status === 'completed' ? sum + tx.amount : sum, 0),
    activeSessions: Math.floor(Math.random() * 500 + 100),
    dailyRevenue: mockDailyRevenue,
    userGrowth: mockUserGrowth,
    systemMetrics: mockSystemMetrics,
  };
};

export const fetchTransactions = async ({ page = 1, limit = 10, filters = {} }: { page?: number, limit?: number, filters?: any }) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  let filteredTransactions = mockTransactions;

  if (filters.status) {
    filteredTransactions = filteredTransactions.filter(tx => tx.status === filters.status);
  }
  if (filters.type) {
    filteredTransactions = filteredTransactions.filter(tx => tx.type === filters.type);
  }
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredTransactions = filteredTransactions.filter(tx => 
      tx.id.toLowerCase().includes(searchTerm) ||
      tx.userName.toLowerCase().includes(searchTerm) ||
      tx.merchant?.toLowerCase().includes(searchTerm) ||
      tx.blockchainTxHash?.toLowerCase().includes(searchTerm)
    );
  }
  
  const total = filteredTransactions.length;
  const data = filteredTransactions.slice((page - 1) * limit, page * limit);
  return { data, total, page, limit };
};

export const fetchUsers = async ({ page = 1, limit = 10, filters = {} }: { page?: number, limit?: number, filters?: any }) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  let filteredUsers = mockUsers;

  if (filters.kycStatus) {
    filteredUsers = filteredUsers.filter(user => user.kycStatus === filters.kycStatus);
  }
  if (filters.accountStatus) {
    filteredUsers = filteredUsers.filter(user => user.accountStatus === filters.accountStatus);
  }
   if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.id.toLowerCase().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.walletAddress.toLowerCase().includes(searchTerm)
    );
  }

  const total = filteredUsers.length;
  const data = filteredUsers.slice((page - 1) * limit, page * limit);
  return { data, total, page, limit };
};

export const fetchBlockchainData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    networkStatus: mockBlockchainNetworkStatus,
    smartContractLogs: mockSmartContractLogs.slice(0, 10), // Show recent 10 logs
  };
};
