'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
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
import { useUser } from '@clerk/nextjs'
import { updateUserSettings } from '@/lib/api'

const formSchema = z.object({
  dailyCalorieGoal: z.number().min(500).max(10000),
})

export function UserSettingsForm() {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dailyCalorieGoal: 2000,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id) return

    try {
      setIsSubmitting(true)
      await updateUserSettings({ dailyCalorieGoal: values.dailyCalorieGoal })
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="dailyCalorieGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Calorie Goal</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Set your daily calorie target for tracking progress
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}
