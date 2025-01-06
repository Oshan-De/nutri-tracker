'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useMealStore } from '@/store/meal-store'
import { useCalorieGoalStore } from '@/store/calorie-goal-store'

interface StoreErrorBoundaryProps {
  children: React.ReactNode
}

export function StoreErrorBoundary({ children }: StoreErrorBoundaryProps) {
  const { error: mealError, fetchMeals } = useMealStore()
  const { error: goalError, fetchGoal } = useCalorieGoalStore()
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (mealError || goalError) {
      setHasError(true)
    } else {
      setHasError(false)
    }
  }, [mealError, goalError])

  useEffect(() => {
    return () => setHasError(false)
  }, [])

  const handleRetry = async () => {
    setHasError(false)
    try {
      await Promise.all([fetchMeals(), fetchGoal()])
    } catch (error) {
      console.error('Error retrying data fetch:', error)
      setHasError(true)
    }
  }

  if (hasError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-xl font-semibold">Data Error</h2>
        <p className="text-center text-muted-foreground">
          {mealError || goalError || 'Failed to load data'}
        </p>
        <Button onClick={handleRetry}>Retry Loading Data</Button>
      </div>
    )
  }

  return <>{children}</>
}
