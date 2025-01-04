'use client'

import { useUser } from '@clerk/nextjs'
import { redirect, useRouter } from 'next/navigation'
import { AddMealForm } from '@/components/forms/add-meal-form'

function AddMealPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  if (isLoaded && !user) {
    redirect('/sign-in')
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold">Add Meal</h1>
      <div className="max-w-2xl">
        <AddMealForm
          onSuccess={() => router.push('/logs')}
          onCancel={() => router.push('/logs')}
        />
      </div>
    </div>
  )
}

export default AddMealPage
