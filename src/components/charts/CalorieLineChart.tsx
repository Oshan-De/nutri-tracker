'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface CalorieData {
  date: string
  calories: number
  goal: number
}

interface CalorieLineChartProps {
  data: CalorieData[]
}

export function CalorieLineChart({ data }: CalorieLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="date"
          stroke="currentColor"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="currentColor"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${value}cal`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
          itemStyle={{ color: 'var(--foreground)' }}
        />
        <Line
          type="monotone"
          dataKey="calories"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="goal"
          stroke="var(--muted-foreground)"
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}