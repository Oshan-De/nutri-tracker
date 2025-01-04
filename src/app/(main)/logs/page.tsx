'use client'

import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getFoodLogs } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { DeleteLogDialog } from '@/components/delete-log-dialog'
import { EditLogDialog } from '@/components/edit-log-dialog'

function LogsPage() {
  const { user, isLoaded } = useUser()
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<
    {
      id: string
      foodName: string
      mealType: string
      calories: number
      notes?: string
    }[]
  >([])

  async function loadLogs() {
    try {
      const data = await getFoodLogs()
      setLogs(data)
    } catch (error) {
      console.error('Error loading logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadLogs()
    }
  }, [user])

  if (isLoaded && !user) {
    redirect('/sign-in')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Food Logs</h1>
        <Button size="lg" asChild>
          <a href="/logs/add">Add Meal</a>
        </Button>
      </div>

      <div className="grid gap-4">
        {logs.map((log) => (
          <Card key={log.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{log.foodName}</h3>
                <p className="text-sm text-muted-foreground">
                  {log.mealType} • {log.calories} calories
                </p>
                {log.notes && <p className="mt-2 text-sm">{log.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <EditLogDialog log={log} onUpdate={loadLogs} />
                <DeleteLogDialog
                  foodName={log.foodName}
                  onConfirm={async () => {
                    try {
                      await fetch(`/api/food-logs/${log.id}`, {
                        method: 'DELETE',
                      })
                      setLogs(logs.filter((l) => l.id !== log.id))
                    } catch (error) {
                      console.error('Error deleting log:', error)
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default LogsPage
