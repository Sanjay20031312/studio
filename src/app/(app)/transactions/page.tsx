'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, ListFilter, FileText, Undo2, Briefcase, MoreVertical } from 'lucide-react';
import { fetchTransactions } from '@/lib/mock-data';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  
  const initialSearchFromURL = searchParams.get('search') || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(initialSearchFromURL);
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(initialSearchFromURL);
  const [filters, setFilters] = useState<{ status?: string; type?: string }>({});
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<{ data: Transaction[], total: number, page: number, limit: number }, Error>({
    queryKey: ['transactions', currentPage, appliedSearchTerm, filters],
    queryFn: () => fetchTransactions({ page: currentPage, limit: ITEMS_PER_PAGE, filters: { ...filters, search: appliedSearchTerm } }),
    keepPreviousData: true,
  });
  
  useEffect(() => {
    const newSearchFromURL = searchParams.get('search') || '';
    if (newSearchFromURL !== appliedSearchTerm) {
      setSearchInput(newSearchFromURL);
      setAppliedSearchTerm(newSearchFromURL);
      setCurrentPage(1); 
    }
  }, [searchParams, appliedSearchTerm]);


  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  const handleFilterChange = (filterType: 'status' | 'type', value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value === 'all' ? undefined : value }));
    setCurrentPage(1);
  };
  
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = () => {
    setAppliedSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  const transactions = data?.data || [];
  
  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'outline';
    }
  };

  const handleExportCSV = () => {
    if (!transactions.length) {
      toast({
        title: "No Data",
        description: "There are no transactions to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['ID', 'User Name', 'Amount', 'Currency', 'Status', 'Type', 'Timestamp', 'Merchant', 'Blockchain Tx Hash'];
    const csvRows = [
      headers.join(','),
      ...transactions.map(tx => [
        tx.id,
        `"${tx.userName.replace(/"/g, '""')}"`, // escape double quotes
        tx.amount,
        tx.currency,
        tx.status,
        tx.type,
        format(new Date(tx.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        `"${(tx.merchant || 'N/A').replace(/"/g, '""')}"`,
        tx.blockchainTxHash || 'N/A'
      ].join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "Transactions CSV has been downloaded.",
      });
    } else {
       toast({
        title: "Export Failed",
        description: "Your browser does not support automatic CSV download.",
        variant: "destructive",
      });
    }
  };

  const handleBatchProcess = () => {
    toast({
      title: "Batch Process Initiated",
      description: "This is a placeholder for batch processing transactions. In a real app, you would select transactions to process.",
    });
  };


  if (error) {
    return <div className="text-red-500">Error loading transactions: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Transaction Management" description="Search, filter, and manage all transactions.">
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
         <Button onClick={handleBatchProcess}>
          <Briefcase className="mr-2 h-4 w-4" />
          Batch Process
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search transactions by ID, user, merchant..." 
              className="w-full rounded-lg bg-card pl-8" 
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              aria-label="Search transactions"
            />
          </div>
          <Button onClick={handleSearchSubmit}>Search</Button>
        </div>
        <div className="flex gap-2">
          <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by type">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <ListFilter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Date Range</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Amount Range</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Currency</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}><Skeleton className="h-8 w-full" /></TableCell>
                </TableRow>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id.substring(0,8)}...</TableCell>
                  <TableCell>{tx.userName}</TableCell>
                  <TableCell>{tx.amount.toFixed(2)} {tx.currency}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(tx.status)} className="capitalize">{tx.status}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{tx.type}</TableCell>
                  <TableCell>{format(new Date(tx.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell>{tx.merchant || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                           <span className="sr-only">Open menu</span>
                           <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                        <DropdownMenuItem><Undo2 className="mr-2 h-4 w-4" />Process Refund</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            Page {data?.page || 0} of {totalPages} (Total {data?.total || 0} transactions)
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
