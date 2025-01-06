import {
  addMeal,
  deleteMeal,
  deleteMeals,
  getMeals,
  updateMeal,
} from '@/lib/api'
import { Meal } from '@/lib/types/meal'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface MealState {
  meals: Meal[]
  isLoading: boolean
  error: string | null
  resetStore: () => void
  fetchMeals: () => Promise<boolean>
  addMeal: (meal: Meal) => Promise<void>
  updateMeal: (id: string, meal: Meal) => Promise<void>
  deleteMeal: (id: string) => Promise<void>
  deleteMeals: (ids: string[]) => Promise<void>
}

export const useMealStore = create<MealState>()(
  devtools(
    persist(
      (set): MealState => ({
        meals: [],
        isLoading: false,
        error: null,
        resetStore: () => set({ meals: [], isLoading: false, error: null }),

        fetchMeals: async () => {
          set({ isLoading: true, error: null })

          try {
            const meals = await getMeals()

            set({ meals, isLoading: false })
            return true
          } catch (error) {
            set({
              error: `Failed to fetch meals: ${(error as Error).message}`,
              isLoading: false,
            })

            return false
          }
        },

        addMeal: async (meal: Meal) => {
          set({ isLoading: true, error: null })

          try {
            const newMeal = await addMeal(meal)

            set((state) => ({
              meals: [...state.meals, newMeal],
              isLoading: false,
            }))
          } catch (error) {
            set({
              error: `Failed to add meal: ${(error as Error).message}`,
              isLoading: false,
            })
          }
        },

        updateMeal: async (id: string, meal: Meal) => {
          set({ isLoading: true, error: null })

          try {
            await updateMeal(id, meal)

            set((state) => ({
              meals: state.meals.map((m) => (m.id === id ? meal : m)),
              isLoading: false,
            }))
          } catch (error) {
            set({
              error: `Failed to update meal: ${(error as Error).message}`,
              isLoading: false,
            })
          }
        },

        deleteMeal: async (id: string) => {
          set({ isLoading: true, error: null })

          try {
            await deleteMeal(id)

            set((state) => ({
              meals: state.meals.filter((meal) => meal.id !== id),
              isLoading: false,
            }))
          } catch (error) {
            set({
              error: `Failed to delete meal: ${(error as Error).message}`,
              isLoading: false,
            })
          }
        },

        deleteMeals: async (ids: string[]) => {
          set({ isLoading: true, error: null })

          try {
            const deletedMeals = await deleteMeals(ids)
            if (!deletedMeals) {
              throw new Error('Failed to delete meals')
            }

            set((state) => ({
              meals: [...state.meals.filter((meal) => !ids.includes(meal.id))],
              isLoading: false,
            }))
          } catch (error) {
            set({
              error: `Failed to delete meals: ${(error as Error).message}`,
              isLoading: false,
            })
          }
        },
      }),
      {
        name: 'meal-storage',
        version: 1,
      },
    ),
  ),
)
