'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAISuggestions } from '@/lib/api'
import { createFoodLog } from '@/lib/api'

export function AISuggestionsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)

  interface Suggestion {
    suggestion: string
    calories: number
    ingredients: string
    instructions: string
  }

  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [error, setError] = useState('')

  async function handleGetSuggestions() {
    try {
      setLoading(true)
      setError('')
      const ingredientsList = ingredients
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean)
      const result = await getAISuggestions(ingredientsList)
      setSuggestion(result)
    } catch (error) {
      console.error('Error getting suggestions:', error)
      setError('Failed to get suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddToLog() {
    try {
      if (suggestion) {
        await createFoodLog({
          foodName: suggestion.suggestion.split(' - ')[0],
          calories: suggestion.calories,
          mealType: 'lunch', // Default to lunch, can be made selectable
          logDate: new Date(),
          notes: suggestion.instructions,
        })
      }
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding to log:', error)
      setError('Failed to add meal to log. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Get Suggestions</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Meal Suggestions</DialogTitle>
          <DialogDescription>
            Enter ingredients you have, and I&apos;ll suggest a healthy meal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Enter ingredients separated by commas"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
            <Button
              onClick={handleGetSuggestions}
              disabled={loading || !ingredients.trim()}
            >
              {loading ? 'Getting suggestions...' : 'Get Suggestions'}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            {suggestion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-muted rounded-lg p-4"
              >
                <h3 className="font-semibold mb-2">{suggestion.suggestion}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {suggestion.calories} calories
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Ingredients:</span>{' '}
                  {suggestion.ingredients}
                </p>
                <p className="text-sm mb-4">
                  <span className="font-medium">Instructions:</span>{' '}
                  {suggestion.instructions}
                </p>
                <Button onClick={handleAddToLog} className="w-full">
                  Add to Log
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
