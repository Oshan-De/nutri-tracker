'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { format } from 'date-fns'
// import { LoadingSpinner } from '@/components/loading-spinner'
import { useMealsData } from '@/hooks/use-meals'
import { MostConsumedStats } from '@/components/most-consumed-stats'
import { Greeting } from '@/components/greeting'
import { AISuggestionsModal } from '@/components/ai-suggestions-modal'
import CalorieRingChart from '@/components/charts/CalorieRingChart'
import WeeklyProgressChart from '@/components/charts/WeeklyProgressChart'
import NutrientBreakdownChart from '@/components/charts/NutrientBreakdownChart'
import Link from 'next/link'
import { useMealStore } from '@/store/meal-store'
import { useState } from 'react'
// import { useCalorieGoalStore } from '@/store/calorie-goal-store'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export default function Dashboard() {
  const [period, setPeriod] = useState('week')
  const { getWeeklyData, getNutrientTotals, getCalorieStats, getRecentMeals } =
    useMealsData()
  const { meals } = useMealStore((state) => state)
  // const {  } = useCalorieGoalStore((state) => state)

  // loaded from stores
  // if (mealsLoading || goalLoading) {
  //   return <LoadingSpinner />
  // }

  return (
    <div className="flex flex-1 flex-col gap-4 p-10 pt-3 pb-10">
      <div className="flex justify-between items-center">
        <Greeting />
        <div className="flex gap-4">
          <AISuggestionsModal />
          <Button size="lg" asChild>
            <Link href="/add-meal">Add Meal</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/set-calorie-goal">Set Goals</Link>
          </Button>
        </div>
      </div>

      <div className="pt-6">
        <MostConsumedStats data={meals} />
      </div>

      {/* Overview Section */}
      <div className="grid auto-rows-min gap-7 md:grid-cols-3 pt-7">
        <div className="rounded-xl bg-card h-full">
          <CalorieRingChart
            {...{
              consumed: getCalorieStats().consumed,
              goal: getCalorieStats().goal ?? 0,
            }}
          />
        </div>
        <div className="rounded-xl bg-card col-span-2">
          <Card className="w-full">
            <CardHeader className="flex justify-between flex-row pb-4">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Weekly Calorie Progress
                </CardTitle>
                <CardDescription className="text-base font-light text-gray-400">
                  Daily calorie intake vs goal
                </CardDescription>
              </div>
              <div>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Current Week</SelectItem>
                    <SelectItem value="month">Current Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <WeeklyProgressChart
                data={getWeeklyData(period).map((item) => ({
                  ...item,
                  goal: item.goal ?? 0,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends Section */}
      <div className="grid auto-rows-min gap-7 md:grid-cols-3 pt-7">
        <div className="rounded-xl bg-card">
          <NutrientBreakdownChart data={getNutrientTotals()} />
        </div>
        <div className="rounded-xl bg-card md:pl-4 col-span-2">
          <h3 className="mb-4 text-xl font-semibold">Recent Meals</h3>
          <div className="space-y-4">
            {getRecentMeals(3).length > 0 ? (
              <>
                {getRecentMeals(3).map((meal) => (
                  <Card key={meal.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg">{meal.mealName}</h4>
                        <div className="flex gap-2 text-sm text-gray-600">
                          <span>
                            {format(
                              new Date(meal.logDate).toISOString(),
                              'MMM d, yyyy',
                            )}{' '}
                          </span>
                          • <span>{meal.mealType}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {meal.calories} kcal
                      </div>
                    </div>
                    {meal.notes && (
                      <p className="mt-2 text-sm text-gray-400">{meal.notes}</p>
                    )}
                  </Card>
                ))}
                <div className="text-center pt-2">
                  <Button variant="link" asChild>
                    <Link href="/dietary-logs">View All Meals</Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center pt-10">
                No recent meals
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
