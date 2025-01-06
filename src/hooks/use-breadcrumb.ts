import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function useBreadcrumb() {
  const router = useRouter()
  const pathname = usePathname()

  const navigate = useCallback(
    (path: string) => {
      const allowedPaths = ['/dashboard', '/logs']

      if (allowedPaths.includes(path)) {
        router.replace(path, { scroll: false })
      }
    },
    [router],
  )

  const breadcrumbs = useCallback(() => {
    const paths = pathname.split('/').filter(Boolean)

    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`
      return {
        label: path
          .replace(/-/g, ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        url: url,
      }
    })
  }, [pathname])

  return {
    breadcrumbs: breadcrumbs(),
    navigate,
  }
}
