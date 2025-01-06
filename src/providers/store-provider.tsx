'use client'

import { useEffect, useState } from 'react'
import { useMealStore, MealState } from '@/store/meal-store'
import {
  useCalorieGoalStore,
  CalorieGoalState,
} from '@/store/calorie-goal-store'
// import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import { PersistStore } from '@/lib/types/store'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const { fetchMeals } = useMealStore()
  const { fetchGoal } = useCalorieGoalStore()

  const [initialized, setInitialized] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const maxRetries = 3

  useEffect(() => {
    if (retryCount > 0) {
      setError(null)
    }
  }, [retryCount])

  useEffect(() => {
    if (!isHydrated) return

    let mounted = true
    let retryTimeout: NodeJS.Timeout
    let initialized = false

    const initializeStores = async () => {
      if (initialized) return

      try {
        await Promise.all([
          (useMealStore as PersistStore<MealState>).persist.rehydrate(),
          (
            useCalorieGoalStore as PersistStore<CalorieGoalState>
          ).persist.rehydrate(),
        ])

        if (mounted) {
          const results = await Promise.all([fetchMeals(), fetchGoal()])
          if (results.every(Boolean)) {
            initialized = true
            setInitialized(true)
            setRetryCount(0)
          }
        }
      } catch (error) {
        console.error('Error initializing stores:', error)
        if (mounted) {
          setError(
            error instanceof Error
              ? error
              : new Error('Failed to initialize stores'),
          )
          if (retryCount < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
            retryTimeout = setTimeout(() => {
              setRetryCount((prev) => prev + 1)
              setInitialized(false)
            }, delay)
          }
        }
      }
    }

    initializeStores()

    return () => {
      mounted = false
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [fetchMeals, fetchGoal, initialized, retryCount, isHydrated])

  useEffect(() => {
    let unsubMeals: (() => void) | null = null
    let unsubGoals: (() => void) | null = null

    const checkHydration = () => {
      if (
        (useMealStore as PersistStore<MealState>).persist.hasHydrated() &&
        (
          useCalorieGoalStore as PersistStore<CalorieGoalState>
        ).persist.hasHydrated()
      ) {
        setIsHydrated(true)
        if (unsubMeals) unsubMeals()
        if (unsubGoals) unsubGoals()
      }
    }

    const mealStore = useMealStore as PersistStore<MealState>
    const goalStore = useCalorieGoalStore as PersistStore<CalorieGoalState>

    unsubMeals = mealStore.persist.onHydrate(checkHydration)
    unsubGoals = goalStore.persist.onHydrate(checkHydration)

    checkHydration()

    return () => {
      if (unsubMeals) unsubMeals()
      if (unsubGoals) unsubGoals()
      if (isHydrated) {
        useMealStore.getState().resetStore()
        useCalorieGoalStore.getState().resetStore()
      }
    }
  }, [isHydrated])

  // mealsLoading and goalLoading loeaded from stores
  // if (!isHydrated || !initialized || mealsLoading || goalLoading) {
  //   return <LoadingSpinner />
  // }

  if (error && retryCount >= maxRetries) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-xl font-semibold">Failed to load data</h2>
        <p className="text-center text-muted-foreground">
          {error.message ||
            'An unexpected error occurred while loading your data'}
        </p>
        <Button
          onClick={() => {
            setRetryCount(0)
            setError(null)
            setInitialized(false)
          }}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
