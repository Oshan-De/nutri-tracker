'use client'

import { useCalorieGoalStore } from '@/store/calorie-goal-store'

interface CalorieGoal {
  goalType: 'daily' | 'weekly' | 'monthly'
  calorieGoal: number
  proteinGoal?: number
  carbsGoal?: number
  fatGoal?: number
}

export function useCalorieGoalData() {
  const { goal: dailyCalorieGoal } = useCalorieGoalStore((state) => state)

  const calorieGoal: CalorieGoal = {
    goalType: 'daily',
    calorieGoal: dailyCalorieGoal || 0,
    proteinGoal: 50,
    carbsGoal: 250,
    fatGoal: 70,
  }

  return {
    calorieGoal,
  }
}
