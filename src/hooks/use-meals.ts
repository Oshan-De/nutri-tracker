'use client'

import { Meal } from '@/lib/types/meal'
import { useCalorieGoalStore } from '@/store/calorie-goal-store'
import { useMealStore } from '@/store/meal-store'

export function useMealsData() {
  const { goal: dailyCalorieGoal } = useCalorieGoalStore((state) => state)
  const { meals } = useMealStore((state) => state)

  const getWeeklyData = (period: string) => {
    const now = new Date()
    const startDate = new Date(now)
    let daysToShow = 7

    if (period === 'month') {
      startDate.setDate(1)
      daysToShow = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    } else if (period === '3months') {
      startDate.setMonth(startDate.getMonth() - 2)
      startDate.setDate(1)
      daysToShow = 90
    } else {
      startDate.setDate(now.getDate() - now.getDay())
      daysToShow = 7
    }

    const data = Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dayMeals = meals.filter((meal) => {
        const mealDate = new Date(meal.logDate)
        return mealDate.toDateString() === date.toDateString()
      })

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
        goal: dailyCalorieGoal,
      }
    })

    return data
  }

  const sortMealsByDate = (meals: Meal[]) => {
    return [...meals].sort((a, b) => {
      return new Date(b.logDate).getTime() - new Date(a.logDate).getTime()
    })
  }

  const getRecentMeals = (limit: number = 5) => {
    return sortMealsByDate(meals).slice(0, limit).reverse()
  }

  const getNutrientTotals = () => {
    const totals = meals.reduce(
      (acc, meal) => ({
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 },
    )

    return [
      { name: 'Protein', value: totals.protein, color: '#22c55e' },
      { name: 'Carbs', value: totals.carbs, color: '#3b82f6' },
      { name: 'Fat', value: totals.fat, color: '#ef4444' },
    ]
  }

  const getMostConsumed = () => {
    const mealTypeCounts = meals.reduce((acc, meal) => {
      acc[meal.mealType] = (acc[meal.mealType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const entries = Object.entries(mealTypeCounts)
    if (!entries.length) return null

    return entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
  }

  const getCalorieStats = () => {
    const today = new Date().toISOString().split('T')[0]

    const todayMeals = meals.filter((meal) => {
      const mealDate = new Date(meal.logDate).toISOString().split('T')[0]
      return mealDate === today
    })

    const consumed = todayMeals.reduce((sum, meal) => sum + meal.calories, 0)

    return {
      consumed,
      goal: dailyCalorieGoal,
    }
  }

  return {
    getWeeklyData,
    getNutrientTotals,
    getMostConsumed,
    getCalorieStats,
    getRecentMeals,
  }
}
