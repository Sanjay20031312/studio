// src/components/icons/AppLogo.tsx
import { LayoutDashboard } from 'lucide-react';
import type React from 'react';

interface AppLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function AppLogo({ size = 24, className, ...props }: AppLogoProps) {
  return (
    <LayoutDashboard
      className={className}
      size={size}
      aria-label="BlockPay Logo"
      {...props}
    />
  );
}
