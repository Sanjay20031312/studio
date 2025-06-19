'use client';

import React, { useState } from 'react';
import { Bell, Search, Settings, Users, CreditCard, LogOut, MessageSquare, CheckCircle, Menu as MenuIcon, Home, ListCollapse, Zap, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import type { User } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { AppLogo } from '@/components/icons/AppLogo';

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
    timestamp: new Date(Date.now() - 1000 * 60 * 5), 
    read: false,
    avatar: 'https://placehold.co/32x32.png?text=S',
    avatarFallback: 'S',
  },
  {
    id: '2',
    icon: Users,
    title: 'New user registered',
    description: 'John Doe (john.doe@example.com) just signed up.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), 
    read: false,
    avatar: 'https://placehold.co/32x32.png?text=U',
    avatarFallback: 'U',
  },
  {
    id: '3',
    icon: Settings,
    title: 'System update complete',
    description: 'The system has been updated to version 2.1.0.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), 
    read: true,
  },
  {
    id: '4',
    icon: CreditCard,
    title: 'Large withdrawal alert',
    description: 'Withdrawal of $5,000.00 initiated by user Alice.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
];

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: <Home className="mr-2 h-4 w-4" /> },
  { href: '/transactions', label: 'Transactions', icon: <ListCollapse className="mr-2 h-4 w-4" /> },
  { href: '/users', label: 'User Management', icon: <Users className="mr-2 h-4 w-4" /> },
  { href: '/blockchain', label: 'Blockchain', icon: <Zap className="mr-2 h-4 w-4" /> },
  { href: '/settings', label: 'Settings', icon: <Settings2 className="mr-2 h-4 w-4" /> },
];

interface AppHeaderProps {
  user: User | null;
}

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
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

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    if (href === '/search') return pathname === href || pathname.startsWith(`${href}?`);
    return pathname.startsWith(href) && href !== '/dashboard'; // Avoid /dashboard matching /dashboard/anything
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-md md:px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className={`flex items-center ${isActive(item.href) ? 'bg-accent text-accent-foreground' : ''}`}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Link href="/dashboard" className="mr-6 hidden items-center gap-2 md:flex">
        <AppLogo className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-headline font-semibold">BlockPay Admin</h1>
      </Link>
      
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {navItems.map((item) => (
           <Link
            key={item.href}
            href={item.href}
            className={`transition-colors hover:text-foreground ${isActive(item.href) ? 'text-foreground font-semibold border-b-2 border-primary pb-px' : 'text-muted-foreground'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <form onSubmit={handleHeaderSearchSubmit} className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Global search..."
            className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[300px] h-9"
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
                    className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? 'bg-accent/10 dark:bg-accent/20' : ''}`}
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
                      <p className={`text-xs ${!notification.read ? 'text-muted-foreground/80' : 'text-muted-foreground/70'}`}>
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary self-center ml-2 shrink-0"></div>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-center gap-2 py-2" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCircle className="mr-2 h-4 w-4" /> Mark all as read
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex items-center justify-center gap-2 py-2 cursor-pointer">
              <Link href="/notifications"> 
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
