'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CalorieRingChartProps {
  consumed: number
  goal: number
}

export function CalorieRingChart({ consumed, goal }: CalorieRingChartProps) {
  const [percentage, setPercentage] = useState(0)
  const radius = 50
  const strokeWidth = 10
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  useEffect(() => {
    const newPercentage = Math.min((consumed / goal) * 100, 100)
    setPercentage(newPercentage)
  }, [consumed, goal])

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        {/* Background ring */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-muted-foreground/20"
        />
        {/* Progress ring */}
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-primary"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transformOrigin: '50% 50%',
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
        <span className="text-xs text-muted-foreground">
          {consumed} / {goal}
        </span>
      </div>
    </div>
  )
}