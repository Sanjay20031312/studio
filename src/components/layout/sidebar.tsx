'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Home, ListCollapse, Users, Zap, Settings, LogOut, Package, CreditCard, Settings2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { useMockAuth } from '@/hooks/use-mock-auth';

interface AppSidebarProps {
  user: User | null;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: <Home /> },
  { href: '/transactions', label: 'Transactions', icon: <ListCollapse /> },
  { href: '/users', label: 'User Management', icon: <Users /> },
  { href: '/blockchain', label: 'Blockchain', icon: <Zap /> },
  { href: '/settings', label: 'Settings', icon: <Settings2 /> },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const { logout } = useMockAuth();

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left" className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-semibold group-data-[collapsible=icon]:hidden">BlockPay</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                tooltip={{ children: item.label, side: 'right', className: "ml-2" }}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
           {user && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
           )}
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
         <Button variant="ghost" size="sm" className="w-full mt-2 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:aspect-square" onClick={logout} aria-label="Log out">
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden ml-2">Log Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
