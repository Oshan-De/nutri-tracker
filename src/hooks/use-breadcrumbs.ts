import { usePathname } from 'next/navigation'

export function useBreadcrumbs() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)

    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        url,
      }
    })
  }

  return getBreadcrumbs()
}
