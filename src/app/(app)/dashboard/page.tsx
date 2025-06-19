'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { SampleLineChart } from '@/components/charts/sample-line-chart';
import { SampleBarChart } from '@/components/charts/sample-bar-chart';
import { fetchDashboardData, mockSystemMetrics } from '@/lib/mock-data';
import { DollarSign, Users, Activity, BarChart, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChartConfig } from "@/components/ui/chart";

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const userGrowthChartConfig = {
  newUsers: {
    label: "New Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Admin Overview" description="Real-time transaction metrics, system health, and analytics." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[126px]" />)}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
         <div className="mt-6">
           <Skeleton className="h-[200px]" />
         </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading dashboard data: {error.message}</div>;
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Overview" description="Real-time transaction metrics, system health, and analytics." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(data?.totalRevenue || 0)} icon={DollarSign} description="All successful transactions" />
        <StatCard title="Total Transactions" value={data?.totalTransactions || 0} icon={Activity} description="Across all users" />
        <StatCard title="Active Users" value={data?.totalUsers || 0} icon={Users} description="Users with recent activity" />
        <StatCard title="Active Sessions" value={data?.activeSessions || 0} icon={BarChart} description="Current live sessions" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
           <SampleLineChart 
            data={data?.dailyRevenue || []} 
            dataKey="revenue" 
            xAxisKey="date" 
            title="Revenue Over Time"
            description="Daily revenue for the last 30 days."
            chartConfig={revenueChartConfig}
            className="shadow-lg"
          />
        </div>
        <div className="lg:col-span-2">
          <SampleBarChart 
            data={data?.userGrowth || []} 
            dataKey="newUsers" 
            xAxisKey="date" 
            title="User Growth"
            description="New users per day for the last 30 days."
            chartConfig={userGrowthChartConfig}
            className="shadow-lg"
          />
        </div>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>System Health Monitoring</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.systemMetrics || mockSystemMetrics).map((metric) => (
                <TableRow key={metric.name}>
                  <TableCell className="font-medium">{metric.name}</TableCell>
                  <TableCell>{metric.value} {metric.unit}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      metric.status === 'healthy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      metric.status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {metric.status === 'healthy' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {metric.status === 'warning' && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {metric.status === 'critical' && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {metric.status ? metric.status.charAt(0).toUpperCase() + metric.status.slice(1) : 'N/A'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
