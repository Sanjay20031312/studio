'use client';

import { BarChart as LucideBarChart } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface SampleBarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  title: string;
  description?: string;
  footerText?: string;
  chartConfig: ChartConfig;
  aspectRatio?: number;
  className?: string;
}

export function SampleBarChart({
  data,
  dataKey,
  xAxisKey,
  title,
  description,
  footerText,
  chartConfig,
  aspectRatio = 16 / 9,
  className,
}: SampleBarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
         <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px] md:h-[350px]">
          <BarChart accessibilityLayer data={data} margin={{ top: 12, bottom: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
             <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
             />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {footerText && (
        <CardFooter className="text-sm text-muted-foreground">
          {footerText}
        </CardFooter>
      )}
    </Card>
  );
}
