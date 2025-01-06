export interface AISuggestionsParams {
  ingredients: string[]
  cuisine?: string
  mealType?: string
  calorieGoal?: number
}

export interface AISuggestion {
  suggestion: string
  calories: number
  ingredients: string
  instructions: string
}
