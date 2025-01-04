'use client'

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { UserSettingsForm } from '@/components/forms/user-settings-form'

function SettingsPage() {
  const { user, isLoaded } = useUser()

  if (isLoaded && !user) {
    redirect('/sign-in')
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid gap-4 max-w-2xl">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Nutrition Goals</h2>
          <UserSettingsForm />
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage
