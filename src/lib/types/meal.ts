export interface Meal {
  id: string
  mealName: string
  mealType: string
  calories: number
  logDate: string
  notes?: string
  protein?: number
  carbs?: number
  fat?: number
}

export interface Nutrients {
  protein: number
  carbs: number
  fat: number
}

export interface WeeklyData {
  day: string
  calories: number
  goal: number
}

export interface MealsState {
  meals: Meal[]
  todaysCalories: number
  nutrients: Nutrients
  loading: boolean
  error: string | null
  fetchMeals: () => Promise<void>
  addMeal: (meal: Meal) => Promise<void>
  updateMeal: (meal: Meal) => Promise<void>
  deleteMeal: (mealId: string) => Promise<void>
  setLoading: (loading: boolean) => void
}
