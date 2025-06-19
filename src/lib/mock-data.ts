import type { Transaction, User, BlockchainNetworkStatus, SmartContractLog, DailyRevenue, UserGrowth, SystemMetric } from './types';
import { format, subDays, subHours } from 'date-fns';

const generateRandomId = () => Math.random().toString(36).substring(2, 10); // Shorter ID
const generateRandomName = () => {
  const firstNames = ["Alice", "Bob", "Charlie", "David", "Eve", "Fiona", "George", "Hannah", "Ian", "Julia"];
  const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};
const generateRandomWalletAddress = () => `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
const generateRandomTxHash = () => `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

const now = new Date();

export const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => {
  const statuses: Transaction['status'][] = ['completed', 'pending', 'failed', 'refunded'];
  const types: Transaction['type'][] = ['payment', 'withdrawal', 'deposit', 'refund'];
  const randomDate = subDays(now, Math.floor(Math.random() * 365)); // Transactions spread over a year
  return {
    id: `tx-${generateRandomId()}`,
    userId: `user-${generateRandomId()}`,
    userName: generateRandomName(),
    amount: parseFloat((Math.random() * 1000 + 5).toFixed(2)), // Min amount 5
    currency: 'USD',
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    timestamp: randomDate.toISOString(),
    merchant: `Walmart Store #${Math.floor(Math.random() * 1000) + 1}`,
    blockchainTxHash: generateRandomTxHash(),
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by newest first


export const mockUsers: User[] = Array.from({ length: 30 }, (_, i) => {
  const kycStatuses: User['kycStatus'][] = ['verified', 'pending', 'rejected', 'not_started'];
  const accountStatuses: User['accountStatus'][] = ['active', 'suspended'];
  const name = generateRandomName();
  return {
    id: `usr-${generateRandomId()}`,
    name: name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    avatarUrl: `https://placehold.co/40x40.png?text=${name.charAt(0)}`,
    kycStatus: kycStatuses[Math.floor(Math.random() * kycStatuses.length)],
    walletAddress: generateRandomWalletAddress(),
    loyaltyPoints: Math.floor(Math.random() * 5000),
    cryptoBalance: parseFloat((Math.random() * 5).toFixed(4)),
    accountStatus: accountStatuses[Math.floor(Math.random() * accountStatuses.length)],
    lastLogin: subHours(now, Math.floor(Math.random() * 72)).toISOString(),
    joinDate: subDays(now, Math.floor(Math.random() * 365)).toISOString(),
  };
}).sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());


export const mockBlockchainNetworkStatus: BlockchainNetworkStatus[] = [
  { name: 'Ethereum Mainnet', status: 'online', blockHeight: 19000000 + Math.floor(Math.random() * 1000), lastBlockTime: new Date().toISOString(), avgGasPrice: `${(Math.random() * 50 + 10).toFixed(2)} Gwei` },
  { name: 'Polygon Mainnet', status: 'online', blockHeight: 50000000 + Math.floor(Math.random() * 1000), lastBlockTime: new Date().toISOString(), avgGasPrice: `${(Math.random() * 100 + 30).toFixed(2)} Gwei` },
  { name: 'Hyperledger Fabric (Walmart)', status: 'degraded', blockHeight: 120000 + Math.floor(Math.random() * 100), lastBlockTime: subHours(now, 1).toISOString(), avgGasPrice: 'N/A' },
];

export const mockSmartContractLogs: SmartContractLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: `log-${generateRandomId()}`,
  contractAddress: generateRandomWalletAddress(),
  functionCalled: ['transfer', 'approve', 'mint', 'burn'][Math.floor(Math.random() * 4)],
  params: { to: generateRandomWalletAddress(), amount: parseFloat((Math.random() * 100).toFixed(2)) },
  timestamp: subHours(now, i * 2).toISOString(),
  status: Math.random() > 0.1 ? 'success' : 'failure',
  gasUsed: `${(Math.random() * 100000 + 21000).toFixed(0)}`,
})).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const mockDailyRevenue: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(now, 29-i), 'MMM dd'), // Ensure dates are sequential for charts
  revenue: Math.floor(Math.random() * 50000 + 10000),
}));

export const mockUserGrowth: UserGrowth[] = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(now, 29-i), 'MMM dd'), // Ensure dates are sequential for charts
  newUsers: Math.floor(Math.random() * 100 + 10),
}));


export const mockSystemMetrics: SystemMetric[] = [
    { name: 'API Latency', value: `${(Math.random() * 100 + 50).toFixed(0)}`, unit: 'ms', status: 'healthy' },
    { name: 'Error Rate', value: `${(Math.random() * 0.5).toFixed(2)}`, unit: '%', status: 'healthy' }, // Lower error rate
    { name: 'Database Connections', value: Math.floor(Math.random() * 50 + 20), unit: 'active', status: 'healthy' },
    { name: 'Transaction Queue Length', value: Math.floor(Math.random() * 5), unit: 'jobs', status: 'healthy' }, // More specific
    { name: 'Server CPU Utilization', value: `${(Math.random() * 60 + 10).toFixed(1)}`, unit: '%', status: 'healthy' },
];


// Mock fetch functions
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDashboardData = async () => {
  await simulateDelay(500); 
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

export const fetchTransactions = async ({ page = 1, limit = 10, filters = {} }: { page?: number, limit?: number, filters?: Record<string, string | undefined> }) => {
  await simulateDelay(300);
  let filteredTransactions = [...mockTransactions]; // Create a copy to avoid mutating original

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
      (tx.merchant && tx.merchant.toLowerCase().includes(searchTerm)) ||
      (tx.blockchainTxHash && tx.blockchainTxHash.toLowerCase().includes(searchTerm))
    );
  }
  
  const total = filteredTransactions.length;
  const data = filteredTransactions.slice((page - 1) * limit, page * limit);
  return { data, total, page, limit };
};

export const fetchUsers = async ({ page = 1, limit = 10, filters = {} }: { page?: number, limit?: number, filters?: Record<string, string | undefined> }) => {
  await simulateDelay(400);
  let filteredUsers = [...mockUsers]; // Create a copy

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
  await simulateDelay(600);
  return {
    networkStatus: mockBlockchainNetworkStatus,
    smartContractLogs: mockSmartContractLogs.slice(0, 10), 
  };
};
