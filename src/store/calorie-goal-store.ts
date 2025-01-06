import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCalorieGoal, updateCalorieGoal } from '@/lib/api'

export interface CalorieGoalState {
  goal: number | null
  isLoading: boolean
  error: string | null
  resetStore: () => void
  fetchGoal: () => Promise<boolean>
  updateGoal: (goal: number) => Promise<void>
}

export const useCalorieGoalStore = create<CalorieGoalState>()(
  persist(
    (set) => ({
      goal: null,
      isLoading: false,
      error: null,
      resetStore: () => set({ goal: null, isLoading: false, error: null }),

      fetchGoal: async () => {
        set({ isLoading: true, error: null })
        try {
          const dailyGoal = await getCalorieGoal()

          set({ goal: dailyGoal, isLoading: false })

          return true
        } catch (error) {
          set({
            error: `Failed to fetch calorie goal: ${(error as Error).message}`,
            isLoading: false,
          })
          return false
        }
      },

      updateGoal: async (goal: number) => {
        set({ isLoading: true, error: null })
        try {
          await updateCalorieGoal({ dailyCalorieGoal: goal })

          set({ goal, isLoading: false })
        } catch (error) {
          set({
            error: `Failed to update calorie goal: ${(error as Error).message}`,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'calorie-goal-storage',
      version: 1,
    },
  ),
)
