import { memo } from 'react'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Line, LineChart, XAxis, YAxis } from 'recharts'

interface WeeklyProgressChartProps {
  data: {
    day: string
    calories: number
    goal: number
  }[]
}

const chartConfig: ChartConfig = {
  calories: {
    label: 'Calories',
    color: 'hsl(var(--primary))',
  },
  goal: {
    label: 'Goal',
    color: 'hsl(var(--secondary))',
  },
}

export function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  return (
    <ChartContainer config={chartConfig} className="mx-auto w-full h-[230px]">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="day"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}cal`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value: string | number | (string | number)[]) =>
                `${value} cal`
              }
            />
          }
        />
        <Line
          type="monotone"
          dataKey="calories"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="goal"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export default memo(WeeklyProgressChart)
