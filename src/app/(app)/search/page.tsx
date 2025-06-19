'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchTransactions } from '@/lib/mock-data';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Search as SearchIcon } from 'lucide-react'; // Renamed Search to SearchIcon to avoid conflict

const ITEMS_PER_PAGE = 10;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { 
    data: transactionsData, 
    isLoading: isLoadingTransactions, 
    error: transactionsError 
  } = useQuery<{ data: Transaction[], total: number }, Error>({
    queryKey: ['searchResults', 'transactions', query],
    queryFn: () => fetchTransactions({ 
      filters: { search: query }, 
      page: 1, 
      limit: ITEMS_PER_PAGE 
    }),
    enabled: !!query, 
  });

  const transactions = transactionsData?.data || [];

  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'outline';
    }
  };

  const pageTitle = query ? `Search Results for "${query}"` : "Global Search";
  const pageDescription = query ? `Displaying results for your query.` : "Enter a term in the global search bar above.";

  return (
    <div className="space-y-6">
      <PageHeader title={pageTitle} description={pageDescription} />

      {!query && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SearchIcon className="mr-2 h-5 w-5" />
              Begin Your Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please use the search bar in the header to find information across the application.</p>
          </CardContent>
        </Card>
      )}

      {query && (
        <>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Matching transactions based on your search.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions && (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              )}
              {transactionsError && (
                <div className="text-red-500 flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4" /> Error loading transaction results: {transactionsError.message}
                </div>
              )}
              {!isLoadingTransactions && !transactionsError && transactions.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No transactions found matching your query.</p>
              )}
              {!isLoadingTransactions && !transactionsError && transactions.length > 0 && (
                <div className="overflow-x-auto rounded-lg border bg-card">
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User search results will be displayed here in the future.</p>
            </CardContent>
          </Card>
          
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Blockchain Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Blockchain data search results will be displayed here in the future.</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
