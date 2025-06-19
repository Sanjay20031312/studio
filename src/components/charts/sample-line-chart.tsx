'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface SampleLineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  title: string;
  description?: string;
  footerText?: string;
  chartConfig: ChartConfig;
  className?: string;
}

export function SampleLineChart({
  data,
  dataKey,
  xAxisKey,
  title,
  description,
  footerText,
  chartConfig,
  className
}: SampleLineChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px] md:h-[350px]">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0, // Adjusted for smaller YAxis labels
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 6) : value} 
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={30} // Adjusted for smaller labels
              tickFormatter={(value) => `$${value / 1000}k`} 
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey={dataKey}
              type="natural"
              stroke={`var(--color-${Object.keys(chartConfig)[0]})`}
              strokeWidth={2}
              dot={{
                fill: `var(--color-${Object.keys(chartConfig)[0]})`,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {footerText && (
         <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {footerText} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing data for the last 30 days
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
