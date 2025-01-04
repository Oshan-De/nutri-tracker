'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface NutrientData {
  name: string
  value: number
  color: string
}

interface NutrientBreakdownChartProps {
  data: NutrientData[]
}

export function NutrientBreakdownChart({ data }: NutrientBreakdownChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  let startAngle = 0
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const endAngle = startAngle + angle
    const largeArcFlag = angle > 180 ? 1 : 0

    // Calculate coordinates for the path
    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
    const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
    const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

    const segment = {
      ...item,
      path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
      percentage,
      startAngle,
    }

    startAngle = endAngle
    return segment
  })

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {segments.map((segment, index) => (
          <motion.path
            key={segment.name}
            d={segment.path}
            fill={segment.color}
            initial={{ opacity: 0 }}
            animate={{
              opacity:
                hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </svg>

      <div className="absolute bottom-0 flex w-full justify-center gap-4">
        {segments.map((segment) => (
          <div key={segment.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-xs">
              {segment.name} ({Math.round(segment.percentage)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
