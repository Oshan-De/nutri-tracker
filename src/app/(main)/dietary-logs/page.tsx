'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { FilterLogs } from '@/components/filter-logs'
import { DeleteLogDialog } from '@/components/delete-log-dialog'
import Link from 'next/link'
import { useMealStore } from '@/store/meal-store'
import { Meal } from '@/lib/types/meal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNotification } from '@/hooks/use-notification'
import { Pencil, Save, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

const mealSchema = z.object({
  id: z.string(),
  mealName: z.string().min(1, 'Meal name is required'),
  calories: z.number().positive('Calories must be positive'),
  logDate: z.string(),
  mealType: z.string(),
  notes: z.string().optional(),
})

export default function DietaryLogs() {
  const { meals, deleteMeal, updateMeal, deleteMeals } = useMealStore(
    (state) => state,
  )
  const [filteredLogs, setFilteredLogs] = useState<Meal[]>(meals)
  const [selectedMeals, setSelectedMeals] = useState<Set<string>>(new Set())
  const [editingMealId, setEditingMealId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const { success, error } = useNotification()

  useEffect(() => {
    setFilteredLogs((prevFiltered) => {
      const filteredIds = new Set(prevFiltered.map((log) => log.id))
      return meals.filter((meal) => filteredIds.has(meal.id))
    })
  }, [meals])

  const startEditing = (meal: Meal) => {
    setSelectedMeals(new Set())
    setEditingMealId(meal.id)
    setFormData({
      mealName: meal.mealName,
      mealType: meal.mealType,
      calories: meal.calories,
      notes: meal.notes || '',
      logDate: meal.logDate,
    })
    setFormErrors({})
  }

  const cancelEditing = () => {
    setEditingMealId(null)
    setFormData({})
    setFormErrors({})
  }

  const saveEdits = async () => {
    if (!editingMealId) return

    try {
      const validatedData = mealSchema.parse({
        id: editingMealId,
        ...formData,
      })

      await updateMeal(validatedData.id, validatedData)
      setEditingMealId(null)
      setFormData({})

      success({
        title: 'Meal updated successfully',
        description: 'Your meal has been updated.',
      })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            errors[e.path[0] as string] = e.message
          }
        })
        setFormErrors(errors)
      } else {
        console.error('Error saving edits:', err)
      }
      error({
        title: 'Error updating meal',
        description: 'There was an error updating your meal. Please try again.',
      })
    }
  }

  const handleFieldChange = (field: keyof Meal, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const toggleSelectMeal = (mealId: string) => {
    if (editingMealId) return
    setSelectedMeals((prev) =>
      prev.has(mealId)
        ? new Set([...prev].filter((id) => id !== mealId))
        : new Set(prev).add(mealId),
    )
  }

  const handleDeleteLog = async (mealId: string): Promise<void> => {
    try {
      await deleteMeal(mealId)
      success({
        title: 'Meal deleted successfully',
        description: 'Your meal has been deleted.',
      })
    } catch (err) {
      console.error('Error deleting meal: ', err)
      error({
        title: 'Error deleting meal',
        description: 'There was an error deleting your meal. Please try again.',
      })
    }
  }

  const handleMultipleDeleteLog = async (meals: Set<string>): Promise<void> => {
    try {
      const mealIds = Array.from(meals)
      await deleteMeals(mealIds)
      success({
        title: 'Meals deleted successfully',
        description: 'Your meals have been deleted.',
      })
    } catch (err) {
      console.error('Error deleting meal: ', err)
      error({
        title: 'Error deleting meal',
        description: 'There was an error deleting your meal. Please try again.',
      })
    } finally {
      setSelectedMeals(new Set())
    }
  }

  const resetFilters = () => {
    setFilteredLogs(meals)
  }

  const groupedLogs = filteredLogs.reduce((acc, meal) => {
    const date = format(new Date(meal.logDate ?? ''), 'MMM d, yyyy')
    if (!acc[date]) acc[date] = []
    acc[date].push(meal)
    return acc
  }, {} as Record<string, Meal[]>)

  return (
    <div className="flex flex-1 flex-col gap-4 p-10 pt-3 pb-10">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold">Diatary Logs</h1>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/add-meal">Add Meal</Link>
          </Button>

          <Button
            size="lg"
            variant={'outline'}
            onClick={() => handleMultipleDeleteLog(selectedMeals)}
            disabled={selectedMeals.size === 0 || editingMealId !== null}
          >
            Delete Selected
          </Button>
          <Button size="lg" variant={'ghost'} onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      <FilterLogs
        onFilterChange={({
          startDate,
          endDate,
          mealType,
          minCalories,
          maxCalories,
        }) => {
          let filtered = [...meals]
          if (startDate)
            filtered = filtered.filter(
              (log) => new Date(log.logDate ?? '') >= new Date(startDate),
            )
          if (endDate)
            filtered = filtered.filter(
              (log) => new Date(log.logDate ?? '') <= new Date(endDate),
            )
          if (mealType)
            filtered = filtered.filter((log) => log.mealType === mealType)
          if (minCalories)
            filtered = filtered.filter((log) => log.calories >= minCalories)
          if (maxCalories)
            filtered = filtered.filter((log) => log.calories <= maxCalories)
          setFilteredLogs(filtered)
        }}
      />

      {Object.entries(groupedLogs)
        .reverse()
        .map(([date, meals]) => (
          <div key={date}>
            <h2 className="text-xl font-semibold mb-2">{date}</h2>
            <div className="grid gap-6">
              {meals.reverse().map((meal) => (
                <Card
                  key={meal.id}
                  className={`log-card group p-4 pb-6 ${
                    selectedMeals.has(meal.id)
                      ? 'outline outline-2 outline-primary'
                      : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <Checkbox
                      checked={selectedMeals.has(meal.id)}
                      onCheckedChange={() => toggleSelectMeal(meal.id)}
                      disabled={editingMealId !== null}
                      className="mt-2"
                    />
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <div className="w-full">
                          <div
                            className={`flex gap-4 items-center ${
                              editingMealId === meal.id
                                ? 'w-full justify-between'
                                : ''
                            }`}
                          >
                            {editingMealId === meal.id ? (
                              <>
                                <Input
                                  value={formData.mealName as string}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      'mealName',
                                      e.target.value,
                                    )
                                  }
                                  width={300}
                                />
                                {formErrors.mealName && (
                                  <p className="text-red-500 text-sm">
                                    {formErrors.mealName}
                                  </p>
                                )}
                              </>
                            ) : (
                              <h4 className="text-lg">{meal.mealName}</h4>
                            )}
                            <div className="flex gap-2  ">
                              {editingMealId === meal.id ? (
                                <>
                                  <Button
                                    variant={'ghost'}
                                    size="icon"
                                    onClick={saveEdits}
                                  >
                                    <Save />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant={'ghost'}
                                    onClick={cancelEditing}
                                  >
                                    <X />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant={'ghost'}
                                  size="icon"
                                  onClick={() => startEditing(meal)}
                                >
                                  <Pencil />
                                </Button>
                              )}
                              {!editingMealId && editingMealId !== meal.id && (
                                <DeleteLogDialog
                                  mealName={meal.mealName}
                                  onConfirm={() => handleDeleteLog(meal.id)}
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {editingMealId === meal.id ? (
                              <>
                                <div className="flex gap-4 w-full pb-2 pt-4">
                                  <Select
                                    value={formData.mealType as string}
                                    onValueChange={(value) =>
                                      handleFieldChange('mealType', value)
                                    }
                                  >
                                    <SelectTrigger className="w-[200px]">
                                      <SelectValue placeholder="Select meal type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="breakfast">
                                        Breakfast
                                      </SelectItem>
                                      <SelectItem value="lunch">
                                        Lunch
                                      </SelectItem>
                                      <SelectItem value="dinner">
                                        Dinner
                                      </SelectItem>
                                      <SelectItem value="snack">
                                        Snack
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {formErrors.mealType && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors.mealType}
                                    </p>
                                  )}
                                  <Input
                                    type="number"
                                    value={formData.calories as number}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        'calories',
                                        Number(e.target.value),
                                      )
                                    }
                                    className="w-[150px]"
                                  />
                                  {formErrors.calories && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors.calories}
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-sm text-gray-600">
                                  {format(
                                    new Date(meal.logDate).toISOString(),
                                    'MMM d, yyyy',
                                  )}{' '}
                                </span>
                                •{' '}
                                <span className="text-sm text-gray-600">
                                  {meal.mealType}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {editingMealId !== meal.id && (
                          <div className="text-sm font-medium text-primary text-nowrap">
                            {meal.calories} kcal
                          </div>
                        )}
                      </div>
                      {editingMealId === meal.id ? (
                        <>
                          <Textarea
                            placeholder="Notes"
                            value={formData.notes as string}
                            onChange={(e) =>
                              handleFieldChange('notes', e.target.value)
                            }
                            className="w-full mt-2"
                            rows={4}
                          />
                          {formErrors.notes && (
                            <p className="text-red-500 text-sm">
                              {formErrors.notes}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {' '}
                          {meal.notes && (
                            <p className="mt-2 text-sm text-gray-400">
                              {meal.notes}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
