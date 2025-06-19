import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string; 
  trendColor?: 'text-green-500' | 'text-red-500';
}

export function StatCard({ title, value, icon: Icon, description, trend, trendColor }: StatCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-headline">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {trend && <p className={`text-xs pt-1 ${trendColor || 'text-muted-foreground'}`}>{trend}</p>}
      </CardContent>
    </Card>
  );
}
