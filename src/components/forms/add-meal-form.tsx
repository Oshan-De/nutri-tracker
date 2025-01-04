'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createFoodLog } from '@/lib/api'

const formSchema = z.object({
  foodName: z.string().min(2, {
    message: 'Food name must be at least 2 characters.',
  }),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.number().min(0),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  notes: z.string().optional(),
  logDate: z.date(),
})

export type AddMealFormValues = z.infer<typeof formSchema>

interface AddMealFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddMealForm({ onSuccess, onCancel }: AddMealFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddMealFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodName: '',
      mealType: 'breakfast',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      notes: '',
      logDate: new Date(),
    },
  })

  async function onSubmit(values: AddMealFormValues) {
    try {
      setIsSubmitting(true)
      await createFoodLog(values)
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = {
    1: (
      <motion.div
        key="step1"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
      >
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="foodName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food Name</FormLabel>
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
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    {...field}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </motion.div>
    ),
    2: (
      <motion.div
        key="step2"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
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
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
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
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
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
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
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
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </motion.div>
    ),
    3: (
      <motion.div
        key="step3"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
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
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                    onChange={e => field.onChange(new Date(e.target.value))}
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
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                    placeholder="Any additional notes..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </motion.div>
    ),
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {steps[step as keyof typeof steps]}
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (step === 1) {
                onCancel?.()
              } else {
                setStep(step - 1)
              }
            }}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          <Button
            type={step === 3 ? 'submit' : 'button'}
            disabled={isSubmitting}
            onClick={() => {
              if (step < 3) {
                setStep(step + 1)
              }
            }}
          >
            {step === 3 ? (isSubmitting ? 'Saving...' : 'Save') : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  )
}