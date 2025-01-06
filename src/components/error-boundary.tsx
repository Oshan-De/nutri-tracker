'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error)
      setHasError(true)
      setError(error.error)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-center text-muted-foreground">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    )
  }

  return <>{children}</>
}
