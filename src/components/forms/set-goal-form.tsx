'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCalorieGoalStore } from '@/store/calorie-goal-store'
import { useNotification } from '@/hooks/use-notification'

const formSchema = z.object({
  goalType: z.enum(['daily', 'weekly', 'monthly']),
  calorieGoal: z
    .number()
    .min(500, 'Minimum calorie goal is 500')
    .max(50000, 'Maximum calorie goal is 50000'),
  proteinGoal: z.number().min(0, 'Protein goal must be 0 or higher').optional(),
  carbsGoal: z.number().min(0, 'Carbs goal must be 0 or higher').optional(),
  fatGoal: z.number().min(0, 'Fat goal must be 0 or higher').optional(),
})

export function SetGoalPageForm() {
  const { goal: dailyCalorieGoal, updateGoal } = useCalorieGoalStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error } = useNotification()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalType: 'daily',
      calorieGoal:
        typeof dailyCalorieGoal === 'number' ? dailyCalorieGoal : 2000,
      proteinGoal: 50,
      carbsGoal: 250,
      fatGoal: 70,
    },
  })

  const [tempValues, setTempValues] = useState({
    calorieGoal: form.getValues('calorieGoal')?.toString() || '',
    proteinGoal: form.getValues('proteinGoal')?.toString() || '',
    carbsGoal: form.getValues('carbsGoal')?.toString() || '',
    fatGoal: form.getValues('fatGoal')?.toString() || '',
  })

  const handleTempChange = (field: keyof typeof tempValues, value: string) => {
    setTempValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBlur = (field: keyof typeof tempValues) => {
    const parsedValue = parseInt(tempValues[field], 10)

    form.setValue(field, isNaN(parsedValue) ? undefined : parsedValue, {
      shouldValidate: true,
    })
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await updateGoal(values.calorieGoal)
      success({
        title: 'Goal updated successfully',
        description: 'Your calorie goal has been updated.',
      })
    } catch (err) {
      console.error('Error updating settings:', err)
      error({
        title: 'Error updating goal',
        description: 'There was an error updating your goal. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="goalType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="calorieGoal"
          render={() => (
            <FormItem>
              <FormLabel>Calorie Goal</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2000"
                  value={tempValues.calorieGoal}
                  onChange={(e) =>
                    handleTempChange('calorieGoal', e.target.value)
                  }
                  onBlur={() => handleBlur('calorieGoal')}
                />
              </FormControl>
              <FormDescription>
                Set your calorie target for the selected period
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="proteinGoal"
            render={() => (
              <FormItem>
                <FormLabel>Protein Goal (g)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50"
                    value={tempValues.proteinGoal}
                    onChange={(e) =>
                      handleTempChange('proteinGoal', e.target.value)
                    }
                    onBlur={() => handleBlur('proteinGoal')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carbsGoal"
            render={() => (
              <FormItem>
                <FormLabel>Carbs Goal (g)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="250"
                    value={tempValues.carbsGoal}
                    onChange={(e) =>
                      handleTempChange('carbsGoal', e.target.value)
                    }
                    onBlur={() => handleBlur('carbsGoal')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fatGoal"
            render={() => (
              <FormItem>
                <FormLabel>Fat Goal (g)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="70"
                    value={tempValues.fatGoal}
                    onChange={(e) =>
                      handleTempChange('fatGoal', e.target.value)
                    }
                    onBlur={() => handleBlur('fatGoal')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}
