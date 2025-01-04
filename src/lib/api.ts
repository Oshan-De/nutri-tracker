// API client for making requests to our backend

export async function getFoodLogs() {
  const response = await fetch('/api/food-logs')

  if (!response.ok) {
    throw new Error('Failed to fetch food logs')
  }

  return response.json()
}

export async function createFoodLog(data: {
  foodName: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  mealType: string
  logDate: Date
  notes?: string
}) {
  const response = await fetch('/api/food-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create food log')
  }

  return response.json()
}

export async function updateFoodLog(id: string, data: {
  foodName: string
  mealType: string
  calories: number
  notes?: string
}) {
  const response = await fetch(`/api/food-logs/${id}/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update food log')
  }
}

export async function updateUserSettings(data: { dailyCalorieGoal: number }) {
  const response = await fetch('/api/settings', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update settings')
  }
}

export async function getAISuggestions(ingredients: string[]) {
  const response = await fetch('/api/ai-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  })

  if (!response.ok) {
    throw new Error('Failed to get AI suggestions')
  }

  return response.json()
}
