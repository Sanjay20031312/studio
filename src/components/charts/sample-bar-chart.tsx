'use client';

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
          <BarChart accessibilityLayer data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 6) : value}
            />
             <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={30} // Adjust width to prevent label cropping
             />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey={dataKey} fill={`var(--color-${Object.keys(chartConfig)[0]})`} radius={4} />
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
