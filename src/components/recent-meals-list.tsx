'use client'

import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { getFoodLogs } from '@/lib/api'

export function RecentMealsList() {
  const [recentMeals, setRecentMeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMeals() {
      try {
        const logs = await getFoodLogs()
        const sorted = logs.sort(
          (a: { createdAt: string }, b: { createdAt: string }) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          },
        )
        setRecentMeals(sorted.slice(0, 5))
      } catch (error) {
        console.error('Error loading recent meals:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMeals()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {recentMeals.map(
        (meal: {
          id: string
          foodName: string
          mealType: string
          calories: number
          logDate: string
        }) => (
          <Card key={meal.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{meal.foodName}</h4>
                <p className="text-sm text-muted-foreground">
                  {meal.mealType} • {meal.calories} calories
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(meal.logDate).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ),
      )}
    </div>
  )
}
