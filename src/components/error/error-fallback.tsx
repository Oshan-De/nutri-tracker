import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const router = useRouter()

  const handleReset = () => {
    resetErrorBoundary?.()
    router.refresh()
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground text-sm">{error?.message || 'An unexpected error occurred'}</p>
      <Button onClick={handleReset}>Try again</Button>
    </div>
  )
}