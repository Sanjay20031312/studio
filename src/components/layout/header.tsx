
'use client';

import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useMockAuth } from '@/hooks/use-mock-auth';
import { usePathname, useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

function getBreadcrumbItems(pathname: string) {
  const pathParts = pathname.split('/').filter(part => part);
  const breadcrumbs = [{ name: 'Dashboard', href: '/dashboard' }];
  
  pathParts.forEach((part, index) => {
    if (part === 'dashboard' && index === 0) return; 
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    breadcrumbs.push({ name: part.charAt(0).toUpperCase() + part.slice(1), href });
  });
  return breadcrumbs;
}


export function AppHeader() {
  const { user } = useMockAuth();
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbItems = getBreadcrumbItems(pathname);
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');

  const handleHeaderSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (headerSearchTerm.trim()) {
      router.push(`/transactions?search=${encodeURIComponent(headerSearchTerm.trim())}`);
    }
  };

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
            placeholder="Search transactions..."
            className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
            aria-label="Search transactions"
            value={headerSearchTerm}
            onChange={(e) => setHeaderSearchTerm(e.target.value)}
          />
        </form>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        {user && <UserNav user={user} />}
      </div>
    </header>
  );
}
