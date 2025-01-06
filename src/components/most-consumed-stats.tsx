'use client'

import { Card } from '@/components/ui/card'
import { Meal } from '@/lib/types/meal'
import { format } from 'date-fns'
import { ArrowDownIcon, ArrowUpIcon, Flame } from 'lucide-react'

interface MostConsumedStatsProps {
  data: Meal[]
}

export function MostConsumedStats({ data }: MostConsumedStatsProps) {
  const getMostConsumedFood = () => {
    const mealCounts = data.reduce((acc, meal) => {
      acc[meal.mealName] = (acc[meal.mealName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const entries = Object.entries(mealCounts)
    if (!entries.length) return null

    return entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max))
  }

  const getMinMaxCalories = () => {
    if (!data.length) return { min: null, max: null }

    return data.reduce(
      (acc, meal) => ({
        min: meal.calories < (acc.min?.calories ?? Infinity) ? meal : acc.min,
        max: meal.calories > (acc.max?.calories ?? -Infinity) ? meal : acc.max,
      }),
      { min: data[0], max: data[0] },
    )
  }

  const mostConsumedFood = getMostConsumedFood()
  const { min: minCalorieMeal, max: maxCalorieMeal } = getMinMaxCalories()

  return (
    <div className="grid gap-7 md:grid-cols-3">
      <Card className="pt-5 px-7 pb-7">
        <Flame className="h-8 w-8 text-orange-500 dark:text-orange-400 mb-3" />
        <h3 className="text-gray-400 pb-1">Most Consumed Meal</h3>
        {mostConsumedFood ? (
          <p className="text-xl font-semibold">
            {mostConsumedFood[0]}{' '}
            <span className="text-primary">({mostConsumedFood[1]} times)</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </Card>

      <Card className="pt-5 px-7 pb-7">
        <ArrowUpIcon className="h-8 w-8 text-red-500 dark:text-red-400 mb-3" />
        <h3 className="text-gray-400 pb-1">Highest Calorie Meal</h3>
        {maxCalorieMeal ? (
          <p className="text-xl font-semibold">
            {maxCalorieMeal.mealName}{' '}
            <span className="text-primary">
              ({maxCalorieMeal.calories} kcal)
            </span>
            <br />
            <span className="text-sm font-light text-gray-500">
              {format(new Date(maxCalorieMeal.logDate), 'MMM d, yyyy')}
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </Card>

      <Card className="pt-5 px-7 pb-7">
        <ArrowDownIcon className="h-8 w-8 text-green-500 dark:text-green-400 mb-3" />
        <h3 className="text-gray-400 pb-1">Lowest Calorie Meal</h3>
        {minCalorieMeal ? (
          <p className="text-xl font-semibold">
            {minCalorieMeal.mealName}{' '}
            <span className="text-primary">
              ({minCalorieMeal.calories} kcal)
            </span>
            <br />
            <span className="text-sm font-light text-gray-500">
              {format(new Date(minCalorieMeal.logDate), 'MMM d, yyyy')}
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </Card>
    </div>
  )
}
