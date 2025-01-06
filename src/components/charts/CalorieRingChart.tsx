'use client'

import { memo } from 'react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { calculateStartEndAngles } from '@/lib/utils'

interface CalorieRingChartProps {
  consumed: number
  goal: number
}

const chartConfig: ChartConfig = {
  calories: {
    label: 'Calories',
    color: 'hsl(var(--primary))',
  },
}

export function CalorieRingChart({ consumed, goal }: CalorieRingChartProps) {
  const percentage = Math.round((consumed / goal) * 100)
  const remaining = Math.max(0, goal - consumed)

  const { startAngle, endAngle } = calculateStartEndAngles(0, goal, consumed)

  const chartData = [
    { name: 'Consumed', calories: consumed, fill: 'var(--color-calories)' },
  ]

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold -mb-2">
          Calorie Intake
        </CardTitle>
        <CardDescription className="text-base font-light text-gray-400">
          Daily calorie consumption
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full h-[230px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={endAngle}
            endAngle={startAngle}
            innerRadius={95}
            outerRadius={145}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[105, 86]}
            />
            <RadialBar dataKey="calories" background cornerRadius={30} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy ? viewBox.cy - 20 : 20}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy ? viewBox.cy + 10 : 10}
                          className="fill-primary text-base"
                        >
                          {consumed} / {goal} kcal
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy ? viewBox.cy + 30 : 30}
                          className="fill-muted-foreground text-xs"
                        >
                          {remaining} kcal remaining
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default memo(CalorieRingChart)
