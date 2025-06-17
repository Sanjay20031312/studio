
'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Search, UserPlus, CheckCircle, AlertCircle, XCircle, Clock, UserCog, ShieldAlert, ShieldCheck } from 'lucide-react';
import { fetchUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

const newUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, { message: "Invalid wallet address. Must be 0x followed by 40 hex characters." }),
  kycStatus: z.enum(['verified', 'pending', 'rejected', 'not_started']),
  accountStatus: z.enum(['active', 'suspended']),
});

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ kycStatus?: string; accountStatus?: string }>({});
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: '',
      email: '',
      walletAddress: '',
      kycStatus: 'not_started',
      accountStatus: 'active',
    },
  });

  const { data, isLoading, error } = useQuery<{ data: User[], total: number, page: number, limit: number }, Error>({
    queryKey: ['users', currentPage, appliedSearchTerm, filters],
    queryFn: () => fetchUsers({ page: currentPage, limit: ITEMS_PER_PAGE, filters: { ...filters, search: appliedSearchTerm } }),
    keepPreviousData: true,
  });

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;
  
  const handleFilterChange = (filterType: 'kycStatus' | 'accountStatus', value: string) => {
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

  const users = data?.data || [];

  const getKycStatusBadge = (status: User['kycStatus']) => {
    switch (status) {
      case 'verified': return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><ShieldCheck className="mr-1 h-3 w-3" />Verified</Badge>;
      case 'pending': return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'rejected': return <Badge variant="destructive"><ShieldAlert className="mr-1 h-3 w-3" />Rejected</Badge>;
      case 'not_started': return <Badge variant="outline">Not Started</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getAccountStatusBadge = (status: User['accountStatus']) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="bg-sky-500 hover:bg-sky-600"><CheckCircle className="mr-1 h-3 w-3" />Active</Badge>;
      case 'suspended': return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600"><AlertCircle className="mr-1 h-3 w-3" />Suspended</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  function onSubmitNewUser(values: z.infer<typeof newUserSchema>) {
    // In a real app, you would send this data to your backend
    console.log("New user data:", values);
    toast({
      title: "User Creation Simulated",
      description: `User "${values.name}" has been added. (This is a mock action)`,
    });
    setIsAddUserDialogOpen(false);
    form.reset(); // Reset form fields
    // Optionally, refetch user list:
    // queryClient.invalidateQueries({ queryKey: ['users'] });
  }

  if (error) {
    return <div className="text-red-500">Error loading users: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage customer accounts, KYC verification, and support.">
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new user account.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNewUser)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="kycStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>KYC Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select KYC status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="not_started">Not Started</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="accountStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Account Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select account status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                     <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Adding User..." : "Add User"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search users by name, email, wallet..." 
              className="w-full rounded-lg bg-card pl-8"
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              aria-label="Search users"
            />
          </div>
          <Button onClick={handleSearchSubmit}>Search</Button>
        </div>
        <div className="flex gap-2">
          <Select value={filters.kycStatus || 'all'} onValueChange={(value) => handleFilterChange('kycStatus', value)}>
            <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by KYC status">
              <SelectValue placeholder="KYC Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All KYC Statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.accountStatus || 'all'} onValueChange={(value) => handleFilterChange('accountStatus', value)}>
            <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by Account Status">
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Account Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead>Wallet Address</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}><Skeleton className="h-10 w-full" /></TableCell>
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getKycStatusBadge(user.kycStatus)}</TableCell>
                  <TableCell>{getAccountStatusBadge(user.accountStatus)}</TableCell>
                  <TableCell>{user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}</TableCell>
                  <TableCell>{format(new Date(user.joinDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.accountStatus === 'active' ? (
                          <DropdownMenuItem className="text-orange-600 focus:bg-orange-100 focus:text-orange-700">Suspend Account</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600 focus:bg-green-100 focus:text-green-700">Activate Account</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600 focus:bg-red-100 focus:text-red-700">Delete User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between pt-2">
           <span className="text-sm text-muted-foreground">
            Page {data?.page || 0} of {totalPages} (Total {data?.total || 0} users)
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

