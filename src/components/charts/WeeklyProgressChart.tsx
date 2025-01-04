import { motion } from 'framer-motion'

interface WeeklyProgressData {
  day: string
  calories: number
  goal: number
}

interface WeeklyProgressChartProps {
  data: WeeklyProgressData[]
}

export function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col">
        <div className="flex-1">
          {data.map((day, index) => (
            <div key={day.day} className="group mb-2 last:mb-0">
              <div className="flex items-center gap-2">
                <span className="w-8 text-xs text-muted-foreground">
                  {day.day}
                </span>
                <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-muted/50">
                  <motion.div
                    className="absolute h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.calories / day.goal) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  />
                </div>
                <span className="w-16 text-right text-xs text-muted-foreground">
                  {day.calories} / {day.goal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
