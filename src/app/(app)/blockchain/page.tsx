'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchBlockchainData } from '@/lib/mock-data';
import type { BlockchainNetworkStatus, SmartContractLog } from '@/lib/types';
import { FileText, Activity, Wifi, WifiOff, AlertTriangle, Settings2, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const NetworkStatusIcon = ({ status }: { status: BlockchainNetworkStatus['status'] }) => {
  if (status === 'online') return <Wifi className="h-5 w-5 text-green-500" />;
  if (status === 'offline') return <WifiOff className="h-5 w-5 text-red-500" />;
  if (status === 'degraded') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  return <Activity className="h-5 w-5 text-muted-foreground" />;
};

const LogStatusIcon = ({ status }: { status: SmartContractLog['status'] }) => {
  if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === 'failure') return <XCircle className="h-4 w-4 text-red-500" />;
  return null;
};

export default function BlockchainPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blockchainData'],
    queryFn: fetchBlockchainData,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Blockchain Monitoring" description="Network status, smart contract logs, and gas fee monitoring." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[180px]" />)}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500">Error loading blockchain data: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Blockchain Monitoring" description="Network status, smart contract logs, and gas fee monitoring.">
        <Button variant="outline">
            <Settings2 className="mr-2 h-4 w-4" />
            Configure Networks
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(data?.networkStatus || []).map((network) => (
          <Card key={network.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{network.name}</CardTitle>
              <NetworkStatusIcon status={network.status} />
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold font-headline">{network.blockHeight.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Current Block Height</p>
              <div className="pt-2">
                <p className="text-sm">Avg. Gas: <span className="font-medium">{network.avgGasPrice}</span></p>
                <p className="text-sm">Last Block: <span className="font-medium">{format(parseISO(network.lastBlockTime), 'MMM dd, HH:mm:ss')}</span></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Smart Contract Interaction Logs</CardTitle>
          <CardDescription>Recent interactions with deployed smart contracts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Function</TableHead>
                  <TableHead>Gas Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.smartContractLogs || []).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(parseISO(log.timestamp), 'MMM dd, HH:mm:ss')}</TableCell>
                    <TableCell>
                      <Link href={`/blockchain/explorer/address/${log.contractAddress}`} className="hover:underline text-primary">
                        {log.contractAddress.substring(0, 6)}...{log.contractAddress.substring(log.contractAddress.length - 4)}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{log.functionCalled}</TableCell>
                    <TableCell>{log.gasUsed}</TableCell>
                    <TableCell><LogStatusIcon status={log.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blockchain/explorer/tx/${log.id}`}>
                           <FileText className="mr-2 h-4 w-4" /> View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {(!data?.smartContractLogs || data.smartContractLogs.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                        No smart contract logs available.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
