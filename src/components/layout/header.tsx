
'use client';

import React, { useState } from 'react';
import { Bell, Search, Settings, Users, CreditCard, LifeBuoy, LogOut, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useMockAuth } from '@/hooks/use-mock-auth';
import { usePathname, useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

function getBreadcrumbItems(pathname: string) {
  const pathParts = pathname.split('/').filter(part => part);
  const breadcrumbs = [{ name: 'Dashboard', href: '/dashboard' }];
  
  pathParts.forEach((part, index) => {
    if (part === 'dashboard' && index === 0) return; 
    if (part === 'search' && index === 0) {
       breadcrumbs.push({ name: 'Search', href: '/search'});
       return;
    }
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    breadcrumbs.push({ name: part.charAt(0).toUpperCase() + part.slice(1), href });
  });
  return breadcrumbs;
}

interface NotificationItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  avatarFallback?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    icon: MessageSquare,
    title: 'New transaction processed',
    description: 'Transaction #TRX12345 for $250.00 has been completed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    avatar: 'https://placehold.co/32x32.png?text=S',
    avatarFallback: 'S',
  },
  {
    id: '2',
    icon: Users,
    title: 'New user registered',
    description: 'John Doe (john.doe@example.com) just signed up.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    avatar: 'https://placehold.co/32x32.png?text=U',
    avatarFallback: 'U',
  },
  {
    id: '3',
    icon: Settings,
    title: 'System update complete',
    description: 'The system has been updated to version 2.1.0.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: '4',
    icon: CreditCard,
    title: 'Large withdrawal alert',
    description: 'Withdrawal of $5,000.00 initiated by user Alice.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
];


export function AppHeader() {
  const { user } = useMockAuth();
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbItems = getBreadcrumbItems(pathname);
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const handleHeaderSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (headerSearchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(headerSearchTerm.trim())}`);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage className="font-medium">{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-4">
        <form onSubmit={handleHeaderSearchSubmit} className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Global search..."
            className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
            aria-label="Global search"
            value={headerSearchTerm}
            onChange={(e) => setHeaderSearchTerm(e.target.value)}
          />
        </form>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="h-5">{unreadCount} New</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <DropdownMenuItem disabled className="text-center text-muted-foreground py-4">
                No new notifications
              </DropdownMenuItem>
            ) : (
              <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 ${!notification.read ? 'bg-accent/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {notification.avatar ? (
                       <Avatar className="h-8 w-8 mt-1">
                         <AvatarImage src={notification.avatar} alt={notification.title} data-ai-hint="user icon" />
                         <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
                       </Avatar>
                    ) : (
                       <notification.icon className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs ${!notification.read ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/50 mt-0.5">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary self-center ml-2"></div>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-center gap-2 py-2" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCircle className="h-4 w-4" /> Mark all as read
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex items-center justify-center gap-2 py-2">
              <Link href="/notifications"> {/* Placeholder link */}
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {user && <UserNav user={user} />}
      </div>
    </header>
  );
}
