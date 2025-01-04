'use client'

import { Button } from '@/components/ui/button'
import { AISuggestionsModal } from '@/components/ai-suggestions-modal'
import { useState } from 'react'

interface FoodLog {
  logDate: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { CalorieRingChart } from '@/components/charts/CalorieRingChart'
import { WeeklyProgressChart } from '@/components/charts/WeeklyProgressChart'
import { NutrientBreakdownChart } from '@/components/charts/NutrientBreakdownChart'
import { useEffect } from 'react'
import { getFoodLogs } from '@/lib/api'
import { RecentMealsList } from '@/components/recent-meals-list'

function Dashboard() {
  const { user, isLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [todaysCalories, setTodaysCalories] = useState(0)
  const [weeklyData, setWeeklyData] = useState<
    { day: string; calories: number; goal: number }[]
  >([])
  const [nutrients, setNutrients] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const logs = await getFoodLogs()
        // Process logs to get today's calories
        const today = new Date().toISOString().split('T')[0]
        const todayLogs = logs.filter((log: FoodLog) => log.logDate === today)
        const todayTotal: number = todayLogs.reduce(
          (sum: number, log: FoodLog) => sum + log.calories,
          0,
        )
        setTodaysCalories(todayTotal)

        // Process weekly data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const weeklyData = days.map((day) => ({
          day,
          calories: 0,
          goal: (user?.publicMetadata?.dailyCalorieGoal as number) || 2000,
        }))
        setWeeklyData(weeklyData)

        // Process nutrients
        interface Nutrients {
          protein: number
          carbs: number
          fat: number
        }

        const totalNutrients: Nutrients = logs.reduce(
          (acc: Nutrients, log: FoodLog) => ({
            protein: acc.protein + (log.protein || 0),
            carbs: acc.carbs + (log.carbs || 0),
            fat: acc.fat + (log.fat || 0),
          }),
          { protein: 0, carbs: 0, fat: 0 },
        )
        setNutrients(totalNutrients)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  // Redirect if not authenticated
  if (isLoaded && !user) {
    redirect('/sign-in')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <a href="/logs/add">Add Meal</a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="/settings">Set Goals</a>
        </Button>
      </div>

      {/* Overview Section */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Today&apos;s Calories</h3>
          <CalorieRingChart
            consumed={todaysCalories}
            goal={(user?.publicMetadata?.dailyCalorieGoal as number) || 2000}
          />
        </div>
        <div className="aspect-video rounded-xl bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Weekly Progress</h3>
          <WeeklyProgressChart data={weeklyData} />
        </div>
        <div className="aspect-video rounded-xl bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">AI Suggestions</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get personalized meal suggestions based on your goals.
          </p>
          <AISuggestionsModal />
        </div>
      </div>

      {/* Trends Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Nutrient Breakdown</h3>
          <NutrientBreakdownChart
            data={[
              {
                name: 'Protein',
                value: nutrients.protein,
                color: '#22c55e',
              },
              { name: 'Carbs', value: nutrients.carbs, color: '#3b82f6' },
              { name: 'Fat', value: nutrients.fat, color: '#ef4444' },
            ]}
          />
        </div>
        <div className="rounded-xl bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Meals</h3>
          <RecentMealsList />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
