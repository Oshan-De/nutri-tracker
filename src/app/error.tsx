'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="text-muted-foreground">
        We apologize for the inconvenience. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}