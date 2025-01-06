'use client'

import { useRouter } from 'next/navigation'
import { AddMealForm } from '@/components/forms/add-meal-form'
import { Card } from '@/components/ui/card'

export default function AddMeal() {
  const router = useRouter()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pl-8">
      <div className="w-fit">
        <Card className="p-6 md:min-w-[600px] md:w-[600px] overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Nutrition Goals</h2>
          <AddMealForm
            onSuccess={() => router.push('/dietary-logs')}
            onCancel={() => router.push('/dashboard')}
          />
        </Card>
      </div>
    </div>
  )
}
