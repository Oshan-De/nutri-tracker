'use client'

import { memo } from 'react'
import { Bar, BarChart, XAxis, CartesianGrid } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface NutrientBreakdownChartProps {
  data?: {
    name: string
    value: number
  }[]
}

const chartConfig: ChartConfig = {
  nutrients: {
    label: 'Nutrients',
  },
  protein: {
    label: 'Protein',
    color: 'hsl(var(--primary))',
  },
  carbs: {
    label: 'Carbohydrates',
    color: 'hsl(var(--primary))',
  },
  fat: {
    label: 'Fat',
    color: 'hsl(var(--primary))',
  },
}

export function NutrientBreakdownChart({
  data = [],
}: NutrientBreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 0

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.value,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
    fill: `hsl(var(--primary))`,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Nutrient Breakdown
        </CardTitle>
        <CardDescription className="text-base font-light text-gray-400">
          Distribution of macronutrients
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={8} />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-muted-foreground">No data available</p>
        )}
        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {chartData.map((item) => (
              <div key={item.name} className="flex gap-2 flex-col items-center">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.value}g</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default memo(NutrientBreakdownChart)
