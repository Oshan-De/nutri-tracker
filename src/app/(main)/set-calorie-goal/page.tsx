'use client'

import { Card } from '@/components/ui/card'
import { SetGoalPageForm } from '@/components/forms/set-goal-form'

export default function SetGoal() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pl-8">
      <div className="w-fit">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Nutrition Goals</h2>
          <SetGoalPageForm />
        </Card>
      </div>
    </div>
  )
}
