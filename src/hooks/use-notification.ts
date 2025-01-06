import { useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

interface NotificationOptions {
  title?: string
  description?: string
}

export function useNotification() {
  const success = useCallback((options: NotificationOptions) => {
    toast({
      title: options.title,
      description: options.description,
    })
  }, [])

  const error = useCallback((options: NotificationOptions) => {
    toast({
      title: options.title,
      description: options.description,
    })
  }, [])

  return {
    success,
    error,
  }
}
