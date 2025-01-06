'use client'

import { useUser } from '@clerk/nextjs'
import { CloudIcon, MoonIcon, SunIcon } from 'lucide-react'

export function Greeting() {
  const { user } = useUser()
  const hour = new Date().getHours()

  const getGreetingData = () => {
    if (hour < 12) {
      return {
        greeting: 'Good Morning',
        icon: <SunIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      }
    }
    if (hour < 18) {
      return {
        greeting: 'Good Afternoon',
        icon: <CloudIcon className="h-8 w-8 text-blue-500 dark:text-blue-300" />,
      }
    }
    return {
      greeting: 'Good Evening',
      icon: <MoonIcon className="h-8 w-8 text-purple-500 dark:text-purple-400" />,
    }
  }

  const { greeting, icon } = getGreetingData()

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      {icon}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {greeting}, {user?.firstName || 'there'}!
      </h1>
    </div>
  )
}
