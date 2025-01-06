import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export function useAuthRedirect() {
  const { isLoaded, user } = useUser()

  useEffect(() => {
    if (isLoaded && !user) {
      redirect('/sign-in')
    }
  }, [isLoaded, user])
}
