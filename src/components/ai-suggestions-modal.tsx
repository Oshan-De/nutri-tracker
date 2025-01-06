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
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ButtonWithSpinner } from '@/components/button-with-spinner'
import { cuisines, mealTypes } from '@/lib/constants'
import { AISuggestion } from '@/lib/types/ai'
import { getAISuggestions } from '@/lib/api'
import { useMealStore } from '@/store/meal-store'
import { v4 as uuidv4 } from 'uuid'
import { useCalorieGoalStore } from '@/store/calorie-goal-store'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useNotification } from '@/hooks/use-notification'
import { Sparkles } from 'lucide-react'

const formSchema = z.object({
  ingredients: z.string().min(1, { message: 'Ingredients are required.' }),
  cuisine: z.string().min(1, { message: 'Cuisine is required.' }),
  mealType: z.string().min(1, { message: 'Meal type is required.' }),
})

export function AISuggestionsModal() {
  const { addMeal } = useMealStore()
  const { goal: dailyCalorieGoal } = useCalorieGoalStore()
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { success, error: notifyError } = useNotification()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: '',
      cuisine: '',
      mealType: '',
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form

  const handleGetSuggestions = async (data: {
    ingredients: string
    cuisine: string
    mealType: string
  }) => {
    setLoading(true)
    setError('')

    try {
      const ingredientsList = data.ingredients
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean)

      const result = await getAISuggestions({
        ingredients: ingredientsList,
        cuisine: data.cuisine,
        mealType: data.mealType,
        calorieGoal:
          typeof dailyCalorieGoal === 'number' ? dailyCalorieGoal : undefined,
      })

      setSuggestions(result || [])
      setStep(2)
    } catch (err) {
      console.error('Error getting suggestions:', err)
      setError('Failed to get suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToLog = async (suggestion: AISuggestion) => {
    try {
      const {
        calories,
        suggestion: mealName,
        ingredients,
        instructions,
      } = suggestion

      if (!mealName || calories <= 0) {
        throw new Error('Invalid suggestion format.')
      }

      const formattedIngredients = ingredients
        .split(',')
        .map((ingredient) => ingredient.trim())
        .join(', ')

      const formattedInstructions = instructions
        ? `Instructions: ${instructions}`
        : ''

      const notes = `AI suggested a ${form.getValues(
        'cuisine',
      )} ${form.getValues(
        'mealType',
      )} meal: ${mealName}. Ingredients: ${formattedIngredients}. ${formattedInstructions}`

      const data = {
        id: uuidv4(),
        logDate: new Date().toISOString(),
        mealName: mealName,
        calories,
        notes,
        mealType: form.getValues('mealType'),
      }

      await addMeal(data)

      handleClose()
      success({
        title: 'Meal added successfully',
        description: 'Your meal has been added to the log.',
      })
    } catch (err) {
      console.error('Error adding to log:', err)
      setError('Failed to add meal to log. Please try again.')
      notifyError({
        title: 'Error',
        description: 'An error occurred while adding the meal to the log.',
      })
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSuggestions([])
    setError('')
    setStep(1)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="flex gap-3 relative px-6 py-2 text-white border-2 border-primary rounded-xl mx-4"
        >
          <Sparkles className="stroke-primary" />
          Get Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Meal Suggestions</DialogTitle>
          <DialogDescription>
            Enter ingredients, select preferences, and get meal suggestions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {step === 1 ? (
            <>
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(handleGetSuggestions)}
                  className="space-y-4"
                >
                  <FormField
                    control={control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ingredients</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter ingredients separated by commas"
                            {...field}
                          />
                        </FormControl>
                        {errors.ingredients && (
                          <FormMessage>
                            {errors.ingredients.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuisine</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select cuisine" />
                            </SelectTrigger>
                            <SelectContent>
                              {cuisines.map((c) => (
                                <SelectItem key={c} value={c.toLowerCase()}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {errors.cuisine && (
                          <FormMessage>{errors.cuisine.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="mealType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                            <SelectContent>
                              {mealTypes.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {errors.mealType && (
                          <FormMessage>{errors.mealType.message}</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <ButtonWithSpinner
                      type="submit"
                      loading={loading}
                      disabled={
                        !form.getValues().ingredients.trim() ||
                        !form.getValues().cuisine ||
                        !form.getValues().mealType
                      }
                    >
                      {!loading && <Sparkles className="stroke-white" />}
                      Get Suggestions
                    </ButtonWithSpinner>
                  </div>
                </form>
              </Form>
            </>
          ) : (
            <>
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
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between pb-3">
                      <Label className="text-md">Suggestions</Label>
                      <Button
                        variant="default"
                        onClick={() => handleAddToLog(suggestions[0])}
                      >
                        Add to Log
                      </Button>
                    </div>

                    <ul className="space-y-2">
                      {suggestions.map((suggestion, i) => (
                        <li
                          key={i}
                          className="relative rounded-lg border bg-card p-4 text-sm text-card-foreground shadow-sm transition-shadow hover:shadow-md group"
                        >
                          <h3 className="text-lg font-medium text-primary">
                            {suggestion.suggestion}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {suggestion.calories} kcal
                          </p>
                          <div className="text-sm space-y-2">
                            <div className="flex items-start">
                              <span className="font-semibold text-primary mr-2">
                                Ingredients:
                              </span>
                              <span className="text-muted-foreground">
                                {suggestion.ingredients}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="font-semibold text-primary mr-2">
                                Instructions:
                              </span>
                              <span className="text-muted-foreground">
                                {suggestion.instructions}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <DialogFooter>
          {step === 1 ? (
            <>
              {suggestions.length > 0 && !loading && (
                <>
                  <Button variant="outline" onClick={() => setStep(2)}>
                    View Suggestions
                  </Button>
                </>
              )}
              <DialogClose asChild>
                <Button variant="outline" onClick={() => handleClose()}>
                  Close
                </Button>
              </DialogClose>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => handleClose()}>
                  Close
                </Button>
              </DialogClose>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
