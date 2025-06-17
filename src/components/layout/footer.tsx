
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import type { User } from '@/lib/types';
import { useMockAuth } from '@/hooks/use-mock-auth';

interface AppFooterProps {
  user: User | null;
}

export function AppFooter({ user }: AppFooterProps) {
  const { logout } = useMockAuth();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {user ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-4" onClick={logout} aria-label="Log out">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        ) : (
          <div /> // Empty div to maintain layout if user is somehow null
        )}
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BlockPay. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
