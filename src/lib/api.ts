import { AISuggestion, AISuggestionsParams } from '@/lib/types/ai'
import { Meal } from '@/lib/types/meal'

export async function getMeals(): Promise<Meal[]> {
  const response = await fetch('/api/meals')

  if (!response.ok) {
    throw new Error('Failed to fetch meals logs')
  }

  return response.json()
}

export async function addMeal(data: Meal) {
  const response = await fetch('/api/meals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create meal')
  }

  return response.json()
}

export async function updateMeal(id: string, data: Meal) {
  const response = await fetch(`/api/meals/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.text()

  if (result !== 'OK') {
    throw new Error('Failed to updae]te diatary log')
  }

  return true
}

export async function deleteMeal(id: string): Promise<boolean> {
  const response = await fetch(`/api/meals/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete tets1 log')
  }

  return true
}

export async function deleteMeals(ids: string[]): Promise<boolean> {
  const response = await fetch('/api/meals', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete diatary log')
  }

  const result = await response.text()

  if (result !== 'OK') {
    throw new Error('Failed to delete diatary log')
  }

  return true
}

export async function getCalorieGoal(): Promise<number> {
  const response = await fetch('/api/calorie-goal', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch calorie goal')
  }

  const data = await response.json()
  return data.dailyCalorieGoal
}

export async function updateCalorieGoal(data: { dailyCalorieGoal: number }) {
  const response = await fetch('/api/calorie-goal', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update calorie goal')
  }
}

export async function getAISuggestions(
  params: AISuggestionsParams,
): Promise<AISuggestion[]> {
  const { ingredients, cuisine, mealType, calorieGoal } = params

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error('Ingredients list must be a non-empty array.')
  }

  try {
    const response = await fetch('/api/ai/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients,
        cuisine,
        mealType,
        calorieGoal,
      }),
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Server Error: ${response.status} - ${errorMessage}`)
    }

    let data = await response.json()
    if (Array.isArray(data)) {
      if (
        data.some(
          (item) =>
            typeof item !== 'object' ||
            typeof item.suggestion !== 'string' ||
            typeof item.calories !== 'number' ||
            typeof item.ingredients !== 'string' ||
            typeof item.instructions !== 'string' ||
            item.calories <= 0,
        )
      ) {
        throw new Error('Unexpected response format: Invalid items in array.')
      }
    } else if (
      typeof data === 'object' &&
      typeof data.suggestion === 'string' &&
      typeof data.calories === 'number' &&
      typeof data.ingredients === 'string' &&
      typeof data.instructions === 'string' &&
      data.calories > 0
    ) {
      data = [data]
    } else {
      throw new Error('Unexpected response format from the server.')
    }

    return data
  } catch (error) {
    console.error('Error fetching AI suggestions:', error)
    throw new Error(
      'An error occurred while fetching AI suggestions. Please try again later.',
    )
  }
}
