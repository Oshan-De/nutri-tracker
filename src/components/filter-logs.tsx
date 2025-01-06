'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterLogsProps {
  onFilterChange: (filters: {
    startDate?: string
    endDate?: string
    mealType?: string
    minCalories?: number
    maxCalories?: number
  }) => void
}

export function FilterLogs({ onFilterChange }: FilterLogsProps) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    mealType: '',
    minCalories: '',
    maxCalories: '',
  })

  const handleFilterChange = (field: string, value: string) => {
    if (field === 'mealType' && value === 'all') {
      value = ''
    }

    const newFilters = { ...filters, [field]: value }

    setFilters(newFilters)
    onFilterChange({
      ...newFilters,
      minCalories: newFilters.minCalories
        ? Number(newFilters.minCalories)
        : undefined,
      maxCalories: newFilters.maxCalories
        ? Number(newFilters.maxCalories)
        : undefined,
    })
  }

  return (
    <div className="space-y-4 bg-card rounded-lg pb-6">
      <div className="flex gap-6">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Meal Type</Label>
          <Select
            value={filters.mealType}
            onValueChange={(value) => handleFilterChange('mealType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Min Calories</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minCalories}
            onChange={(e) => handleFilterChange('minCalories', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Calories</Label>
          <Input
            type="number"
            placeholder="Any"
            value={filters.maxCalories}
            onChange={(e) => handleFilterChange('maxCalories', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
