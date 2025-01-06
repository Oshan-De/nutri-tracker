'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useMealStore } from '@/store/meal-store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonWithSpinner } from '@/components/button-with-spinner'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { v4 as uuidv4 } from 'uuid'
import { useNotification } from '@/hooks/use-notification'
import { Textarea } from '@/components/ui/textarea'

const fullSchema = z.object({
  mealName: z.string().min(2, {
    message: 'Food name must be at least 2 characters.',
  }),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(500, {
      message: 'Calories must be at least 500.',
    }),
  ),
  protein: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(0).optional(),
  ),
  carbs: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(0).optional(),
  ),
  fat: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(0).optional(),
  ),
  notes: z.string().optional(),
  logDate: z.preprocess((val) => new Date(val as string), z.date()),
})

const stepSchemas = [
  z.object({
    mealName: fullSchema.shape.mealName,
    mealType: fullSchema.shape.mealType,
  }),
  z.object({
    calories: fullSchema.shape.calories,
    protein: fullSchema.shape.protein,
    carbs: fullSchema.shape.carbs,
    fat: fullSchema.shape.fat,
  }),
  z.object({
    logDate: fullSchema.shape.logDate,
    notes: fullSchema.shape.notes,
  }),
]

export type AddMealFormValues = z.infer<typeof fullSchema>

interface AddMealFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddMealForm({ onSuccess }: AddMealFormProps) {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error } = useNotification()

  const form = useForm<AddMealFormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      mealName: '',
      mealType: 'breakfast',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      notes: '',
      logDate: new Date(),
    },
    mode: 'onBlur',
  })

  async function validateCurrentStep() {
    const currentStepSchema = stepSchemas[step]
    const fields = Object.keys(currentStepSchema.shape)
    const isValid = await form.trigger(fields as (keyof AddMealFormValues)[])
    return isValid
  }

  async function onSubmit(values: AddMealFormValues) {
    if (step < stepSchemas.length - 1) {
      const isValid = await validateCurrentStep()
      if (!isValid) return
      setStep((prev) => prev + 1)
      return
    }

    try {
      setIsSubmitting(true)
      const meal = {
        id: uuidv4(),
        ...values,
        logDate: values.logDate.toISOString(),
      }
      await useMealStore.getState().addMeal(meal)
      success({
        title: 'Meal added successfully',
        description: 'Your meal has been added to the list.',
      })
      onSuccess?.()
    } catch (err) {
      console.error('Error submitting form:', err)
      error({
        title: 'Error',
        description: 'An error occurred while adding the meal.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    <motion.div
      key="step1"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 0, opacity: 0 }}
      transition={{
        x: { type: 'spring', stiffness: 200, damping: 25 },
        opacity: { duration: 0.3, ease: 'easeInOut' },
      }}
    >
      <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="mealName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Grilled Chicken Salad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>,
    <motion.div
      key="step2"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 0, opacity: 0 }}
      transition={{
        x: { type: 'spring', stiffness: 200, damping: 25 },
        opacity: { duration: 0.3, ease: 'easeInOut' },
      }}
    >
      <h2 className="text-lg font-semibold mb-4">Nutrition Information</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calories</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="protein"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protein (g)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carbs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carbs (g)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fat (g)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </motion.div>,
    <motion.div
      key="step3"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 0, opacity: 0 }}
      transition={{
        x: { type: 'spring', stiffness: 200, damping: 25 },
        opacity: { duration: 0.3, ease: 'easeInOut' },
      }}
    >
      <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="logDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split('T')[0]
                      : ''
                  }
                  className="w-fit"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm"
                  placeholder="Optional notes about the meal."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>,
  ][step]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">{steps}</AnimatePresence>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            disabled={step === 0 || isSubmitting}
            onClick={() => setStep((prev) => prev - 1)}
          >
            Previous
          </Button>
          {step === stepSchemas.length - 1 ? (
            <ButtonWithSpinner
              type="submit"
              loading={isSubmitting}
              className="w-fit"
            >
              Submit
            </ButtonWithSpinner>
          ) : (
            <Button
              type="button"
              variant="default"
              onClick={async () => {
                const isValid = await validateCurrentStep()
                if (isValid) setStep((prev) => prev + 1)
              }}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
